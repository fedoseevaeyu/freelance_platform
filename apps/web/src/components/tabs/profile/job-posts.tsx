import { inter, montserrat } from '@fonts';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';

import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

dayjs.extend(relativeTime);

interface Props {
  username: string;
}
const JobPosts = ({ username }: Props) => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{
    posts: Array<{
      user: {
        name: string;
        verified: boolean;
        avatarUrl: string;
        username: string;
      };
      budget: number;
      category: {
        name: string;
        slug: string;
      };
      deadline: string;
      description: string;
      images: Array<any>;
      slug: string;
      title: string;
      tags: Array<{
        name: string;
        slug: string;
        id: string;
      }>;
      createdAt: string;
      id: string;
    }>;
    next?: number;
  }>({
    queryKey: ['job-posts', username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/job-post/user/${username}?take=${pageParam}`)
      );
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
  return (
    <div className={clsx('container')}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data?.pages.map((page, index) => (
        <SimpleGrid
          key={index}
          cols={3}
          verticalSpacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {page.posts?.map((post) => (
            <Paper key={post.id} withBorder shadow={'md'} radius="md">
              <Group position="left" mt="md" pl="md">
                <div>
                  <Avatar
                    size="md"
                    src={
                      post.user.avatarUrl
                        ? assetURLBuilder(post.user.avatarUrl)
                        : profileImageRouteGenerator(post.user.username)
                    }
                    radius="xl"
                  />
                </div>
                <div className="flex flex-col">
                  <Text
                    size="md"
                    className={clsx(montserrat.className, 'mb-0')}
                  >
                    {post.user.name}
                  </Text>

                  <Text
                    size="xs"
                    className={clsx(montserrat.className, 'mt-0 leading-3')}
                  >
                    @{post.user.username}{' '}
                  </Text>
                </div>
              </Group>
              <Group p="md">
                <Link
                  href={`/job/${post.slug}`}
                  className="truncate hover:underline"
                >
                  {post.title}
                </Link>
              </Group>
              {post?.tags?.length > 0 ? (
                <>
                  <Divider />
                  <Group position="apart">
                    <div className="flex flex-col p-2 ">
                      <Text size="xs" className={clsx(montserrat.className)}>
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            className="m-1 bg-yellow-400 capitalize"
                          >
                            <Link href={`/t/${tag.slug}`}>
                              <span className="text-xs text-black">
                                # {tag.name}{' '}
                              </span>
                            </Link>
                          </Badge>
                        ))}
                      </Text>
                    </div>
                  </Group>
                </>
              ) : null}
            </Paper>
          ))}
        </SimpleGrid>
      ))}
      <div>
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            fullWidth
            color="black"
            className={clsx('bg-gray-900 hover:bg-black', {
              [inter.className]: true,
            })}
          >
            Загрузить ещё
          </Button>
        )}
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Загрузка...' : null}</div>
      {data?.pages?.[0]?.posts?.length === 0 && (
        <div className="container flex w-[100%] flex-col items-center justify-center">
          <p>
            <span className="font-bold">{username}</span> ещё не опубликовал
            свои заказы
          </p>
        </div>
      )}
    </div>
  );
};

export default JobPosts;
