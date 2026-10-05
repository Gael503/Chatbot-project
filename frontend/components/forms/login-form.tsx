"use client"
import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import ButtonsForm from "./buttonsForm"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "../ui/toast"
import { authService } from "@/services"
import { Session } from "next-auth"
import { InputText } from "./customField"
import { LoginRequest } from "@/services/auth/classes"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const defaultValues: LoginRequest = {
    email: "",
    password: ""
  }
  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm<LoginRequest>({ defaultValues })
  const t = useTranslations();
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  const HandleLogin = async (payload: LoginRequest) => {
    setDisabled(true)
    try {
      const resp: Session | null = await authService.login(payload);
      if(!resp){
        toast.add({
          type: "error",
          title: t('login.unauthorized'),
          description: t("login.unauthorized_credentials")
          
        })
        return;
      }
      toast.add({
          type: "info",
          title: t("login.authorized"),
      })
      router.push("/home")
    } catch (error) {
      console.error("Error al hacer signIn");
      console.error("Error: ", error)
    } finally{
      setTimeout(() =>{
        setDisabled(false)
      }, 1500)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(HandleLogin)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('login.title')}</h1>
                <p className="text-balance text-muted-foreground">

                </p>
              </div>
              <InputText
                control={control}
                fieldInfo={{
                  id: "username",
                  name: "email",
                  labeltext: t("login.user"),
                  placeholder: t("login.user_placeholder"),
                  maxlength: 50,
                  minlength: 0,
                  requeried: true,
                  type: "text",
                  disabled: disabled
                }}
                errors={errors.email}
                setValue={setValue}
                key="username"
              />

              <InputText
                control={control}
                fieldInfo={{
                  id: "password",
                  name: "password",
                  labeltext: t("login.password"),
                  placeholder: t("login.password_placeholder"),
                  maxlength: 50,
                  minlength: 0,
                  requeried: true,
                  type: "password",
                  disabled: disabled
                }}
                errors={errors.password}
                setValue={setValue}
                key="password"
              />
              <ButtonsForm disable={disabled} onClean={() => reset()}/>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/backgroud-cube.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
