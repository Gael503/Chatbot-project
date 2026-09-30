"use client"

import { useEffect, useState } from "react"
import { promptService } from "@/services"
import { promptData, PromptsListRequest, PromptsListResponse } from "@/services/prompts/classes"
import Pagination from "@/shared/Pagination"
import { DataTable } from "@/components/ui/data-table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cloneRequest, handlePageChange, handleSizeChange } from "@/components/utils/pagination"
import { getPromptColumns } from "./PromptColumns"
import { PromptContainer } from "./PromptContainer"

const newRequest = () => new PromptsListRequest()

type DialogMode = "view" | "activate" | null

export default function PromptListDialog(props: { onUpdate: () => void }) {
    const { onUpdate } = props;
    const [loading, setLoading] = useState(false)
    const [prompts, setPrompts] = useState<promptData[]>([])
    const [infoRequest, setInfoRequest] = useState<PromptsListRequest>(new PromptsListRequest())
    const [selectedPrompt, setSelectedPrompt] = useState<promptData | null>(null)
    const [dialogMode, setDialogMode] = useState<DialogMode>(null)
    const [activating, setActivating] = useState(false)

    const searchPrompts = async (request: PromptsListRequest) => {
        setLoading(true)
        try {
            const resp: PromptsListResponse = await promptService.search(request)
            if (!resp.success || !resp.data) {
                setPrompts([])
                setInfoRequest(request)
                return
            }
            setPrompts(resp.data.prompts)
            const nextRequest = cloneRequest(newRequest, request)
            nextRequest.pagination = Object.assign(new Pagination(), resp.data.pagination)
            setInfoRequest(nextRequest)
        } catch (error) {
            setPrompts([])
        } finally {
            setLoading(false)
        }
    }

    const handleView = (data: promptData) => {
        setSelectedPrompt(data)
        setDialogMode("view")
    }

    const handleActivePrompt = (data: promptData) => {
        setSelectedPrompt(data)
        setDialogMode("activate")
    }

    const closeDialog = () => {
        setSelectedPrompt(null)
        setDialogMode(null)
    }

    const confirmActivate = async () => {
        if (!selectedPrompt) return
        setActivating(true)
        try {
            const resp = await promptService.activate(selectedPrompt.id)
            if (resp.success) {
                closeDialog()
                await searchPrompts(infoRequest)
                onUpdate();
            }
        } finally {
            setActivating(false)
        }
    }

    const onPageChange = (page: number) => handlePageChange(newRequest, infoRequest, page, searchPrompts)
    const onSizeChange = (size: number) => handleSizeChange(newRequest, infoRequest, size, searchPrompts)

    const columns = getPromptColumns({
        onView: handleView,
        turnOn: handleActivePrompt
    }
    )
    useEffect(() =>{
        searchPrompts(new PromptsListRequest())
    },[])

    return (
        <div>
            <DataTable
                columns={columns}
                data={prompts}
                pagination={{
                    page: infoRequest.pagination.page,
                    size: infoRequest.pagination.size,
                    totalPages: infoRequest.pagination.totalPages,
                    totalRecords: infoRequest.pagination.total,
                    onPageChange,
                    onSizeChange,
                    loading,
                }}
            />

            <Dialog open={dialogMode === "view"} onOpenChange={(next) => !next && closeDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Prompt v{selectedPrompt?.version_num}</DialogTitle>
                    </DialogHeader>
                    {selectedPrompt && <PromptContainer {...selectedPrompt} />}
                </DialogContent>
            </Dialog>

            <Dialog open={dialogMode === "activate"} onOpenChange={(next) => !next && closeDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Prompt v{selectedPrompt?.version_num}</DialogTitle>
                    </DialogHeader>
                    <p>Confirma si deseas activar este prompt</p>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={closeDialog} disabled={activating}>
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={confirmActivate} disabled={activating}>
                            {activating ? "Activando..." : "Activar"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
