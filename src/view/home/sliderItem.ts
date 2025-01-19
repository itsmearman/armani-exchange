import { useTranslations } from "next-intl";
export default function SliderItem(){
    const t = useTranslations();
    const Slider = [
    {
        title: t("firstHomeSlider"),
        color:"206,17,17",
        route:"/spot",
    },
    {
        title:"title2",
        color:"0,140,255",
        route:"/about-us",
    },
    // {
    //     title:"title3",
    //     color:"10,184,111",
    //     route:"/spot",
    // },
    // {
    //     title:"title4",
    //     color:"211,122,7",
    //     route:"/spot",
    // },
    // {
    //     title:"title5",
    //     color:"118,163,12",
    //     route:"/spot",
    // },
    // {
    //     title:"title6",
    //     color:"180,10,47",
    //     route:"/spot",
    // },
    // {
    //     title:"title7",
    //     color:"35,99,19",
    //     route:"/spot",
    // },
    // {
    //     title:"title8",
    //     color:"0,68,255",
    //     route:"/spot",
    // },
    // {
    //     title:"title9",
    //     color:"218,12,218",
    //     route:"/spot",
    // },
    // {
    //     title:"title10",
    //     color:"54,94,77",
    //     route:"/spot",
    // },

]
return Slider;
}
