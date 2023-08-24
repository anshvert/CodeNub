import  React, {useEffect, useState} from "react"
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import {DBProblem, Problem} from "@/utils/types/problem";
import {firestore} from "@/firebase/firebase";
import {
    doc,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    getDoc,
    runTransaction,
    Transaction
} from "firebase/firestore";
import {toast} from "react-toastify";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebase"

type ProblemDescriptionProps = {
    problem: Problem
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({problem}) => {
    const [user] = useAuthState(auth)
    const {currentProblem,loading,problemDifficultyClass,setCurrentProblem} = useGetCurrentProblem(problem.id)
    const {liked,disliked,solved,starred,setData} = useGetUsersDataOnProblem(problem.id)
    const [updating,setUpdating] = useState(false)

    const handleLike = async () => {
        if (!user) {
            toast.error("You must be logged in to like a problem",{ position: "top-left",theme: "dark"})
            return
        }
        if (updating) return
        setUpdating(true)
        await runTransaction(firestore,async (transaction: Transaction): Promise<void> => {
            const userRef: DocumentReference<DocumentData> = doc(firestore,"users",user.uid)
            const problemRef: DocumentReference<DocumentData> = doc(firestore,"problems",problem.id)
            const [userDoc,problemDoc]: [DocumentSnapshot<DocumentData>,DocumentSnapshot<DocumentData>] = await Promise.all([transaction.get(userRef),transaction.get(problemRef)])
            if (userDoc.exists() && problemDoc.exists()) {
                if (liked){
                    transaction.update(userRef,{
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef,{
                        likes: problemDoc.data().likes - 1
                    })
                    setCurrentProblem(prevState => prevState ? ({...prevState,likes: prevState.likes - 1}) : null)
                    setData(prevState => ({...prevState,liked: false}))
                }
                else if (disliked) {
                    transaction.update(userRef,{
                        likedProblems: [...userDoc.data().likedProblems,problem.id],
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string)=> id !== problem.id)
                    })
                    transaction.update(problemRef,{
                        likes: problemDoc.data().likes + 1,
                        dislikes: problemDoc.data().dislikes - 1
                    })
                    setCurrentProblem(prev=> prev ? ({...prev,likes: prev.likes+1,dislikes: prev?.dislikes - 1}) : null)
                    setData(prev=>({...prev,liked: true,disliked: false}))
                }
                else {
                    transaction.update(userRef,{
                        likedProblems: [...userDoc.data().likedProblems,problem.id]
                    })
                    transaction.update(problemRef,{
                        likes: problemDoc.data().likes + 1
                    })
                    setCurrentProblem(prev=> prev ? ({...prev,likes:prev.likes+1}) : null)
                    setData(prev=>({...prev,liked: true}))
                }
            }

        })
        setUpdating(false)
    }

    return (
        <div className='bg-dark-layer-1'>
            {/* TAB */}
            <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
                <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                    Description
                </div>
            </div>

            <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
                        </div>
                        {!loading && currentProblem && (
                            <div className='flex items-center mt-3'>
                                <div
                                    className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}>
                                    {currentProblem.difficulty}
                                </div>
                                <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                    <BsCheck2Circle />
                                </div>
                                <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6' onClick={handleLike}>
                                    {liked && <AiFillLike className="text-dark-blue-s"/>}
                                    {!liked && <AiFillLike/>}
                                    <span className='text-xs'>{currentProblem.likes}</span>
                                </div>
                                <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'>
                                    <AiFillDislike />
                                    <span className='text-xs'>{currentProblem.dislikes}</span>
                                </div>
                                <div className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '>
                                    <TiStarOutline />
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="mt-3 flex space-x-2">
                                <RectangleSkeleton/>
                                <CircleSkeleton/>
                                <RectangleSkeleton/>
                                <RectangleSkeleton/>
                            </div>
                        )}
                        {/* Problem Statement(paragraphs) */}
                        <div className='text-white text-sm'>
                           <div dangerouslySetInnerHTML = {{ __html: problem.problemStatement}} />
                        </div>

                        {/* Examples */}
                        <div className='mt-4'>
                            {problem.examples.map((example, index: number) => (
                                <div key={example.id}>
                                    <p className='font-medium text-white'> Example {index + 1}:</p>
                                    {example.img && <img src={example.img} alt='' className="mt-3" />}
                                    <div className='example-card'>
                                    <pre>
                                        <strong className='text-white'> Input: </strong> {example.inputText}
                                        <br/>
                                        <strong> Output:</strong> {example.outputText}
                                        <br/>
                                        {example.explanation && (
                                            <>
                                                <strong>Explanation:</strong> {example.explanation}
                                            </>
                                        )}
                                    </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Constraints */}
                        <div className='my-5'>
                            <div className='text-white text-sm font-medium'>Constraints:</div>
                            <ul className='text-white ml-5 list-disc'>
                                <div dangerouslySetInnerHTML={{__html: problem.constraints}}/>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProblemDescription;

function useGetCurrentProblem(problemId: string) {
    const [currentProblem,setCurrentProblem] = useState<DBProblem|null>(null)
    const [loading,setLoading] = useState<boolean>(true)
    const [problemDifficultyClass,setProblemDifficultyClass] = useState<string>("")
    useEffect(()=>{
        const getCurrentProblem = async () => {
            setLoading(true)
            const docRef = doc(firestore,"problems",problemId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()){
                const problem = docSnap.data()
                setCurrentProblem({id:docSnap.id,...problem} as DBProblem)
                setProblemDifficultyClass(
                    problem.difficulty === "Easy" ? "bg-olive text-olive": problem.difficulty === "Medium" ? "bg-yellow text-dark-yellow": "bg-dark-pink text-dark-pink"
                )
            }
            setLoading(false)
        }
        getCurrentProblem().then().catch((error): void =>{
            toast.error(error.message("Error while fetching Problem! Please try Again."))
        })
    },[problemId])
    return {currentProblem,loading,problemDifficultyClass,setCurrentProblem}
}
function useGetUsersDataOnProblem(problemId: string) {
    const initialUserData = {
        liked: false,
        disliked: false,
        starred: false,
        solved: false
    }
    const [data,setData] = useState(initialUserData)
    const [user] = useAuthState(auth)
    useEffect(()=>{
        const getUsersDataOnProblem = async () => {
            const userRef = doc(firestore,"users",user!.uid)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()){
                const data = userSnap.data()
                const {solvedProblems,likedProblems,dislikedProblems,starredProblems} = data
                setData({
                    liked: likedProblems.includes(problemId),
                    disliked: dislikedProblems.includes(problemId),
                    starred: starredProblems.includes(problemId),
                    solved: solvedProblems.includes(problemId)
                })
            }
        }
        if (user) getUsersDataOnProblem().then().catch((error)=>{
            console.log(error.message,"Error While fetching user problem Data !!")
        })
        return () => setData(initialUserData)
    },[problemId, user])

    return {...data,setData}
}