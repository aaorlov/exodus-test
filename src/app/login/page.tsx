import HankoAuth from "@/components/hanko/HankoAuth";
import { Metadata } from "next";
import {SignInContainer, Card} from "@/components/form/styled";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => (
  <SignInContainer direction="column" justifyContent="space-between">
    <Card variant="outlined">
      <HankoAuth />
    </Card>
  </SignInContainer>
)

export default LoginPage;