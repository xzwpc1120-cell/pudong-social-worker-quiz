import type { Metadata } from "next";
import "./globals.css";
import "./updates.css";

export const metadata: Metadata = {title:"浦东社工备考训练室",description:"2025—2026浦东新区社区工作者综合能力测验本地训练题库"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
