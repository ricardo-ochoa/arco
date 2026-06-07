import "./globals.css"

export const metadata = {
  title: "Arco — Registro de Pedidos",
  description: "Sistema de registro y gestión de pedidos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background antialiased">
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">A</span>
            </div>
            <h1 className="text-lg font-semibold text-foreground">Arco</h1>
            <span className="text-muted-foreground text-sm">Registro de Pedidos</span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
