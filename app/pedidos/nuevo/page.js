"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react"
import { savePedido } from "@/lib/storage"
import { formatCurrency, parseFechaInput } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const productoVacio = () => ({ sku: "", nombre: "", precio: "", unidades: 1 })

export default function NuevoPedidoPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [fecha, setFecha] = useState("")
  const [cliente, setCliente] = useState("")
  const [direccion, setDireccion] = useState("")
  const [productos, setProductos] = useState([productoVacio()])
  const [error, setError] = useState("")

  const subtotal = productos.reduce(
    (sum, p) => sum + (parseFloat(p.precio) || 0) * (parseInt(p.unidades) || 0),
    0
  )
  const iva = subtotal * 0.16
  const total = subtotal + iva

  function addProducto() {
    setProductos([...productos, productoVacio()])
  }

  function removeProducto(idx) {
    if (productos.length === 1) return
    setProductos(productos.filter((_, i) => i !== idx))
  }

  function updateProducto(idx, field, value) {
    const updated = [...productos]
    updated[idx] = { ...updated[idx], [field]: value }
    setProductos(updated)
  }

  function handleSave() {
    if (!orderId.trim()) { setError("El ID de pedido es obligatorio."); return }
    const fechaISO = parseFechaInput(fecha)
    if (!fechaISO) { setError('Fecha inválida. Usa el formato "06/06/26 10:07 p.m."'); return }
    if (!cliente.trim()) { setError("El cliente es obligatorio."); return }
    const productosValidos = productos.filter((p) => p.sku || p.nombre)
    if (productosValidos.length === 0) { setError("Agrega al menos un producto."); return }

    setError("")

    const pedido = {
      uuid: crypto.randomUUID(),
      orderId: orderId.trim(),
      fecha: fechaISO,
      cliente: cliente.trim().toUpperCase(),
      direccion: direccion.trim(),
      productos: productosValidos.map((p) => ({
        sku: p.sku.trim(),
        nombre: p.nombre.trim(),
        precio: parseFloat(p.precio) || 0,
        unidades: parseInt(p.unidades) || 1,
      })),
      subtotal,
      iva,
      total,
      createdAt: new Date().toISOString(),
    }

    savePedido(pedido)
    router.push("/")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Nuevo Pedido</h2>
          <p className="text-muted-foreground text-sm">Completa los datos del pedido y sus productos.</p>
        </div>
      </div>

      {/* Datos del pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="orderId">ID Pedido</Label>
            <Input
              id="orderId"
              placeholder="ORD-1780792748037"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fecha">Fecha y Hora</Label>
            <Input
              id="fecha"
              type="text"
              placeholder="06/06/26 10:07 p.m."
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              placeholder="NOMBRE COMPLETO"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              placeholder="Bogota 90"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Productos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Productos</CardTitle>
          <Button variant="outline" size="sm" onClick={addProducto}>
            <Plus className="h-3.5 w-3.5" />
            Agregar producto
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {productos.map((producto, idx) => (
            <div key={idx} className="space-y-3">
              {idx > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Producto {idx + 1}
                </span>
                {productos.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeProducto(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label>SKU</Label>
                  <Input
                    placeholder="8480000239266"
                    value={producto.sku}
                    onChange={(e) => updateProducto(idx, "sku", e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Nombre del producto"
                    value={producto.nombre}
                    onChange={(e) => updateProducto(idx, "nombre", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={producto.precio}
                    onChange={(e) => updateProducto(idx, "precio", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label>Unidades</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    min="1"
                    value={producto.unidades}
                    onChange={(e) => updateProducto(idx, "unidades", e.target.value)}
                  />
                </div>
                {(parseFloat(producto.precio) > 0 && parseInt(producto.unidades) > 0) && (
                  <div className="col-span-3 flex items-end pb-0.5">
                    <p className="text-sm text-muted-foreground">
                      Importe:{" "}
                      <span className="font-semibold text-foreground">
                        {formatCurrency((parseFloat(producto.precio) || 0) * (parseInt(producto.unidades) || 0))}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Totales */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA 16%</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Link href="/">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          Guardar Pedido
        </Button>
      </div>
    </div>
  )
}
