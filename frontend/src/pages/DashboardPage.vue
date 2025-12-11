<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import WeatherCards from '@/components/WeatherCards.vue'
import WeatherTable from '@/components/WeatherTable.vue'
import WeatherInsights from '@/components/WeatherInsights.vue'
import {
  getWeatherLogs,
  getWeatherInsights,
  exportWeatherCsv,
  exportWeatherXlsx,
  type WeatherLog,
  type WeatherInsight,
} from '@/api/weather'

const logs = ref<WeatherLog[]>([])

const current = computed(() =>
  logs.value.length ? logs.value[logs.value.length - 1] : null,
)

const insights = ref<WeatherInsight[]>([])

const loadingCurrent = ref(false)
const loadingHistory = ref(false)
const loadingInsights = ref(false)

const loadData = async () => {
  loadingCurrent.value = true
  loadingHistory.value = true
  loadingInsights.value = true
  try {
    const [logsResponse, insightsResponse] = await Promise.all([
      getWeatherLogs(),
      getWeatherInsights(),
    ])

    logs.value = logsResponse
    insights.value = insightsResponse
  } catch (err) {
    console.error('Erro ao carregar dados de clima', err)
  } finally {
    loadingCurrent.value = false
    loadingHistory.value = false
    loadingInsights.value = false
  }
}

const handleExportCsv = async () => {
  try {
    await exportWeatherCsv()
  } catch (err) {
    console.error('Erro ao exportar CSV', err)
  }
}

const handleExportXlsx = async () => {
  try {
    await exportWeatherXlsx()
  } catch (err) {
    console.error('Erro ao exportar XLSX', err)
  }
}

onMounted(loadData)
</script>

<template>
  <main class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto py-8 space-y-6">
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold">Dashboard de Clima</h1>
          <p class="text-sm text-muted-foreground">
            Dados reais da sua região + insights de IA gerados a partir do pipeline de clima.
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" @click="handleExportCsv">
            Exportar CSV
          </Button>
          <Button variant="outline" @click="handleExportXlsx">
            Exportar XLSX
          </Button>
          <Button @click="loadData">
            Atualizar
          </Button>
        </div>
      </header>

      <!-- Cards usam o "current" calculado a partir do último log -->
      <WeatherCards :current="current" :loading="loadingCurrent" />

      <div class="grid gap-6 md:grid-cols-3">
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Registros recentes de clima</CardTitle>
          </CardHeader>
          <CardContent>
            <!-- Tabela recebe todos os logs -->
            <WeatherTable :records="logs" :loading="loadingHistory" />
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <WeatherInsights :insights="insights" :loading="loadingInsights" />
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
