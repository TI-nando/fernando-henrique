package main

import (
	"bytes"
	"log"
	"net/http"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

// --- CONFIGURAÇÕES ---
const (
	RABBITMQ_URL = "amqp://admin:password123@rabbitmq:5672/"
	QUEUE_NAME   = "weather_queue"
	API_URL = "http://backend:3000/weather"
)

func main() {
	// 1. Conecta no RabbitMQ
	conn, err := connectRabbit()
	if err != nil {
		log.Fatalf("❌ Erro RabbitMQ: %s", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("❌ Erro Canal: %s", err)
	}
	defer ch.Close()

	// 2. Declara a fila (para garantir que existe)
	q, err := ch.QueueDeclare(
		QUEUE_NAME, true, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("❌ Erro Fila: %s", err)
	}

	// 3. Ouve as mensagens
	msgs, err := ch.Consume(
		q.Name, "", false, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("❌ Erro Consumer: %s", err)
	}

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			log.Printf("📦 Recebido: %s", d.Body)

			// Envia para o NestJS
			if sendToAPI(d.Body) {
				log.Println("✅ Enviado para API!")
				d.Ack(false)
			} else {
				log.Println("⚠️ Falha API. Tentando de novo...")
				d.Nack(false, true)
				time.Sleep(5 * time.Second)
			}
		}
	}()

	log.Printf(" [*] Worker Go Rodando! (CTRL+C para sair)")
	<-forever
}

// Tenta reconectar se o RabbitMQ demorar
func connectRabbit() (*amqp.Connection, error) {
	var counts int64
	for {
		c, err := amqp.Dial(RABBITMQ_URL)
		if err == nil {
			return c, nil
		}
		log.Println("RabbitMQ indisponível... tentando em 1s...")
		counts++
		if counts > 5 { return nil, err }
		time.Sleep(1 * time.Second)
	}
}

// Faz o POST para o NestJS
func sendToAPI(jsonData []byte) bool {
	resp, err := http.Post(API_URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Erro HTTP: %v", err)
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode >= 200 && resp.StatusCode < 300
}