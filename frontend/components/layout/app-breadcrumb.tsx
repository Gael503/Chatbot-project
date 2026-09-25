"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { House } from "lucide-react"
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("menu");

  const segments = pathname.split("/").filter(Boolean);

  const getLabel = (index: number): string => {
    const segment = segments[index];
    const parent = segments[index - 1];
    //para no renderizar el [id] en la navegacion dinamica
    if (parent === "chats" && /^\d+$/.test(segment)) {
      return t("chats.detail");
    }

    return t.has(segment) ? t(`${segment}.title`) : segment;
  };

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage> <House /> {t("home")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="grid place-content-center">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          const label = getLabel(index);

          return (
            <Fragment key={segment}>
              {index == 0 && <House />}
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
