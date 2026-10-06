"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "@/components/table-features"
import { promptData } from "@/services/prompts/classes"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/components/utils/formatDate"
import { ColumsPrompts } from "../interfaces"
const columnHelper = createColumnHelper<DataTableFeatures, promptData>()

export function getPromptColumns(props: ColumsPrompts) {
    const { onView, turnOn, t } = props;
    return columnHelper.columns([
        // columnHelper.accessor("id", {
        //     header: "Id"
        // }),
        columnHelper.accessor("version_num", {
            header: t('prompt.prompt.version')
        }),
        columnHelper.accessor("created_by", {
            header: t('prompt.prompt.created_by')
        }),
        columnHelper.accessor("is_active", {
            header: t('prompt.prompt.is_active'),
            cell: (info) => (
                <div className="max-w-30 m-auto">
                    <p className={`p-2 border ${info.getValue() ? "border-green-300" : "border-red-500" } rounded-2xl font-bold text-center`}>
                        {
                        info.getValue()
                        ? t("common.status_active")
                        : t("common.status_inactive")
                        }
                    </p>
                </div>
            )
        }),
        columnHelper.accessor("created_at", {
            header: t('prompt.prompt.created_at'),
            cell: (info) => formatDate(info.getValue())
        }),
        columnHelper.display({
            header: t('common.actions'),
            cell: (info) => (
                <div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-200 mx-2 font-bold"
                        onClick={() => onView(info.row.original)}
                    >
                        { t('common.show') }
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-200 mx-2 font-bold"
                        onClick={() => turnOn(info.row.original)}
                    >
                        { t('common.activate') }
                    </Button>
                </div>
            )
        }),
    ])
}
