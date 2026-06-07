"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Package, Trash2, Eye, Loader2 } from "lucide-react"
import { getPedidos, deletePedido } from "@/lib/storage"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function HomePage() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPedidos()
      .then(setPedidos)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(uuid, orderId) {
    if (!confirm(`¿Eliminar el pedido ${orderId}?`)) return
    await deletePedido(uuid)
    setPedidos((prev) => prev.filter((p) => p.uuid !== uuid))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pedidos</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "Cargando…" : `${pedidos.length} ${pedidos.length === 1 ? "registro" : "registros"} guardados`}
          </p>
        </div>
        <Link href="/pedidos/nuevo">
          <Button>
            <Plus className="h-4 w-4" />
            Nuevo Pedido
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
          <Package className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium">Sin pedidos todavía</p>
          <p className="text-muted-foreground text-sm mt-1">Crea el primer registro con el botón de arriba.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.uuid}>
                  <TableCell>
                    <Badge variant="outline">{pedido.orderId}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(pedido.fecha)}
                  </TableCell>
                  <TableCell className="font-medium">{pedido.cliente}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {pedido.productos.length} {pedido.productos.length === 1 ? "producto" : "productos"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(pedido.total)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/pedidos/${pedido.uuid}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(pedido.uuid, pedido.orderId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
