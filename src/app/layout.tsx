import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // هنا نستخدم await لأن cookies() عندك Promise
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value || "light";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${activeThemeValue}`}
      style={{ colorScheme: activeThemeValue }}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "text-foreground group/body overscroll-none",
          "[--footer-height:calc(var(--spacing)*14)]",
          "[--header-height:calc(var(--spacing)*14)]",
          "xl:[--footer-height:calc(var(--spacing)*24)]"
        )}

        style={{fontFamily: "cairo"}}
      >
        <Toaster position="top-center" dir="rtl" style={{fontFamily: "Cairo"}}  />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            {children}
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
