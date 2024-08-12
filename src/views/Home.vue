<template>
  <section>
    <Toast />
    <div class="h-screen surface-ground py-4">
      <div class="grid grid-nogutter gap-4 px-4">
        <Card class="col h-10rem">
          <template #content>
            <h4 class="text-2xl mt-0 mb-4 text-color">Accounts</h4>
            <Button
              type="button"
              label="Add"
              class="flex justify-content-center gap-2 w-full"
              @click="visible = true"
            >
              <i class="pi pi-plus"> </i>
              <span>Add</span>
            </Button>
          </template>
        </Card>
        <div class="col-9">
          <div class="flex flex-column gap-4" v-if="!loadingData">
            <router-link
              v-for="item in expensesData"
              class="no-underline"
              :key="item.id"
              :to="{ name: 'account-detail', params: { id: item.id } }"
            >
              <Card class="hover:shadow-2">
                <template #content>
                  <div class="flex align-items-center font-medium">
                    <div class="bg-primary p-1 border-round mr-2">
                      <i class="pi pi-wallet text-xl" />
                    </div>
                    <div class="flex justify-content-between w-full">
                      <span class="flex-1">{{ item.name }}</span>
                      <span class="flex-1">{{ item.type.name }}</span>
                      <span>${{ item.amount }}</span>
                    </div>
                  </div>
                </template>
              </Card>
            </router-link>
          </div>
          <Skeleton v-else width="100%" height="450px" />
        </div>
      </div>
    </div>
    <Dialog
      header="Add Account"
      class="w-25rem"
      modal
      v-model:visible="visible"
      :draggable="false"
    >
      <form @submit.prevent="registerAccount">
        <div class="flex flex-column gap-2 gap-2 mb-3">
          <label for="account-name" class="text-sm">Account name</label>
          <InputText
            id="account-name"
            class="flex-auto"
            autocomplete="off"
            placeholder="Type the account name"
            required
            v-model="accountName"
          />
          <label for="account-month" class="text-sm">Account month</label>

          <Dropdown
            id="account-month"
            class="w-full"
            showClear
            optionLabel="name"
            placeholder="Choose a Month"
            v-model="accountMonth"
            :options="optionsForAccountMonth"
            required
          >
            <template #option="slotProps">
              <div class="flex align-items-center gap-2">
                <i :class="slotProps.option.icon" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
          <label for="account-type" class="text-sm">Accout type</label>
          <Dropdown
            id="account-type"
            class="w-full"
            checkmark
            showClear
            optionLabel="name"
            placeholder="Select a type for your account"
            v-model="accountType"
            :options="optionsForAccountType"
            required
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
            v-model="amount"
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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'
import type { AccountResponseData } from '@/types/response'

const visible = ref(false)
const amount = ref(0)
const accountName = ref('')
const accountType = ref()
const accountMonth = ref()
const expensesData = ref<Array<AccountResponseData>>()
const loadingData = ref(true)

const toast = useToast()

const optionsForAccountType = [
  { name: 'General', category: 'general', icon: 'pi pi-wallet' },
  { name: 'Credit Card', category: 'credit-card', icon: 'pi pi-credit-card' },
  { name: 'Investment', category: 'investment', icon: 'pi pi-angle-double-up' }
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

const registerAccount = async () => {
  try {
    const { status, error } = await supabase.from('accounts').insert([
      {
        monthName: accountMonth.value.name,
        amount: amount.value,
        name: accountName.value,
        type: accountType.value
      }
    ])

    if (error) {
      toast.add({
        severity: 'error',
        summary: error.message,
        detail: error.details,
        life: 3000
      })
    }

    if (status === 201) {
      visible.value = false
      toast.add({
        severity: 'success',
        summary: 'Congrats!!',
        detail: 'Account registered with success!!',
        life: 3000
      })
      return await fetchAccounts()
    }
  } catch (error: any) {
    console.error(error.message)
  }
}

const fetchAccounts = async () => {
  try {
    const { data, error } = await supabase.from('accounts').select('*')

    if (data) {
      expensesData.value = data
    }

    if (error) {
      return toast.add({
        severity: 'error',
        summary: error.message,
        detail: error.details,
        life: 3000
      })
    }
  } catch (error: any) {
    console.error(error.message)
  } finally {
    loadingData.value = false
  }
}

onMounted(async () => {
  loadingData.value = true
  await fetchAccounts()
})
</script>

<style scoped></style>
