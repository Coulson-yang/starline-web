import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MissionBackdrop } from "@/components/MissionBackdrop";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getInstitutionData } from "@/lib/get-institution-data";
import { getSiteUrl, siteDescription } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "英创起点 · Start Line.",
    template: "%s · 英创起点",
  },
  description: siteDescription,
  openGraph: {
    title: "英创起点 · Mission Control",
    description: siteDescription,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "英创起点 · Mission Control",
    description: siteDescription,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await getInstitutionData();

  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className={`${inter.className} min-h-screen`}>
        <MissionBackdrop />
        <OrganizationJsonLd name={data.brand.name} />
        <SiteHeader brandName={data.brand.name} trialHref={data.brand.trialCtaHref} trialLabel={data.brand.trialCtaLabel} />
        <main>{children}</main>
        <SiteFooter brandName={data.brand.name} />
      </body>
    </html>
  );
}
