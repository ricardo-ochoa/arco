import "./globals.css"
import { ConditionalHeader } from "@/components/ConditionalHeader"

export const metadata = {
  title: "Arco — Registro de Pedidos",
  description: "Sistema de registro y gestión de pedidos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="h-screen flex flex-col bg-background antialiased overflow-hidden">
        <ConditionalHeader />
        <main className="flex-1 overflow-y-auto mx-auto w-full max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
