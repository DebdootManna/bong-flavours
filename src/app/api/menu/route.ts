import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description?: string
  veg: boolean
}

export async function GET(req: NextRequest) {
  try {
    // Read the menu data from the JSON file
    const menuPath = path.join(process.cwd(), 'data', 'menu.json')
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'))
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const vegFilter = searchParams.get('veg')
    
    // Start with all menu items (the JSON file is directly an array)
    let filteredItems: MenuItem[] = menuData

    // Apply category filter
    if (category && category !== 'All') {
      filteredItems = filteredItems.filter((item: MenuItem) => item.category === category)
    }

    // Apply search filter
    if (search) {
      filteredItems = filteredItems.filter((item: MenuItem) => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Apply vegetarian filter
    if (vegFilter !== null) {
      const isVeg = vegFilter === 'true'
      filteredItems = filteredItems.filter((item: MenuItem) => item.veg === isVeg)
    }

    return NextResponse.json({
      success: true,
      items: filteredItems,
      total: filteredItems.length
    })

  } catch (error) {
    console.error('Menu API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}
