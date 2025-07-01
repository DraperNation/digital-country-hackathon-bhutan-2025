import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import type { Metadata } from "next";
import { Providers } from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Drapo Citizen",
  description: "Global app for ecitizen",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let messages = {};
  try {
    // Synchronously require the JSON file from public/locales
    messages = require(`../../../public/locales/${locale}/common.json`);
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
