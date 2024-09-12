import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN || TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Jeet Pal",
};












// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);