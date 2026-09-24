
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IInputStringProps } from "./interfaces/inputProps"
import { Controller } from "react-hook-form"
import { useTranslations } from "next-intl"

export const InputText = (props: IInputStringProps) => {
    const t = useTranslations();
    const { control, fieldInfo } = props;
    const { id, name, labeltext, maxlength, placeholder, requeried, type, minlength, disabled, className } = fieldInfo;
    return(
        <Controller
            name={name}
            control={control}
            disabled={disabled}
            rules={{
                required: requeried ? t("forms.required") : false,
                maxLength: {
                    value: maxlength,
                    message: t('forms.max_length', {value: maxlength}),
                },
                minLength: {
                    value: minlength,
                    message: t('forms.min_length', {value: minlength}),
                },
            }}
            render={({ field, fieldState }) => (
                <Field className={className ? className : "my-2"}>
                <FieldLabel htmlFor={id} className="font-bold">
                    {labeltext}
                </FieldLabel>

                <Input
                    {...field}
                    value={field.value ?? ""}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    aria-invalid={fieldState.invalid}
                    minLength={minlength}
                    maxLength={maxlength}
                />

                {fieldState.error && (
                    <p className="text-sm text-red-500">
                    {fieldState.error.message}
                    </p>
                )}
                </Field>
            )}
            />
    )
}