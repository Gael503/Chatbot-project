import Pagination from "@/shared/Pagination"

type Paginated = { pagination: Pagination }

export function cloneRequest<T extends Paginated>(factory: () => T, request: T): T {
    const next = Object.assign(factory(), request)
    next.pagination = Object.assign(new Pagination(), request.pagination)
    return next
}

export function handlePageChange<T extends Paginated>(
    factory: () => T,
    request: T,
    page: number,
    search: (request: T) => void
): void {
    const next = cloneRequest(factory, request)
    next.pagination.page = page
    search(next)
}

export function handleSizeChange<T extends Paginated>(
    factory: () => T,
    request: T,
    size: number,
    search: (request: T) => void
): void {
    const next = cloneRequest(factory, request)
    next.pagination.size = size
    next.pagination.page = 1
    search(next)
}
