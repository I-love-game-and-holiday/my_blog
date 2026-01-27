import { highlightCode } from '@/lib/highlight'
import { OsCommandTabsClient, OsCodeBlockClient } from './os-command-tabs-client'

interface CommandItem {
    mac: string
    windows: string
    description?: string
}

interface OsCommandTabsProps {
    commands: CommandItem[]
}

export async function OsCommandTabs({ commands }: OsCommandTabsProps) {
    const highlightedCommands = await Promise.all(
        commands.map(async (command) => ({
            ...command,
            macHtml: await highlightCode(command.mac, 'bash'),
            windowsHtml: await highlightCode(command.windows, 'powershell'),
        }))
    )

    return <OsCommandTabsClient commands={highlightedCommands} />
}

interface OsCodeBlockProps {
    mac: string
    windows: string
    title?: string
}

export async function OsCodeBlock({ mac, windows, title }: OsCodeBlockProps) {
    const [macHtml, windowsHtml] = await Promise.all([
        highlightCode(mac, 'bash'),
        highlightCode(windows, 'powershell'),
    ])

    return (
        <OsCodeBlockClient
            mac={mac}
            windows={windows}
            macHtml={macHtml}
            windowsHtml={windowsHtml}
            title={title}
        />
    )
}
