import type { Metadata } from "next"
import DashboardPageClient from "./dashboard-page"

export const metadata: Metadata = {
  title: "Technical Infrastructure Dashboard",
  description: "Dashboard for monitoring device and panel usage across studios",
}

export default function DashboardPage() {
  return <DashboardPageClient />
}
