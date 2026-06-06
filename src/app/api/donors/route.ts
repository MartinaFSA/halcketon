import { supabaseAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Search donor
    let donorId: string;
    const {
      data: donor,
      error: donorSearchError,
    } = await supabaseAdmin
      .from("donors")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (donorSearchError) {
      throw donorSearchError;
    }

    if (!donor) {
      const {
        data: newDonor,
        error: donorInsertError,
      } = await supabaseAdmin
        .from("donors")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: normalizedEmail,
        })
        .select()
        .single();

      if (donorInsertError || !newDonor) {
        throw new Error(
          donorInsertError?.message ??
            "No se pudo crear el donor"
        );
      }

      donorId = newDonor.id;
    } else {
      donorId = donor.id;
    }

    // Search existing profile

    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    let userId: string;

    // User exists

    if (profile) {
      userId = profile.id;
    } else {
      // Create user
      const {
        data: createdUser,
        error: createUserError,
      } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
      });

      if (
        createUserError ||
        !createdUser?.user
      ) {
        throw new Error(
          createUserError?.message ??
            "No se pudo crear el usuario"
        );
      }

      userId = createdUser.user.id;

      // Create profile
      const {
        error: profileInsertError,
      } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          email: normalizedEmail,
          full_name: `${firstName} ${lastName}`,
          role: "donor",
        });

      if (profileInsertError) {
        throw profileInsertError;
      }

      // Send invite email

      const {
        error: inviteError,
      } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(
          normalizedEmail
        );

      if (inviteError) {
        console.error(
          "Error enviando invitación:",
          inviteError
        );
      }
    }

    // Link user and donor

    const {
      error: updateDonorError,
    } = await supabaseAdmin
      .from("donors")
      .update({
        user_id: userId,
      })
      .eq("id", donorId);

    if (updateDonorError) {
      throw updateDonorError;
    }

    return NextResponse.json({
      success: true,
      donorId,
      userId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}