import { ChevronRight } from "lucide-react"
import Link from "next/link"

type ListItemsProps = {
    url:string,
    title:string
}
const ListItems = ({url,title}:ListItemsProps) => {
  return (
    <Link href={url} className="flex items-center text-black/80 gap-2 transition duration-500 hover:gap-3 hover:text-black">
        <p className="my-3 text-sm ">{title}</p>
        <ChevronRight className="w-5 h-5"/>
    </Link>
  )
}

export default ListItems