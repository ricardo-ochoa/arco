import { getDb } from "@/lib/mongodb"

export async function GET(request, { params }) {
  try {
    const db = await getDb()
    const pedido = await db
      .collection("registered_orders")
      .findOne({ uuid: params.id })
    if (!pedido) return Response.json({ error: "No encontrado" }, { status: 404 })
    return Response.json({ ...pedido, _id: pedido._id.toString() })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error al obtener pedido" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb()
    await db.collection("registered_orders").deleteOne({ uuid: params.id })
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error al eliminar pedido" }, { status: 500 })
  }
}
