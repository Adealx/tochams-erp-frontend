import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "TOCHAMS ERP",
  description:
    "Enterprise Resource Planning & Accounts Receivable Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <body
        className="
          min-h-screen
          bg-gray-50
          text-gray-900
          antialiased
        "
      >
        <AuthProvider>

          <SidebarProvider>

            {children}

          </SidebarProvider>

        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            success: {
              style: {
                background: "#16A34A",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#DC2626",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}