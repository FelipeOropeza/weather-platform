// src/api/weather.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ajuste para o seu backend
})

export interface WeatherRecord {
  id: string
  datetime: string
  location: string
  condition: string
  temperature: number
  humidity: number
}

export interface CurrentWeather {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
}

export interface WeatherInsight {
  id: string
  type: 'text' | 'alert' | 'score'
  title: string
  description?: string
  severity?: 'info' | 'warning' | 'danger'
  score?: number
}

export async function getCurrentWeather(): Promise<CurrentWeather> {
  const { data } = await api.get('/weather/current')
  return data
}

export async function getWeatherHistory(): Promise<WeatherRecord[]> {
  const { data } = await api.get('/weather/history')
  return data
}

export async function getWeatherInsights(): Promise<WeatherInsight[]> {
  const { data } = await api.get('/weather/insights')
  return data
}

export async function exportWeatherCsv(): Promise<void> {
  const { data } = await api.get('/weather/export/csv', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'weather.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function exportWeatherXlsx(): Promise<void> {
  const { data } = await api.get('/weather/export/xlsx', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'weather.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
