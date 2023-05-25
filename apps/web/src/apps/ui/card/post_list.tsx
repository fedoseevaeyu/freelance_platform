import { sanitize } from '@components/tabs/profile/services';
import { inter } from '@fonts';
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import clsx from 'clsx';
import Link from 'next/link';

import type { Posts } from '~/types/jobpost';

import { assetURLBuilder } from '../../utils/url';

interface Props {
  title: string;
  description: string;
  image: string;
  price?: number;
  until: Date;
  delivery_days: number;
  buttonTitle?: string;
  author?: Posts['posts'][0]['author'];
  slug: string;
  type: 'service' | 'job';
  resolveImageUrl: boolean;
  tags?: string[];
  badgeLabel?: string;
}

export function PostCardList({
  description,
  image,
  slug,
  title,
  type,
  buttonTitle,
  resolveImageUrl = true,
  tags,
  badgeLabel,
  price,
  until,
  delivery_days,
}: Props) {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      className={`mx-1 h-full w-full ${
        image ? 'min-h-[21rem]' : 'min-h-[10rem]'
      } min-w-[300px] `}
    >
      {image && (
        <Card.Section>
          <Image
            src={
              image.includes('fallback')
                ? '/images/fallback.webp'
                : resolveImageUrl
                ? assetURLBuilder(image)
                : image
            }
            height={160}
            alt="Обложка"
          />
        </Card.Section>
      )}

      <Group
        position="apart"
        mt="md"
        mb="xs"
        className="flex flex-col items-start justify-center"
      >
        <div className="flex w-full items-center justify-between">
          <Text weight={500} className="" style={{ whiteSpace: 'normal' }}>
            {title}
          </Text>
        </div>
        {badgeLabel ? <Badge variant="light">{badgeLabel}</Badge> : null}

        {tags ? (
          <div className="flex w-full flex-wrap gap-[4px]">
            {tags.map((e) => (
              <Badge key={e} variant="outline">
                {e}
              </Badge>
            ))}
          </div>
        ) : null}
      </Group>

      <div>
        {type === 'job' ? (
          <Badge variant="light">Бюджет: {price} руб.</Badge>
        ) : (
          <Badge variant="light">Мин. цена тарифа: {price} руб.</Badge>
        )}
      </div>

      <div>
        {until && (
          <Badge variant="light">
            Дедлайн: {new Date(until).toLocaleDateString()}
          </Badge>
        )}
      </div>

      <div>
        {delivery_days && (
          <Badge variant="light" className={'mt-2'}>
            Мин. срок исполнения (дни): {delivery_days}
          </Badge>
        )}
      </div>

      <Text
        size="sm"
        color="dimmed"
        lineClamp={5}
        className="mt-3"
        dangerouslySetInnerHTML={sanitize(description, undefined)}
      />

      <Link href={`/${type}/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button
          fullWidth
          mt="md"
          radius="md"
          className={clsx(
            'max-w-[100px] bg-purple-500 transition-all duration-[110ms] hover:scale-105 hover:bg-purple-700',
            {
              [inter.className]: true,
            }
          )}
        >
          {buttonTitle || 'Открыть'}
        </Button>
      </Link>
    </Card>
  );
}
