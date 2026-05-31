import {
  Html,
  Body,
  Container,
  Text,
} from "@react-email/components";

export default function WelcomeEmail() {
  return (
    <Html>
      <Body>
        <Container>
          <Text>
            Gracias por sumarte como donante.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}