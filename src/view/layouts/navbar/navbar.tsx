'use client'
import {
  React,
  NavbarItem,
  Link,
  Image,
  LogoMD,
  Logo,
  usePathname,
  useWidth,
  // ProfileCircle,
  // Notification,
  // Modal,
  useState,
  useTranslations,
  ThemeSwitcher,
  LocaleSwitcher,
} from './imports'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Navbar() {
  const supabase = useSupabaseClient()
  const item = NavbarItem()
  const slug = usePathname()
  const width = useWidth()
  const t = useTranslations()
  const router = useRouter()
  // const [modalMessage, setModalMessage] = useState<string>('')
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [username, setUsername] = useState<string | null>(null)

  // گرفتن username از جدول profiles
  const fetchUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setUsername(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single()

    if (data && !error) {
      setUsername(data.username)
    } else {
      setUsername(null)
    }
  }

  useEffect(() => {
    fetchUserProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await fetchUserProfile()
      } else if (event === 'SIGNED_OUT') {
        setUsername(null)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // بررسی مجدد وضعیت کاربر در هر تغییر مسیر
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // خروج از حساب
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout Error:', error.message)
    } else {
      router.push('/signup')
      router.refresh()
      setUsername(null)
    }
  }

  // const modalView = () => {
  //   setModalMessage(t('noMessage'))
  //   setIsModalOpen(true)
  //   return
  // }


  return (
    <>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      /> */}
      <nav className='h-[5rem] fixed bottom-0 md:top-0 w-full flex px-6 shadow-lg justify-between bg-white dark:bg-gray-900 z-10'>
        <Link href={'/'} className='hidden md:block my-auto'>
          <Image src={Logo} width={80} height={50} alt='' />
        </Link>
        <div className='my-[1rem] md:my-[1.8rem] flex gap-x-8 mx-auto'>
          {item.map((data, index) => (
            <Link
              href={data.route}
              key={index}
              className='flex flex-col items-center cursor-pointer text-black dark:text-white hover:text-gray-400'
            >
              {width < 768
                ? data.route === slug
                  ? (
                    <>
                      {data.imgActive}
                      <span className='text-blue-600 dark:text-green-500'>{data.title}</span>
                    </>
                  )
                  : (
                    <>
                      {data.img}
                      <span>{data.title}</span>
                    </>
                  )
                : data.route === slug
                  ? <span className='text-blue-600 dark:text-green-500'>{data.title}</span>
                  : <span>{data.title}</span>}
            </Link>
          ))}
        </div>
        <div className='flex flex-row gap-2'>
          <ThemeSwitcher />
          <div className='hidden md:block my-auto gap-4'>
            {username ? (
              <div className='flex flex-col items-center'>
                <span className='text-black dark:text-white'>{username}{t("welcome")}</span>
                <button className='text-red-500' onClick={handleLogout}>{t("logout")}</button>
              </div>
            ) : (
              <Link href='/login' className='text-blue-600 dark:text-green-500'>{t("login")}</Link>
            )}
          </div>
        </div>
      </nav>

      <div className='h-[5rem] visible md:invisible fixed top-0  w-full flex px-6 shadow-lg justify-between bg-white dark:bg-gray-900 z-10'>
        <div className='my-auto px-4'>
          <LocaleSwitcher
          />
        </div>
        <Image src={LogoMD} width={100} alt='' className='mx-auto' />
        <div className='my-auto gap-4'>
          {username ? (
            <div className='flex flex-col items-center'>
              <span className='text-black dark:text-white'>{username}{t("welcome")}</span>
              <button className='text-red-500' onClick={handleLogout}>{t("logout")}</button>
            </div>
          ) : (
            <Link href='/signup' className='text-blue-600 dark:text-green-500 p-4'>{t("login")}</Link>
          )}
        </div>
      </div>
    </>
  )
}
