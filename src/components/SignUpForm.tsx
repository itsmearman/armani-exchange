'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LoadPage from './Loading'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) return setError(signUpError.message)

    const user = data.user
    if (!user) return setError('خطا در دریافت اطلاعات کاربر')

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user.id, username, email: user.email })

    if (profileError) {
      setLoading(false)
      return setError('ثبت نام انجام شد اما خطا در ذخیره نام کاربری')
    }

    router.push('/spot')
  }
  if (loading) return <LoadPage />

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSignUp} className="space-y-4">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری" className="border p-2 w-full" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ایمیل" type="email" className="border p-2 w-full" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور" type="password" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">ثبت نام</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <p>حساب دارید؟ <a className='text-blue-500 font-bold' href="/login">وارد </a> شوید</p>
    </div>
  )
}
