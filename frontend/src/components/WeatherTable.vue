<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { WeatherLog } from '@/api/weather'

defineProps<{
  records: WeatherLog[]
  loading: boolean
}>()
</script>

<template>
  <div class="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data / Hora</TableHead>
          <TableHead>Local</TableHead>
          <TableHead>Condição</TableHead>
          <TableHead>Temp (°C)</TableHead>
          <TableHead>Umidade (%)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
            Carregando registros de clima...
          </TableCell>
        </TableRow>
        <TableRow v-else-if="!records.length">
          <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
            Nenhum registro encontrado.
          </TableCell>
        </TableRow>
        <TableRow v-else v-for="row in records" :key="row.id">
          <TableCell>{{ new Date(row.createdAt).toLocaleString() }}</TableCell>
          <TableCell>{{ row.location }}</TableCell>
          <TableCell>{{ row.condition }}</TableCell>
          <TableCell>{{ row.temperature.toFixed(1) }}</TableCell>
          <TableCell>{{ row.humidity.toFixed(0) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
