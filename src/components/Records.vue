<template>
  <Toast />
  <section>
    <div class="pt-5 mx-5">
      <div>
        <div class="flex justify-content-between">
          <h6 class="text-color text-2xl m-0">Transactions</h6>
          <Button
            icon="pi pi-download"
            aria-label="Download"
            @click="handleDownloadCsv"
            :disabled="isDownloadDisabled"
          />
        </div>
        <br />
        <div v-if="!isLoading">
          <div v-bind:key="item.id" v-for="item in records">
            <Card
              class="mb-3"
              :style="
                item['record-type'] === RecordType.INCOME
                  ? 'border-right: .6rem solid var(--green-500)'
                  : 'border-right: .6rem solid var(--red-500)'
              "
              :pt="{ body: { class: 'p-2' } }"
            >
              <template #content>
                <div class="flex align-items-center">
                  <div class="flex align-items-center gap-2 flex-1">
                    <p class="m-0 text-color capitalize">
                      {{ item.description }}
                    </p>
                    <Chip :label="item.category" class="text-xs" />
                  </div>

                  <p class="m-0 text-color flex-1">
                    {{ item.amount }}
                  </p>
                  <div class="flex align-items-center">
                    <p class="m-0 text-color capitalize">
                      {{ formatDate(item.date) }}
                    </p>
                    <div class="ml-4 flex gap-2">
                      <Button
                        text
                        raised
                        rounded
                        aria-label="Cancel"
                        icon="pi pi-pencil"
                        severity="info"
                        @click="editRecord(item)"
                      />
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        rounded
                        raised
                        outlined
                        aria-label="Cancel"
                        @click="deleteRecord(item)"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
          <div v-if="isDownloadDisabled">
            Ops! There are not transitions yet :/
          </div>
        </div>

        <div v-else class="flex flex-column gap-3">
          <Skeleton width="w-full" height="3.5rem" border-radius=".857rem" />
          <Skeleton width="w-full" height="3.5rem" border-radius=".857rem" />
          <Skeleton width="w-full" height="3.5rem" border-radius=".857rem" />
        </div>
      </div>
    </div>

    <Button
      class="fixed bottom-0 right-50 font-bold mb-4"
      icon="pi pi-plus"
      label="Add"
      @click="isModalVisible = true"
    />

    <Dialog
      v-model:visible="isModalVisible"
      modal
      header="Add Record"
      :style="{ width: '35rem' }"
    >
      <form @submit.prevent="addRecord">
        <div class="flex flex-column gap-2 gap-2 mb-3">
          <div class="flex align-items-center gap-3">
            <div>
              <RadioButton
                v-model="recordType"
                inputId="isExpense"
                name="expense"
                value="Expense"
              />
              <label for="isExpense" class="ml-2">Expense</label>
            </div>

            <div>
              <RadioButton
                v-model="recordType"
                inputId="isIncome"
                name="income"
                value="Income"
              />
              <label for="isIncome" class="ml-2">Income</label>
            </div>
          </div>
          <Divider />
          <div class="flex gap-2">
            <div>
              <label for="record-name" class="text-sm">Record name</label>
              <InputText
                id="record-name"
                class="flex-auto"
                autocomplete="off"
                placeholder="Give a name for your record"
                v-model="expenseName"
              />
            </div>

            <div>
              <label for="locale-us" class="text-sm">Amount</label>
              <InputNumber
                v-model="expenseValue"
                inputId="locale-us"
                locale="en-US"
                :minFractionDigits="1"
                placeholder="Amount value"
              />
            </div>
          </div>

          <div class="flex align-items-center gap-2 grid-nogutter">
            <div class="col">
              <label for="record-type" class="text-sm mb-2">Expense type</label>
              <Dropdown
                filter
                class="w-full"
                inputId="record-type"
                v-model="category"
                :options="categories"
                optionLabel="name"
                placeholder="Select a category"
              />
            </div>

            <div class="flex-1">
              <label for="record-data" class="text-sm">Date</label>
              <Calendar
                inputId="record-data"
                showIcon
                iconDisplay="input"
                class="w-full"
                placeholder="Select a date"
                dateFormat="dd/mm/yy"
                v-model="expenseDate"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-content-center mt-5">
          <Button label="Add Record" class="w-6" type="submit" />
        </div>
      </form>
    </Dialog>

    <Dialog
      header="Edit Record"
      class="w-25rem"
      modal
      v-model:visible="editingRecord"
      :draggable="false"
    >
      <form @submit.prevent="handleEditRecord">
        <div class="flex flex-column gap-2 gap-2 mb-3">
          <label for="record-name" class="text-sm">Record name</label>
          <InputText
            id="record-name"
            class="flex-auto"
            autocomplete="off"
            placeholder="Type the account name"
            v-model="recordToBeEdited.description"
            required
          />

          <label for="record-value" class="text-sm">Record value</label>
          <InputNumber
            inputId="record-value"
            locale="en-US"
            :minFractionDigits="1"
            required
            v-model="recordToBeEdited.amount"
          />

          <label for="record-data" class="text-sm">Date</label>
          <Calendar
            id="record-data"
            showIcon
            iconDisplay="input"
            class="w-full"
            placeholder="Select a date"
            dateFormat="dd/mm/yy"
            v-model="newRecordDate"
          />
        </div>

        <div class="flex mt-5">
          <Button
            label="Save"
            class="w-full"
            type="submit"
            @click="editingRecord = false"
          />
        </div>
      </form>
    </Dialog>
    <Dialog
      header="Delete Record"
      class="w-25rem"
      modal
      v-model:visible="showDeleteRecord"
      :draggable="false"
    >
      <span>Are you sure you want to delete this record?</span>
      <div class="mt-4 flex gap-4">
        <Button
          label="Cancel"
          severity="info"
          @click="showDeleteRecord = false"
        />
        <Button label="Delete" severity="danger" @click="handleDeleteRecord" />
      </div>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
import type { RecordsResponseData } from '@/types/response'

const props = defineProps<{
  records: Array<RecordsResponseData>
  refetchRecords: () => Promise<void>
  csvFileName: string
}>()

enum RecordType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}

const categories = [
  { name: 'Food' },
  { name: 'Shopping' },
  { name: 'House' },
  { name: 'Vehicle' },
  { name: 'Life & Entertainment' },
  { name: 'Communication & PC' },
  { name: 'Financial Expenses' },
  { name: 'Health' },
  { name: 'Sports' },
  { name: 'Fitness' },
  { name: 'Wellness' },
  { name: 'Income' },
  { name: 'Others' },
  { name: 'Refund' }
]

const toast = useToast()
const route = useRoute()
const category = ref()
const isModalVisible = ref(false)
const showDeleteRecord = ref(false)
const expenseName = ref()
const expenseValue = ref()
const expenseDate = ref()
const isLoading = ref(false)
const editingRecord = ref(false)
const recordToBeEdited = ref<RecordsResponseData>({} as RecordsResponseData)
const recordToBeDeleted = ref<RecordsResponseData>({} as RecordsResponseData)
const newRecordDate = ref()
const recordType = ref('Expense')
const monthId = Number(route.params.id)

const isDownloadDisabled = computed(() => {
  return !props.records.length
})

const formatDate = (date: string) => {
  if (!date) return ''
  const [year, month, day] = date.substring(0, 10).split('-')
  return `${day}/${month}/${year}`
}

const addRecord = async () => {
  try {
    const { error } = await supabase.from('records').insert([
      {
        amount: expenseValue.value,
        month_id: monthId,
        description: expenseName.value,
        category: category.value.name,
        date: expenseDate.value,
        'record-type': recordType.value as RecordType
      }
    ])

    if (error) {
      return toast.add({
        severity: 'error',
        summary: 'Ops!',
        detail: error.message,
        life: 3000
      })
    }

    isModalVisible.value = false

    toast.add({
      severity: 'success',
      summary: 'Yeah!',
      detail: 'Record added with success',
      life: 3000
    })
    return await props.refetchRecords()
  } catch (error) {
    console.error(error)
  } finally {
    expenseValue.value = ''
    expenseName.value = ''
    category.value = ''
    expenseDate.value = ''
  }
}

const deleteRecord = (item: RecordsResponseData) => {
  recordToBeDeleted.value = item
  showDeleteRecord.value = true
}

const handleDeleteRecord = async () => {
  const recordId = recordToBeDeleted.value.id

  try {
    const { status } = await supabase
      .from('records')
      .delete()
      .eq('id', recordId)

    if (status === 204) {
      toast.add({
        severity: 'success',
        summary: 'Record Deleted!!',
        detail: 'The record was deleted!!',
        life: 3000
      })
      await props.refetchRecords()
      showDeleteRecord.value = false
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const editRecord = (item: RecordsResponseData) => {
  recordToBeEdited.value = item
  newRecordDate.value = formatDate(item.date)
  editingRecord.value = true
}

const handleEditRecord = async () => {
  const { id, description, amount, category } = recordToBeEdited.value
  try {
    const { status } = await supabase
      .from('records')
      .update({
        date: newRecordDate.value,
        id: id,
        description,
        amount,
        category
      })
      .eq('id', recordToBeEdited.value!.id)
      .select()

    if (status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Record Edited!!',
        detail: 'The record was edited with success!!',
        life: 3000
      })
      await props.refetchRecords()
    }
  } catch (error) {
    console.error(error)
  }
}

const createAndDownloadCsv = (csv: string) => {
  const CSV_MIME_TYPE = 'text/csv;charset=utf-8;'
  const filename = props.csvFileName
  const csvContent = csv
  const blob = new Blob([csvContent], { type: CSV_MIME_TYPE })
  const link = document.createElement('a')

  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleDownloadCsv = async () => {
  try {
    const { data: csvData, error: csvError } = await supabase
      .from('records')
      .select('*')
      .eq('month_id', monthId)
      .csv()

    if (csvError) {
      return toast.add({
        severity: 'error',
        summary: csvError.message,
        life: 3000
      })
    }

    createAndDownloadCsv(csvData)
  } catch (error) {
    console.error(error)
  }
}
</script>
