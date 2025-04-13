'use client'
import { useState, FormEvent, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

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
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push('/spot')
      }
    }

    checkSession()

    // در صورت تغییر وضعیت auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/spot')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSignUp} className="space-y-4 w-10/12 md:w-full">
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
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            ثبت‌نام
          </button>
          {message && <p>{message}</p>}
        </div>
      </form>
      <p>حساب دارید؟ <a className='text-blue-500 font-bold' href="/login">وارد </a> شوید</p>
    </div>
  )
}
