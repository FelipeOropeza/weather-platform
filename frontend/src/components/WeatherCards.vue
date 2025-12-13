<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CurrentWeather } from '@/api/weather'

defineProps<{
  current: CurrentWeather | null
  loading: boolean
}>()
</script>

<template>
  <div class="grid gap-4 md:grid-cols-4">
    <!-- Skeleton -->
    <Card v-for="n in 4" :key="n" v-if="loading">
      <CardHeader>
        <CardTitle class="h-4 w-24 animate-pulse bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div class="h-8 w-16 animate-pulse bg-muted rounded" />
      </CardContent>
    </Card>

    <!-- Cards -->
    <template v-else-if="current">
      <Card>
        <CardHeader>
          <CardTitle>Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">
            {{ current.temperature.toFixed(1) }}°C
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Umidade</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">
            {{ current.humidity.toFixed(0) }}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vento</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">
            {{ current.windSpeed.toFixed(1) }} km/h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condição</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-xl font-semibold capitalize">
            {{ current.condition }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ current.location }}
          </p>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
