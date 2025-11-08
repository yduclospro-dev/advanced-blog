import ResetPasswordContainer from "@/components/auth/reset-password/containers/ResetPasswordContainer";
import ClientOnly from "@/components/ClientOnly";

export default function ResetPasswordPage() {
  return (
    <ClientOnly>
      <ResetPasswordContainer />
    </ClientOnly>
  );
}
