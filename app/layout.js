import "./globals.css"
import { ConditionalHeader } from "@/components/ConditionalHeader"

export const metadata = {
  title: "Arco — Registro de Pedidos",
  description: "Sistema de registro y gestión de pedidos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background antialiased">
        <ConditionalHeader />
        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
