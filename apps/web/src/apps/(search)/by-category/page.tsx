import { Container } from '@components/container';
import { inter } from '@fonts';
import { Avatar, Badge, Button, Loader, Paper, Tabs } from '@mantine/core';
import { upperFirst, useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useRef } from 'react';

import type { JobPosts } from '~/types/jobpost';

import { routes } from '../../config/routes';
import { profileImageRouteGenerator } from '../../utils/profile';
import { assetURLBuilder, URLBuilder } from '../../utils/url';

dayjs.locale(ru);

export default function SearchByCategoryPageContent(props: any) {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JobPosts>({
      queryKey: ['category', props.id, props.name],
      queryFn: async ({ pageParam = 10 }) => {
        return axios
          .get(
            URLBuilder(
              `/categories/${props.slug}/${
                query.tab ?? 'services'
              }?take=${pageParam}`
            )
          )
          .then((e) => e.data);
      },
      getNextPageParam: (lastPage) => lastPage.next,
    });
  const { query, push } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: containerRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting]);

  return (
    <Container>
      <h1
        className={clsx('mb-8 text-center text-4xl font-bold', {
          [inter.className]: true,
        })}
      >
        {upperFirst(props.name)}
      </h1>
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        Мы нашли
        <Badge
          variant="light"
          color="green"
          className="cursor-pointer"
          onClick={() => {
            push(routes.searchCategory(query.slug as string, 'services'));
          }}
        >
          {props.services} {props.services > 1 ? 'Улугу' : 'Услуг'}
        </Badge>
        <Badge
          variant="light"
          color="green"
          className="cursor-pointer"
          onClick={() => {
            push(routes.searchCategory(query.slug as string, 'jobs'));
          }}
        >
          {props.jobs} {props.jobs > 1 ? 'Заказов' : 'Заказ'}
        </Badge>
      </div>
      <Tabs
        defaultValue={(query.tab as string) ?? 'services'}
        onTabChange={(d) => {
          push(routes.searchCategory(query.slug as string, d as any));
        }}
        className="mt-10"
      >
        <Tabs.List grow>
          <Tabs.Tab value="services">Услуги</Tabs.Tab>
          <Tabs.Tab value="jobs">Заказы</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="services">
          {status === 'loading' && (
            <div className="mt-20 flex flex-col items-center justify-center">
              <Loader />
            </div>
          )}
          {status === 'error' && <div>Что-то пошло не так...</div>}
          {status === 'success' && (
            <>
              {data?.pages.map((p, index) => (
                <Fragment key={index}>
                  {p.posts.map((post) => (
                    <div key={post.id} className="flex flex-col">
                      <Paper
                        withBorder
                        radius="md"
                        p="md"
                        my="sm"
                        className={clsx('cursor-pointer')}
                        component={Link}
                        href={`/service/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex flex-row ">
                          <div className="flex flex-row items-center">
                            <Avatar
                              src={
                                post.user.avatarUrl
                                  ? assetURLBuilder(post.user.avatarUrl)
                                  : profileImageRouteGenerator(
                                      post.user.username
                                    )
                              }
                              size="md"
                              radius="xl"
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-2 flex flex-col">
                              <span className="font-bold">
                                {post.user.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                @{post.user.username}
                              </span>
                            </div>
                          </div>
                          <div className="ml-auto flex flex-row items-center">
                            <span
                              className={clsx('ml-4 text-sm text-gray-500')}
                            >
                              {dayjs(post.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                        <p className="ml-12 truncate text-lg font-semibold">
                          {post.title}
                        </p>
                        <div className="mt-2 flex flex-row  gap-2">
                          {post.tags.map((t) => (
                            <Badge key={t.id} color="green" variant="light">
                              #{t.name}
                            </Badge>
                          ))}
                        </div>
                      </Paper>
                    </div>
                  ))}
                </Fragment>
              ))}
              <div className="" ref={containerRef}>
                <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
              </div>
              {hasNextPage && (
                <Button
                  color="black"
                  className={clsx('bg-gray-900 hover:bg-black', {
                    [inter.className]: true,
                  })}
                  onClick={() => fetchNextPage()}
                >
                  Загрузить ещё
                </Button>
              )}
            </>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="jobs">
          {status === 'loading' && (
            <div className="mt-20 flex flex-col items-center justify-center">
              <Loader />
            </div>
          )}
          {status === 'error' && <div>Что-то пошло не так...</div>}
          {status === 'success' && (
            <>
              {data?.pages.map((p, index) => (
                <Fragment key={index}>
                  {p.posts.map((post) => (
                    <div key={post.id} className="flex flex-col">
                      <Paper
                        withBorder
                        radius="md"
                        p="md"
                        my="sm"
                        className={clsx('cursor-pointer')}
                        component={Link}
                        href={`/job/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex flex-row ">
                          <div className="flex flex-row items-center">
                            <img
                              src={
                                post.user.avatarUrl
                                  ? assetURLBuilder(post.user.avatarUrl)
                                  : profileImageRouteGenerator(
                                      post.user.username
                                    )
                              }
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-2 flex flex-col">
                              <span className="font-bold">
                                {post.user.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                @{post.user.username}
                              </span>
                            </div>
                          </div>
                          <div className="ml-auto flex flex-row items-center">
                            <span
                              className={clsx('ml-4 text-sm text-gray-500')}
                            >
                              {dayjs(post.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                        <p className="ml-12 truncate text-lg font-semibold">
                          {post.title}
                        </p>
                        <div className="mt-2 flex flex-row  gap-2">
                          {post.tags.map((t) => (
                            <Badge key={t.id} color="green" variant="light">
                              #{t.name}
                            </Badge>
                          ))}
                        </div>
                      </Paper>
                    </div>
                  ))}
                </Fragment>
              ))}
              <div className="" ref={containerRef}>
                <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
              </div>
              {hasNextPage && (
                <Button
                  color="black"
                  className={clsx('bg-gray-900 hover:bg-black', {
                    [inter.className]: true,
                  })}
                  onClick={() => fetchNextPage()}
                >
                  Загрузить ещё
                </Button>
              )}
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
