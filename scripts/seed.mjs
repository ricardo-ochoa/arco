import { MongoClient } from "mongodb"
import { randomUUID } from "crypto"

const MONGODB_URI = "mongodb+srv://KyrosTEC:iMzvuVz8m16OBvBA@kaira.qrkoedp.mongodb.net/?appName=kAIra"
const MONGODB_DB  = "always_on_shelf"
const COLLECTION  = "registered_orders"

function calcTotales(productos) {
  const subtotal = productos.reduce((s, p) => s + p.precio * p.unidades, 0)
  const iva   = subtotal * 0.16
  const total = subtotal + iva
  return { subtotal, iva, total }
}

const registros = [
  {
    uuid: randomUUID(),
    orderId: "ORD-1780792748037",
    fecha: new Date("2026-06-06T22:39:00.000Z").toISOString(),
    cliente: "RICARDO GASPAR OCHOA",
    direccion: "Bogota 90",
    productos: [
      { sku: "8480000239266", nombre: "Bebida de almendra 0% azúcares",        precio: 23.67, unidades: 1 },
      { sku: "8480000229663", nombre: "Corn Flakes 0% azúcares añadidos",      precio: 97.92, unidades: 1 },
      { sku: "8402001019395", nombre: "Gazpacho Tradicional Mercadona",         precio: 78.23, unidades: 1 },
    ],
    createdAt: new Date("2026-06-06T22:45:00.000Z").toISOString(),
  },
  {
    uuid: randomUUID(),
    orderId: "ORD-1780654321098",
    fecha: new Date("2026-06-05T14:20:00.000Z").toISOString(),
    cliente: "MARIA LOPEZ HERNANDEZ",
    direccion: "Insurgentes Sur 1458",
    productos: [
      { sku: "8480000415108", nombre: "Leche entera UHT",                       precio: 18.50, unidades: 2 },
      { sku: "8480000421215", nombre: "Yogur natural sin azúcar",               precio: 32.90, unidades: 3 },
      { sku: "8480000334422", nombre: "Pan de molde integral sin corteza",      precio: 45.60, unidades: 1 },
    ],
    createdAt: new Date("2026-06-05T14:28:00.000Z").toISOString(),
  },
  {
    uuid: randomUUID(),
    orderId: "ORD-1780111987654",
    fecha: new Date("2026-06-04T10:05:00.000Z").toISOString(),
    cliente: "CARLOS MENDEZ RUIZ",
    direccion: "Av. Revolución 344, Col. Mixcoac",
    productos: [
      { sku: "8480000512233", nombre: "Aceite de oliva virgen extra 750ml",    precio: 112.40, unidades: 1 },
      { sku: "8480000678901", nombre: "Tomate triturado natural 400g",         precio: 14.80,  unidades: 4 },
      { sku: "8480000789012", nombre: "Pasta espagueti 500g",                  precio: 22.30,  unidades: 2 },
      { sku: "8480000890123", nombre: "Atún en aceite de oliva pack x3",       precio: 68.90,  unidades: 1 },
    ],
    createdAt: new Date("2026-06-04T10:15:00.000Z").toISOString(),
  },
  {
    uuid: randomUUID(),
    orderId: "ORD-1780345678901",
    fecha: new Date("2026-06-03T18:55:00.000Z").toISOString(),
    cliente: "ANA MARTINEZ GARCIA",
    direccion: "Calle Durango 210, Col. Roma Norte",
    productos: [
      { sku: "8480000223344", nombre: "Granola con frutos secos 500g",         precio: 89.50, unidades: 1 },
      { sku: "8480000334455", nombre: "Leche de avena sin azúcar 1L",          precio: 28.70, unidades: 2 },
    ],
    createdAt: new Date("2026-06-03T19:02:00.000Z").toISOString(),
  },
  {
    uuid: randomUUID(),
    orderId: "ORD-1780987123456",
    fecha: new Date("2026-06-02T09:30:00.000Z").toISOString(),
    cliente: "JOSE RODRIGUEZ PEREZ",
    direccion: "Madero 77, Centro Histórico",
    productos: [
      { sku: "8480000556677", nombre: "Jabón de manos líquido 500ml",          precio: 35.20, unidades: 2 },
      { sku: "8480000667788", nombre: "Papel higiénico doble hoja x12",        precio: 95.60, unidades: 1 },
      { sku: "8480000778899", nombre: "Detergente líquido ropa 2L",            precio: 78.40, unidades: 1 },
    ],
    createdAt: new Date("2026-06-02T09:40:00.000Z").toISOString(),
  },
]

// Inyectar totales calculados
const docs = registros.map((r) => ({ ...r, ...calcTotales(r.productos) }))

const client = new MongoClient(MONGODB_URI)

try {
  await client.connect()
  const db = client.db(MONGODB_DB)
  const col = db.collection(COLLECTION)

  // Evitar duplicados por orderId
  for (const doc of docs) {
    const exists = await col.findOne({ orderId: doc.orderId })
    if (exists) {
      console.log(`⚠  Ya existe: ${doc.orderId} — omitido`)
    } else {
      await col.insertOne(doc)
      console.log(`✓  Insertado: ${doc.orderId} — ${doc.cliente}`)
    }
  }

  console.log("\n✅ Seed completado.")
} finally {
  await client.close()
}
