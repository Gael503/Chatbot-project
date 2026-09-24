"use client"
import { useEffect, useState } from "react"
import { userSearchRequest, User } from "@/services/users/classes/user"
import { userService } from "@/services"
import { DataTable } from "@/components/ui/data-table"
import { userColumns } from "../components/UserColumns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Pagination from "@/shared/Pagination"

function cloneRequest(request: userSearchRequest): userSearchRequest {
    const next = Object.assign(new userSearchRequest(), request)
    next.pagination = Object.assign(new Pagination(), request.pagination)
    return next
}

export default function TableUsers(){
    const [users, setUsers] = useState<User[]>([])
    const [infoRequest, setInfoRequest] = useState<userSearchRequest>(new userSearchRequest())
    const [loading, setLoading] = useState(false)

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
        searchUsers(infoRequest)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFilterChange = (field: "id" | "name" | "email", value: string) => {
        setInfoRequest(prev => {
            const next = cloneRequest(prev)
            if (field === "id") next.id = value ? Number(value) : 0
            else next[field] = value
            return next
        })
    }

    const handleSearch = () => {
        const request = cloneRequest(infoRequest)
        request.pagination.page = 1
        searchUsers(request)
    }

    const handlePageChange = (page: number) => {
        const request = cloneRequest(infoRequest)
        request.pagination.page = page
        searchUsers(request)
    }

    const { page, totalPages } = infoRequest.pagination

    return (
        <div className="p-4">
            <div className="container mx-auto py-10 space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium" htmlFor="filter-id">Id</label>
                        <Input
                            id="filter-id"
                            value={infoRequest.id || ""}
                            onChange={(e) => handleFilterChange("id", e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium" htmlFor="filter-name">Name</label>
                        <Input
                            id="filter-name"
                            value={infoRequest.name}
                            onChange={(e) => handleFilterChange("name", e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium" htmlFor="filter-email">Email</label>
                        <Input
                            id="filter-email"
                            value={infoRequest.email}
                            onChange={(e) => handleFilterChange("email", e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={loading}>Search</Button>
                </div>

                <DataTable columns={userColumns} data={users} />

                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        disabled={loading || page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        disabled={loading || (totalPages > 0 && page >= totalPages)}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
