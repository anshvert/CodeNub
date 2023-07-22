import React from "react"
import Link from "next/link"
import Image from "next/image"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebase";
import Logout from "@/components/buttons/Logout";
import {SetterOrUpdater,useSetRecoilState} from "recoil";
import {authModalState,AuthModalState} from "@/atoms/authModalAtom";


type TopbarProps = {}

const Topbar:React.FC<TopbarProps> = () => {
    const [user] = useAuthState(auth)
    const setAuthModalState:SetterOrUpdater<AuthModalState> = useSetRecoilState(authModalState)
    return (
        <>
            <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
                <div className={`flex w-full items-center justify-between max-w-[1200px] mx-auto`}>
                    <Link href='/' className='h-[22px] flex-1'>
                        <Image src='/logo-full.png' alt='Logo' className='h-full' width="90" height="100" />
                    </Link>

                    <div className='flex items-center space-x-4 flex-1 justify-end'>
                        <div>
                            <a
                                href='https://www.buymeacoffee.com/burakorkmezz'
                                target='_blank'
                                rel='noreferrer'
                                className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2'>
                                Premium
                            </a>
                        </div>
                        {!user && (
                            <Link href='/auth' onClick={(): void=> {
                                setAuthModalState((prev:AuthModalState) => ({ ...prev,isOpen: true,type:"login"}))
                            }}>
                                <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded'>Sign In</button>
                            </Link>
                        )}
                        {user && (
                            <div className="cursor-pointer group relative">
                                <Image src="/avatar.png" alt="user profile img" className="h-8 w-8 rounded-full" height="200" width="200"/>
                                <div className="absolute top-10 left-2/4 -translate-x-2/4 mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0
                                transition-all duration-300 ease-out">
                                <p className="text-sm">{user.email}</p>
                                </div>
                            </div>
                        )}
                        {user && (<Logout/>)}
                    </div>
                </div>
            </nav>
            {/*<div*/}
            {/*    className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0*/}
            {/*    transition-all duration-300 ease-in-out'>*/}
            {/*    <p className='text-sm'>{user.email}</p>*/}
            {/*</div>*/}
        </>
    )
}

export default Topbar