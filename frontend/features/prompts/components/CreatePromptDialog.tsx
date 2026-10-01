"use client"

import { useRef, useState, type DragEvent } from "react"
import { promptService } from "@/services"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CreatePromptDialogProps } from "../interfaces"
import { useTranslations } from "next-intl"

export default function CreatePromptDialog({ onCreated }: CreatePromptDialogProps) {
    const [open, setOpen] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string>("")
    const [submitting, setSubmitting] = useState(false)
    const t = useTranslations();
    const inputRef = useRef<HTMLInputElement>(null)

    const reset = () => {
        setFile(null)
        setError("")
        setDragging(false)
    }

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) {
            reset()
        }
    }

    const readFile = (file: File | undefined) => {
        if (!file) {
            return
        }
        if (!file.name.toLowerCase().endsWith(".txt")) {
            setError("Solo se permiten archivos .txt")
            return
        }
        setFile(file)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDragging(false)
        readFile(event.dataTransfer.files?.[0])
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setDragging(true)
    }

    const handleDragLeave = () => {
        setDragging(false)
    }

    const handleSubmit = async () => {
        if(!file){
            console.log("No hay archivo por enviar");
            return;
        }
        setSubmitting(true)
        try {
            const resp = await promptService.create(file)
            if (!resp.success) {
                setError(resp.message || "No se pudo crear el prompt")
                return
            }
            onCreated()
            handleOpenChange(false)
        } catch (error) {
            setError("No se pudo crear el prompt")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button className="bg-blue-600 text-white cursor-pointer"/>}>
                { t('prompt.new_prompt') }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ t('prompt.new_prompt') }</DialogTitle>
                </DialogHeader>

                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer ${
                        dragging ? "border-cyan-600 bg-cyan-50" : "border-gray-300"
                    }`}
                >
                    <input
                        type="file"
                        accept=".txt,text/plain"
                        className="hidden"
                        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    />
                    {file ? (
                        <p className="font-medium">{file.name}</p>
                    ) : (
                        <p className="text-gray-500">
                            { t('prompt.new_prompt_description') }
                        </p>
                    )}
                </div>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <div className="flex justify-end mt-4">
                    <Button onClick={handleSubmit} disabled={submitting || !file}>
                        {submitting ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
