"use client";

import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";

import { store } from "@/lib/store";

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
