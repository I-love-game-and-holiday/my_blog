'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { ChevronRight, Folder, FolderOpen, File } from 'lucide-react'
import cn from 'clsx'

interface FileTreeContextValue {
    activeFile?: string
}

const FileTreeContext = createContext<FileTreeContextValue>({})

interface FileTreeProps {
    children: ReactNode
    className?: string
}

function FileTreeRoot({ children, className }: FileTreeProps) {
    return (
        <FileTreeContext.Provider value={{}}>
            <ul
                className={cn(
                    'my-4 select-none text-sm',
                    'rounded-lg border border-border bg-secondary/30 px-4 py-3',
                    'inline-flex flex-col gap-1',
                    className
                )}
            >
                {children}
            </ul>
        </FileTreeContext.Provider>
    )
}

interface FileTreeFolderProps {
    name: string
    defaultOpen?: boolean
    children: ReactNode
}

function FileTreeFolder({ name, defaultOpen = false, children }: FileTreeFolderProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <li className="flex flex-col">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 py-0.5 hover:bg-secondary/50 rounded px-1 -ml-1 transition-colors"
            >
                <ChevronRight
                    className={cn(
                        'h-3.5 w-3.5 text-muted-foreground transition-transform',
                        isOpen && 'rotate-90'
                    )}
                />
                {isOpen ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                    <Folder className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-foreground">{name}</span>
            </button>
            {isOpen && (
                <ul className="ml-4 pl-2 border-l border-border flex flex-col gap-1 mt-1">
                    {children}
                </ul>
            )}
        </li>
    )
}

interface FileTreeFileProps {
    name: string
    active?: boolean
}

function FileTreeFile({ name, active = false }: FileTreeFileProps) {
    return (
        <li
            className={cn(
                'flex items-center gap-1.5 py-0.5 px-1 -ml-1 rounded',
                active && 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            )}
        >
            <span className="w-3.5" /> {/* Spacer for alignment with folder chevron */}
            <File className={cn('h-4 w-4', active ? 'text-blue-500' : 'text-muted-foreground')} />
            <span className={cn(active ? 'font-medium' : 'text-foreground')}>{name}</span>
            {active && (
                <span className="ml-1 text-xs text-blue-500">← 作成するファイル</span>
            )}
        </li>
    )
}

// Named exports for MDX usage
export { FileTreeRoot as FileTree }
export { FileTreeFolder }
export { FileTreeFile }
