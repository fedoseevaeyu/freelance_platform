import { inter, montserrat } from '@fonts';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Image,
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
import type { IOptions } from 'sanitize-html';
import sanitizeHtml from 'sanitize-html';

import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

dayjs.extend(relativeTime);

const defaultOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a'],
  allowedAttributes: {
    a: ['href'],
  },
  allowedIframeHostnames: ['www.youtube.com'],
};

export const sanitize = (dirty: string, options: IOptions | undefined) => ({
  __html: sanitizeHtml(dirty, { ...defaultOptions, ...options }),
});

interface Props {
  username: string;
}
const ServicesTab = ({ username }: Props) => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{
    services: {
      id: string;
      user: {
        username: string;
        name: string;
        avatarUrl: string;
      };
      createdAt: string;
      title: string;
      tags: { name: string; id: string; slug: string }[];
      slug: true;
      description: string;
      package: [
        {
          price: number;
        }
      ];
      rating: number;
      bannerImage: string;
      ratedBy: number;
    }[];
    next?: number;
  }>({
    queryKey: ['services', username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/services/user/${username}?take=${pageParam}`)
      );
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
  return (
    <div>
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
          {page.services?.map((service) => (
            <Paper key={service.id} withBorder shadow={'md'} radius="md">
              <Image
                src={
                  service.bannerImage.includes('fallback')
                    ? '/images/fallback.webp'
                    : assetURLBuilder(service.bannerImage)
                }
                width="100%"
                height={'100%'}
                alt="Service Banner"
                classNames={{
                  image: 'rounded-t-md',
                }}
              />
              <Group position="left" mt="md" pl="md">
                <div>
                  <Avatar
                    size="md"
                    src={
                      service.user.avatarUrl
                        ? assetURLBuilder(service.user.avatarUrl)
                        : profileImageRouteGenerator(service.user.username)
                    }
                    radius="xl"
                  />
                </div>
                <div className="flex flex-col">
                  <Text
                    size="md"
                    className={clsx(montserrat.className, 'mb-0')}
                  >
                    {service.user.name}
                  </Text>

                  <Text
                    size="xs"
                    className={clsx(montserrat.className, 'mt-0 leading-3')}
                  >
                    @{service.user.username}{' '}
                  </Text>
                </div>
              </Group>
              <Group mt="sm" className="mb-auto w-full" p="md">
                <Link
                  href={`/service/${service.slug}`}
                  style={{ overflowWrap: 'break-word' }}
                >
                  {service.title}
                </Link>
              </Group>
              <Divider />
              <Group position="apart">
                <div className="flex flex-col p-2 ">
                  <Text size="xs" className={clsx(montserrat.className)}>
                    {service.tags.map((tag) => (
                      <Badge key={tag.id} className="m-1 capitalize">
                        <Text>
                          <span className="text-xs text-black">
                            # {tag.name}{' '}
                          </span>
                        </Text>
                      </Badge>
                    ))}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      ))}
      <div>
        {hasNextPage ? (
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
        ) : null}
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Загрузка...' : null}</div>
      {data?.pages?.[0]?.services?.length === 0 && (
        <div className="container flex w-[100%] flex-col items-center justify-center">
          <p>
            <span className="font-bold">{username}</span> ещё не опубликовал
            свои услуги
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
