<template>
  <Button
    icon="pi pi-file-import"
    label="Import CSV"
    severity="secondary"
    outlined
    @click="isVisible = true"
  />

  <Dialog
    v-model:visible="isVisible"
    modal
    :header="parsedData ? 'Bank Statement Preview' : 'Import Bank Statement'"
    :style="{ width: '85vw', maxWidth: '1100px' }"
    :draggable="false"
    @hide="reset"
  >
    <!-- Upload Zone -->
    <div v-if="!parsedData">
      <div
        class="upload-zone"
        :class="{ 'drag-over': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInputRef?.click()"
      >
        <i class="pi pi-cloud-upload text-5xl text-color-secondary mb-3" />
        <p class="m-0 text-color font-semibold text-lg">
          Drag & drop your CSV here
        </p>
        <p class="m-0 text-color-secondary text-sm mt-2">or click to browse</p>
        <p class="m-0 text-color-secondary text-xs mt-3">
          Supports Brazilian bank statement format (.csv)
        </p>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept=".csv"
        style="display: none"
        @change="onFileChange"
      />
      <Message
        v-if="parseError"
        severity="error"
        :closable="false"
        class="mt-3"
      >
        {{ parseError }}
      </Message>
    </div>

    <!-- Preview -->
    <div v-else>
      <!-- Statement Summary Cards -->
      <div class="grid mb-4">
        <div class="col-12 sm:col-4">
          <Card :pt="{ body: { class: 'p-3' } }">
            <template #content>
              <p class="text-xs text-color-secondary m-0 mb-1">Account</p>
              <p class="text-xl font-bold m-0">{{ parsedData.meta.account }}</p>
            </template>
          </Card>
        </div>
        <div class="col-12 sm:col-4">
          <Card :pt="{ body: { class: 'p-3' } }">
            <template #content>
              <p class="text-xs text-color-secondary m-0 mb-1">Period</p>
              <p class="text-base font-bold m-0">
                {{ formatDate(parsedData.meta.periodStart) }}
                &nbsp;—&nbsp;
                {{ formatDate(parsedData.meta.periodEnd) }}
              </p>
            </template>
          </Card>
        </div>
        <div class="col-12 sm:col-4">
          <Card :pt="{ body: { class: 'p-3' } }">
            <template #content>
              <p class="text-xs text-color-secondary m-0 mb-1">Final Balance</p>
              <p
                class="text-xl font-bold m-0"
                :class="
                  parsedData.meta.finalBalance >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                "
              >
                {{ formatCurrency(parsedData.meta.finalBalance) }}
              </p>
            </template>
          </Card>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-wrap gap-3 mb-4 align-items-end">
        <div class="flex flex-column gap-1">
          <label class="text-xs text-color-secondary">Type</label>
          <Dropdown
            v-model="filterType"
            :options="transactionTypes"
            placeholder="All types"
            showClear
            class="w-12rem"
          />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-xs text-color-secondary">From</label>
          <Calendar
            v-model="filterDateFrom"
            dateFormat="dd/mm/yy"
            showIcon
            iconDisplay="input"
            placeholder="Start date"
            class="w-10rem"
          />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-xs text-color-secondary">To</label>
          <Calendar
            v-model="filterDateTo"
            dateFormat="dd/mm/yy"
            showIcon
            iconDisplay="input"
            placeholder="End date"
            class="w-10rem"
          />
        </div>
        <Button
          v-if="filterType || filterDateFrom || filterDateTo"
          label="Clear"
          text
          severity="secondary"
          icon="pi pi-times"
          @click="clearFilters"
        />
      </div>

      <!-- Transactions DataTable -->
      <DataTable
        v-model:selection="selectedTransactions"
        :value="filteredTransactions"
        selectionMode="multiple"
        :metaKeySelection="false"
        scrollable
        scrollHeight="300px"
        class="text-sm"
      >
        <Column selectionMode="multiple" style="width: 3rem" frozen />
        <Column field="date" header="Date" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <span class="whitespace-nowrap">{{ formatDate(data.date) }}</span>
          </template>
        </Column>
        <Column field="type" header="Type" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <Chip :label="data.type" class="text-xs" />
          </template>
        </Column>
        <Column
          field="description"
          header="Description"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <span class="text-color-secondary">{{ data.description }}</span>
          </template>
        </Column>
        <Column
          field="amount"
          header="Amount"
          sortable
          style="min-width: 8rem"
          headerClass="justify-content-end"
          bodyClass="text-right"
        >
          <template #body="{ data }">
            <span
              class="font-semibold"
              :class="data.amount >= 0 ? 'text-green-500' : 'text-red-500'"
            >
              {{ formatCurrency(data.amount) }}
            </span>
          </template>
        </Column>
        <Column
          field="balance"
          header="Balance"
          style="min-width: 8rem"
          headerClass="justify-content-end"
          bodyClass="text-right"
        >
          <template #body="{ data }">
            <span class="text-color-secondary">{{
              formatCurrency(data.balance)
            }}</span>
          </template>
        </Column>
      </DataTable>

      <!-- Summary Totals -->
      <div
        class="flex flex-wrap gap-5 mt-4 pt-4 border-top-1 border-200 align-items-end"
      >
        <div>
          <p class="text-xs text-color-secondary m-0 mb-1">Total Income</p>
          <p class="text-lg font-bold text-green-500 m-0">
            {{ formatCurrency(totalIncome) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-color-secondary m-0 mb-1">Total Expenses</p>
          <p class="text-lg font-bold text-red-500 m-0">
            {{ formatCurrency(totalExpenses) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-color-secondary m-0 mb-1">Net Result</p>
          <p
            class="text-lg font-bold m-0"
            :class="netResult >= 0 ? 'text-green-500' : 'text-red-500'"
          >
            {{ formatCurrency(netResult) }}
          </p>
        </div>
        <p class="ml-auto m-0 text-sm text-color-secondary align-self-center">
          {{ selectedTransactions.length }} selected &middot;
          {{ filteredTransactions.length }} of
          {{ parsedData.transactions.length }} transactions
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-content-between mt-5">
        <Button
          label="Upload another"
          severity="secondary"
          outlined
          icon="pi pi-arrow-left"
          @click="reset"
        />
        <Button
          label="Import Records"
          icon="pi pi-check"
          :loading="isImporting"
          :disabled="selectedTransactions.length === 0"
          @click="handleImport"
        />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { supabase } from '@/supabase'
import Message from 'primevue/message'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Transaction {
  date: Date
  type: string
  description: string
  amount: number
  balance: number
}

interface StatementMeta {
  account: string
  periodStart: Date
  periodEnd: Date
  finalBalance: number
}

interface ParsedStatement {
  meta: StatementMeta
  transactions: Transaction[]
}

const props = defineProps<{
  monthId: number
  refetchRecords: () => Promise<void>
}>()

const emit = defineEmits<{
  imported: [payload: { meta: StatementMeta; transactions: Transaction[] }]
}>()

const toast = useToast()

const isVisible = ref(false)
const isDragging = ref(false)
const parseError = ref<string | null>(null)
const parsedData = ref<ParsedStatement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isImporting = ref(false)

const filterType = ref<string | null>(null)
const filterDateFrom = ref<Date | null>(null)
const filterDateTo = ref<Date | null>(null)

const selectedTransactions = ref<Transaction[]>([])

// ─── CSV Parsing ──────────────────────────────────────────────────────────────

/**
 * Splits a single CSV line into fields, correctly handling quoted fields
 * that may contain semicolons.
 */
const parseCsvLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ';' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

/**
 * Parses a Brazilian-formatted number string to a JS number.
 * e.g. "-49,90" → -49.90 | "1.234,56" → 1234.56
 */
const parseBrNumber = (value: string): number => {
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(cleaned)
  if (isNaN(n)) throw new Error(`Cannot parse number: "${value}"`)
  return n
}

/**
 * Parses a DD/MM/YYYY date string to a Date object.
 */
const parseDateStr = (value: string): Date => {
  const parts = value.trim().split('/')
  if (parts.length !== 3) throw new Error(`Cannot parse date: "${value}"`)
  const [day, month, year] = parts
  return new Date(Number(year), Number(month) - 1, Number(day))
}

const parseStatement = (text: string): ParsedStatement => {
  const lines = text.split('\n')

  if (lines.length < 7) {
    throw new Error(
      'File is too short or malformed. Expected Brazilian bank statement format.'
    )
  }

  // Row 0: title — discarded
  // Row 1: "Conta;80373333"
  // Row 2: "Período;01/03/2026 a 15/03/2026"
  // Row 3: "Saldo;338,98"
  // Row 4: blank
  // Row 5: column headers
  // Row 6+: transactions

  const contaRow = parseCsvLine(lines[1])
  const periodoRow = parseCsvLine(lines[2])
  const saldoRow = parseCsvLine(lines[3])

  if (!contaRow[1]) throw new Error('Missing "Conta" in metadata.')
  if (!periodoRow[1]) throw new Error('Missing "Período" in metadata.')
  if (!saldoRow[1]) throw new Error('Missing "Saldo" in metadata.')

  const account = contaRow[1]

  const periodParts = periodoRow[1].split(' a ')
  if (periodParts.length !== 2)
    throw new Error(
      'Invalid "Período" format. Expected "DD/MM/YYYY a DD/MM/YYYY".'
    )
  const periodStart = parseDateStr(periodParts[0])
  const periodEnd = parseDateStr(periodParts[1])
  const finalBalance = parseBrNumber(saldoRow[1])

  const meta: StatementMeta = { account, periodStart, periodEnd, finalBalance }

  // Map headers by name (resilient to column reordering)
  const headerRow = parseCsvLine(lines[5])
  const headerMap: Record<string, number> = {}
  headerRow.forEach((h, i) => {
    headerMap[h.trim()] = i
  })

  const required = [
    'Data Lançamento',
    'Histórico',
    'Descrição',
    'Valor',
    'Saldo'
  ]
  for (const col of required) {
    if (!(col in headerMap))
      throw new Error(`Missing required column: "${col}"`)
  }

  const transactions: Transaction[] = []
  for (let i = 6; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const cells = parseCsvLine(line)
    const dateStr = cells[headerMap['Data Lançamento']]
    const type = cells[headerMap['Histórico']] ?? ''
    const description = cells[headerMap['Descrição']] ?? ''
    const amountStr = cells[headerMap['Valor']]
    const balanceStr = cells[headerMap['Saldo']]

    if (!dateStr || !amountStr) continue

    try {
      transactions.push({
        date: parseDateStr(dateStr),
        type,
        description,
        amount: parseBrNumber(amountStr),
        balance: parseBrNumber(balanceStr)
      })
    } catch {
      // Skip individual malformed rows without crashing the import
    }
  }

  if (transactions.length === 0) {
    throw new Error(
      'No valid transactions found. Check that the file is a valid bank statement.'
    )
  }

  return { meta, transactions }
}

// ─── Computed ─────────────────────────────────────────────────────────────────

const transactionTypes = computed(() => {
  if (!parsedData.value) return []
  return [...new Set(parsedData.value.transactions.map((t) => t.type))].sort()
})

const filteredTransactions = computed<Transaction[]>(() => {
  if (!parsedData.value) return []
  let txs = parsedData.value.transactions

  if (filterType.value) {
    txs = txs.filter((t) => t.type === filterType.value)
  }
  if (filterDateFrom.value) {
    const from = filterDateFrom.value
    txs = txs.filter((t) => t.date >= from)
  }
  if (filterDateTo.value) {
    const to = filterDateTo.value
    txs = txs.filter((t) => t.date <= to)
  }

  return txs
})

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0)
)
const totalExpenses = computed(() =>
  filteredTransactions.value
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0)
)
const netResult = computed(() => totalIncome.value + totalExpenses.value)

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// ─── File handling ────────────────────────────────────────────────────────────

const processFile = (file: File) => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    parseError.value = 'Only .csv files are supported.'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string
      if (!text?.trim()) {
        parseError.value = 'The file appears to be empty.'
        return
      }
      parsedData.value = parseStatement(text)
      selectedTransactions.value = [...parsedData.value.transactions]
      parseError.value = null
    } catch (err) {
      parseError.value =
        err instanceof Error ? err.message : 'Failed to parse the CSV file.'
    }
  }
  reader.onerror = () => {
    parseError.value = 'Could not read the file. Please try again.'
  }
  reader.readAsText(file, 'UTF-8')
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processFile(file)
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) processFile(file)
}

const clearFilters = () => {
  filterType.value = null
  filterDateFrom.value = null
  filterDateTo.value = null
}

const reset = () => {
  parsedData.value = null
  parseError.value = null
  selectedTransactions.value = []
  clearFilters()
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ─── Import ───────────────────────────────────────────────────────────────────

const toIsoDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

const handleImport = async () => {
  if (!parsedData.value || selectedTransactions.value.length === 0) return
  isImporting.value = true

  try {
    const records = selectedTransactions.value.map((tx) => ({
      amount: Math.abs(tx.amount),
      description: tx.description || tx.type,
      month_id: props.monthId,
      'record-type':
        tx.amount >= 0 ? 'Income' : ('Expense' as 'Income' | 'Expense'),
      category: 'Others',
      date: toIsoDate(tx.date)
    }))

    const { error } = await supabase.from('records').insert(records)

    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Import failed',
        detail: error.message,
        life: 4000
      })
      return
    }

    emit('imported', {
      meta: parsedData.value.meta,
      transactions: selectedTransactions.value
    })

    toast.add({
      severity: 'success',
      summary: 'Import successful!',
      detail: `${records.length} record(s) imported.`,
      life: 3000
    })

    isVisible.value = false
    reset()
    await props.refetchRecords()
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Unexpected error',
      detail: 'Something went wrong during import.',
      life: 4000
    })
  } finally {
    isImporting.value = false
  }
}
</script>

<style scoped>
.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed var(--surface-border, #d1d5db);
  border-radius: 0.75rem;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: var(--primary-color);
  background-color: var(--primary-50, #f5f3ff);
}
</style>
