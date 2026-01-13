export function HeroBlocks() {
    return (
        <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 md:w-32 md:h-32"
            aria-hidden="true"
        >
            {/* 上段左 - 101テキスト */}
            <text
                x="26"
                y="28"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-orange-500"
                style={{
                    fontSize: '32px',
                    fontFamily: 'var(--font-nunito), system-ui, sans-serif',
                    fontWeight: 800,
                }}
            >
                101
            </text>

            {/* 上段右 - ブロック */}
            <rect
                x="52"
                y="4"
                width="44"
                height="44"
                rx="6"
                className="fill-sky-400"
            />

            {/* 下段左 - ブロック */}
            <rect
                x="4"
                y="52"
                width="44"
                height="44"
                rx="6"
                className="fill-emerald-400"
            />

            {/* 下段右 - ブロック */}
            <rect
                x="52"
                y="52"
                width="44"
                height="44"
                rx="6"
                className="fill-amber-400"
            />
        </svg>
    )
}
