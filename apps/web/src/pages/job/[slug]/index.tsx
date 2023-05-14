import useHydrateUserContext from '@hooks/hydrate/user';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';

import type { JobPost } from '~/types/jobpost';

import JobPostPageContent from '../../../apps/(views)/(jobs)/page';
import { siteName } from '../../../apps/data/site';
import Layout from '../../../apps/ui/layout';
import { URLBuilder } from '../../../apps/utils/url';

const Slug: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  useHydrateUserContext();
  return (
    <Layout
      title={`${props.title} | ${props.user.name} | ${siteName}`}
      description={props.description || `${props.user.name} на ${siteName}`}
    >
      <JobPostPageContent {...props} />
    </Layout>
  );
};

export default Slug;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(URLBuilder('/static/job-posts'));
  if (!res.ok) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
  return {
    paths: (await res.json()).map(
      (p: { slug: string; user: { username: string } }) => ({
        params: {
          username: p.user.username,
          slug: p.slug,
        },
      })
    ),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<JobPost> = async ({ params }) => {
  const { username } = params!;
  const { slug } = params!;
  const data = await fetch(URLBuilder(`/job-post/${slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const jobPost = await data.json();
  return {
    props: jobPost,
  };
};
