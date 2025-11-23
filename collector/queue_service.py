import pika
import json
import os
import time
from pika.exceptions import AMQPConnectionError, ChannelClosedByBroker
from dotenv import load_dotenv

load_dotenv()
class QueueService:
    def __init__(self):
        self.host = os.getenv("RABBITMQ_HOST", "localhost")
        self.port = int(os.getenv("RABBITMQ_PORT", 5672))
        self.queue_name = os.getenv("QUEUE_NAME", "weather_queue")
        self.connection = None
        self.channel = None
        self.connect_with_retry()

    def connect_with_retry(self):
        while True:
            try:
                print("🔌 Tentando conectar ao RabbitMQ...")
                self.connection = pika.BlockingConnection(
                    pika.ConnectionParameters(
                        host=self.host,
                        port=self.port,
                        heartbeat=30,
                        blocked_connection_timeout=300
                    )
                )
                self.channel = self.connection.channel()
                self.channel.queue_declare(queue=self.queue_name, durable=True)
                print("🐇 Conectado ao RabbitMQ!")
                return
            except AMQPConnectionError:
                print("❌ Falha ao conectar. Tentando novamente em 5s...")
                time.sleep(5)

    def send(self, data):
        json_data = json.dumps(data)
        while True:
            try:
                self.channel.basic_publish(
                    exchange="",
                    routing_key=self.queue_name,
                    body=json_data,
                    properties=pika.BasicProperties(delivery_mode=2)
                )
                print("📤 Dados enviados:", json_data)
                return
            except (AMQPConnectionError, ChannelClosedByBroker):
                print("⚠️ Conexão perdida! Reconectando...")
                self.connect_with_retry()
            except Exception as e:
                print("❌ Erro inesperado ao enviar mensagem:", e)
                time.sleep(2)