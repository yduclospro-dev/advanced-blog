import LoginContainer from "@/components/auth/login/containers/LoginContainer";
import ClientOnly from "@/components/ClientOnly";

export default function LoginPage() {
  return (
    <ClientOnly>
      <LoginContainer />
    </ClientOnly>
  );
}