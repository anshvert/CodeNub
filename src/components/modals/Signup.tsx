import React, {useState} from "react"
import {useSetRecoilState} from "recoil";
import {authModalState} from "@/atoms/authModalAtom";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"
import {useRouter} from "next/router";
import {setDoc} from "@firebase/firestore";
import {doc} from "firebase/firestore";
import {firestore} from "@/firebase/firebase"
import {toast} from "react-toastify";

type SignupProps = {}

const Signup:React.FC<SignupProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const handleClick = (type: "login" | "register" | "forgotPassword") => {
        setAuthModalState((prev)=> ({...prev,type:type}))
    }
    const [inputs,setInputs] = useState({email:'',displayName:'',password:''})
    const router = useRouter()
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const handleChangeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleRegister = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault()
        try {
            toast.loading("Creating your account",{position:"top-center",toastId:"loadingToast"})
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password)
            if (!newUser) return
            const userData = {
                uid: newUser.user.uid,
                email: newUser.user.email,
                displayName: newUser.user.displayName,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                likedProblems: [],
                solvedProblems: [],
                starredProblems: [],
                dislikedProblems: []
            }
            await setDoc(doc(firestore,"users",newUser.user.uid),userData)
            await router.push("/")
        }
        catch (error:any) {
            toast.error(error.message,{position:"top-center"})
        } finally {
            toast.dismiss("loadingToast")
        }
    }
    return <form className="space-y-6 px-6 py-4"  onSubmit={handleRegister}>
        <h3 className="text-xl font-medium text-white">Register to CodeNub</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
                Email
            </label>
            <input onChange={handleChangeInput} type="email" name="email" id="email" className="border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="name@company.com"/>
        </div>
        <div>
            <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-gray-300">
                Display Name
            </label>
            <input onChange={handleChangeInput} type="displayName" name="displayName" id="displayName" className="border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="Elon Musk"/>
        </div>
        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
                Password
            </label>
            <input onChange={handleChangeInput} type="password" name="password" id="password" className="border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="********"/>
        </div>
        <button type="submit" className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-dark-gray-6 hover:bg-gray-8">
            {loading ? "Registering": "Register"}
        </button>
        <div className='text-sm font-medium text-gray-300'>
            Already a User?{" "}
            <a href='#' className='text-blue-700 hover:underline' onClick={()=> handleClick("login")}>
                Login
            </a>
        </div>
    </form>
}
export default Signup