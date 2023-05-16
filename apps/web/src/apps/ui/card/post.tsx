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
  buttonTitle?: string;
  author?: Posts['posts'][0]['author'];
  slug: string;
  type: 'service' | 'job';
  resolveImageUrl: boolean;
  tags?: string[];
  badgeLabel?: string;
}

export function PostCard({
  description,
  image,
  slug,
  title,
  type,
  buttonTitle,
  resolveImageUrl = true,
  tags,
  badgeLabel,
}: Props) {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      className={`mx-1  h-full ${
        image ? 'min-h-[21rem]' : 'min-h-[10rem]'
      } min-w-[300px] max-w-[350px]`}
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
          <Text weight={500} lineClamp={1} className="break-all">
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

      <Text
        size="sm"
        color="dimmed"
        lineClamp={2}
        className="break-all"
        dangerouslySetInnerHTML={sanitize(description, undefined)}
      />

      <Link href={`/${type}/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button
          fullWidth
          mt="md"
          radius="md"
          className={clsx(
            'bg-purple-500 transition-all duration-[110ms] hover:scale-105 hover:bg-purple-700',
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
