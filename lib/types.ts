export type Product = {
  id: string
  sourceId: string
  slug: string
  sku: string
  name: string
  category: string
  unitPrice: number
  packSize: number
  sizeGrid: string
  season: string
  gender: string
  material: string
  imageUrl: string
  sourceUrl?: string
  status: 'active' | 'archived'
}

export type CartLine = { product: Product; boxes: number }
