# Weather Data Platform 🌦️

Sistema completo de coleta, processamento, armazenamento e visualização de dados climáticos.

## 🧱 Stack

- **Frontend:** React + Vite + Tailwind + shadcn/ui
- **Backend:** NestJS
- **Banco:** MongoDB
- **Fila:** RabbitMQ
- **Worker:** Go
- **Coletor:** Python (Open-Meteo / OpenWeather)
- **Infra:** Docker + Docker Compose

## 🚀 Como rodar

docker compose up --build

## 🎯 Objetivo

- Coletar dados climáticos periodicamente
- Enviar para o RabbitMQ
- Processar no worker Go
- Armazenar no Mongo via API NestJS
- Exibir no dashboard React
- Gerar insights com IA
- Exportar CSV/XLSX
