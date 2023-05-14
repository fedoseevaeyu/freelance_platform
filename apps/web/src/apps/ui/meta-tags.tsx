import Head from 'next/head';
import type { FC } from 'react';

import { siteLogo, siteUrl } from '../data/site';

export interface MetaTagsProps {
  title: string;
  description: string;
  ogImage?: string;
}

const MetaTags: FC<MetaTagsProps> = ({ description, title, ogImage }) => {
  return (
    <Head>
      <>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <link rel="icon" href={siteLogo} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage || siteLogo} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage || siteLogo} />
      </>
    </Head>
  );
};

export { MetaTags };
