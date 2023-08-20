import React, {useEffect, useState} from 'react'
import {Problem} from "@/mockProblems/problems";
import {BsCheckCircle} from "react-icons/bs";
import Link from "next/link";
import {AiFillYoutube} from "react-icons/ai";
import {IoClose} from "react-icons/io5";
import YouTube from "react-youtube";
import {collection, getDocs, orderBy, query} from "@firebase/firestore";
import { firestore } from "@/firebase/firebase";
import {DBProblem} from "@/utils/types/problem";

type ProblemsTableProps = {
    setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
}

const ProblemsTable:React.FC<ProblemsTableProps> = ({ setLoadingProblems }) => {
    const [youtubePlayer,setYoutubePlayer] = useState({
        isOpen:false,
        videoId:""
    })
    const problems = useGetProblems(setLoadingProblems)
    const closeModal = () => {
        setYoutubePlayer({isOpen: false,videoId: ""})
    }

    useEffect(()=> {
        const handleEsc = (e:KeyboardEvent) => {
            if (e.key == "Escape") closeModal()
        }
        window.addEventListener("keydown",handleEsc)
        return () =>  window.removeEventListener("keydown",handleEsc)
    },[])

    return (
        <>
            <tbody className="text-white">
                {problems.map((doc: DBProblem,idx: number)=> {
                    const difficultyColor = doc.difficulty === "Easy" ? "text-dark-green-s": doc.difficulty === "Medium" ? "text-dark-yellow":"text-dark-pink"
                    return (
                        <tr className={`${idx % 2 == 1 ? 'bg-dark-layer-1':''}`} key={doc.id}>
                            <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                             <BsCheckCircle fontSize={"18"} width="18"/>
                            </th>
                            <td className="px-6 py-4">
                                {doc.link ? (
                                    <Link href={doc.link} className="hover:text-blue-600 cursor-pointer" target="_blank">{doc.title}</Link>
                                    ):(
                                    <Link className="hover:text-blue-600 cursor-pointer" href={`/problems/${doc.id}`}>
                                        {doc.title}
                                    </Link>
                                )}
                            </td>
                            <td className={`px-6 py-4 ${difficultyColor}`}>
                                {doc.difficulty}
                            </td>
                            <td className={`px-6 py-4`}>
                                {doc.category}
                            </td>
                            <td className={`px-6 py-4`}>
                                {doc.videoId ? <AiFillYoutube fontSize={"25"} className="cursor-pointer hover:text-red-600" onClick={()=> setYoutubePlayer({isOpen: true,videoId: doc.videoId as string})}/>: <p className="text-gray-400">Coming Soon </p>}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            {youtubePlayer.isOpen && (<tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center' >
                <div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute'></div>
                    <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                        <div className='w-full h-full flex items-center justify-center relative'>
                            <div className='w-full relative'>
                                <IoClose fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' onClick={closeModal} />
                                <YouTube videoId={youtubePlayer.videoId} loading='lazy' iframeClassName='w-full min-h-[500px]' />
                            </div>
                        </div>
                    </div>
                </tfoot>)}
        </>
    )
}
export default ProblemsTable

function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
    const [problems,setProblems] = useState<DBProblem[]>([])

    useEffect(() => {
        const getProblems = async () => {
            setLoadingProblems(true)
            const q = query(collection(firestore,"problems"),orderBy("order","asc"))
            const querySnapshot = await getDocs(q)
            const problemData: DBProblem[] = []
            querySnapshot.forEach((doc)=>{
                problemData.push({id: doc.id,...doc.data()} as DBProblem)
            })
            setProblems(problemData)
            setLoadingProblems(false)
        }
        getProblems()
    }, [setLoadingProblems]);
    return problems
}
