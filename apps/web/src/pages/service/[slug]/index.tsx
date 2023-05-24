import { Container } from '@components/container';
import { sanitize } from '@components/tabs/profile/services';
import { inter } from '@fonts';
import useHydrateUserContext from '@hooks/hydrate/user';
import useIssueNewAuthToken from '@hooks/jwt';
import { useUser } from '@hooks/user';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Image,
  Select,
  Table,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { openModal } from '@mantine/modals';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';
import clsx from 'clsx';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import type { Service } from '~/types/service';

import { routes } from '../../../apps/config/routes';
import { siteName } from '../../../apps/data/site';
import { PostCard } from '../../../apps/ui/card/post';
import { MetaTags } from '../../../apps/ui/meta-tags';
import { readCookie } from '../../../apps/utils/cookie';
import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

// @ts-ignore
const Modal = ({ username, props, p }) => {
  const [send, setSend] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState<string | null>(null);
  const { push, asPath } = useRouter();

  const { id, userType } = useUser();

  useEffect(() => {
    try {
      if (
        username &&
        username !== props.user.username &&
        userType === 'Client'
      ) {
        axios
          .get(URLBuilder(`/job-post/user/${username}?take=10`))
          .then((e) => {
            setJobs(
              e.data.posts.map((s: any) => ({
                label: s.title,
                value: s.id,
              }))
            );
          });
      }
    } catch {
      /* empty */
    }
  }, [userType, username]);

  return (
    <div
      className={clsx('', {
        [inter.className]: true,
      })}
    >
      <Text>
        {send
          ? `Предложено`
          : `Вы действительно хотите нанять ${props.user.name}?`}
      </Text>
      <Text>
        {send
          ? 'Предложено'
          : `Выбранный тариф услуг будет стоить ${p.price} рублей.`}
      </Text>
      <div className="my-2 style={{ width: '100%', overflow: 'visible' }}">
        <Select
          label="Выберите заказ"
          data={jobs}
          onChange={(e) => setJob(e)}
          value={job}
          style={{ width: '100%' }}
          // menuStyle={{ overflow: 'visible' }}
          // optionStyle={{ whiteSpace: 'normal' }}
        />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Button
          disabled={send}
          variant="default"
          fullWidth
          className="bg-green-500 text-white hover:bg-green-600"
          onClick={() => {
            if (!username)
              push({
                pathname: routes.auth.signIn,
                query: {
                  to: asPath,
                },
              });
            else {
              const token = readCookie('token');
              axios
                .post(
                  URLBuilder(`/orders`),
                  {
                    job_post_id: job,
                    service_id: props.id,
                    client_id: id,
                    freelancer_id: props.user.id,
                  },
                  {
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then(() => {
                  setSend(true);
                });
            }
          }}
        >
          {send ? 'Предложено' : 'Предложить'}
        </Button>
      </div>
    </div>
  );
};

const ServicePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { username } = useUser();
  useHydrateUserContext();
  useIssueNewAuthToken();

  const [recommendJobs, setrecommendJobs] = useState(3);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  return (
    <Container
      className={clsx('mb-10', {
        [inter.className]: true,
      })}
    >
      <MetaTags
        title={`@${props.user.username} | ${props.user.name} | ${siteName}`}
        description={props.description || `${props.user.name} на ${siteName}`}
        ogImage={assetURLBuilder(props.bannerImage)}
      />
      <Image
        src={
          props.bannerImage.includes('fallback')
            ? '/images/fallback.webp'
            : assetURLBuilder(props.bannerImage)
        }
        alt="Banner Image"
        className="mb-4"
        classNames={{
          image:
            'min-w-[140px] min-h-[140px] max-w-full min-h-full max-h-[512px] rounded-md object-contain w-full',
        }}
      />
      <h1 className="text-center text-2xl font-bold">{props.title}</h1>
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
          <h2 className="text-base font-semibold">{props.user.name}</h2>
          <Text
            color={'dimmed'}
            className={clsx('leading-3', {
              [inter.className]: true,
            })}
          >
            <a
              href={routes.profile(props.user.username)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              @{props.user.username}
            </a>
          </Text>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
          <Badge key={props.category.id}>
            <Link href={routes.searchCategory(props.category.slug)}>
              {props.category.name}
            </Link>
          </Badge>
          {props.tags?.length > 0 ? (
            <div className="my-4 flex flex-row flex-wrap items-center justify-center gap-2">
              {props.tags?.map((t) => (
                <Badge variant="light" key={t.id} color="green">
                  <Link href={routes.searchCategory(props.category.slug)}>
                    #{t.name}
                  </Link>
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
        {props.images.length > 0 ? (
          <Carousel
            centerMode
            dynamicHeight
            emulateTouch
            useKeyboardArrows
            showArrows
            showThumbs={false}
            swipeable
          >
            {props.images.map((i) => (
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
                    src={assetURLBuilder(i)}
                    alt="Image"
                    className="max-h-[512px] cursor-pointer"
                    classNames={{
                      image: 'rounded-md max-h-[512px]',
                    }}
                    onClick={() => {
                      window.open(assetURLBuilder(i));
                    }}
                  />
                )}
              </div>
            ))}
          </Carousel>
        ) : null}

        <Text className={'font-bold'}>О себе</Text>

        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
        <TypographyStylesProvider>
          <div
            className="prose max-w-full break-all "
            dangerouslySetInnerHTML={sanitize(props.description, undefined)}
          />
        </TypographyStylesProvider>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />

        <Text className={'font-bold'}>Опыт работы</Text>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
        <TypographyStylesProvider>
          <div
            className="prose max-w-full break-all "
            dangerouslySetInnerHTML={sanitize(props.workExp, undefined)}
          />
        </TypographyStylesProvider>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />

        <Text className={'font-bold'}>Навыки</Text>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
        <TypographyStylesProvider>
          <div
            className="prose max-w-full break-all "
            dangerouslySetInnerHTML={sanitize(props.skills, undefined)}
          />
        </TypographyStylesProvider>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />

        <Text className={'font-bold'}>Стеки технологий</Text>
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
        <TypographyStylesProvider>
          <div
            className="prose max-w-full break-all "
            dangerouslySetInnerHTML={sanitize(props.technologies, undefined)}
          />
        </TypographyStylesProvider>
      </div>
      <Divider orientation="horizontal" className={clsx('my-4 w-full')} />

      <Text
        className={clsx('mb-4 text-center text-2xl font-bold', {
          [inter.className]: true,
        })}
        id="packages-offered"
      >
        Тарифы
      </Text>

      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th />
            {props.package.map((p) => (
              <th key={p.id}>{upperFirst(p.name)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Описание</td>
            {props.package.map((p) => (
              <td key={p.id}>{p.description || 'Не предоставлено'}</td>
            ))}
          </tr>
          <tr>
            <td>Срок</td>
            {props.package.map((p) => (
              <td key={p.id}>
                {p.deliveryDays} {p.deliveryDays > 1 ? 'дней' : 'день'}
              </td>
            ))}
          </tr>
          <tr>
            <td>Что включено</td>
            {props.package.map((p) => (
              <td key={p.id}>
                {p.features.map((f) => (
                  <div key={f.id}>
                    {f.includedIn.includes(p.name) ? (
                      <div className="flex flex-row items-center gap-2">
                        <IconCheck size={13} color="green" />
                        <span>{f.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <IconX size={13} color="red" />
                        <span>{f.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            <td>Цена</td>
            {props.package.map((p) => (
              <td key={p.id}>
                <span className="text-[18px] font-semibold">{p.price}</span>
              </td>
            ))}
          </tr>
          {props.user.username !== username ? (
            <tr>
              <td>Действия</td>
              {props.package.map((p) => (
                <td key={p.id}>
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    disabled={username === props.user.username}
                    onClick={() => {
                      openModal({
                        children: (
                          <Modal props={props} p={p} username={username} />
                        ),
                        centered: true,
                      });
                    }}
                    color="black"
                    className={clsx(
                      'rounded-md bg-gray-900 text-white transition-all duration-[110ms] hover:scale-105 hover:bg-black',
                      {
                        [inter.className]: true,
                        'cursor-not-allowed': username === props.user.username,
                      }
                    )}
                  >
                    Сотрудничать
                  </Button>
                </td>
              ))}
            </tr>
          ) : null}
        </tbody>
      </Table>

      {props.user.username === username ? (
        <div className={'w-full items-center justify-center text-center'}>
          {props.recommendJobs.length > 0 ? (
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
                Рекомендованные заказы
              </Text>
              <div className="grid gap-[12px] md:grid-cols-3">
                {props.recommendJobs
                  .slice(
                    0,
                    showAllRecommendations
                      ? props.recommendJobs.length
                      : recommendJobs
                  )
                  .map((post) => (
                    <PostCard
                      {...post}
                      type="job"
                      badgeLabel={post.category.name}
                      tags={post.tags
                        .map((e: any) => e.name)
                        .sort((a: any, b: any) => a.length - b.length)}
                      key={post.slug}
                      image={
                        post.bannerImage?.includes('fallback')
                          ? '/images/fallback.webp'
                          : post.bannerImage
                      }
                    />
                  ))}
              </div>
              {!showAllRecommendations && (
                <div className="flex justify-center">
                  {/* <div className="items-right flex mr-4">
                    <Button
                      className="mx-auto mt-3 bg-blue-500"
                      onClick={() => {
                        setrecommendJobs((prevState) => prevState + 3);
                      }}
                    >
                      Мне ничего не подошло
                    </Button>
                  </div> */}
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
                Рекомендованные заказы
              </Text>
              Мы ничего не нашли...
            </>
          )}
        </div>
      ) : null}
    </Container>
  );
};

export default ServicePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await (await fetch(URLBuilder('/static/services'))).json();
  return {
    fallback: 'blocking',
    paths: data.map((g: any) => ({
      params: {
        username: g.user.username,
        slug: g.slug,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<
  Service & { recommendJobs: any[] }
> = async ({ params }) => {
  const { slug } = params!;

  const data = await fetch(URLBuilder(`/services/${slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const service = await data.json();
  return {
    props: service,
  };
};
