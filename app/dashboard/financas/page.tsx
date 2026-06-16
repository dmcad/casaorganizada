import { FinancasView } from '@/components/modules/financas/FinancasView'
import { getTransactions, getBudgetCategories } from '@/lib/data/queries'

export default async function FinancasPage() {
  const [transactions, budget] = await Promise.all([getTransactions(), getBudgetCategories()])
  return <FinancasView transactions={transactions} budget={budget} />
}
