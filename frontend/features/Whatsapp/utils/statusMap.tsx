import { BotConnectionState } from "@/services/whatsapp/classes";
import {
    CircleAlert,
    Rss,
    RotateCwFadingClock,
    BadgeCheck,
    ShieldX
} from "lucide-react";

import { useTranslations } from "next-intl";

const statusConfig = {
    inactive: CircleAlert,
    initializing: Rss,
    qr_pending: RotateCwFadingClock,
    connected: BadgeCheck,
    auth_failure: ShieldX
};

const statusClass = {
    inactive: "border-yellow-300",
    initializing: "border-blue-300",
    qr_pending: "border-yellow-300",
    connected: "border-green-300",
    auth_failure: "border-red-300"
};

export default function getStatusData(
    status: BotConnectionState = "auth_failure",
    t: ReturnType<typeof useTranslations>
) {
    const Icon = statusConfig[status];

    return {
        text: t(`whatsapp.status.${status}`),
        icon: <Icon width={150} height={150}/>,
        border: statusClass[status]
    };
}