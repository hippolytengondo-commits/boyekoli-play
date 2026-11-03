import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GESTION360", template: "%s · GESTION360" },
  description: "Plateforme de gestion intégrale et de digitalisation des entreprises.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
