'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Eye, Code2, RotateCcw } from 'lucide-react'
import { html as htmlLang } from '@codemirror/lang-html'
import { css as cssLang } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { githubDark } from '@uiw/codemirror-theme-github'
import { cn } from '@/lib/utils'
import { INTERACTIVE_TRANSITION } from '@/lib/constants'
import { CodeBlockWrapper } from './code-block-wrapper'
import { CopyButton } from './copy-button'

const CodeMirrorEditor = dynamic(
    () => import('@uiw/react-codemirror').then((mod) => ({ default: mod.default })),
    {
        ssr: false,
        loading: () => <div className="code-editor-placeholder" />,
    }
)

type PlaygroundTab = 'preview' | 'code'
type EditorLanguage = 'html' | 'css' | 'js'

interface PlaygroundTabDef {
    key: PlaygroundTab
    label: string
    icon: typeof Eye
}

const tabs: PlaygroundTabDef[] = [
    { key: 'preview', label: 'プレビュー', icon: Eye },
    { key: 'code', label: 'コード', icon: Code2 },
]

function getLanguageExtension(lang: EditorLanguage) {
    switch (lang) {
        case 'html':
            return htmlLang()
        case 'css':
            return cssLang()
        case 'js':
            return javascript()
    }
}

const editorBasicSetup = {
    lineNumbers: false,
    foldGutter: false,
    highlightActiveLine: false,
    highlightActiveLineGutter: false,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: false,
    tabSize: 2,
}

interface CodeEditorSectionProps {
    language: EditorLanguage
    value: string
    onChange: (value: string) => void
}

function CodeEditorSection({ language, value, onChange }: CodeEditorSectionProps) {
    const extensions = useMemo(() => [getLanguageExtension(language)], [language])

    return (
        <CodeMirrorEditor
            value={value}
            onChange={onChange}
            theme={githubDark}
            extensions={extensions}
            basicSetup={editorBasicSetup}
            className="code-editor-codemirror"
        />
    )
}

interface CodePlaygroundClientProps {
    html: string
    css: string
    js: string
    height: number
    title?: string
}

export function CodePlaygroundClient({
    html,
    css,
    js,
    height,
    title,
}: CodePlaygroundClientProps) {
    const [activeTab, setActiveTab] = useState<PlaygroundTab>('preview')
    const [editableHtml, setEditableHtml] = useState(html)
    const [editableCss, setEditableCss] = useState(css)
    const [editableJs, setEditableJs] = useState(js)

    const isModified =
        editableHtml !== html || editableCss !== css || editableJs !== js

    const handleReset = () => {
        setEditableHtml(html)
        setEditableCss(css)
        setEditableJs(js)
    }

    const buildSrcDoc = () => {
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${editableCss}</style>
</head>
<body>
    ${editableHtml}
    ${editableJs ? `<script>${editableJs}</script>` : ''}
</body>
</html>`.trim()
    }

    const getCodeText = () => {
        const sections: string[] = [editableHtml]
        if (editableCss) sections.push(editableCss)
        if (editableJs) sections.push(editableJs)
        return sections.join('\n\n')
    }

    return (
        <figure className="my-6">
            {title && (
                <figcaption className="mb-2 text-sm font-medium text-muted-foreground">
                    {title}
                </figcaption>
            )}
            <CodeBlockWrapper className="my-0">
                {/* タブヘッダー */}
                <div className="code-block-header flex items-center justify-between">
                    <div className="flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2 text-sm font-medium',
                                        INTERACTIVE_TRANSITION,
                                        activeTab === tab.key
                                            ? 'bg-background text-primary border-b-2 border-primary -mb-px'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                    <div className="flex items-center gap-1">
                        {isModified && (
                            <button
                                onClick={handleReset}
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground rounded-md',
                                    'hover:text-foreground hover:bg-muted',
                                    INTERACTIVE_TRANSITION
                                )}
                                title="初期コードに戻す"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                リセット
                            </button>
                        )}
                        {activeTab === 'code' && (
                            <CopyButton getText={getCodeText} />
                        )}
                    </div>
                </div>

                {/* プレビューパネル */}
                {activeTab === 'preview' && (
                    <div className="bg-white" style={{ height }}>
                        <iframe
                            srcDoc={buildSrcDoc()}
                            className="w-full h-full"
                            sandbox="allow-scripts allow-forms"
                            title={title || 'プレビュー'}
                        />
                    </div>
                )}

                {/* コードパネル */}
                {activeTab === 'code' && (
                    <div className="code-block-dark">
                        <div className="px-4 pt-3 text-xs text-muted-foreground">
                            HTML
                        </div>
                        <CodeEditorSection
                            language="html"
                            value={editableHtml}
                            onChange={setEditableHtml}
                        />

                        {(editableCss || css) && (
                            <>
                                <div className="border-t border-border" />
                                <div className="px-4 pt-3 text-xs text-muted-foreground">
                                    CSS
                                </div>
                                <CodeEditorSection
                                    language="css"
                                    value={editableCss}
                                    onChange={setEditableCss}
                                />
                            </>
                        )}

                        {(editableJs || js) && (
                            <>
                                <div className="border-t border-border" />
                                <div className="px-4 pt-3 text-xs text-muted-foreground">
                                    JavaScript
                                </div>
                                <CodeEditorSection
                                    language="js"
                                    value={editableJs}
                                    onChange={setEditableJs}
                                />
                            </>
                        )}
                    </div>
                )}
            </CodeBlockWrapper>
        </figure>
    )
}
