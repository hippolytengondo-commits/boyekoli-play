export const env = {
  get appUrl() { return process.env.APP_URL ?? "http://localhost:3000"; },
  get mailTransport() { return process.env.MAIL_TRANSPORT ?? "console"; },
  get sessionTtlHours() { return Number(process.env.SESSION_TTL_HOURS ?? 168); },
  get isProd() { return process.env.NODE_ENV === "production"; },
};
