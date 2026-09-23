"use client"
import { useForm } from "react-hook-form"
import { LoginForm } from "@/components/forms/interfaces/login"
import { useTranslations } from "next-intl";
import Image from "next/image";
import { InputText } from "@/components/forms/customField"
import ButtonsForm from "@/components/forms/buttonsForm"
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import { Session } from "next-auth";
import { toast } from "@/components/ui/toast"
import { useEffect, useState } from "react";
export default function LoginPage() {
  const defaultValues: LoginForm = {
    email: "",
    password: ""
  }
  const { control, setValue, handleSubmit, formState: { errors } } = useForm<LoginForm>({ defaultValues })
  const t = useTranslations();
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  const HandleLogin = async (payload: LoginForm) => {
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
    <>
      <div className="min-h-screen flex items-center justify-center p-4 m-auto w-3/4">
        <div className="w-full max-w-md p-4 border rounded-2xl bg-white">
          <header className="p-3 font-bold text-center">
            <h1>{t('login.title')}</h1>
          </header>

          <div className="flex flex-col md:flex-row p-3 gap-6 items-center">

            <div className="shrink-0">
              <Image
                src="/icons/bot.png"
                height={100}
                width={100}
                alt="botImage"
                className="mx-auto"
              />
            </div>

            <form onSubmit={handleSubmit(HandleLogin)} className="w-full md:flex-1">
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
              <ButtonsForm disable={disabled}/>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}