export async function getPedidos() {
  const res = await fetch("/api/pedidos")
  if (!res.ok) return []
  return res.json()
}

export async function getPedido(uuid) {
  const res = await fetch(`/api/pedidos/${uuid}`)
  if (!res.ok) return null
  return res.json()
}

export async function savePedido(pedido) {
  const res = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  })
  if (!res.ok) throw new Error("Error al guardar pedido")
  return res.json()
}

export async function deletePedido(uuid) {
  const res = await fetch(`/api/pedidos/${uuid}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Error al eliminar pedido")
}
