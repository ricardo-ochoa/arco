"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Package, Loader2 } from "lucide-react"
import { getPedido, deletePedido } from "@/lib/storage"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export default function PedidoDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getPedido(id)
      .then((p) => {
        if (p) setPedido(p)
        else setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm(`¿Eliminar el pedido ${pedido.orderId}?`)) return
    await deletePedido(pedido.uuid)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="font-medium">Pedido no encontrado</p>
        <Link href="/" className="mt-4">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">Pedido</h2>
              <Badge variant="outline">{pedido.orderId}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">{formatDate(pedido.fecha)}</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">UUID</dt>
              <dd className="font-mono text-xs mt-0.5 text-foreground break-all">{pedido.uuid}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ID Pedido</dt>
              <dd className="font-semibold mt-0.5">{pedido.orderId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cliente</dt>
              <dd className="font-semibold mt-0.5">{pedido.cliente}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dirección</dt>
              <dd className="mt-0.5">{pedido.direccion || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fecha</dt>
              <dd className="mt-0.5">{formatDate(pedido.fecha)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Registrado</dt>
              <dd className="mt-0.5">{formatDate(pedido.createdAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Productos{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({pedido.productos.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Uds.</TableHead>
                <TableHead className="text-right">Importe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedido.productos.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.precio)}</TableCell>
                  <TableCell className="text-right">{p.unidades}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(p.precio * p.unidades)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(pedido.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA 16%</span>
              <span>{formatCurrency(pedido.iva)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(pedido.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
