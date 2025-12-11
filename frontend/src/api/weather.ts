// src/api/weather.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // ajuste se seu Nest estiver em outra porta
})

// ajuste esses tipos conforme o seu schema/DTO real
export interface WeatherLog {
  id: string
  createdAt: string
  location: string
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
}

export interface WeatherInsight {
  id: string
  title: string
  description?: string
  severity?: 'info' | 'warning' | 'danger'
  score?: number
}

export interface CreateWeatherLogDto {
  location: string
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
}

// GET /api/weather/logs  -> lista de logs
export async function getWeatherLogs(): Promise<WeatherLog[]> {
  const { data } = await api.get('/api/weather/logs')
  return data
}

// POST /api/weather/logs -> criar um novo log
export async function createWeatherLog(
  payload: CreateWeatherLogDto,
): Promise<WeatherLog> {
  const { data } = await api.post('/api/weather/logs', payload)
  return data
}

// GET /api/weather/insights
export async function getWeatherInsights(): Promise<WeatherInsight[]> {
  const { data } = await api.get('/api/weather/insights')
  return data
}

// GET /api/weather/export.csv
export async function exportWeatherCsv(): Promise<void> {
  const { data } = await api.get('/api/weather/export.csv', {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'logs.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// GET /api/weather/export.xlsx
export async function exportWeatherXlsx(): Promise<void> {
  const { data } = await api.get('/api/weather/export.xlsx', {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'logs.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
