'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError('ایمیل یا رمز اشتباه است.')
    } else {
      router.push('/spot')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <form onSubmit={handleLogin} className="space-y-4 w-10/12 md:w-full">
        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <div className='w-full flex justify-center pb-5'>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            ورود
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
      <p>حساب ندارید؟ <a className='text-blue-500 font-bold' href="/signup">ثبت نام </a> کنید</p>
    </div>
  )
}
