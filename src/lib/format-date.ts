export function formatDate(date: string | Date): string {
    if (!date) return null;
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}