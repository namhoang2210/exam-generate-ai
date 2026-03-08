import type { Metadata } from "next";
import { Be_Vietnam_Pro, Titan_One } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const titanOne = Titan_One({
  variable: "--font-titan-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ExamGen AI - Hệ thống sinh đề thi tiếng Anh",
  description: "Giải pháp AI hỗ trợ giáo viên tạo đề thi tiếng Anh chuẩn THCS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${beVietnamPro.variable} ${titanOne.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
