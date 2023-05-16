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
  Table,
  Text,
  Tooltip,
  TypographyStylesProvider,
} from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { openModal } from '@mantine/modals';
import { IconCheck, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import type { Service } from '~/types/service';

import { routes } from '../../../apps/config/routes';
import { siteName } from '../../../apps/data/site';
import { PostCard } from '../../../apps/ui/card/post';
import { MetaTags } from '../../../apps/ui/meta-tags';
import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

const Modal = ({ username, props, p }) => {
  const [send, setSend] = useState(false);
  const { push, asPath } = useRouter();

  return (
    <div
      className={clsx('', {
        [inter.className]: true,
      })}
    >
      <Text>
        {send
          ? `Email для связи с ${props.user.name}`
          : `Вы действительно хотите нанять ${props.user.name}?`}
      </Text>
      <Text>{send ? props.user.email : `Выбранный пакет услуг будет стоить ${p.price} рублей.`}</Text>
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
              setSend(true);
            }
            // axios
            //   .post<{
            //     id: string;
            //     amount: string;
            //     discounted: boolean;
            //   }>(
            //     URLBuilder('/order/create'),
            //     {
            //       packageId: p.id,
            //       sellerUsername: props.user.username,
            //     },
            //     {
            //       headers: {
            //         authorization: `Bearer ${readCookie(
            //           'token'
            //         )}`,
            //       },
            //     }
            //   )
            //   .then((d) => d.data)
            //   .catch((err) => {
            //     notifyAboutError(err);
            //   });
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
          <h2 className="text-base font-semibold">
            {props.user.name}
            {props.user.verified ? (
              <Tooltip label="Verified User" withArrow>
                <Badge
                  color="green"
                  variant="light"
                  className="ml-2 rounded-full"
                >
                  <div className="flex flex-row flex-nowrap items-center justify-center">
                    <IconCheck />
                  </div>
                </Badge>
              </Tooltip>
            ) : null}
          </h2>
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
        <Divider orientation="horizontal" className={clsx('my-4 w-full')} />

        <TypographyStylesProvider>
          <div
            className="prose max-w-full break-all "
            dangerouslySetInnerHTML={sanitize(props.description, undefined)}
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
        Пакеты
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

      {props.recommendJobs.length > 0 && (
        <>
          <Text
            className={clsx('my-4 text-center text-2xl font-bold', {
              [inter.className]: true,
            })}
          >
            Предложенные заказы
          </Text>
          <div className="grid gap-[12px] md:grid-cols-3">
            {props.recommendJobs.map((post) => (
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
        </>
      )}
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
