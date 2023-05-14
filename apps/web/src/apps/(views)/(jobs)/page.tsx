import { Container } from '@components/container';
import { inter } from '@fonts';
import { useUser } from '@hooks/user';
import { Avatar, Badge, Divider, Image, Text, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';

import { routes } from '../../config/routes';
import { profileImageRouteGenerator } from '../../utils/profile';
import { assetURLBuilder } from '../../utils/url';

export default function JobPostPageContent(props: any) {
  const { username } = useUser();
  return (
    <Container
      className={clsx('container', {
        [inter.className]: true,
      })}
      mb="xl"
    >
      <div className="flex flex-col items-center justify-center ">
        <h1 className="break-all text-3xl font-bold">{props.title}</h1>
        {props.budget && (
          <Tooltip label={`Бюджет этого заказа составляет ${props.budget}`}>
            <Badge variant="light" className="mt-2">
              {props.budget}
            </Badge>
          </Tooltip>
        )}
        {/* {props.claimed ? (
          <div className="mt-2">
            <Tooltip label={`This Post is claimed by ${props.claimedBy.name}`}>
              <Badge color="green">Claimed</Badge>
            </Tooltip>
          </div>
        ) : null} */}
        <div className="mt-2 flex flex-row flex-wrap items-center justify-center">
          <Avatar
            src={
              props.user.avatarUrl
                ? assetURLBuilder(props.user.avatarUrl)
                : profileImageRouteGenerator(props.user.username)
            }
            size="md"
            radius="xl"
          />
          <div className="ml-2 flex flex-col">
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
            <Text
              color={'dimmed'}
              className={clsx({
                [inter.className]: true,
              })}
            >
              <Link
                href={routes.profile(props.user.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="leading-3 text-blue-500  hover:underline"
              >
                @{props.user.username}
              </Link>
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
                        className="my-6 cursor-pointer max-h-[512px]"
                        controls
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    ) : (
                      <Image
                        src={assetURLBuilder(i)}
                        alt="Image"
                        height={512}
                        className="cursor-pointer max-h-[512px]"
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

        {props.user.username === username && (
          <>
            <Divider orientation="horizontal" className={clsx('my-4 w-full')} />
            <div>
              <h2 className="text-base font-semibold">Предложенные услуги</h2>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
