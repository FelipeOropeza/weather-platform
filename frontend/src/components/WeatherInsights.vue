<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WeatherSummary } from '@/api/weather'

defineProps<{
  insights: WeatherSummary | null
  loading: boolean
}>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Insights de IA</h2>

    <!-- Loading -->
    <div v-if="loading" class="grid gap-4 md:grid-cols-2">
      <Card v-for="i in 4" :key="i">
        <CardHeader>
          <CardTitle class="h-4 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div class="h-4 w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>

    <!-- Sem dados -->
    <p v-else-if="!insights" class="text-sm text-muted-foreground">
      Nenhum insight disponível no momento.
    </p>

    <!-- Dados -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>🌡️ Temperatura Média</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ insights.avgTemperature }} °C
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🌧️ Maior chance de chuva</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ insights.highestRainChance }}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💨 Dias com vento forte</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ insights.windyDays }}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Registros analisados</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            {{ insights.totalRecords }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
