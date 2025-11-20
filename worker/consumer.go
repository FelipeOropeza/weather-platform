package main

import (
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherData struct {
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	WindSpeed   float64 `json:"wind_speed"`
	Condition   string  `json:"condition"`
	RainChance  float64 `json:"rain_chance"`
	Timestamp   string  `json:"timestamp"`
}

func StartConsumer(ch *amqp.Channel, queueName string) {

	msgs, err := ch.Consume(
		queueName,
		"",
		false,
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

		log.Println("🌤️  Dados recebidos:")
		log.Println("  • Temperatura:", data.Temperature)
		log.Println("  • Umidade:", data.Humidity)
		log.Println("  • Vento:", data.WindSpeed)
		log.Println("  • Condição:", data.Condition)
		log.Println("  • Chance de chuva:", data.RainChance)
		log.Println("  • Timestamp:", data.Timestamp)
		log.Println("-----------------------------------")

		msg.Ack(false)
	}

	log.Println("⚠️ Canal fechado. Encerrando consumer...")
}
