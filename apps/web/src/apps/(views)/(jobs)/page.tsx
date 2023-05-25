/* eslint-disable no-nested-ternary */
import { Container } from '@components/container';
import { inter } from '@fonts';
import { useUser } from '@hooks/user';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Image,
  MultiSelect,
  Paper,
  Select,
  Text,
  Tooltip,
} from '@mantine/core';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { routes } from '../../config/routes';
import { PostCard } from '../../ui/card/post';
import { readCookie } from '../../utils/cookie';
import { profileImageRouteGenerator } from '../../utils/profile';
import { assetURLBuilder, URLBuilder } from '../../utils/url';

async function fetchPosts(
  type: any,
  category: any,
  tags: any[],
  page: any,
  price: [number, number],
  until: Date
) {
  return axios
    .get(
      URLBuilder(
        `/posts?type=${type}category=${category}&price=${Number(
          price[0]
        )}&price=${Number(price[1])}&until=${until}&tags=${tags.join(
          ','
        )}&page=${page}`
      )
    )
    .then((e) => e.data);
}

export default function JobPostPageContent(props: any) {
  const [send, setSend] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [choice, setChoice] = useState(false);
  const [services, setServices] = useState([]);
  const [service, setService] = useState<string | null>(null);
  const { id, userType, username } = useUser();
  const [recommendService, setRecommendService] = useState(3);
  const [loading, setLoading] = useState(false);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  useEffect(() => {
    try {
      if (
        username &&
        username !== props.user.username &&
        userType === 'Freelancer'
      ) {
        axios
          .get(URLBuilder(`/services/user/${username}?take=10`))
          .then((e) => {
            setServices(
              e.data.services.map((s: any) => ({
                label: s.title,
                value: s.id,
              }))
            );
          });
      }
    } catch {}
  }, [userType, username]);

  useEffect(() => {
    if (
      username &&
      username !== props.user.username &&
      userType === 'Freelancer'
    ) {
      const my = props.orders.find((e: any) => e.freelancerId === id);
      if (my) {
        setSend(true);
        setStatus(my.status);
      }
    }
  }, [id, userType, username]);

  useEffect(() => {
    if (username && username === props.user.username && userType === 'Client') {
      const my = props.orders.find((e: any) => e.clientId === id);
      if (my) {
        setSend(true);
        setStatus(my.status);
      }
    }
  }, [id, userType, username]);

  // search
  const type = 'service';
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<any[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 10000]);
  const [until, setUntil] = useState(new Date(2034, 1));

  const { data: categoriesOptions } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get(URLBuilder('/categories'));
      return res.data;
    },
  });

  const { data: tagsOptions } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await axios.get(URLBuilder('/tags'));
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

  const recommendServicesSlice = props.recommendServices.slice(
    0,
    showAllRecommendations ? props.recommendServices.length : recommendService
  );

  const { data, isLoading, isError } = useInfiniteQuery(
    ['posts', type, category, tags, price, until],
    ({ pageParam = 1 }) =>
      fetchPosts(type, category, tags, pageParam, price, until)
  );

  return (
    <Container
      className={clsx('container', {
        [inter.className]: true,
      })}
      mb="xl"
    >
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col flex-wrap items-center gap-2">
          <h1 className="break-all text-3xl font-bold">{props.title}</h1>
          {props.budget && (
            <Tooltip label={`Бюджет этого заказа составляет ${props.budget}`}>
              <Badge variant="light" className="mt-1">
                бюджет: {props.budget} руб.
              </Badge>
            </Tooltip>
          )}
          {props.deadline && (
            <Tooltip
              label={`Необходимо выполнить этот проект до ${new Date(
                props.deadline
              ).toLocaleDateString()}`}
            >
              <Badge variant="light" className="mt-1">
                дедлайн: {new Date(props.deadline).toLocaleDateString()}
              </Badge>
            </Tooltip>
          )}

          {username !== props.user.username &&
            userType === 'Freelancer' &&
            !send &&
            services.length > 0 && (
              <>
                {!choice && (
                  <Button
                    variant="filled"
                    className="mt-2 bg-blue-500 text-white"
                    onClick={() => setChoice(true)}
                  >
                    Сотрудничать
                  </Button>
                )}
                {choice && (
                  <>
                    <Select
                      data={services}
                      onChange={(e) => setService(e)}
                      value={service}
                      searchable
                      className="w-full"
                    />
                    <Button
                      variant="filled"
                      className="bg-blue-500 text-white"
                      disabled={!service || loading}
                      onClick={() => {
                        setLoading(true);
                        const token = readCookie('token');
                        axios
                          .post(
                            URLBuilder(`/orders`),
                            {
                              job_post_id: props.id,
                              service_id: service,
                              client_id: props.user.id,
                              freelancer_id: id,
                            },
                            {
                              headers: {
                                authorization: `Bearer ${token}`,
                              },
                            }
                          )
                          .then(() => {
                            setStatus('Response');
                            setChoice(false);
                            setSend(true);
                            setLoading(false);
                          });
                      }}
                    >
                      Отправить отклик
                    </Button>
                  </>
                )}
              </>
            )}
        </div>
        {/* {(props.orders.find((props: any) => props.jobPostId === id).status && (
          <Tooltip
            label={`Статус этого заказа ${props.orders.find((props: any) => props.jobPostId === id).status}`}
          >
            <Badge variant="light" className="mt-2">
              {props.orders.find((props: any) => props.jobPostId === id).status}
            </Badge>
          </Tooltip>
        )} */}
        {send && (
          <div>
            <Tooltip label={`Статус`}>
              <Badge
                variant="light"
                className="mt-3"
                color={
                  status === 'Response'
                    ? 'yellow'
                    : status === 'Accepted'
                    ? 'blue'
                    : status === 'Canceled'
                    ? 'red'
                    : 'green'
                }
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {status === 'Response'
                  ? 'Предложено'
                  : // eslint-disable-next-line no-nested-ternary
                  status === 'Accepted'
                  ? 'Выполняется'
                  : status === 'Canceled'
                  ? 'Отклонено'
                  : 'Выполнено'}
              </Badge>
            </Tooltip>
          </div>
        )}

        <div className="mt-3 flex flex-row flex-wrap items-center justify-center">
          <Avatar
            src={
              props.user.avatarUrl &&
              !props.user.avatarUrl.includes('fallback') &&
              !props.user.avatarUrl.includes('cloudflare-ipfs')
                ? assetURLBuilder(props.user.avatarUrl)
                : profileImageRouteGenerator(props.user.username)
            }
            size="md"
            radius="xl"
          />
          <div className="ml-2 flex flex-col">
            <Text
              color={'dimmed'}
              className={clsx('flex items-center justify-center gap-6', {
                [inter.className]: true,
              })}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-base font-semibold">{props.user.name}</h2>
                <Link
                  href={routes.profile(props.user.username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-3 text-blue-500  hover:underline"
                >
                  @{props.user.username}
                </Link>
              </div>
            </Text>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
          <Badge key={props.category.id}>
            <Link href={routes.searchCategory(props.category.slug)}>
              {props.category.name}
            </Link>
          </Badge>
          <div className="mt-4 flex flex-row  flex-wrap items-center justify-center gap-2">
            {props.tags.map((t: any, index: number) => (
              <Badge variant="light" key={index} color="green">
                <a href={`/t/${t.slug}`}>#{t.name}</a>
              </Badge>
            ))}
          </div>
        </div>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
        <p className="prose max-w-full text-center">
          {props.description}
        </p>

        {props.images.length > 0 && (
          <>
            <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
            <div className="flex flex-col flex-wrap items-center justify-center gap-2">
              <h2 className="text-xl font-semibold">
                Прикрепленные изображения
              </h2>
              <Carousel
                centerMode
                dynamicHeight
                emulateTouch
                useKeyboardArrows
                showArrows
                showThumbs={false}
                swipeable
              >
                {props.images.map((i: any) => (
                  <div key={assetURLBuilder(i)}>
                    {i.endsWith('.mp4') ? (
                      <video
                        src={assetURLBuilder(i)}
                        className="my-6 max-h-[512px] cursor-pointer"
                        controls
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    ) : (
                      <Image
                        src={
                          i.includes('fallback')
                            ? '/images/fallback.webp'
                            : assetURLBuilder(i)
                        }
                        alt="Image"
                        height={512}
                        className="max-h-[512px] cursor-pointer"
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            </div>
          </>
        )}

        {props.user.username === username ? (
          <div className={'w-full items-center text-center'}>
            {userType !== 'Freelancer' && props.recommendServices.length > 0 ? (
              <>
                <Divider
                  orientation="horizontal"
                  className={clsx('my-4 w-full')}
                />
                <Text
                  className={clsx('my-4 text-center text-2xl font-bold', {
                    [inter.className]: true,
                  })}
                >
                  Рекомендованные услуги
                </Text>
                {showAllRecommendations && (
                  <Paper
                    p="md"
                    shadow="xs"
                    className="mb-[24px] flex-wrap gap-4"
                  >
                    <div className="flex gap-4">
                      <Select
                        className="w-full"
                        placeholder="Выберите категорию"
                        value={category}
                        searchable
                        onChange={(value) => setCategory(value as string)}
                        data={
                          categoriesOptions?.map((e) => ({
                            value: e.id,
                            label: e.name,
                          })) ?? []
                        }
                      />
                      <MultiSelect
                        className="w-full"
                        placeholder="Выберите тэги"
                        searchable
                        value={tags}
                        onChange={(value) => setTags(value)}
                        data={
                          tagsOptions?.map((e) => ({
                            value: e.id,
                            label: e.name,
                          })) ?? []
                        }
                      />
                      {/* <DatePickerInput
                        placeholder="Укажите дедлайн"
                        mx="auto"
                        maw={400}
                        className={'w-full items-center'}
                        allowDeselect
                        onChange={(e) => setUntil(e ?? new Date(2034, 1))}
                      />
                    </div>
*/}
                      {/* <div className="mt-3 flex flex-col gap-4">
                      <Text>Цена</Text>
                      <div className="flex">
                        <RangeSlider
                          value={price}
                          step={100}
                          onChange={(value) =>
                            setPrice(value as [number, number])
                          }
                          marks={[
                            { value: 0, label: '0' },
                            { value: 100000, label: '100000' },
                          ]}
                          max={100000}
                          className={'h-[30px] w-[50%]'}
                        />
                      </div> */}
                    </div>
                  </Paper>
                )}

                {isLoading && <p>Загрузка...</p>}
                {isError && <p>Что-то пошло не так...</p>}

                {!isLoading && !isError && (
                  <div className="grid gap-[12px] md:grid-cols-3">
                    {recommendServicesSlice
                      .filter((post: any) => {
                        // Filter by category
                        if (category && post.category.id !== category) {
                          return false;
                        }

                        // Filter by tags
                        /* if (tags.length > 0) {
                          const postTags = post.tags.map((tag: any) => tag.id);
                          if (
                            !tags.some((tag: any) => postTags.includes(tag))
                          ) {
                            return false;
                          }
                        }

                        // Filter by price
                        const [minPrice, maxPrice] = price;
                        const postPrice = post.price || 0;
                        if (postPrice < minPrice || postPrice > maxPrice) {
                          return false;
                        } */

                        // Filter by until date
                        const postUntil = new Date(post.until);
                        if (postUntil > until) {
                          return false;
                        }

                        return true;
                      })
                      .map((post: any) => (
                        <PostCard
                          {...post}
                          type="service"
                          badgeLabel={post.category.name}
                          price={post.budget}
                          tags={post.tags
                            .map((e: any) => e.name)
                            .sort((a: any, b: any) => a.length - b.length)}
                          key={post.slug}
                          image={
                            post.bannerImage.includes('fallback')
                              ? '/images/fallback.webp'
                              : post.bannerImage
                          }
                        />
                      ))}
                  </div>
                )}
                {!showAllRecommendations && (
                  <div className="flex justify-between">
                    {/* <Button
                      className="mx-auto mt-3 bg-blue-500"
                      onClick={() => {
                        setRecommendService((prevState) => prevState + 3);
                      }}
                    >
                      Мне ничего не подошло
                    </Button> */}
                    <Button
                      className="mx-auto mt-3 bg-blue-500"
                      onClick={() => {
                        setShowAllRecommendations(true);
                      }}
                    >
                      Показать все
                    </Button>
                  </div>
                )}
              </>
            ) : userType !== 'Freelancer' && status === 'Done' ? (
              <>
                <Divider
                  orientation="horizontal"
                  className={clsx('my-4 w-full')}
                />
                <Text
                  className={clsx('mb-4 text-center text-2xl font-bold', {
                    [inter.className]: true,
                  })}
                >
                  Рекомендованные услуги
                </Text>
                Тут ничего нет, потому что заказ уже был выполнен :)
              </>
            ) : (
              <>
                <Divider
                  orientation="horizontal"
                  className={clsx('my-4 w-full')}
                />
                <Text
                  className={clsx('mb-4 text-center text-2xl font-bold', {
                    [inter.className]: true,
                  })}
                >
                  Рекомендованные услуги
                </Text>
                Мы ничего не нашли...
              </>
            )}
          </div>
        ) : null}
      </div>
    </Container>
  );
}
