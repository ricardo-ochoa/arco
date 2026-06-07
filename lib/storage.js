const STORAGE_KEY = "arco_pedidos"

export function getPedidos() {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getPedido(uuid) {
  return getPedidos().find((p) => p.uuid === uuid) || null
}

export function savePedido(pedido) {
  const pedidos = getPedidos()
  const idx = pedidos.findIndex((p) => p.uuid === pedido.uuid)
  if (idx >= 0) {
    pedidos[idx] = pedido
  } else {
    pedidos.unshift(pedido)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos))
  return pedido
}

export function deletePedido(uuid) {
  const pedidos = getPedidos().filter((p) => p.uuid !== uuid)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos))
}
