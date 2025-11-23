import schedule
import time
from datetime import datetime
from weather_service import WeatherService
from queue_service import QueueService
import pika
import os

LAT = float(os.getenv("LATITUDE", "-23.55"))
LON = float(os.getenv("LONGITUDE", "-46.63"))

weather_service = WeatherService(LAT, LON)
queue_service = QueueService()

def job():
    try:
        data = weather_service.fetch_weather()
        queue_service.send(data)
        print(f"✔ Coleta realizada em {datetime.now()}")
    except Exception as e:
        print("❌ Erro na coleta ou envio:", e)

print("🚀 Python Weather Collector iniciado!")
schedule.every(1).minutes.do(job)  # produção: 1 hora
# schedule.every(1).minutes.do(job)  # teste rápido

job()  # roda imediatamente na inicialização

while True:
    schedule.run_pending()
    time.sleep(1)