import { env } from "./env";

export interface Mail { to: string; subject: string; text: string }

/** Boîte d'envoi en mémoire (tests / développement). Un transport SMTP réel sera branché en phase 9. */
export const outbox: Mail[] = [];

export async function sendMail(mail: Mail) {
  if (env.mailTransport === "console") {
    outbox.push(mail);
    if (outbox.length > 200) outbox.shift();
    if (process.env.NODE_ENV !== "test") console.log(`[mail:console] À: ${mail.to} | ${mail.subject}\n${mail.text}`);
    return;
  }
  throw new Error(`Transport d'e-mail « ${env.mailTransport} » non configuré.`);
}
