import { Container } from '@components/container';
import JobPosts from '@components/tabs/profile/job-posts';
import ServicesTab from '@components/tabs/profile/services';
import { inter, montserrat } from '@fonts';
import useHydrateUserContext from '@hooks/hydrate/user';
import { useUser } from '@hooks/user';
import {
  Avatar,
  Badge,
  Button,
  Card,
  FileButton,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconClock, IconMapPin, IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { routes } from '../../../apps/config/routes';
import { countries } from '../../../apps/data';
import { siteName } from '../../../apps/data/site';
import { MetaTags } from '../../../apps/ui/meta-tags';
import { readCookie } from '../../../apps/utils/cookie';
import { notifyAboutError } from '../../../apps/utils/error';
import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { uploadFiles } from '../../../apps/utils/upload';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

dayjs.locale(ru);

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const [isEdit, setIsEdit] = useState(false);
  const { username } = useUser();
  const editable = username === props.username;
  useHydrateUserContext();

  const updateState = useHydrateUserContext(
    'replace',
    true,
    routes.auth.signIn
  );
  const { data, isLoading, refetch } = useQuery<{
    bio: string;
    name: string;
    aboutMe: string;
    country: string;
    avatarUrl: string;
  }>({
    queryKey: ['account'],
    queryFn: async () => {
      return fetch(URLBuilder(`/profile?settings=true`), {
        headers: {
          authorization: `Bearer ${readCookie('token')}`,
        },
      }).then((res) => res.json());
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const formState = useForm({
    initialValues: {
      bio: '',
      name: '',
      aboutMe: '',
      country: '',
      avatarUrl: '',
      imageSelected: false,
    },
  });

  const [avatar, setAvatar] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      formState.setValues({
        name: data!.name,
        bio: data!.bio,
        country: data!.country,
        avatarUrl: data!.avatarUrl,
      });
      formState.resetDirty();
    }
  }, [data, isLoading]);

  const [loading, setLoading] = useState(false);

  if (isEdit) {
    return (
      <div className={inter.className}>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <MetaTags
          title={`${props.name} | @${props.username} | ${siteName}`}
          description={props.bio || `${props.name} на ${siteName}`}
        />
        <div className="flex flex-row flex-wrap items-center justify-evenly">
          <div className="h-52 w-full bg-[#e0f3ff]" />
          <Paper
            withBorder
            p="xl"
            radius={'md'}
            style={{
              flex: 0.3,
            }}
            className="mt-[-50px] lg:min-w-[50%]"
          >
            <div className="flex flex-col items-center justify-center">
              <FileButton
                onChange={(d) => {
                  if (d) {
                    setAvatar(d);
                    formState.setFieldValue('imageSelected', true);
                  }
                }}
                accept={'image/*'}
              >
                {({ onClick }) => (
                  <Avatar
                    src={
                      formState.values.imageSelected && avatar
                        ? URL.createObjectURL(avatar)
                        : formState.values.avatarUrl
                        ? assetURLBuilder(formState.values.avatarUrl)
                        : profileImageRouteGenerator(username)
                    }
                    size={150}
                    className={clsx('cursor-pointer')}
                    radius={'50%' as any}
                    onClick={onClick}
                  />
                )}
              </FileButton>
              <div className="flex w-full flex-col items-center justify-center">
                <form
                  onReset={() => setIsEdit(false)}
                  onSubmit={formState.onSubmit(async (d) => {
                    setLoading(true);
                    let url: string | undefined;
                    if (avatar) {
                      const urls = await uploadFiles(
                        [avatar],
                        readCookie('token')!
                      ).catch((err) => {
                        notifyAboutError(err);
                        setLoading(false);
                        return null;
                      });
                      if (urls === null) return;
                      url = urls.paths[0];
                    }

                    axios
                      .post(
                        URLBuilder('/profile/update'),
                        {
                          name: d.name || undefined,
                          bio: d.bio || undefined,
                          country: d.country || undefined,
                          avatarUrl: url || d.avatarUrl || undefined,
                        },
                        {
                          headers: {
                            authorization: `Bearer ${readCookie('token')}`,
                          },
                        }
                      )
                      .then(() => {
                        showNotification({
                          message: 'Профиль обновлен',
                          color: 'green',
                        });
                        formState.resetDirty();
                        setAvatar(undefined);
                        updateState();
                        setIsEdit(false);
                        refetch();
                      })
                      .catch((err) => {
                        notifyAboutError(err);
                        return null;
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  })}
                  className="mt-8 flex flex-row gap-4"
                >
                  <TextInput
                    label="Имя"
                    {...formState.getInputProps('name')}
                    labelProps={{
                      className: clsx({
                        [inter.className]: true,
                      }),
                    }}
                    classNames={{
                      input: 'h-[44px]',
                    }}
                  />
                  <TextInput
                    label="Обо мне"
                    {...formState.getInputProps('bio')}
                    labelProps={{
                      className: clsx({
                        [inter.className]: true,
                      }),
                    }}
                    classNames={{
                      input: 'h-[44px]',
                    }}
                  />
                  <Select
                    data={countries}
                    label="Страна"
                    labelProps={{
                      className: clsx({
                        [inter.className]: true,
                      }),
                    }}
                    placeholder="Выберите страну"
                    {...formState.getInputProps('country')}
                    classNames={{
                      input: 'z-[100] h-[44px]',
                    }}
                    searchable
                  />

                  <Group position="center">
                    <Button
                      type="reset"
                      mt="md"
                      variant="outline"
                      color={'red'}
                      className={clsx(inter.className)}
                      loading={loading}
                      radius="lg"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      mt="md"
                      variant="outline"
                      color={'green'}
                      className={clsx(inter.className)}
                      loading={loading}
                      radius="lg"
                    >
                      Сохранить
                    </Button>
                  </Group>
                </form>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx({
        [inter.className]: true,
      })}
    >
      <MetaTags
        title={`${props.name} | @${props.username} | ${siteName}`}
        description={props.bio || `${props.name} on ${siteName}`}
      />
      <div className="flex flex-row flex-wrap items-center justify-evenly">
        <div className="h-52 w-full bg-[#e0f3ff]"></div>
        <Paper
          withBorder
          p="xl"
          radius={'md'}
          style={{
            flex: 0.3,
          }}
          className="mt-[-50px] lg:min-w-[50%]"
        >
          <div className="flex flex-col items-center justify-center">
            <Avatar
              src={
                props.avatarUrl
                  ? assetURLBuilder(props.avatarUrl)
                  : profileImageRouteGenerator(props.username)
              }
              className="mt-[-90px] h-32 w-32 rounded-full border-8 border-[#e0f3ff]"
              draggable={false}
            />
            <div className="flex w-full flex-col items-center justify-center">
              <div className="mt-8 flex flex-row">
                <h1 className={clsx('text-3xl font-bold', inter.className)}>
                  {props.name}
                </h1>
              </div>
              <span
                className={clsx(
                  'mt-1 text-[13px] leading-[18px] text-gray-400 hover:underline'
                )}
              >
                @{props.username}
              </span>
              <p className="mt-4 text-center text-base font-medium">
                {props.bio}
              </p>
            </div>

            <div className="mt-4 flex w-[90%] flex-row items-center justify-evenly">
              <div className="flex flex-row items-center text-base">
                <IconMapPin className="mr-2 h-5 w-5" />
                {props.country}
              </div>
              <div className="flex flex-row items-center text-base">
                <IconClock className="mr-2 h-5 w-5" />
                На платформе с {dayjs(props.createdAt).format('D MMM, YYYY')}
              </div>
            </div>

            {editable ? (
              <div
                className="mt-3 flex cursor-pointer flex-row items-center justify-center"
                onClick={() => setIsEdit(true)}
              >
                <IconPencil className="h-6 w-6 text-blue-500" />
              </div>
            ) : null}
          </div>
        </Paper>
      </div>
      <Container mb="xl">
        {props.role === 'Freelancer' ? (
          <>
            <Title align="center" className={clsx(inter.className)} mb="md">
              Услуги
            </Title>
            <ServicesTab username={props.username} />
          </>
        ) : (
          <>
            <Title align="center" className={clsx(inter.className)} mb="md">
              Заказы
            </Title>
            <JobPosts username={props.username} />
          </>
        )}

        {props.username === username ? (
          <div className={clsx('text-center')}>
            {props.role === 'Freelancer' ? (
              <>
                <Title
                  // align="center"
                  className={clsx(inter.className, 'mt-7')}
                  mb="md"
                >
                  Отклики на ваши услуги
                </Title>
                <div className="grid grid-cols-3 gap-4">
                  {props.orders.filter((e) => e.client_agree).length > 0 ? (
                    props.orders
                      .filter((e) => e.client_agree)
                      .map((e) => (
                        <Card
                          key={e.id}
                          shadow="sm"
                          p="lg"
                          radius="md"
                          withBorder
                          className="mx-1  h-full min-h-[10rem] min-w-[300px] max-w-[350px]"
                        >
                          <Link
                            className="block font-bold"
                            href={`/job/${e.jobPost.slug}`}
                          >
                            {e.jobPost.title}
                          </Link>
                          <Tooltip label={`Статус`}>
                            <Badge
                              className="w-fit"
                              color={
                                e.status === 'Response'
                                  ? 'yellow'
                                  : e.status === 'Accepted'
                                  ? 'blue'
                                  : e.status === 'Canceled'
                                  ? 'red'
                                  : 'green'
                              }
                            >
                              {e.status === 'Response'
                                ? 'Предложено'
                                : e.status === 'Accepted'
                                ? 'Принято'
                                : e.status === 'Canceled'
                                ? 'Отклонено'
                                : 'Выполнено'}
                            </Badge>
                          </Tooltip>
                          <Link
                            className="flex"
                            href={`/profile/${e.jobPost.user.username}`}
                          >
                            <div className="flex flex-col">
                              <Text
                                size="md"
                                className={clsx(montserrat.className, 'mb-0')}
                              >
                                {e.jobPost.user.name}
                              </Text>

                              <Text
                                size="xs"
                                className={clsx(
                                  montserrat.className,
                                  'mt-0 leading-3'
                                )}
                              >
                                @{e.jobPost.user.username}{' '}
                              </Text>
                            </div>
                          </Link>
                          {e.status === 'Accepted' && (
                            <Button
                              onClick={() => {
                                const token = readCookie('token');
                                axios
                                  .post(
                                    URLBuilder(`/orders/${e.id}/done`),
                                    {},
                                    {
                                      headers: {
                                        authorization: `Bearer ${token}`,
                                      },
                                    }
                                  )
                                  .then(() => {
                                    window.location.reload();
                                  });
                              }}
                              mt="md"
                              variant="outline"
                              color={'green'}
                              className={clsx(inter.className)}
                              radius="lg"
                            >
                              Выполнено
                            </Button>
                          )}
                          {e.status === 'Response' && (
                            <div className="flex justify-between">
                              <Button
                                mt="md"
                                variant="outline"
                                color={'red'}
                                className={clsx(inter.className)}
                                onClick={() => {
                                  const token = readCookie('token');
                                  axios
                                    .post(
                                      URLBuilder(`/orders/${e.id}/reject`),
                                      {},
                                      {
                                        headers: {
                                          authorization: `Bearer ${token}`,
                                        },
                                      }
                                    )
                                    .then(() => {
                                      window.location.reload();
                                    });
                                }}
                                radius="lg"
                              >
                                Отклонить
                              </Button>
                              <Button
                                onClick={() => {
                                  const token = readCookie('token');
                                  axios
                                    .post(
                                      URLBuilder(`/orders/${e.id}/accept`),
                                      {},
                                      {
                                        headers: {
                                          authorization: `Bearer ${token}`,
                                        },
                                      }
                                    )
                                    .then(() => {
                                      window.location.reload();
                                    });
                                }}
                                mt="md"
                                variant="outline"
                                color={'green'}
                                className={clsx(inter.className)}
                                radius="lg"
                              >
                                Принять
                              </Button>
                            </div>
                          )}
                        </Card>
                      ))
                  ) : (
                    <div className="col-span-3 flex items-center justify-center">
                      <Text className={clsx('mt-0 text-center')}>
                        Вам ещё не предлагали сотрудничество
                      </Text>
                    </div>
                  )}
                </div>
                <Title
                  align="center"
                  className={clsx(inter.className, 'mt-7')}
                  mb="md"
                >
                  Ваши предложения заказчикам
                </Title>
                {props.orders.filter((e) => e.freelancer_agree).length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {props.orders
                      .filter((e) => e.freelancer_agree)
                      .map((e) => (
                        <Card
                          key={e.id}
                          shadow="sm"
                          p="lg"
                          radius="md"
                          withBorder
                          className="mx-1  h-full min-h-[10rem] min-w-[300px] max-w-[350px]"
                        >
                          <Link
                            className="block font-bold"
                            href={`/job/${e.jobPost.slug}`}
                          >
                            {e.jobPost.title}
                          </Link>
                          <Tooltip label={`Статус`}>
                            <Badge
                              className="w-fit"
                              color={
                                e.status === 'Response'
                                  ? 'yellow'
                                  : e.status === 'Accepted'
                                  ? 'blue'
                                  : e.status === 'Canceled'
                                  ? 'red'
                                  : 'green'
                              }
                            >
                              {e.status === 'Response'
                                ? 'Предложено'
                                : e.status === 'Accepted'
                                ? 'Принято'
                                : e.status === 'Canceled'
                                ? 'Отклонено'
                                : 'Выполнено'}
                            </Badge>
                          </Tooltip>
                          <Link
                            className="mt-2 flex"
                            href={`/profile/${e.jobPost.user.username}`}
                          >
                            <div className="flex w-full flex-col items-center justify-center">
                              <Text
                                size="md"
                                className={clsx(montserrat.className, 'mb-0')}
                              >
                                {e.jobPost.user.name}
                              </Text>

                              <Text
                                size="xs"
                                className={clsx(
                                  montserrat.className,
                                  'mt-0 leading-3'
                                )}
                              >
                                @{e.jobPost.user.username}{' '}
                              </Text>
                            </div>
                          </Link>
                          {e.status === 'Accepted' && (
                            <Button
                              onClick={() => {
                                const token = readCookie('token');
                                axios
                                  .post(
                                    URLBuilder(`/orders/${e.id}/done`),
                                    {},
                                    {
                                      headers: {
                                        authorization: `Bearer ${token}`,
                                      },
                                    }
                                  )
                                  .then(() => {
                                    window.location.reload();
                                  });
                              }}
                              mt="md"
                              variant="outline"
                              color={'green'}
                              className={clsx(inter.className)}
                              radius="lg"
                            >
                              Выполнено
                            </Button>
                          )}
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="col-span-3 flex items-center justify-center">
                    <Text className={clsx('mt-0 text-center')}>
                      Вы ещё не предлагали сотрудничество
                    </Text>
                  </div>
                )}
              </>
            ) : (
              <>
                <Title
                  align="center"
                  className={clsx(inter.className, 'mt-7')}
                  mb="md"
                >
                  Отклики на ваши заказы
                </Title>
                <div className="grid grid-cols-3 gap-4">
                  {props.myOrders.filter((e) => e.freelancer_agree).length >
                  0 ? (
                    props.myOrders
                      .filter((e) => e.freelancer_agree)
                      .map((e) => (
                        <Card
                          key={e.id}
                          shadow="sm"
                          p="lg"
                          radius="md"
                          withBorder
                          className="mx-1  h-full min-h-[10rem] min-w-[300px] max-w-[350px]"
                        >
                          <Link
                            className="block"
                            href={`/service/${e.service.slug}`}
                          >
                            <strong>Услуга:</strong> {e.service.title}
                            <br /> <strong>Заказ:</strong> {e.jobPost.title}
                          </Link>
                          <Tooltip label={`Статус`}>
                            <Badge
                              className="w-fit"
                              color={
                                e.status === 'Response'
                                  ? 'yellow'
                                  : e.status === 'Accepted'
                                  ? 'blue'
                                  : e.status === 'Canceled'
                                  ? 'red'
                                  : 'green'
                              }
                            >
                              {e.status === 'Response'
                                ? 'Предложено'
                                : e.status === 'Accepted'
                                ? 'Выполняется'
                                : e.status === 'Canceled'
                                ? 'Отклонено'
                                : 'Выполнено'}
                            </Badge>
                          </Tooltip>
                          <Link
                            className="flex"
                            href={`/profile/${e.service.user.username}`}
                          >
                            <div className="flex w-full flex-col items-center text-center">
                              <Text
                                size="md"
                                className={clsx(montserrat.className, 'mb-0')}
                              >
                                {e.service.user.name}
                              </Text>

                              {e.status !== 'Canceled' &&
                                e.status !== 'Response' && (
                                  <span>{e.service.user.email}</span>
                                )}

                              <Text
                                size="xs"
                                className={clsx(
                                  montserrat.className,
                                  'mt-1 leading-3'
                                )}
                              >
                                @{e.service.user.username}{' '}
                              </Text>
                            </div>
                          </Link>
                          {e.status === 'Response' && (
                            <div className="flex justify-between">
                              <Button
                                mt="md"
                                variant="outline"
                                color={'red'}
                                className={clsx(inter.className)}
                                onClick={() => {
                                  const token = readCookie('token');
                                  axios
                                    .post(
                                      URLBuilder(`/orders/${e.id}/reject`),
                                      {},
                                      {
                                        headers: {
                                          authorization: `Bearer ${token}`,
                                        },
                                      }
                                    )
                                    .then(() => {
                                      window.location.reload();
                                    });
                                }}
                                radius="lg"
                              >
                                Отклонить
                              </Button>
                              <Button
                                onClick={() => {
                                  const token = readCookie('token');
                                  axios
                                    .post(
                                      URLBuilder(`/orders/${e.id}/accept`),
                                      {},
                                      {
                                        headers: {
                                          authorization: `Bearer ${token}`,
                                        },
                                      }
                                    )
                                    .then(() => {
                                      window.location.reload();
                                    });
                                }}
                                mt="md"
                                variant="outline"
                                color={'green'}
                                className={clsx(inter.className)}
                                radius="lg"
                              >
                                Принять
                              </Button>
                            </div>
                          )}
                        </Card>
                      ))
                  ) : (
                    <div className="col-span-3 flex items-center justify-center">
                      <Text className={clsx('mt-0 text-center')}>
                        Вам ещё не предлагали сотрудничество
                      </Text>
                    </div>
                  )}
                </div>
                <Title
                  align="center"
                  className={clsx(inter.className, 'mt-7')}
                  mb="md"
                >
                  Ваши предложения разработчикам
                </Title>
                {props.myOrders.filter((e) => e.client_agree).length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {props.myOrders
                      .filter((e) => e.client_agree)
                      .map((e) => (
                        <Card
                          key={e.id}
                          shadow="sm"
                          p="lg"
                          radius="md"
                          withBorder
                          className="mx-1  h-full min-h-[10rem] min-w-[300px] max-w-[350px]"
                        >
                          <Link
                            className="block font-bold"
                            href={`/service/${e.service.slug}`}
                          >
                            {e.service.title}
                          </Link>
                          <Tooltip label={`Статус`}>
                            <Badge
                              className="w-fit"
                              color={
                                e.status === 'Response'
                                  ? 'yellow'
                                  : e.status === 'Accepted'
                                  ? 'blue'
                                  : e.status === 'Canceled'
                                  ? 'red'
                                  : 'green'
                              }
                            >
                              {e.status === 'Response'
                                ? 'Предложено'
                                : e.status === 'Accepted'
                                ? 'Выполняется'
                                : e.status === 'Canceled'
                                ? 'Отклонено'
                                : 'Выполнено'}
                            </Badge>
                          </Tooltip>
                          <Link
                            className="mt-2 flex"
                            href={`/profile/${e.service.user.username}`}
                          >
                            <div className="flex w-full flex-col items-center justify-center">
                              <Text
                                size="md"
                                className={clsx(montserrat.className, 'mb-0')}
                              >
                                {e.service.user.name}
                              </Text>

                              {e.status !== 'Canceled' &&
                                e.status !== 'Response' && (
                                  <span>{e.service.user.email}</span>
                                )}

                              <Text
                                size="xs"
                                className={clsx(
                                  montserrat.className,
                                  'mt-0 leading-3'
                                )}
                              >
                                @{e.service.user.username}{' '}
                              </Text>
                            </div>
                          </Link>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="col-span-3 flex items-center justify-center">
                    <Text className={clsx('mt-0 text-center')}>
                      Вы ещё не предлагали сотрудничество
                    </Text>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </Container>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await (await fetch(URLBuilder('/static/profiles'))).json();
  return {
    fallback: 'blocking',
    paths: paths.map((p: { username: string }) => ({
      params: {
        username: p.username,
      },
    })),
  };
};
export const getStaticProps: GetStaticProps<{
  name: string;
  id: string;
  createdAt: Date;
  username: string;
  country: string;
  verified: boolean;
  role: 'Freelancer' | 'Client';
  bio: string;
  avatarUrl: string;
  orders: any[];
  myOrders: any[];
}> = async ({ params }) => {
  const { username } = params!;
  const profile = await (
    await fetch(URLBuilder(`/profile/${username}`))
  ).json();
  return {
    props: {
      ...profile,
    },
  };
};

export default ProfilePage;
