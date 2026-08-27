import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from "@/i18n/routing";
import "./globals.css"

export const metadata: Metadata = {
  title: "Chatbot project",
  description: "",
};
interface ILayout{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}
export default async function RootLayout({ children, params }: ILayout) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
