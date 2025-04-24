import SignUpForm from '@/src/components/SignUpForm'
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  
  return {
    title: t("SigninTitle"),
  };
}

export default function SignUpPage() {
  return (
      <SignUpForm />
  )
}
