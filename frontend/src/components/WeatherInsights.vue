<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WeatherInsight } from '@/api/weather'

defineProps<{
  insights: WeatherInsight[]
  loading: boolean
}>()

const severityVariant = (severity?: string) => {
  if (severity === 'danger') return 'destructive'
  if (severity === 'warning') return 'outline'
  return 'default'
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Insights de IA</h2>

    <div v-if="loading" class="grid gap-4 md:grid-cols-2">
      <Card v-for="i in 2" :key="i">
        <CardHeader>
          <CardTitle class="h-4 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div class="h-4 w-full bg-muted animate-pulse rounded mb-2" />
          <div class="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>

    <p v-else-if="!insights.length" class="text-sm text-muted-foreground">
      Nenhum insight disponível no momento.
    </p>

    <div v-else class="grid gap-4 md:grid-cols-2">
      <Card v-for="insight in insights" :key="insight.id">
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <CardTitle class="text-base font-semibold">
            {{ insight.title }}
          </CardTitle>
          <Badge :variant="severityVariant(insight.severity)">
            {{ insight.severity ?? 'info' }}
          </Badge>
        </CardHeader>
        <CardContent>
          <p v-if="insight.description" class="text-sm text-muted-foreground">
            {{ insight.description }}
          </p>
          <p v-if="insight.score != null" class="mt-2 text-sm">
            Pontuação de conforto climático:
            <span class="font-semibold">{{ insight.score }}/100</span>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
