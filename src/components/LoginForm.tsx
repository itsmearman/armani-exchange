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
  const [error , setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if(err){
      console.log(err)  
      setError('ایمیل یا رمز اشتباه است.')
      setLoading(false)
      return
    }
    await new Promise(res => setTimeout(res, 500))
    router.refresh()
    router.push('/spot')  
  }
  if (loading) return <LoadPage />

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ایمیل" type="email" className="border p-2 w-full" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور" type="password" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">{t("login")}</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <p>{t("noAccount")}<a className='text-blue-500 font-bold' href="/signup">{t("register")} </a> {t("fuck")}</p>
    </div>
  )
}
