FROM oven/bun:1.0.0

WORKDIR /app

# Copy .env file
COPY .env .env

# File system
COPY package.json ./
COPY bun.* ./
COPY app.ts ./
COPY src ./src

# Instalar dependencias
RUN bun install

# Comando para iniciar la aplicación
CMD ["bun", "run", "app.ts"]
