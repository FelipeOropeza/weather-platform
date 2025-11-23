// consumer.go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Estrutura do JSON do Python
type WeatherData struct {
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	WindSpeed   float64 `json:"windspeed"`                  // nome igual do Python
	Condition   string  `json:"condition"`
	RainChance  float64 `json:"precipitation_probability"`   // nome igual do Python
	Timestamp   string  `json:"timestamp"`
}

// Função para envio futuro para a API NestJS
func sendToAPI(data WeatherData) error {
	jsonData, _ := json.Marshal(data)
	resp, err := http.Post("http://localhost:3000/api/weather/logs", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return fmt.Errorf("erro na API: %v", resp.Status)
	}
	return nil
}

// Consumer
func StartConsumer(ch *amqp.Channel, queueName string) {
	msgs, err := ch.Consume(
		queueName,
		"",    // consumer
		false, // autoAck false para controlar ack/nack
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

		// Valida JSON
		if err := json.Unmarshal(msg.Body, &data); err != nil {
			log.Println("❌ JSON inválido:", err)
			msg.Nack(false, false) // descarta
			continue
		}

		// Mostra no console
		log.Println("🌤️  Dados recebidos:")
		log.Println("  • Temperatura:", data.Temperature)
		log.Println("  • Umidade:", data.Humidity)
		log.Println("  • Vento:", data.WindSpeed)
		log.Println("  • Condição:", data.Condition)
		log.Println("  • Chance de chuva:", data.RainChance)
		log.Println("  • Timestamp:", data.Timestamp)
		log.Println("-----------------------------------")

		// Futuro: enviar para API
		/*
		if err := sendToAPI(data); err != nil {
			log.Println("❌ Erro ao enviar para API:", err)
			msg.Nack(false, true) // requeue
			continue
		}
		*/

		// Confirma mensagem
		msg.Ack(false)
	}

	log.Println("⚠️ Canal fechado. Encerrando consumer...")
}
