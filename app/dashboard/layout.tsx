import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { SamFab } from '@/components/layout/SamFab'
import { MobileNav } from '@/components/layout/MobileNav'
import { DEMO_PROFILE } from '@/lib/demo/data'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // In production this comes from the authenticated profile.
  const plan = DEMO_PROFILE.plan

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar plan={plan} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-content">{children}</div>
        </main>
      </div>
      <SamFab />
      <MobileNav />
    </div>
  )
}
