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
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">ورود</h1>
      <LoginForm />
    </div>
  )
}
