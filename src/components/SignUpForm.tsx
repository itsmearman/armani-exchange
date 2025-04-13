// 'use client'
// import { useState, FormEvent, useEffect } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { useRouter } from 'next/navigation'

// export default function SignUpForm() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [message, setMessage] = useState<string | null>(null)
//   const router = useRouter()

//   const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//       email,
//       password,
//     })
    
//     if (!signUpError && signUpData?.user) {
//       const { error: insertError } = await supabase
//         .from('profiles')
//         .insert({
//           id: signUpData.user.id,
//           username: yourUsername, // مقدار انتخابی کاربر
//         })
//         setMessage('لینک تأیید به ایمیل شما ارسال شد.')x
    
//       if (insertError) console.error("❌ خطا در ذخیره username:", insertError)
//     }

//   }
//   useEffect(() => {
//     const checkSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (session) {
//         router.push('/spot')
//       }
//     }

//     checkSession()

//     // در صورت تغییر وضعیت auth
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         router.push('/spot')
//       }
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [router]);

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <form onSubmit={handleSignUp} className="space-y-4 w-10/12 md:w-full">
//         <input
//           type="email"
//           placeholder="ایمیل"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 w-full"
//         />
//         <input
//           type="password"
//           placeholder="رمز عبور"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 w-full"
//         />
//         <div className='w-full flex justify-center pb-5'>
//           <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//             ثبت‌نام
//           </button>
//           {message && <p>{message}</p>}
//         </div>
//       </form>
//       <p>حساب دارید؟ <a className='text-blue-500 font-bold' href="/login">وارد </a> شوید</p>
//     </div>
//   )
// }

'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) return setError(signUpError.message)

    const user = data.user
    if (!user) return setError('خطا در دریافت اطلاعات کاربر')

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user.id, username ,email: user.email })

    if (profileError) return setError('ثبت نام انجام شد اما خطا در ذخیره نام کاربری')

    router.push('/spot')
  }

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
