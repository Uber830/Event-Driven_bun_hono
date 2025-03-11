import { readFileSync } from "node:fs";
import { compile } from "handlebars";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from "@getbrevo/brevo";

// Templates
const welcomeTemplateSource = readFileSync(
  __dirname + "/../templates/welcome.hbs",
  "utf8",
);
const resetPasswordTemplateSource = readFileSync(
  __dirname + "/../templates/resetPassword.hbs",
  "utf8",
);

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!,
);
const sendSmtpEmail = new SendSmtpEmail();

const welcomeTemplate = compile(welcomeTemplateSource);
const resetPasswordTemplate = compile(resetPasswordTemplateSource);

// Function to send emails
export const sendEmail = async ({
  to,
  subject,
  template,
  context,
}: {
  to: string;
  subject: string;
  template: "welcome" | "resetPassword";
  context: any;
}) => {
  try {
    let html: string;

    // Selecc template
    switch (template) {
      case "welcome":
        html = welcomeTemplate(context);
        break;
      case "resetPassword":
        html = resetPasswordTemplate(context);
        break;
      default:
        throw new Error("Invalid template");
    }

    // Prepare
    sendSmtpEmail.sender = { email: "noreply@brevo.com" };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.htmlContent = html;
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
