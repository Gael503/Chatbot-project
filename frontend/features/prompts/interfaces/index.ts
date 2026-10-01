import { promptData } from "@/services/prompts/classes"
import { useTranslations } from "next-intl"
export interface CreatePromptDialogProps {
    onCreated: () => void
}

export interface ColumsPrompts{
    onView: (prompt: promptData) => void,
    turnOn: (prompt: promptData) => void,
    t: ReturnType<typeof useTranslations>
}