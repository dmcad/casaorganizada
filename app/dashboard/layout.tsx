import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { SamFab } from '@/components/layout/SamFab'
import { MobileNav } from '@/components/layout/MobileNav'
import { getAuthedUser, getProfile, getNotifications } from '@/lib/data/queries'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // When Supabase is configured, require an authenticated session.
  // In demo mode (no Supabase) the dashboard stays browsable.
  const { supabase, user } = await getAuthedUser()
  if (supabase && !user) redirect('/auth/login')

  const [profile, notifications] = await Promise.all([getProfile(), getNotifications()])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar plan={profile.plan} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar profile={profile} notifications={notifications} />
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-content">{children}</div>
        </main>
      </div>
      <SamFab />
      <MobileNav />
    </div>
  )
}
