'use client'

import { useEffect, useState } from 'react'
import { useDictionary } from '@/contexts/dictionary-context'
import { X, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

type DictionaryContent = {
    term: string
    content: string
}

export function DictionaryPanel() {
    const { selectedTerm, isOpen, closeDictionary } = useDictionary()
    const [content, setContent] = useState<DictionaryContent | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (selectedTerm && isOpen) {
            setIsLoading(true)
            fetch(`/api/dictionary/${selectedTerm}`)
                .then(res => res.json())
                .then(data => {
                    setContent(data)
                    setIsLoading(false)
                })
                .catch(() => {
                    setContent(null)
                    setIsLoading(false)
                })
        }
    }, [selectedTerm, isOpen])

    return (
        <>
            {/* Desktop Panel */}
            <aside
                className={cn(
                    'dictionary-panel hidden lg:block',
                    isOpen && 'dictionary-panel-open'
                )}
            >
                <div className="sticky top-20">
                    {isOpen && content ? (
                        <div className="dictionary-panel-content">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    {content.term}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeDictionary}
                                    className="p-1 hover:bg-muted rounded-md transition-colors"
                                    aria-label="辞書パネルを閉じる"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div
                                className="prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        </div>
                    ) : isOpen && isLoading ? (
                        <div className="dictionary-panel-content">
                            <div className="animate-pulse space-y-3">
                                <div className="h-6 bg-muted rounded w-1/3" />
                                <div className="h-4 bg-muted rounded w-full" />
                                <div className="h-4 bg-muted rounded w-2/3" />
                            </div>
                        </div>
                    ) : (
                        <div className="dictionary-panel-placeholder">
                            <BookOpen className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground text-center">
                                用語をクリックすると<br />説明が表示されます
                            </p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Modal */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeDictionary}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl max-h-[70vh] overflow-y-auto">
                        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                {content?.term || '読み込み中...'}
                            </h3>
                            <button
                                type="button"
                                onClick={closeDictionary}
                                className="p-1 hover:bg-muted rounded-md transition-colors"
                                aria-label="辞書パネルを閉じる"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            {content ? (
                                <div
                                    className="prose prose-sm"
                                    dangerouslySetInnerHTML={{ __html: content.content }}
                                />
                            ) : (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-4 bg-muted rounded w-2/3" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
