import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "عبود - صديقك الصغير",
  description: "تطبيق تعليمي ممتع للأطفال مع عبود! قصص، حروف، وألوان.",
  icons: {
    icon: "/images/abood/main.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} antialiased bg-abood-bg text-foreground`}
      >
        <main className="min-h-screen max-w-lg mx-auto relative">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
