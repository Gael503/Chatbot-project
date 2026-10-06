"use client"
import { useState, useEffect } from "react";
import { promptService } from "@/services";
import { promptData } from "@/services/prompts/classes";
import { Loader } from "@/components/ui/loader";
import { PromptContainer, PromptContainerEmpty } from "../components/PromptContainer";
import PromptList from "../components/PromptList";
import CreatePromptDialog from "../components/CreatePromptDialog";
import { useTranslations } from "next-intl";

export default function PromptHome(){
    const [loading, setLoading] = useState<boolean>(true);
    const [prompt, setPrompt] = useState<promptData>(new promptData())
    const [reload, setReload] = useState<number>(0)
    const t = useTranslations();
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
            <div className="my-4 bg-gray-50 rounded-2xl p-3">
                <p className="font-bold">{t("prompt.title")}</p>
            </div>
            <div className="flex gap-2 justify-end">
                <div className="mr-2">
                    <CreatePromptDialog onCreated={getPrompt}/>
                </div>
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
            <PromptList onUpdate={handleUpdated}/>
        </div>
    )
}