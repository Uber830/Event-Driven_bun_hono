import { consumeFromQueue } from "../utils/rabbitmqConsumer";
import * as amqp from "amqplib/callback_api";
import { sendEmail } from "../utils/emailService";
import { saveLoginEvent, saveFailedLoginEvent } from "../utils/saveLoginEvent";
import { userLoginEvent, UserEvent } from "../types/user";

// Función para procesar eventos de usuario
const processUserEvent = (msg: amqp.Message | null) => {
  if (!msg) {
    console.warn("Received null message from queue.");
    return;
  }

  try {
    const event = JSON.parse(msg.content.toString());
    console.log("Received event:", event);

    // Procesar el evento según su tipo
    switch (event.type) {
      case "USER_REGISTERED":
        // Send email to user with welcome message
        sendEmail({
          to: event.data.email,
          subject: "Welcome to Our App",
          template: "welcome",
          context: {
            username: event.data.username,
            email: event.data.email,
          },
        });
        break;

      case "USER_LOGIN":
        // Save login success event
        saveLoginEvent(event.data as userLoginEvent);
        break;

      case "USER_LOGIN_FAILED":
        // Save login failed event
        saveFailedLoginEvent(event as UserEvent);
        break;

      case "PASSWORD_RESET_REQUESTED":
        // sendEmail({
        //   to: event.data.email,
        //   subject: "Password Reset Request",
        //   text: `Click the link to reset your password: http://yourapp.com/reset?token=${event.data.resetToken}`,
        // });
        break;

      case "PASSWORD_RESET_COMPLETED": // FIXME: Falta implementar
        // sendEmail({
        //   to: event.data.email,
        //   subject: "Password Reset Completed",
        //   text: `Your password has been reset. Please log in with your new password.`,
        // });
        break;

      default:
        console.warn("Unknown event type:", event.type);
    }
  } catch (error) {
    console.error("Error processing event:", error);
  }
};

// Iniciar el consumidor para la cola de eventos de usuario
export const startUserEventConsumer = () => {
  consumeFromQueue("user_events", processUserEvent);
  console.log("User event consumer started.");
};
