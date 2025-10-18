import { NextResponse } from 'next/server'
import { db } from '@/db'
import { templates } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = parseInt(params.id)
    
    if (isNaN(templateId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid template ID',
      }, { status: 400 })
    }

    const template = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1)

    if (!template || template.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Template not found',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: template[0],
    })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch template',
    }, { status: 500 })
  }
}