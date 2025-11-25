import time
import json
import requests
import pika
import schedule
from datetime import datetime

# --- CONFIGURAÇÕES ---
# Latitude e Longitude de Ipameri, GO (aproximadamente)
CITY_LAT = "-17.72"
CITY_LON = "-48.15"

# Configurações do RabbitMQ (que está rodando no Docker)
RABBITMQ_HOST = 'rabbitmq'
QUEUE_NAME = 'weather_queue'

def get_weather():
    print(f"[{datetime.now()}] 🌤️  Buscando dados do clima...")
    try:
        # API Gratuita (Open-Meteo)
        url = f"https://api.open-meteo.com/v1/forecast?latitude={CITY_LAT}&longitude={CITY_LON}&current_weather=true"
        response = requests.get(url)
        data = response.json()
        
        current = data['current_weather']
        
        # Monta o JSON para enviar
        payload = {
            "city": "Ipameri",
            "temperature": current['temperature'],
            "windSpeed": current['windspeed'],
            "condition": str(current['weathercode']),
            "humidity": 50 # Valor fixo pois essa API simples não manda umidade no endpoint básico
        }
        
        return payload
    except Exception as e:
        print(f"❌ Erro ao buscar clima: {e}")
        return None

def send_to_queue(payload):
    try:
        # Conecta no RabbitMQ usando as senhas que definimos no docker-compose
        credentials = pika.PlainCredentials('admin', 'password123')
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
        channel = connection.channel()

        # Garante que a fila existe
        channel.queue_declare(queue=QUEUE_NAME, durable=True)

        # Envia a mensagem
        message = json.dumps(payload)
        channel.basic_publish(
            exchange='',
            routing_key=QUEUE_NAME,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Mensagem persistente
            ))
        
        print(f" [x] 📤 Enviado para a fila: {message}")
        connection.close()
    except Exception as e:
        print(f"❌ Erro ao conectar no RabbitMQ: {e}")

def job():
    weather_data = get_weather()
    if weather_data:
        send_to_queue(weather_data)

# --- INÍCIO ---
if __name__ == "__main__":
    print("🚀 Coletor Iniciado! Rodando a cada 10 segundos para teste...")
    
    # Executa a primeira vez imediatamente
    job()

    # Agenda para rodar a cada 10 segundos (funcionando rápido)
    schedule.every(10).seconds.do(job)

    while True:
        schedule.run_pending()
        time.sleep(1)