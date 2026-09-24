import { Input } from "@base-ui/react/input"
import { Button } from "@base-ui/react/button"
import { userSearchProps } from "../interfaces"

export default function userSearch(props: userSearchProps){
    const { infoRequest, handleFilterChange, handleSearch, loading } = props;
    return(
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
    )
}