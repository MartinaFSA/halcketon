import { supabase } from "@/lib/client";

export default async function DonorsPage() {
  const { data } = await supabase
    .from("donors")
    .select("*");

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
        </tr>
      </thead>

      <tbody>
        {data?.map((donor) => (
          <tr key={donor.id}>
            <td>
              {donor.first_name} {donor.last_name}
            </td>
            <td>{donor.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}