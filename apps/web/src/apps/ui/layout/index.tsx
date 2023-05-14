import type { PropsWithChildren } from 'react';
import React from 'react';

import type { MetaTagsProps } from '../meta-tags';
import { MetaTags } from '../meta-tags';
import { Footer } from './footer';

export default function Layout({
  children,
  title,
  ogImage,
  description,
  footer,
}: PropsWithChildren<MetaTagsProps & { footer?: boolean }>) {
  return (
    <>
      <MetaTags title={title} description={description} ogImage={ogImage} />
      {children}
      {footer && <Footer />}
    </>
  );
}
