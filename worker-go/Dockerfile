# Usa a imagem oficial do Go
FROM golang:1.23-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY go.mod go.sum ./
RUN go mod download

# Copia o código fonte
COPY . .

# Compila o executável chamado "worker"
RUN go build -o worker main.go

# Roda o executável
CMD ["./worker"]