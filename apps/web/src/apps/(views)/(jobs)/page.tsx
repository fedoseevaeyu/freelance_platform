import { Container } from '@components/container';
import { inter } from '@fonts';
import { useUser } from '@hooks/user';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Image,
  Select,
  Text,
  Tooltip,
} from '@mantine/core';
import axios from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { routes } from '../../config/routes';
import { PostCard } from '../../ui/card/post';
import { readCookie } from '../../utils/cookie';
import { profileImageRouteGenerator } from '../../utils/profile';
import { assetURLBuilder, URLBuilder } from '../../utils/url';

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
                {status === 'Response'
                  ? 'Предложено'
                  : status === 'Accepted'
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
        <p className="prose max-w-full break-all text-center">
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
                <div className="grid gap-[12px] md:grid-cols-3">
                  {props.recommendServices
                    .slice(
                      0,
                      showAllRecommendations
                        ? props.recommendServices.length
                        : recommendService
                    )
                    .map((post) => (
                      <PostCard
                        {...post}
                        type="service"
                        badgeLabel={post.category.name}
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
