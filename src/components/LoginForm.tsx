'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LoadPage from './Loading'
import { useTranslations } from 'next-intl'

export default function LoginForm() {
  const t = useTranslations();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (err) {
      console.log(err)
      setError('ایمیل یا رمز اشتباه است.')
      setLoading(false)
      return
    }
    await new Promise(res => setTimeout(res, 100))
    router.push('/spot')
  }
  if (loading) return <LoadPage />

  return (
    <div className="max-w-md mx-auto mt-28">
      <h1 className="text-xl font-bold mb-4 text-center">{t("login")}</h1>
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleLogin} className="space-y-6">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t("email")} type="email" className="border p-2 w-full rounded bg-white dark:bg-gray-900" required />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder={t("password")} type="password" className="border p-2 w-full rounded bg-white dark:bg-gray-900" required />
          <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded-lg">{t("login")}</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <p className='p-3'>{t("noAccount")} <a className='text-blue-500 hover:text-green-500 font-bold' href="/signup">{t("register")} </a> {t("fuck")}</p>
      </div>
    </div>
  )
}
