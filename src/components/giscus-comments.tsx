'use client';

import React from 'react';
import Giscus from "@giscus/react";

const GiscusComments = () => {
    return (
        <Giscus
            id="comments"
            repo="I-love-game-and-holiday/blog-discussions"
            repoId="R_kgDOQkFk9A"
            category="Announcements"
            categoryId="DIC_kwDOQkFk9M4Czfk5"
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme="preferred_color_scheme"
            lang="ja"
            loading="lazy"
        />
    );
};

export default GiscusComments;