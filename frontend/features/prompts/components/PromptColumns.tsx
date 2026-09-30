"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "@/components/table-features"
import { promptData } from "@/services/prompts/classes"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/components/utils/formatDate"

const columnHelper = createColumnHelper<DataTableFeatures, promptData>()

export function getPromptColumns(props: {
    onView: (prompt: promptData) => void,
    turnOn: (prompt: promptData) => void
}) {
    const { onView, turnOn } = props;
    return columnHelper.columns([
        columnHelper.accessor("id", {
            header: "Id"
        }),
        columnHelper.accessor("version_num", {
            header: "Version"
        }),
        columnHelper.accessor("created_by", {
            header: "Creado por"
        }),
        columnHelper.accessor("is_active", {
            header: "Activo",
            cell: (info) => (info.getValue() ? "Si" : "No"),
        }),
        columnHelper.accessor("created_at", {
            header: "Creado",
            cell: (info) => formatDate(info.getValue())
        }),
        columnHelper.display({
            id: "actions",
            header: "Acciones",
            cell: (info) => (
                <div className="w-2 flex">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-200 mx-2 font-bold"
                        onClick={() => onView(info.row.original)}
                    >
                        Ver
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-200 mx-2 font-bold"
                        onClick={() => turnOn(info.row.original)}
                    >
                        Activar prompt
                    </Button>
                </div>
            )
        }),
    ])
}
