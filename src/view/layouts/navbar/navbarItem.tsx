import {Home2,DocumentText,Profile2User,Trade} from 'iconsax-react'

export const NavbarItem = [ 
    {
        title: "خانه",
        img: <Home2 size={32} color='green' />,
        imgActive:<Home2 size={32} color='blue' variant="Bulk"/>,
        route: "/",
    },
    {
        title: "بلاگ",
        img: <DocumentText size={32} color='green' />,
        imgActive:<DocumentText size={32} color='blue' variant="Bulk"/>,
        route: "/blog",
    },
    {
        title: "درباره ما",
        img: <Profile2User size={32} color='green' />,
        imgActive:<Profile2User size={32} color='blue' variant="Bulk"/>,
        route: "/about-us",
    },
    {
        title: "معامله",
        img: <Trade size={32} color='green' />,
        imgActive:<Trade size={32} color='blue' variant="Bulk"/>,
        route: "/spot",
    },

]
