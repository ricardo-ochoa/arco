"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {

  function handleLogout() {
    document.cookie = "arco_auth=; path=/; max-age=0"
    window.location.href = "/login"
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">A</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground">Arco</h1>
        <span className="text-muted-foreground text-sm flex-1">Registro de Pedidos</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  )
}
