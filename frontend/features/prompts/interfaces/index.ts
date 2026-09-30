import { promptData } from "@/services/prompts/classes"
export interface CreatePromptDialogProps {
    onCreated: () => void
}

export interface ColumsPrompts{
    onView: (prompt: promptData) => void,
    turnOn: (prompt: promptData) => void
}