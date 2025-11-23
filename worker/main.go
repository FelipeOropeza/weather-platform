// main.go
package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	amqp "github.com/rabbitmq/amqp091-go"
)

func connectRabbit(host string) *amqp.Connection {
	for {
		conn, err := amqp.Dial("amqp://guest:guest@" + host + ":5672/")
		if err == nil {
			log.Println("🐇 Conectado ao RabbitMQ!")
			return conn
		}

		log.Println("❌ Falha ao conectar no RabbitMQ. Tentando novamente em 5s...")
		time.Sleep(5 * time.Second)
	}
}

func main() {
	godotenv.Load()

	rabbitHost := os.Getenv("RABBITMQ_HOST")
	queue := os.Getenv("RABBITMQ_QUEUE")

	for {
		conn := connectRabbit(rabbitHost)

		ch, err := conn.Channel()
		if err != nil {
			log.Println("❌ Erro ao abrir canal. Reconectando...")
			conn.Close()
			continue
		}

		_, err = ch.QueueDeclare(
			queue, // name
			true,  // durable
			false, // autoDelete
			false, // exclusive
			false, // noWait
			nil,   // args
		)
		if err != nil {
			log.Println("❌ Erro ao declarar fila. Reconectando...")
			ch.Close()
			conn.Close()
			continue
		}

		log.Println("🚀 Iniciando consumer...")
		StartConsumer(ch, queue)

		log.Println("⚠️ Consumer caiu. Reiniciando conexão...")
		ch.Close()
		conn.Close()
		time.Sleep(2 * time.Second)
	}
}
