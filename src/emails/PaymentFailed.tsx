import {
  Html,
  Body,
  Container,
  Text,
} from "@react-email/components";

export default function PaymentFailedEmail() {
  return (
    <Html>
      <Body>
        <Container>
          <Text>
            Tuvimos un inconveniente para procesar tu pago. Por favor, revisa los datos de tu tarjeta o intenta con otro método de pago.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}