"use client"
import { useState, useEffect } from "react";
import { promptService } from "@/services";
import { promptData } from "@/services/prompts/classes";
import { Loader } from "@/components/ui/loader";
import { PromptContainer, PromptContainerEmpty } from "../components/PromptContainer";
import PromptListDialog from "../components/PromptListDialog";
import CreatePromptDialog from "../components/CreatePromptDialog";

export default function PromptHome(){
    const [loading, setLoading] = useState<boolean>(true);
    const [prompt, setPrompt] = useState<promptData>(new promptData())
    const [reload, setReload] = useState<number>(0)
    const getPrompt = async () =>{
        setLoading(true)
        try {
            const response = await promptService.getCurrent();
            if(!response.success || !response.data){
                return;
            }
            setPrompt(response.data.prompt)
        } catch (error) {

        }finally {
            setLoading(false)
        }
    }
    useEffect(() =>{
        getPrompt();
    },[reload])

    const handleUpdated = () => setReload(prev => prev + 1);

    return(
        <div>
            <div className="flex gap-2 justify-end">
                <CreatePromptDialog onCreated={getPrompt}/>
            </div>
            <div className="h-80">
                {
                    loading && <Loader />
                }
                {
                    !loading && (
                        <div className="p-2">
                            {
                                prompt.id ?
                                <PromptContainer {...prompt}/>
                                :
                                <PromptContainerEmpty />
                            }
                        </div>
                    )
                }
            </div>
            <>
            <PromptListDialog onUpdate={handleUpdated}/>
            </>
        </div>
    )
}