import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const DICTIONARY_DIR = path.join(process.cwd(), 'content', 'dictionary')

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const filePath = path.join(DICTIONARY_DIR, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return NextResponse.json(
            { error: 'Term not found' },
            { status: 404 }
        )
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const processedContent = await remark()
        .use(html)
        .process(content)

    return NextResponse.json({
        term: data.term || slug,
        aliases: data.aliases || [],
        content: processedContent.toString(),
    })
}
