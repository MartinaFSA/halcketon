import {
  Html,
  Body,
  Container,
  Text,
} from "@react-email/components";

export default function PaymentSuccessEmail() {
  return (
    <Html>
      <Body>
        <Container>
          <Text>
            Recibimos tu aporte
          </Text>
        </Container>
      </Body>
    </Html>
  );
}