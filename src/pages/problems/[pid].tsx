import React from "react"
import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import {problems} from "@/utils/problems";

type ProblemPageProps = {}

const ProblemPage: React.FC<ProblemPageProps> = () => {
    return (
        <>
            <div>
                <Topbar problemPage/>
                <Workspace/>
            </div>
        </>
    )
}
export default ProblemPage

export async function getStaticPaths(): Promise<any> {
    const paths = Object.keys(problems).map((key: string)=>{
        params:{pid:key}
    })
    return {
        paths,
        fallback: false
    }
}
export async function getStaticProps({params}){
    const {pid} = params
    const problem = problems[pid]
}

