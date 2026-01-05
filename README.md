# Weather Data Platform 🌦️

Sistema completo de coleta, processamento, armazenamento e visualização de dados climáticos.

## 🧱 Stack

- **Frontend:** Vue + Vite + Tailwind + shadcn/vue
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

## Imagem do Esquema do Projeto

![Mapa Projeto](https://github.com/user-attachments/assets/b2714b21-0af0-498c-8231-bff66a82dedb)
