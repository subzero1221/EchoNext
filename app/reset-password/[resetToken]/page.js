import ResetPassword from "@/app/_mainComponents/ResetPassword";

export default function Reset({ params }) {
  const { resetToken } = params;
  return <ResetPassword resetToken={resetToken} />;
}
