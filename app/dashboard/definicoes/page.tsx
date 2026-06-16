import { DefinicoesView } from '@/components/modules/definicoes/DefinicoesView'
import { getProfile, getFamilyMembers } from '@/lib/data/queries'

export default async function DefinicoesPage() {
  const [profile, members] = await Promise.all([getProfile(), getFamilyMembers()])
  return <DefinicoesView profile={profile} members={members} />
}
