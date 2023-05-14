import useHydrateUserContext from '@hooks/hydrate/user';
import { upperFirst } from '@mantine/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';

import SearchByCategoryPageContent from '../../apps/(search)/by-category/page';
import { siteName } from '../../apps/data/site';
import Layout from '../../apps/ui/layout';
import { URLBuilder } from '../../apps/utils/url';

dayjs.extend(relativeTime);

const SearchByCategoryPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  useHydrateUserContext();
  return (
    <Layout
      title={`${upperFirst(props.name)} | Категория | ${siteName}`}
      description={`Найдите заказы или усулги по категории ${props.name} на ${siteName}. `}
    >
      <SearchByCategoryPageContent {...props} />
    </Layout>
  );
};

export default SearchByCategoryPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await (await fetch(URLBuilder('/static/categories'))).json();
  return {
    fallback: 'blocking',
    paths: paths.map((p: { slug: string }) => ({
      params: {
        slug: p.slug,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<{
  id: string;
  name: string;
  services: number;
  slug: string;
  jobs: number;
}> = async ({ params }) => {
  const data = await fetch(URLBuilder(`/categories/${params!.slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const category = await data.json();
  return {
    props: {
      ...category,
      slug: params!.slug,
    },
  };
};
