import { Metadata } from 'next'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'

export const metadata: Metadata = {
    title: 'About',
    description: 'tanaka101について',
}

export default function AboutPage() {
    return (
        <div className="container py-16 md:py-24">
            <div className={`${CONTENT_MAX_WIDTH} mx-auto`}>
                <h1 className="text-3xl font-bold mb-8">About</h1>
                <p className="text-muted-foreground">
                    準備中です。
                </p>
            </div>
        </div>
    )
}
