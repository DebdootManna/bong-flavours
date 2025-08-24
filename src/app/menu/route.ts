import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the static menu HTML file
    
    const menuPath = path.join(process.cwd(), 'public', 'menu.html')
    
    if (!fs.existsSync(menuPath)) {
      return NextResponse.json(
        { message: 'Menu file not found. Please run npm run build:menu first.' },
        { status: 404 }
      )
    }
    
    const menuHtml = fs.readFileSync(menuPath, 'utf8')
    
    return new NextResponse(menuHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
    
  } catch (error) {
    console.error('Error serving menu:', error)
    return NextResponse.json(
      { message: 'Error loading menu' },
      { status: 500 }
    )
  }
}
