# Usa uma imagem leve do Python
FROM python:3.10-slim

# Define a pasta de trabalho
WORKDIR /app

# Copia os requisitos e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY . .

# Comando para rodar (desativa o buffer para vermos os logs na hora)
CMD ["python", "-u", "collector.py"]