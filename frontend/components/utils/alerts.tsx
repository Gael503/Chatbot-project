import { AlertProps } from "../ui/interfaces"
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlertSuccess(props: AlertProps) {
    const { title, message } = props;
    return (
        <div className="absolute right-0 m-4">
            <Alert className="max-w-md">
                <CheckCircle2Icon />
                <AlertTitle>{ title }</AlertTitle>
                <AlertDescription>
                    { message }
                </AlertDescription>
            </Alert>
        </div>
    )
}

export function AlertFail(props: AlertProps) {
    const { title, message } = props;
    return (
        <div className="absolute right-0 m-4">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircleIcon />
                <AlertTitle>{ title }</AlertTitle>
                <AlertDescription>
                    { message }
                </AlertDescription>
            </Alert>
        </div>
    )
}
