import Logo from "../logo";
import { auth } from "@/auth";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/auth";

const Navbar = async () => {
  const session = await auth();
  // console.log(session);

  return (
    <>
      {session && (
        <nav className="bg-slate-200 h-15 flex items-center justify-between px-6">
          <Logo />
          <ul className="flex items-center gap-x-6">
            <li>
              <Link
                href={"/admin/dashboard/createBlog"}
                className="bg-black text-white px-4 py-2 rounded-md font-semibold"
              >
                Create Blog
              </Link>
            </li>
            <li className="flex items-center gap-x-3">
              <h2>{session?.user?.name}</h2>
              <Avatar>
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
              </Avatar>
            </li>
            <li><button onClick={logout}>Log Out</button></li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
