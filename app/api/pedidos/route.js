import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const pedidos = await db
      .collection("registered_orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return Response.json(
      pedidos.map((p) => ({ ...p, _id: p._id.toString() }))
    )
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const db = await getDb()
    const body = await request.json()
    const doc = { ...body, createdAt: body.createdAt || new Date().toISOString() }
    const result = await db.collection("registered_orders").insertOne(doc)
    return Response.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error al guardar pedido" }, { status: 500 })
  }
}
