import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";

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
    <html lang="en">
  <body
    className="
      min-h-screen
      bg-gray-50
      text-gray-900
      antialiased
    "
  >

    <SidebarProvider>

      {children}

    </SidebarProvider>

    <Toaster
      position="top-right"
      toastOptions={{
        duration:3000
      }}
    />

  </body>
</html>
  );
}