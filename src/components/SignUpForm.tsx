'use client'
import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('لینک تأیید به ایمیل شما ارسال شد.')
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <input
        type="email"
        placeholder="ایمیل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="رمز عبور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />
      <div className='w-full flex justify-center pb-5'>
      <button type="submit" className="w-11/12 bg-blue-500 text-white p-2 rounded">
        ثبت‌نام
      </button>
      {message && <p>{message}</p>}
      </div>
    </form>
  )
}
