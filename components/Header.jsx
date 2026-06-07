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
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
        <img src="/logo.svg" alt="Arco" className="h-7 w-auto" />
        <span className="text-muted-foreground text-sm flex-1">Registro de Pedidos</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  )
}
