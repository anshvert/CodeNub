import React from "react"
import Link from "next/link";
import Image from "next/image"

type NavbarProps = {}

const Navbar:React.FC<NavbarProps> = () => {
    return <div className="flex items-center justify-between sm:px-12 px-2 md:px-24">
        <Link href="/" className="flex items-center justify-center h-20">
            <Image src="/logo.png" alt="CodeNub" className="h-full" width="200" height="200"/>
        </Link>
        <div className="flex items-center">
            <button className="bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium
                                hover:text-brand-orange hover:bg-white hover:border-brand-orange transition duration-300 ease-in-out">
                Sign In
            </button>
        </div>
    </div>
}
export default Navbar