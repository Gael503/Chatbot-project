"use client"
import { useEffect, useState } from "react"
import { userSearchRequest, User } from "@/services/users/classes/user"
import { userService } from "@/services"
import { DataTable } from "@/components/ui/data-table"
import { userColumns } from "../components/UserColumns"
import { Button } from "@/components/ui/button"
import Pagination from "@/shared/Pagination"
import { useForm } from "react-hook-form"
import { InputText } from "@/components/forms/customField"
import ButtonsForm from "@/components/forms/buttonsForm"

function cloneRequest(request: userSearchRequest): userSearchRequest {
    const next = Object.assign(new userSearchRequest(), request)
    next.pagination = Object.assign(new Pagination(), request.pagination)
    return next
}

export default function TableUsers(){
    const [users, setUsers] = useState<User[]>([])
    const [infoRequest, setInfoRequest] = useState<userSearchRequest>(new userSearchRequest())
    const [loading, setLoading] = useState(false);
    const defaultValues = new userSearchRequest();
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<userSearchRequest>({ defaultValues })

    const searchUsers = async (request: userSearchRequest) => {
        setLoading(true)
        try {
            const response = await userService.search(request)
            if (response.success && response.data) {
                setUsers(response.data.users)
                const nextRequest = cloneRequest(request)
                nextRequest.pagination = Object.assign(new Pagination(), response.data.pagination)
                setInfoRequest(nextRequest)
            } else {
                setUsers([])
                setInfoRequest(request)
            }
        } catch (error) {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        searchUsers(defaultValues)
    }, [])


    const handleSearch = handleSubmit((formValues) => {
        const request = cloneRequest(infoRequest)
        request.id = formValues.id
        request.name = formValues.name
        request.email = formValues.email
        request.pagination.page = 1
        searchUsers(request)
    })

    const handlePageChange = (page: number) => {
        const request = cloneRequest(infoRequest)
        request.pagination.page = page
        searchUsers(request)
    }

    return (
        <div>
            <div className="my-4">
                <form onSubmit={handleSearch}>
                    <div className="flex m-2">
                        <InputText 
                            control={control}
                            fieldInfo={{
                                id: "filter-id",
                                labeltext: "Id",
                                name: "id",
                                placeholder: "userId",
                                type: "text",
                                minlength: 0,
                                maxlength: 5,
                                requeried: false,
                                disabled: false,
                                className: "mx-2 w-3xs"
                            }}
                            setValue={setValue}
                            errors={errors}
                        />
                        <InputText 
                            control={control}
                            fieldInfo={{
                                id: "name",
                                labeltext: "Nombre de usuario",
                                name: "name",
                                placeholder: "user...",
                                type: "text",
                                minlength: 0,
                                maxlength: 20,
                                requeried: false,
                                disabled: false,
                                className: "mx-2 w-3xs"
                            }}
                            setValue={setValue}
                            errors={errors}
                        />
                        <InputText 
                            control={control}
                            fieldInfo={{
                                id: "email",
                                labeltext: "Email",
                                name: "email",
                                placeholder: "user@gmail.com",
                                type: "text",
                                minlength: 0,
                                maxlength: 30,
                                requeried: false,
                                disabled: false,
                                className: "mx-2 w-3xs"
                            }}
                            setValue={setValue}
                            errors={errors}
                        />
                    </div>
                    <div className="w-1/4 flex m-auto">
                        <ButtonsForm submit_label="Buscar..."/>
                    </div>
                </form>
            </div>

            <DataTable columns={userColumns} data={users} />

            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    disabled={loading || infoRequest.pagination.page <= 1}
                    onClick={() => handlePageChange(infoRequest.pagination.page - 1)}
                >
                    Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {infoRequest.pagination.page} of {infoRequest.pagination.totalPages || 1}
                </span>
                <Button
                    variant="outline"
                    disabled={loading || (infoRequest.pagination.total > 0 && infoRequest.pagination.page >= infoRequest.pagination.totalPages)}
                    onClick={() => handlePageChange(infoRequest.pagination.page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
