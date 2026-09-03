import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Sekolah & Yayasan | BMPS Bogor",
  description: "Temukan sekolah dan yayasan yang telah terdaftar sebagai bagian dari BMPS Bogor.",
};

export default function SekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
