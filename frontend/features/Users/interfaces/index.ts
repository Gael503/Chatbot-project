import { userSearchRequest } from "@/services/users/classes/user"

export interface userSearchProps{
    infoRequest: userSearchRequest,
    handleFilterChange: (field: string, value: any) => void,
    handleSearch: () => void,
    loading: boolean
}