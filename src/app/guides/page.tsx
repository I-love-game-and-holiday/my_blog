import { getGuides } from '@/lib/get-guides'
import { ClickableCard } from '@/components/ui/clickable-card'

export const metadata = {
    title: 'Guides',
    description: '開発に必要な基礎知識を体系的に学ぶガイド',
}

export default async function GuidesPage() {
    const guides = await getGuides()

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Guides</h1>
                <p className="text-muted-foreground">
                    開発に必要な基礎知識を体系的に学ぶガイド。
                    <br />
                    読んで理解する、知識のインプット。
                </p>
            </div>

            {guides.length === 0 ? (
                <p className="text-muted-foreground">まだガイドがありません。</p>
            ) : (
                <div className="grid gap-6">
                    {guides.map((guide) => (
                        <ClickableCard
                            key={guide.route}
                            href={guide.route}
                            padding="none"
                            className="p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-1 group-hover:underline">
                                        {guide.frontMatter?.title || guide.title}
                                    </h2>
                                    {guide.frontMatter?.description && (
                                        <p className="text-muted-foreground text-sm">
                                            {guide.frontMatter.description}
                                        </p>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground shrink-0">
                                    {guide.sections.length} sections
                                </div>
                            </div>
                        </ClickableCard>
                    ))}
                </div>
            )}
        </div>
    )
}
