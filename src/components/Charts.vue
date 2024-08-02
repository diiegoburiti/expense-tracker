<template>
  <div class="card flex justify-content-center">
    <Chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import Chart from 'primevue/chart'
import type { CategoryType } from '@/types/response'

const props = defineProps({
  categories: {
    type: Array<CategoryType>,
    required: true
  },
  totalExpensesByCategory: {
    required: true
  }
})

const chartData = ref(null)
const chartOptions = ref(null)

const chartValues = computed(() => {
  return props.categories?.map(
    (category) => props.totalExpensesByCategory[category]
  )
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
    labels: props.categories,
    datasets: [
      {
        data: chartValues,
        backgroundColor: colors.slice(0, props.categories?.length),
        hoverBackgroundColor: hoverColors.slice(0, props.categories?.length)
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
