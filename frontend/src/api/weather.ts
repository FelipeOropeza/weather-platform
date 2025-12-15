// src/api/weather.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export interface WeatherLog {
  id: string
  createdAt: string
  location: string
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
}

export interface CurrentWeather {
  location: string
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
}

export interface WeatherSummary {
  avgTemperature: number
  highestRainChance: number
  windyDays: number
  totalRecords: number
}


function mapCurrentWeather(data: any): CurrentWeather {
  return {
    location: data.location ?? '—',
    condition: data.condition ?? '—',
    temperature: Number(data.temperature ?? 0),
    humidity: Number(data.humidity ?? 0),
    windSpeed: Number(data.windspeed ?? 0),
  }
}


export async function getCurrentWeather(): Promise<CurrentWeather> {
  const { data } = await api.get('/api/weather/current')
  return mapCurrentWeather(data)
}

export async function getWeatherLogs(): Promise<WeatherLog[]> {
  const { data } = await api.get('/api/weather/logs')
  return data
}

export async function getWeatherInsights(): Promise<WeatherSummary> {
  const { data } = await api.get('/api/weather/insights')
  return data
}

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
