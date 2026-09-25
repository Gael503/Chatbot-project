"use client"

import { useTranslations } from "next-intl";

import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const

export interface DataTablePagination {
    page: number
    size: number
    totalPages: number
    totalRecords: number
    onPageChange: (page: number) => void
    onSizeChange: (size: number) => void
    sizeOptions?: readonly number[]
    loading?: boolean
}

function getPageNumbers(page: number, totalPages: number): (number | "ellipsis")[] {
    if (totalPages <= 1) return [1]

    const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
    const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

    const result: (number | "ellipsis")[] = []
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) {
            result.push("ellipsis")
        }
        result.push(p)
    })
    return result
}

export function PaginationControls({ pagination }: { pagination: DataTablePagination }) {
    const t = useTranslations();

    return (
        <div className="flex items-center justify-between gap-4 p-2">
            <p className="text-md font-bold">
                {t('forms.pagination.records', {
                    first: pagination.page,
                    last: pagination.size,
                    totalRecords: pagination.totalRecords
                })}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground m-auto mr-0">
                <span>{t("forms.pagination.rows")}</span>
                <Select
                    value={String(pagination.size)}
                    onValueChange={(value) => {
                        if (!pagination.loading) {
                            pagination.onSizeChange(Number(value))
                        }
                    }}
                >
                    <SelectTrigger size="sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {(pagination.sizeOptions ?? PAGE_SIZE_OPTIONS).map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="m-auto mx-0">
                {pagination.totalPages > 0 && (
                    <PaginationRoot className="justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                aria-disabled={pagination.loading || pagination.page <= 1}
                                className={pagination.loading || pagination.page <= 1 ? "pointer-events-none opacity-50" : undefined}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (!pagination.loading && pagination.page > 1) {
                                        pagination.onPageChange(pagination.page - 1)
                                    }
                                }}
                            />
                        </PaginationItem>

                        {getPageNumbers(pagination.page, pagination.totalPages).map((p, idx) =>
                            p === "ellipsis" ? (
                                <PaginationItem key={`ellipsis-${idx}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        href="#"
                                        isActive={p === pagination.page}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (!pagination.loading && p !== pagination.page) {
                                                pagination.onPageChange(p)
                                            }
                                        }}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                aria-disabled={pagination.loading || pagination.page >= pagination.totalPages}
                                className={pagination.loading || pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : undefined}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (!pagination.loading && pagination.page < pagination.totalPages) {
                                        pagination.onPageChange(pagination.page + 1)
                                    }
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                    </PaginationRoot>
                )}
            </div>
        </div>
    )
}
