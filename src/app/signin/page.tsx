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
    <div className="max-w-md mx-auto mt-28">
      <h1 className="text-xl font-bold mb-4 text-center">ثبت‌نام</h1>
      <SignUpForm />
    </div>
  )
}
