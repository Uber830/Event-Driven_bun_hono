# Microservicios Event-Driven con Bun, Hono, Docker y PostgreSQL

Este proyecto es un sistema de microservicios basado en eventos, creado para practicar y aprender sobre arquitecturas distribuidas, manejo de eventos y despliegue en la nube. La idea surgió de un día en el que no sabía qué hacer y decidí crear algo útil y desafiante.

---

## **Descripción del Proyecto**

El proyecto consiste en dos microservicios (`backend1` y `backend2`) que se comunican mediante eventos. Cada backend tiene responsabilidades específicas:

- **Backend1**: Maneja la lógica de autenticación (registro, inicio de sesión, recuperación de contraseña), creacion del perfil del usuario, genera eventos.
- **Backend2**: Escucha eventos generados por `backend1` y realiza acciones como enviar correos electrónicos y mensajes sms, actualizar bases de datos y notificar al usuario.

---

## **Tecnologías Utilizadas**

- **Lenguajes**: TypeScript (con Bun runtime).
- **Frameworks**: Hono (para APIs HTTP).
- **Bases de datos**: PostgreSQL (alojado en Neon).
- **Message Broker**: RabbitMQ (cloudamqp).
- **Contenedores**: Docker.
- **CI/CD**: GitHub Actions.
- **Despliegue**: DigitalOcean.
- **Email-SMS**: Brevo

---

## **Estructura del Proyecto**
  ```.
├── backend1/ # Microservicio 1: producer
├── backend2/ # Microservicio 2: consumer
├── docker-compose.yml # Configuración de Docker para los servicios
├── .github/workflows/ # Configuración de GitHub Actions
├── README.md
└── ...
  ```

---

## **Requisitos Previos**

- [Bun](https://bun.sh/) instalado.
- [Docker](https://www.docker.com/) instalado.
- Cuenta en [Neon](https://neon.tech/) para la base de datos PostgreSQL.
- Cuenta en [cloudamqp](https://www.cloudamqp.com/) para el servicio de mensajeria.
- Cuenta en [DigitalOcean](https://www.digitalocean.com/) para el despliegue.

---

## **Configuración del Proyecto**

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Uber830/Event-Driven_bun_hono.git
   cd tu-repositorio
   ```
2. Configura las variables de entorno:

     Crea un archivo ```.env``` en cada backend (backend1 y backend2) con las credenciales necesarias (base de datos, rabbitmq, etc.).

3. Ejecuta el proyecto con Docker:
    ```bash
    docker-compose up --build
    ```

## **Despliegue**

El proyecto está configurado con GitHub Actions para desplegar automáticamente en DigitalOcean cuando se hace push a la rama ```main```.

## **Contribución**

Si deseas contribuir, sigue estos pasos:

  1. Haz un fork del proyecto.

  2. Crea una rama con tu feature (```git checkout -b feature/nueva-funcionalidad```).

  3. Haz commit de tus cambios (```git commit -m 'Añade nueva funcionalidad'```).

  4. Haz push a la rama (```git push origin feature/nueva-funcionalidad```).

  5. Abre un Pull Request.
