export type AccountInfoResponseData = {
  amount: number
  id: number
  monthName: string | null
  name: string
  type: string
}

export type RecordsResponseData = {
  amount: number
  category: string
  description: string | null
  id: number
  month: string
  month_id: number | null
  'record-type': 'income' | 'expense' | null
}
