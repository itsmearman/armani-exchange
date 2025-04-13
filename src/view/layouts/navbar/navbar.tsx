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
  ProfileCircle,
  Notification,
  Modal,
  useState,
  useTranslations,
  ThemeSwitcher,
} from './imports'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { setUserLocale } from '@/src/components/locale/locale'

export default function Navbar() {
  const supabase = useSupabaseClient()

  const item = NavbarItem()
  const slug = usePathname()
  const width = useWidth()
  const [modalMessage, setModalMessage] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const t = useTranslations()

  const [username, setUsername] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

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

    getUserProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_OUT') {
          setUsername(null)
        } else if (event === 'SIGNED_IN') {
          await getUserProfile()
        }
      }
    )
  }, [supabase])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error.message)
    } else {
      router.push('/login')
    }
  }

  const modalView = () => {
    setModalMessage(t('noMessage'))
    setIsModalOpen(true)
    return
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
      <nav className='h-[5rem] fixed bottom-0 md:top-0 w-full flex px-6 shadow-lg justify-between bg-white dark:bg-gray-900 z-10'>
        <Link href={'/'} className='hidden md:block'>
          <Image src={Logo} width={150} height={100} alt='' />
        </Link>
        <ThemeSwitcher />
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
        <div className='hidden md:block my-auto gap-4'>
          {username ? (
            <div className='flex flex-col items-center'>
              <ProfileCircle size={42} color='black' className='invisible md:visible mx-auto' />
              <span className='text-black dark:text-white'>{username}</span>
              <button className='text-red-500' onClick={handleLogout}>خروج</button>
            </div>
          ) : (
            <Link href='/login' className='text-blue-600 dark:text-green-500'>ورود</Link>
          )}
        </div>
      </nav>

      <div className='h-[5rem] visible md:invisible fixed top-0  w-full flex px-6 shadow-lg justify-between bg-white dark:bg-gray-900 z-10'>
        <div className='my-auto px-4'>
          <Notification
            onClick={modalView}
            size='32'
            className='stroke-black dark:stroke-white'
          />
        </div>
        <Image src={LogoMD} width={100} alt='' className='mx-auto' />
        <div className='my-auto gap-4'>
          {username ? (
            <div className='flex flex-col items-center'>
              <ProfileCircle size={42} color='black' className='invisible md:visible mx-auto' />
              <span className='text-black dark:text-white'>{username}</span>
              <button className='text-red-500' onClick={handleLogout}>خروج</button>
            </div>
          ) : (
            <Link href='/login' className='text-blue-600 dark:text-green-500 p-4'>ورود</Link>
          )}
        </div>
      </div>
    </>
  )
}
