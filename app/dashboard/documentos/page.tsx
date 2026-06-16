import { DocumentosView } from '@/components/modules/documentos/DocumentosView'
import { getDocuments, getFamilyMembers } from '@/lib/data/queries'

export default async function DocumentosPage() {
  const [documents, members] = await Promise.all([getDocuments(), getFamilyMembers()])
  return <DocumentosView documents={documents} members={members} />
}
