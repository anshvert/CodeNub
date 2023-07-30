import React from "react"
import Split from 'react-split'
import ProblemDescription from "@/components/Workspace/ProblemDescription/ProblemDescription";
import Playground from "@/components/Workspace/Playground/Playground";

type WorkspaceProps = {}

const Workspace: React.FC<WorkspaceProps> = () => {
    return (
        <>
            <Split
                className="split">
                <ProblemDescription/>
                <Playground/>
            </Split>
        </>
    )
}
export default Workspace