"use client"

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "@/components/table-features"
import { PaginationControls, type DataTablePagination } from "@/components/ui/pagination-controls"

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[]
    pagination?: DataTablePagination
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    pagination,
}: DataTableProps<TData>) {
    const table = useTable({
        features,
        data,
        columns,
    })

    return (
        <div>
            <div className="overflow-hidden my-2 rounded-md border">
                <Table>
                    <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id} className="font-bold bg-cyan-700 text-white">
                                {header.isPlaceholder ? null : (
                                <table.FlexRender header={header} />
                                )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                <table.FlexRender cell={cell} />
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>

            {pagination && <PaginationControls pagination={pagination} />}
        </div>
    )
}