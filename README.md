# GDASH Weather Station Challenge

Uma solução Full Stack distribuída para monitoramento climático em tempo real, utilizando arquitetura de microsserviços orientada a eventos.

<p align="center">
  <a href="https://www.python.org/" title="Python"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="40"/></a>
  <a href="https://www.rabbitmq.com/" title="RabbitMQ"><img src="https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg" alt="RabbitMQ" width="40"/></a>
  <a href="https://go.dev/" title="Go"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" alt="Go" width="40"/></a>
  <a href="https://nestjs.com/" title="NestJS"><img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" width="40"/></a>
  <a href="https://www.mongodb.com/" title="MongoDB"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="40"/></a>
  <a href="https://react.dev/" title="React"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="40"/></a>
  <a href="https://www.docker.com/" title="Docker"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width="40"/></a>
</p>

<p align="center">
  <img src="frontend-react/src/img/dashbord.png" alt="Dashboard" width="900"/>
</p>

## 🧭 Sobre o Projeto

Este projeto foi desenvolvido como solução para um desafio técnico de engenharia de software. O objetivo principal é criar uma arquitetura robusta e poliglota, onde diferentes serviços (cada um em sua linguagem nativa) cooperam através de um message broker para processar dados de alta volumetria.

A aplicação coleta dados meteorológicos, processa em filas de alta performance, armazena em banco orientado a documentos e exibe em um dashboard reativo.

## 🏗️ Arquitetura e Fluxo de Dados

<p align="center">
  <img src="docs/architecture.svg" alt="Arquitetura e Fluxo" width="900"/>
</p>

- Coleta (Python): um script agendado busca dados da Open-Meteo API
- Mensageria (RabbitMQ): garante desacoplamento e resiliência dos dados
- Processamento (Go): um worker consume a fila e comunica com a API
- Backend (NestJS): gerencia regras de negócio e persistência no MongoDB
- Frontend (React): interface moderna com Tailwind e shadcn/ui

## 🚀 Tecnologias Utilizadas

- Infraestrutura: Docker & Docker Compose
- Coletor: Python 3.10 + `requests` + `schedule`
- Fila/Broker: RabbitMQ (Management Plugin)
- Worker: Golang (AMQP Protocol)
- API: NestJS (TypeScript) + Mongoose
- Banco de Dados: MongoDB
- Frontend: React + Vite + TailwindCSS + Recharts

## 📦 Como Rodar (Instalação)

Graças ao Docker, não é necessário instalar Python, Go ou Node.js na sua máquina. Apenas o Docker é obrigatório.

### Pré-requisitos

- Docker Desktop instalado e rodando

### Passo a Passo

1. Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/gdash-weather-station.git
cd gdash-weather-station
```

2. Suba a aplicação com um único comando:

```bash
docker compose up --build
```

Na primeira execução, aguarde o download das imagens e a compilação dos serviços.

3. Acesse as interfaces:

- Dashboard (Frontend): `http://localhost:5173`
- API (Backend): `http://localhost:3000/api`
- RabbitMQ Manager: `http://localhost:15672` (User: `admin` / Pass: `password123`)

### Variáveis de Ambiente

Use o arquivo `.env.example` como base para criar seu `.env`:

```
MONGO_URL=mongodb://admin:password123@mongo:27017/weatherdb?authSource=admin
RABBITMQ_URL=amqp://admin:password123@rabbitmq:5672
RABBITMQ_QUEUE=weather_data
JWT_SECRET=changeme
DEFAULT_USER_EMAIL=admin@example.com
DEFAULT_USER_PASSWORD=123456
OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast
LOCATION_LAT=-23.5505
LOCATION_LON=-46.6333
COLLECTION_INTERVAL=3600
VITE_API_URL=/api
```

## 📂 Estrutura do Projeto

```
gdash-weather-station/
├── backend-nest/             # API Principal (Node.js/NestJS)
├── frontend-react/           # Dashboard (React/Vite)
├── weather-collector-python/ # Serviço de Coleta (Python)
├── worker-go/                # Consumidor da Fila (Golang)
└── docker-compose.yml        # Orquestração dos Containers
```

## ⚙️ Detalhes da Implementação

- Resiliência: o Worker em Go possui lógica de retry e ack/nack manual; se a API estiver fora do ar, a mensagem volta para a fila
- Tradução WMO: o Frontend implementa a tabela da Organização Meteorológica Mundial para traduzir códigos numéricos (ex.: `2`) para descrições humanas ("Parcialmente Nublado ⛅")
- Networking Docker: os serviços se comunicam via rede interna do Docker (`http://backend-nest:3000`, `amqp://rabbitmq`), isolados do host

## 🧩 Serviços e Endpoints

- Backend (NestJS) `backend-nest/`
  - Porta: `3000`
  - Principais rotas:
    - `POST /auth/login` (gera token JWT)
    - `GET /weather` (lista dados)
    - `POST /weather` (insere dado)
    - `GET /weather/export` (CSV)
- Frontend (React/Vite) `frontend-react/`
  - Porta: `5173`
  - Páginas: Login (`/login`) e Dashboard (`/`)
- Coletor (Python) `weather-collector-python/`
  - Publica JSON na fila `weather_data`
- Worker (Go) `worker-go/`
  - Consome a fila e envia `POST` para a API

## 🔧 Rodar serviços individualmente

- Frontend: `docker compose up -d frontend`
- API: `docker compose up -d backend`
- Coletor: `docker compose up -d collector`
- Worker: `docker compose up -d worker`

## 🔗 URLs Principais

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- RabbitMQ UI: `http://localhost:15672` (admin/password123)

## 👤 Usuário Padrão

- Email: `admin@example.com`
- Senha: `123456`

## 🧪 Testes rápidos

Autenticação e listagem via PowerShell:

```powershell
$body = @{ email = 'admin@example.com'; password = '123456' } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:3000/auth/login -ContentType 'application/json' -Body $body
$token = $login.access_token
Invoke-RestMethod -Method Get -Uri http://localhost:3000/weather -Headers @{ Authorization = "Bearer $token" }
```

## 🛠️ Troubleshooting

- Se o login não avançar, limpe o token do navegador:
  - `localStorage.removeItem('gdash_token')` e recarregue
- Se o worker receber `401`, ele reautentica automaticamente e reenvia
- Ajuste `COLLECTION_INTERVAL=60` no `.env` para acelerar dados em desenvolvimento

## 📝 Autor

Desenvolvido por Fernando Henrique Silva

- LinkedIn: https://www.linkedin.com/in/fernandohenrique-dev
