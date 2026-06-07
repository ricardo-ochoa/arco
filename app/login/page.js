"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const CREDENTIALS = {
  email: "hola@arco.com",
  password: "12345",
}

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const data = new FormData(e.target)
    const email = data.get("email")
    const password = data.get("password")

    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      document.cookie = `arco_auth=${email}; path=/; max-age=${60 * 60 * 24}`
      window.location.href = "/"
    } else {
      setError("Correo o contraseña incorrectos.")
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Arco</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Iniciar sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@email.com"
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
