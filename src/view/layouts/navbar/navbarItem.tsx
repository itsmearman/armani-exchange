import {Home2,DocumentText,Profile2User,Trade} from 'iconsax-react'
import { useTranslations } from 'next-intl'
export default function NavbarItem(){
const t = useTranslations()
return [ 
        {
            title: t("home"),
            img: <Home2 size={32} className='stroke-green-500 dark:stroke-white' />,
            imgActive:<Home2 size={32} className='fill-blue-600 dark:fill-green-500' variant="Bulk"/>,
            route: "/",
        },
        {
            title: t("blog"),
            img: <DocumentText size={32} className='stroke-green-500 dark:stroke-white' />,
            imgActive:<DocumentText size={32} className='fill-blue-600 dark:fill-green-500' variant="Bulk"/>,
            route: "/blog",
        },
        {
            title: t("aboutUs"),
            img: <Profile2User size={32} className='stroke-green-500 dark:stroke-white' />,
            imgActive:<Profile2User size={32} className='fill-blue-600 dark:fill-green-500' variant="Bulk"/>,
            route: "/about-us",
        },
        {
            title: t("trade"),
            img: <Trade size={32} className='stroke-green-500 dark:stroke-white' />,
            imgActive:<Trade size={32} className='fill-blue-600 dark:fill-green-500' variant="Bulk"/>,
            route: "/spot",
        },
    
    ]
}
