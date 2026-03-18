import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScriptAI - バズるショート動画スクリプト生成",
  description: "AIがあなたのショート動画のスクリプトを30秒で生成",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}
