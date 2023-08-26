import React, {useState} from "react"
import Split from 'react-split'
import ProblemDescription from "@/components/Workspace/ProblemDescription/ProblemDescription";
import Playground from "@/components/Workspace/Playground/Playground";
import {Problem} from "@/utils/types/problem";

type WorkspaceProps = {
    problem:Problem
}

const Workspace: React.FC<WorkspaceProps> = ({problem}) => {
    const [success,setSuccess] = useState<boolean>(false)
    const [solved,setSolved] = useState<boolean>(false)
    return (
        <>
            <Split
                className="split">
                <ProblemDescription problem={problem} _solved={solved}/>
                <Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved}/>
            </Split>
        </>
    )
}
export default Workspace