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
            <div className="overflow-hidden rounded-lg border-2 border-border">
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
                <figcaption className="figure-caption">{caption}</figcaption>
            )}
        </figure>
    )
}
