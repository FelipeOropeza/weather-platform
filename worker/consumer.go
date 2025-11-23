package main

import (
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherData struct {
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	WindSpeed   float64 `json:"windspeed"`
	Condition   string  `json:"condition"`
	RainChance  float64 `json:"precipitation_probability"`
	Timestamp   string  `json:"timestamp"`
}

func StartConsumer(ch *amqp.Channel, queueName string) {
	client := NewApiClient() // usa ApiClient do api_client.go

	msgs, err := ch.Consume(
		queueName,
		"",
		false, // autoAck false
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Println("❌ Erro ao iniciar consumer:", err)
		return
	}

	log.Println("📡 Worker Go ouvindo mensagens...")

	for msg := range msgs {
		var data WeatherData

		if err := json.Unmarshal(msg.Body, &data); err != nil {
			log.Println("❌ JSON inválido:", err)
			msg.Nack(false, false)
			continue
		}

		log.Println("🌤️  Dados recebidos:", data)

		if err := client.SendToAPI(data); err != nil {
			log.Println("❌ Erro ao enviar para API:", err)
			msg.Nack(false, true)
			continue
		}

		msg.Ack(false)
	}
	log.Println("⚠️ Canal fechado. Encerrando consumer...")
}
