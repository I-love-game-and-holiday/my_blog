import Image from 'next/image'

interface ContentImageProps {
    src: string
    alt: string
    caption?: string
    width?: number
    height?: number
}

export function ContentImage({
    src,
    alt,
    caption,
    width = 800,
    height = 450,
}: ContentImageProps) {
    return (
        <figure className="my-6" style={{ maxWidth: width }}>
            <div className="overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600">
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    quality={90}
                    className="w-full h-auto"
                />
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}
