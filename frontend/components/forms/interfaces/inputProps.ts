import { useForm, UseFormSetValue } from "react-hook-form"

export interface IInputStringProps {
  control:any;
  setValue: UseFormSetValue<any>;
  fieldInfo: IFieldDataString;
  errors: any
}

export interface IFieldDataString {
    id: string;
    name: string;
    labeltext: string;
    placeholder: string;
    maxlength: number;
    minlength: number;
    requeried: boolean;
    type: "text" | "password" | "email"
    disabled: boolean,
    className?: string;
}