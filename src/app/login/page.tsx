import LoginForm from '@/src/components/LoginForm'
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  
  return {
    title: t("LoginTitle"),
  };
}

export default function LoginPage() {
  return (
      <LoginForm />
  )
}
