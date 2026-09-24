"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "@/components/table-features"
import { User } from "@/services/users/classes/user"

const columnHelper = createColumnHelper<DataTableFeatures, User>()

export const userColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Id"
  }),
  columnHelper.accessor("name", {
    header: "Name"
  }),
  columnHelper.accessor("email", {
    header: "Email"
  }),
  columnHelper.accessor("is_active", {
    header: "Is active"
  }),
  columnHelper.accessor("created_at", {
    header: "Created_at"
  }),
  columnHelper.accessor("last_login", {
    header: "Last login"
  }),
])