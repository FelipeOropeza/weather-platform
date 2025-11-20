import schedule
import time
from weather_service import WeatherService
from queue_service import QueueService
import pika
import os

# São Paulo (depois você coloca sua cidade real)
LAT = -23.55
LON = -46.63

weather = WeatherService(latitude=LAT, longitude=LON)

queue = None

def connect_queue():
    global queue
    while True:
        try:
            queue = QueueService()  # tenta conectar
            print("🐇 Conectado ao RabbitMQ!")
            return
        except pika.exceptions.AMQPConnectionError:
            print("❌ RabbitMQ indisponível. Tentando novamente em 5s...")
            time.sleep(5)


def job():
    global queue

    try:
        data = weather.fetch_weather()
        queue.send(data)
        print("✔ Dados coletados e enviados!")

    except pika.exceptions.AMQPConnectionError:
        print("⚠️ Perdi conexão com RabbitMQ. Reconectando...")
        connect_queue()
    except Exception as e:
        print("❌ Erro ao enviar dados:", e)


print("🚀 Python Collector iniciado!")
connect_queue()

schedule.every(1).minutes.do(job)  # para testes

while True:
    schedule.run_pending()
    time.sleep(1)
