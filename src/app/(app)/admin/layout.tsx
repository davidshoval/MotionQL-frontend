import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Staff");

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
