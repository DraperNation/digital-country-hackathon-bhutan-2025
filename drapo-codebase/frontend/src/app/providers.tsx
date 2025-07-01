"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
