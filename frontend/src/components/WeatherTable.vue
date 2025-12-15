<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { WeatherLog } from '@/api/weather'

const props = defineProps<{
  records: WeatherLog[]
  loading: boolean
}>()

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() =>
  Math.ceil(props.records.length / itemsPerPage)
)

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.records.slice(start, start + itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>


<template>
  <div class="border rounded-lg overflow-hidden space-y-4">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
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

        <TableRow
          v-else
          v-for="row in paginatedRecords"
          :key="row.id"
        >
          <TableCell>
            {{ new Date(row.createdAt).toLocaleDateString() }}
          </TableCell>
          <TableCell>{{ row.location }}</TableCell>
          <TableCell>{{ row.condition }}</TableCell>
          <TableCell>{{ row.temperature.toFixed(1) }}</TableCell>
          <TableCell>{{ row.humidity.toFixed(0) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Paginação -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between px-4 py-2 text-sm"
    >
      <span class="text-muted-foreground">
        Página {{ currentPage }} de {{ totalPages }}
      </span>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Anterior
        </button>

        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Próximo
        </button>
      </div>
    </div>
  </div>
</template>

