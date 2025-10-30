import ForgotPasswordContainer from "@/components/auth/forgot-password/containers/ForgotPasswordContainer";
import ClientOnly from "@/components/ClientOnly";

export default function ForgotPasswordPage() {
  return (
    <ClientOnly>
      <ForgotPasswordContainer />
    </ClientOnly>
  );
}
