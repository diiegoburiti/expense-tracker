<template>
  <Toast />
  <section class="surface-ground h-screen">
    <div class="pt-5 mx-5">
      <Card class="">
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
                  @click="modalConfirmation = true"
                />
              </div>
            </div>

            <div class="mt-4">
              <span class="text-xs font-medium text-color text-color-secondary"
                >Account Name</span
              >
              <br />
              <span class="text-base">{{ accountInfo?.name }}</span>
              <Skeleton v-if="isLoading" height="1.8rem" width="8rem" />
              <div class="mt-2">
                <span class="text-xs font-medium text-color-secondary">
                  Account Type
                </span>
                <br />
                <span class="text-base"> {{ accountInfo?.type?.name }} </span>
                <Skeleton v-if="isLoading" height="1.8rem" width="8rem" />
              </div>
              <div class="mt-2">
                <span class="text-xs font-medium text-color-secondary">
                  Account Month
                </span>
                <br />
                <span class="text-base"> {{ accountInfo?.monthName }} </span>
                <Skeleton v-if="isLoading" height="1.8rem" width="8rem" />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <div class="flex gap-4 my-4">
        <Card>
          <template #title>Budget</template>
          <template #content>
            <p class="m-0 text-color-secondary">{{ accountInfo?.amount }}</p>
          </template>
        </Card>
        <Card>
          <template #title>Expense</template>
          <template #content>
            <p class="m-0 text-red-500">{{ expense }}</p>
          </template>
        </Card>

        <Card>
          <template #title>Balance</template>
          <template #content>
            <p
              class="m-0"
              :class="
                balance.isBalanceStatusPositive
                  ? 'text-green-500'
                  : 'text-red-500'
              "
            >
              {{ balance.balanceValue }}
            </p>
          </template>
        </Card>
      </div>

      <div>
        <h6 class="text-color text-2xl m-0">Transactions</h6>
        <br />
        <div v-bind:key="item.id" v-for="item in recordsData">
          <Card
            class="mb-3"
            :style="
              item['record-type'] === 'income'
                ? 'border-right: 10px solid var(--green-500)'
                : 'border-right: 10px solid var(--red-500)'
            "
            :pt="{ body: { class: 'p-2' } }"
          >
            <template #content>
              <div class="flex align-items-center">
                <p class="m-0 text-color flex-1 capitalize">
                  {{ item.description }}
                </p>
                <p class="m-0 text-color flex-1">
                  {{ item.amount }}
                </p>
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
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    raised
                    outlined
                    aria-label="Cancel"
                  />
                </div>
              </div>
            </template>
          </Card>
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
              <label for="amount" class="text-sm">Amount</label>
              <InputNumber
                placeholder="0"
                id="amount"
                inputId="locale-user"
                v-model="expenseValue"
              />
            </div>
          </div>

          <div class="flex align-items-center gap-2 grid-nogutter">
            <div class="col">
              <label for="record-type" class="text-sm mb-2">Expense type</label>
              <Dropdown
                id="record-type"
                v-model="category"
                :options="categories"
                filter
                optionLabel="name"
                placeholder="Select a category"
                class="w-full"
              />
            </div>

            <div class="flex-1">
              <label for="record-data" class="text-sm">Date</label>
              <Calendar
                id="record-data"
                v-model="expenseDate"
                showIcon
                iconDisplay="input"
                class="w-full"
                placeholder="Select a date"
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
      header="Delete Account"
      class="w-25rem"
      modal
      v-model:visible="modalConfirmation"
      :draggable="false"
    >
      <span>Are you sure you want to delete this account?</span>
      <div class="mt-4 flex gap-4">
        <Button
          label="Cancel"
          severity="info"
          @click="modalConfirmation = false"
        />
        <Button label="Delete" severity="danger" @click="deleteAccount" />
      </div>
    </Dialog>

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
            v-bind:model-value="accountInfo.name"
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
            v-model="accountInfo.amount"
            required
          />
        </div>

        <div class="flex mt-5">
          <Button label="Save" class="w-full" type="submit"></Button>
        </div>
      </form>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { supabase } from '@/supababse'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'
import type { AccountResponseData, RecordsResponseData } from '@/types/response'

const categories = [
  { name: 'Food' },
  { name: 'Shopping' },
  { name: 'House' },
  { name: 'Vehicle' },
  { name: 'Life & Entertainment' },
  { name: 'Communication & PC' },
  { name: 'Financial Expenses' },
  { name: 'Income' },
  { name: 'Others' }
]

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
const category = ref()
const isModalVisible = ref(false)
const modalConfirmation = ref(false)
const modalEditAccount = ref(false)
const expenseName = ref()
const expenseValue = ref()
const expenseDate = ref()
const recordsData = ref<RecordsResponseData[]>()
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

const monthId = Number(route.params.id)

watchEffect(() => {
  console.log(route.params.id)
})

const handleGoBack = () => {
  router.push({ name: 'home' })
}

const formatDate = (date: string) => {
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
        'record-type': 'expense'
      }
    ])

    console.log({ error })

    if (error) {
      return toast.add({
        severity: 'error',
        summary: 'Ops!',
        detail: error.message,
        life: 3000
      })
    }

    isModalVisible.value = false

    return toast.add({
      severity: 'success',
      summary: 'Yeah!',
      detail: 'Record added with success',
      life: 3000
    })
  } catch (error) {
    console.error(error)
  } finally {
    expenseValue.value = ''
    expenseName.value = ''
    category.value = ''
    expenseDate.value = ''
  }
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
    modalConfirmation.value = false
    router.push({ name: 'home' })
  }
}

const handleEditAccount = async () => {
  try {
    const { status, error } = await supabase.from('accounts').update({
      monthName: accountMonth.value.name,
      amount: accountAmount.value,
      type: accountType.value,
      name: accountName.value
    })

    if (status === 204) {
      toast.add({
        severity: 'success',
        summary: 'Account Edited!!',
        detail: 'The account was edited with success!!',
        life: 3000
      })
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
    modalConfirmation.value = false
  }
}

const expense = computed(() => {
  return (
    recordsData.value?.reduce(
      (acc, currentValue) => acc + currentValue.amount,
      0
    ) || 0
  )
})

const balance = computed(() => {
  const accountAmount = accountInfo.value.amount || 0
  if (accountAmount > expense?.value) {
    return {
      balanceValue: accountAmount - expense?.value,
      isBalanceStatusPositive: true
    }
  }
  return {
    balanceValue: accountAmount,
    isBalanceStatusPositive: false
  }
})

onMounted(async () => {
  isLoading.value = true
  try {
    const { data: accountDataResponse, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', monthId)

    if (accountError) {
      return toast.add({
        severity: 'error',
        summary: accountError.message,
        life: 3000
      })
    }

    if (accountDataResponse && accountDataResponse.length > 0) {
      const { monthName, name, amount, type } = accountDataResponse[0]

      accountInfo.value = accountDataResponse[0]
      accountMonth.value.name = monthName
      accountName.value = name
      accountAmount.value = amount
      accountType.value = type
    }

    const { data: recordsDataResponse, error: recordsError } = await supabase
      .from('records')
      .select('*')
      .eq('month_id', monthId)

    if (recordsError) {
      return toast.add({
        severity: 'error',
        summary: recordsError.message,
        life: 3000
      })
    }

    recordsData.value = recordsDataResponse
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
