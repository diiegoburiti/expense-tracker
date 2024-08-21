<template>
  <div class="card flex flex-column justify-content-center gap-5 sm:flex-row">
    <Chart
      type="doughnut"
      class="w-full md:w-30rem"
      :data="chartData"
      :options="chartOptions"
    />

    <Chart
      type="pie"
      class="w-full md:w-30rem"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

type CategoryTotals = {
  [category: string]: number
}

const props = defineProps<{
  totalExpensesByCategory: CategoryTotals
}>()

const chartData = ref()
const chartOptions = ref()

const categories = computed(() => {
  const expenses = props.totalExpensesByCategory ?? {}
  return Object.keys(expenses).map((category) => category)
})

const chartValues = computed(() => {
  const expenses = props.totalExpensesByCategory ?? {}
  return categories.value.map((category) => expenses[category])
})

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)
  const colors = [
    documentStyle.getPropertyValue('--blue-500'),
    documentStyle.getPropertyValue('--orange-500'),
    documentStyle.getPropertyValue('--gray-500'),
    documentStyle.getPropertyValue('--red-500'),
    documentStyle.getPropertyValue('--green-500'),
    documentStyle.getPropertyValue('--cyan-500'),
    documentStyle.getPropertyValue('--purple-500')
  ]
  const hoverColors = [
    documentStyle.getPropertyValue('--blue-700'),
    documentStyle.getPropertyValue('--orange-700'),
    documentStyle.getPropertyValue('--gray-400'),
    documentStyle.getPropertyValue('--red-700'),
    documentStyle.getPropertyValue('--green-400'),
    documentStyle.getPropertyValue('--cyan-700'),
    documentStyle.getPropertyValue('--purple-700')
  ]

  return {
    labels: categories.value,
    datasets: [
      {
        data: chartValues,
        backgroundColor: colors.slice(0, categories.value?.length),
        hoverBackgroundColor: hoverColors.slice(0, categories.value?.length)
      }
    ]
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor
        }
      }
    }
  }
}

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})
</script>
