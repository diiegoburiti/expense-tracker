<template>
  <Toast />
  <section class="mx-5 pt-5">
    <Card>
      <template #content>
        <div>
          <div class="flex justify-content-between">
            <div class="flex align-items-center gap-2">
              <Button
                severity="secondary"
                icon="pi pi-arrow-circle-left "
                aria-label="Go back"
                @click="handleGoBack"
              />
              <h6 class="m-0 text-lg text-color font-medium">
                Account Details
              </h6>
            </div>
            <div class="flex gap-2">
              <Button
                label="Edit"
                severity="info"
                raised
                @click="modalEditAccount = true"
              />
              <Button
                label="Delete"
                severity="danger"
                raised
                @click="modalDeleteAccount = true"
              />
            </div>
          </div>

          <div class="mt-4">
            <span class="text-xs font-medium text-color text-color-secondary"
              >Account Name</span
            >
            <br />
            <span v-if="!isLoading" class="text-base">{{
              accountInfo?.name
            }}</span>
            <Skeleton v-if="isLoading" height="1.2rem" width="8rem" />
            <div class="mt-2">
              <span class="text-xs font-medium text-color-secondary">
                Account Type
              </span>
              <br />
              <span v-if="!isLoading" class="text-base">
                {{ accountInfo?.type?.name }}
              </span>
              <Skeleton v-if="isLoading" height="1.2rem" width="8rem" />
            </div>
            <div class="mt-2">
              <span class="text-xs font-medium text-color-secondary">
                Account Month
              </span>
              <br />
              <span v-if="!isLoading" class="text-base">
                {{ accountInfo?.monthName }}
              </span>
              <Skeleton v-if="isLoading" height="1.2rem" width="8rem" />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div class="flex gap-4 my-4">
      <Card>
        <template #title><span class="text-lg">Budget</span></template>
        <template #content>
          <span class="m-0 text-color-secondary text-xl font-bold">
            <span class="font-normal">$</span>
            {{ accountInfo?.amount }}
          </span>
        </template>
      </Card>
      <Card>
        <template #title><span class="text-lg">Expense</span></template>
        <template #content>
          <span class="m-0 text-red-500 text-xl font-bold">
            <span class="font-normal">$</span>
            {{ expense - income }}
          </span>
        </template>
      </Card>

      <Card>
        <template #title><span class="text-lg">Balance</span></template>
        <template #content>
          <span
            class="m-0 text-xl font-bold"
            :class="
              balance.isBalanceStatusPositive
                ? 'text-green-500'
                : 'text-red-500'
            "
          >
            <span class="font-normal">$</span>
            {{ balance.balanceValue }}
          </span>
        </template>
      </Card>
    </div>
    <div class="mt-4">
      <Card class="p-o m-0 mb-4" :pt="{ body: { class: 'p-0' } }">
        <template #content>
          <TabView
            :pt="{
              root: {
                class: 'p-0 m-0'
              },
              nav: {
                class: 'border-round-top-xl justify-content-center'
              },
              panelcontainer: {
                class: 'p-0 m-0'
              }
            }"
          >
            <TabPanel header="Balance">
              <Charts
                v-if="!isLoading"
                :totalExpensesByCategory="totalExpensesByCategory"
                class="my-5 scalein animation-duration-500"
              />

              <div class="flex flex-column" v-else>
                <div class="flex justify-content-center my-5 gap-5">
                  <Skeleton width="4rem" class="mb-2"></Skeleton>
                  <Skeleton width="4rem" class="mb-2"></Skeleton>
                  <Skeleton width="4rem" class="mb-2"></Skeleton>
                  <Skeleton width="4rem" class="mb-2"></Skeleton>
                </div>
                <Skeleton shape="circle" size="35rem" class="m-auto" />
              </div>
            </TabPanel>
            <TabPanel header="Records">
              <Records />
            </TabPanel>
          </TabView>
        </template>
      </Card>
    </div>

    <Dialog
      header="Edit Account"
      class="w-25rem"
      modal
      v-model:visible="modalEditAccount"
      :draggable="false"
    >
      <form @submit.prevent="handleEditAccount">
        <div class="flex flex-column gap-2 gap-2 mb-3">
          <label for="account-name" class="text-sm">Account name</label>
          <InputText
            id="account-name"
            class="flex-auto"
            autocomplete="off"
            placeholder="Type the account name"
            v-model="accountName"
          />
          <label for="account-month" class="text-sm">Account month</label>

          <Dropdown
            id="account-month"
            class="w-full"
            showClear
            optionLabel="name"
            placeholder="Choose a Month"
            :options="optionsForAccountMonth"
            v-model="accountMonth"
          >
            <template #option="slotProps">
              <div class="flex align-items-center gap-2">
                <i :class="slotProps.option.icon" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
          <label for="account-type" class="text-sm">Account type</label>
          <Dropdown
            id="account-type"
            class="w-full"
            checkmark
            showClear
            optionLabel="name"
            placeholder="Select a type for your account"
            v-model="accountType"
            :options="optionsForAccountType"
          >
            <template #option="slotProps">
              <div class="flex align-items-center gap-2">
                <i :class="slotProps.option.icon" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
          <label for="starting-amount" class="text-sm">Starting Amount</label>
          <InputNumber
            id="starting-amount"
            inputId="locale-user"
            v-model="accountAmount"
            required
          />
        </div>

        <div class="flex mt-5">
          <Button
            label="Save"
            class="w-full"
            type="submit"
            @click="modalEditAccount = false"
          />
        </div>
      </form>
    </Dialog>

    <Dialog
      header="Delete Account"
      class="w-25rem"
      modal
      v-model:visible="modalDeleteAccount"
      :draggable="false"
    >
      <span>Are you sure you want to delete this account?</span>
      <div class="mt-4 flex gap-4">
        <Button
          label="Cancel"
          severity="info"
          @click="modalDeleteAccount = false"
        />
        <Button label="Delete" severity="danger" @click="deleteAccount" />
      </div>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'
import Charts from '@/components/Charts.vue'
import Records from '@/components/Records.vue'
import type { AccountResponseData, RecordsResponseData } from '@/types/response'

const optionsForAccountType = [
  { name: 'General', category: 'general', icon: 'pi pi-wallet' },
  { name: 'Credit Card', category: 'credit-card', icon: 'pi pi-credit-card' },
  {
    name: 'Insvestiment',
    category: 'investiment',
    icon: 'pi pi-angle-double-up'
  }
]

const optionsForAccountMonth = [
  { name: 'January' },
  { name: 'February' },
  { name: 'March' },
  { name: 'April' },
  { name: 'May' },
  { name: 'June' },
  { name: 'July' },
  { name: 'August' },
  { name: 'September' },
  { name: 'October' },
  { name: 'November' },
  { name: 'December' }
]

const toast = useToast()
const router = useRouter()
const route = useRoute()
const modalDeleteAccount = ref(false)
const modalEditAccount = ref(false)
const showDeleteRecord = ref(false)
const accountInfo = ref<AccountResponseData>({} as AccountResponseData)
const isLoading = ref(false)
const accountName = ref()
const accountAmount = ref()
const accountMonth = ref({ name: '' })
const accountType = ref({
  name: '',
  category: '',
  icon: ''
})

const totalExpensesByCategory = ref({})
const monthId = Number(route.params.id)

const records = ref<RecordsResponseData[]>()

const handleGoBack = () => {
  router.push({ name: 'home' })
}

const deleteAccount = async () => {
  const { status } = await supabase.from('accounts').delete().eq('id', monthId)

  if (status === 204) {
    toast.add({
      severity: 'success',
      summary: 'Account Deleted!!',
      detail: 'The account was deleted!!',
      life: 3000
    })
    showDeleteRecord.value = false
    handleGoBack()
  }
}

const handleEditAccount = async () => {
  try {
    const { status, error } = await supabase
      .from('accounts')
      .update({
        monthName: accountMonth.value.name,
        amount: accountAmount.value,
        type: accountType.value,
        name: accountName.value
      })
      .eq('id', monthId)
      .select()

    if (status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Account Edited!!',
        detail: 'The account was edited with success!!',
        life: 3000
      })
      await fetchAccountInfo()
    }

    if (error) {
      toast.add({
        severity: 'error',
        summary: error.message,
        life: 3000
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    modalDeleteAccount.value = false
  }
}

const fetchAccountInfo = async () => {
  isLoading.value = true

  try {
    const { data: accountDataResponse, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', monthId)

    if (accountDataResponse && accountDataResponse.length > 0) {
      const { monthName, name, amount, type } = accountDataResponse[0]

      accountInfo.value = accountDataResponse[0]
      accountMonth.value.name = monthName
      accountName.value = name
      accountAmount.value = amount
      accountType.value = type
    }

    if (accountError) {
      return toast.add({
        severity: 'error',
        summary: accountError.message,
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchExpenses = async () => {
  isLoading.value = true
  try {
    const { data: expenses, error } = await supabase
      .from('records')
      .select('*')
      .eq('month_id', monthId)

    if (error) {
      console.error('Error fetching expenses:', error.message)
      return
    }

    type CategoryTotals = {
      [category: string]: number
    }

    const categoryTotals: CategoryTotals = {}
    records.value = expenses
    expenses.forEach((expense) => {
      const { category, amount } = expense
      categoryTotals[category] = (categoryTotals[category] || 0) + amount
    })

    totalExpensesByCategory.value = categoryTotals
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

enum RecordType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}
const expense = computed(() => {
  const expenseRecords =
    records.value?.filter(
      (record) => record['record-type'] === RecordType.EXPENSE
    ) || []

  const totalAmount = expenseRecords.reduce(
    (acc, currentValue) => acc + currentValue.amount,
    0
  )

  return Number(totalAmount.toFixed())
})

const income = computed(() => {
  const incomeRecords =
    records.value?.filter(
      (record) => record['record-type'] === RecordType.INCOME
    ) || []

  const totalIncome = incomeRecords.reduce(
    (acc, currentValue) => acc + currentValue.amount,
    0
  )

  return Number(totalIncome.toFixed())
})

const balance = computed(() => {
  const accountAmount = accountInfo.value.amount || 0
  const balanceValue = accountAmount + income.value - expense.value

  return {
    balanceValue: balanceValue,
    isBalanceStatusPositive: balanceValue >= 0
  }
})

onMounted(async () => {
  await fetchAccountInfo()
  await fetchExpenses()
})
</script>
