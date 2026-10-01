"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import { type DataTableFeatures } from "@/components/table-features"
import { User } from "@/services/users/classes/user"
import { formatDate } from "@/components/utils/formatDate"

const columnHelper = createColumnHelper<DataTableFeatures, User>()

export const getUserColumns = (t: ReturnType<typeof useTranslations>) =>
  columnHelper.columns([
    columnHelper.accessor("name", {
      header: t("users.user.name"),
    }),

    columnHelper.accessor("email", {
      header: t("users.user.email"),
    }),

    columnHelper.accessor("is_active", {
      header: t("users.user.is_active"),
      cell: (info) => (
        <div>
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
      header: t("users.user.created_at"),
      cell: (info) =>
        info.getValue()
          ? formatDate(info.getValue())
          : t("common.unknown"),
    }),

    columnHelper.accessor("last_login", {
      header: t("users.user.last_login"),
      cell: (info) =>
        info.getValue()
          ? formatDate(info.getValue())
          : t("common.unknown"),
    }),
  ])