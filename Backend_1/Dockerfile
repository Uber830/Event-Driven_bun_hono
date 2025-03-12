FROM oven/bun:1.0.0

WORKDIR /app

# File system
COPY package.json .
COPY bun.* .
COPY app.ts .
COPY src ./src

# Instalar dependencias
RUN bun install
EXPOSE 3006
# Comando para iniciar la aplicación
CMD ["bun", "run", "app.ts"]
