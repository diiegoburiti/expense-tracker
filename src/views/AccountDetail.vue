<template>
  <Toast />
  <section class="surface-ground">
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
    <div class="mt-4">
      <TabView>
        <TabPanel header="Balance">
          <Charts
            v-if="!isLoading"
            :categories="categoriesData"
            :totalExpensesByCategory="totalExpensesByCategory"
          />
        </TabPanel>
        <TabPanel header="Records">
          <Records />
        </TabPanel>
      </TabView>
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
import { onMounted, ref } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import Charts from '@/components/Charts.vue'
import Records from '@/components/Records.vue'

import type { AccountResponseData } from '@/types/response'

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
const categoriesData = ref()
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

const fetchCategories = async () => {
  isLoading.value = true

  try {
    const { data: categoriesResponse, error: categoriesError } = await supabase
      .from('category_view')
      .select('*')

    if (categoriesError) {
      return toast.add({
        severity: 'error',
        summary: categoriesError.message,
        life: 3000
      })
    }
    categoriesData.value = categoriesResponse.map(
      (category) => category.category
    )
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
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
      .select('category, amount')
      .eq('month_id', monthId)

    if (error) {
      console.error('Error fetching expenses:', error.message)
      return
    }

    const categoryTotals = {}
    expenses.forEach((expense) => {
      const { category, amount } = expense
      categoryTotals[category] = (categoryTotals[category] || 0) + amount
    })

    totalExpensesByCategory.value = categoryTotals

    console.log('Total expenses per category:', categoryTotals)
  } catch (error) {
    console.error('Error fetching expenses:', error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchAccountInfo()
  await fetchCategories()
  await fetchExpenses()
})
</script>
