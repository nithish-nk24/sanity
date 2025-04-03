import Image from "next/image"
import Link from "next/link"

type socialIconProps = {
    url:string
    icon:string 
}
const SocialIcons = ({url,icon}:socialIconProps) => {
  return (
    <Link href={url} >
        <div className="border border-white p-3 rounded-full scale-90 hover:scale-100 duration transition hover:bg-gradient-to-r from-pink-500 to-rose-500 ">
        <Image src={icon} alt="" width={30} height={30} />
        </div>
    </Link>
  )
}

export default SocialIcons