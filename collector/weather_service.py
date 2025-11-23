import requests
import json
import time
import schedule
import os
import pika
from datetime import datetime
from pika.exceptions import AMQPConnectionError, ChannelClosedByBroker
from dotenv import load_dotenv

load_dotenv()

# -------------------------------
# WeatherService
# -------------------------------
WEATHER_CODES = {
    0: "céu limpo",
    1: "parcialmente nublado",
    2: "nublado",
    3: "nublado",
    45: "neblina",
    48: "neblina com geada",
    51: "chuva leve",
    53: "chuva moderada",
    55: "chuva forte",
    61: "chuva fraca",
    63: "chuva moderada",
    65: "chuva forte",
    71: "neve fraca",
    73: "neve moderada",
    75: "neve forte",
    80: "chuva de pancadas",
    81: "chuva forte de pancadas",
    82: "chuva muito forte",
}

class WeatherService:
    def __init__(self, latitude, longitude, timezone="America/Sao_Paulo"):
        self.latitude = latitude
        self.longitude = longitude
        self.timezone = timezone

    def fetch_weather(self):
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={self.latitude}&longitude={self.longitude}&"
            f"hourly=temperature_2m,relativehumidity_2m,windspeed_10m,"
            f"precipitation_probability,weathercode&current_weather=true&timezone={self.timezone}"
        )

        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Erro ao buscar dados ({response.status_code})")

        data = response.json()

        # Usamos o primeiro valor horário como fallback
        idx = 0

        weather_json = {
            "temperature": data["hourly"]["temperature_2m"][idx],
            "humidity": data["hourly"]["relativehumidity_2m"][idx],
            "windspeed": data["hourly"]["windspeed_10m"][idx],
            "condition": WEATHER_CODES.get(data["hourly"]["weathercode"][idx], "desconhecido"),
            "precipitation_probability": data["hourly"]["precipitation_probability"][idx],
            "timestamp": data["hourly"]["time"][idx]
        }

        return weather_json