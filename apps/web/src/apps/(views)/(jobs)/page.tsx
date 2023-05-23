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
import { IconCheck } from '@tabler/icons-react';
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
        <div className="flex items-center justify-between gap-6">
          <h1 className="break-all text-3xl font-bold">{props.title}</h1>
          {username !== props.user.username &&
            userType === 'Freelancer' &&
            !send &&
            services.length > 0 && (
              <>
                {!choice && (
                  <Button
                    variant="filled"
                    className="bg-black text-white"
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
                    />
                    <Button
                      variant="filled"
                      className="bg-black text-white"
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
        {props.budget && (
          <Tooltip label={`Бюджет этого заказа составляет ${props.budget}`}>
            <Badge variant="light" className="mt-2">
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
            <Badge variant="light" className="mt-2">
              дедлайн: {new Date(props.deadline).toLocaleDateString()}
            </Badge>
          </Tooltip>
        )}
        <div className="mt-2 flex flex-row flex-wrap items-center justify-center">
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
                <h2 className="text-base font-semibold">
                  {props.user.name}
                  {props.user.verified && (
                    <Tooltip label="Подтвержденный пользователь" withArrow>
                      <Badge
                        color="green"
                        variant="light"
                        className="ml-2 rounded-full"
                      >
                        <div className="flex flex-row flex-nowrap items-center justify-center">
                          <IconCheck color="green" size={15} />
                        </div>
                      </Badge>
                    </Tooltip>
                  )}
                </h2>
                <Link
                  href={routes.profile(props.user.username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-3 text-blue-500  hover:underline"
                >
                  @{props.user.username}
                </Link>
              </div>

              {send && (
                <div className="ml-24 flex flex-col">
                  <Tooltip label={`Статус`}>
                    <Badge
                      className="w-fit"
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
        <p className="prose w-full max-w-full break-words text-xl">
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
          <tr>
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
                  Предложенные услуги
                </Text>
                <div className="grid gap-[12px] md:grid-cols-3">
                  {props.recommendServices
                    .slice(
                      recommendService > 3 ? recommendService - 3 : 0,
                      recommendService
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
                {props.recommendServices.length > recommendService && (
                  <Button
                    className="mx-auto mt-3 bg-black"
                    onClick={() => {
                      setRecommendService((prevState) => prevState + 3);
                    }}
                  >
                    Мне ничего не подошло
                  </Button>
                )}
              </>
            ) : (
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
                  Предложенные услуги
                </Text>
                Мы ничего не нашли...
              </>
            )}
          </tr>
        ) : null}
      </div>
    </Container>
  );
}
