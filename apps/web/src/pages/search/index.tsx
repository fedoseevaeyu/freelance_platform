import {
  Button,
  MultiSelect,
  Paper,
  RangeSlider,
  Select,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';

import { PostCard } from '../../apps/ui/card/post';
import { PostCardList } from '../../apps/ui/card/post_list';
import { URLBuilder } from '../../apps/utils/url';

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
        `/posts?type=${type}&category=${category}&price=${Number(
          price[0]
        )}&price=${Number(price[1])}&until=${until}&tags=${tags.join(
          ','
        )}&page=${page}`
      )
    )
    .then((e) => e.data);
}

export default function Search() {
  const [type, setType] = useState('service');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<any[]>([]);
  const [cardView, setCardView] = useState('grid');
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

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery(
      ['posts', type, category, tags, price, until],
      ({ pageParam = 1 }) =>
        fetchPosts(type, category, tags, pageParam, price, until),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  return (
    <div className="container py-[32px]">
      <Paper p="md" shadow="xs" className="mb-[24px] flex-wrap gap-4">
        <div className="flex gap-4">
          <Select
            className="w-full"
            placeholder="Что вы ищите?"
            value={type}
            onChange={(value) => setType(value as string)}
            data={[
              { label: 'Услуги', value: 'service' },
              { label: 'Заказы', value: 'job' },
            ]}
          />
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
              tagsOptions?.map((e) => ({ value: e.id, label: e.name })) ?? []
            }
          />
          <DatePickerInput
            placeholder="Укажите дедлайн"
            mx="auto"
            maw={400}
            className={'w-full items-center'}
            allowDeselect
            onChange={(e) => setUntil(e ?? new Date(2034, 1))}
          />
        </div>

        <div className="mt-3 flex flex-col gap-4">
          <Text>Цена</Text>
          <div className="flex justify-between">
            <RangeSlider
              value={price}
              step={100}
              onChange={setPrice}
              marks={[
                { value: 0, label: '0' },
                { value: 100000, label: '100000' },
              ]}
              max={100000}
              className={'h-[30px] w-[50%]'}
            />
          </div>
        </div>
      </Paper>

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Что-то пошло не так...</p>}
      {!isLoading && !isError && (
        <>
          <div className={'flex justify-center'}>
            <Button
              onClick={() => setCardView(cardView === 'grid' ? 'list' : 'grid')}
              className="btn-sm bg-gray-900 text-gray-200 hover:bg-gray-800"
            >
              {cardView === 'grid'
                ? 'Отобразить списком'
                : 'Отобразить сеткой из карточек'}
            </Button>
          </div>
          <div
            className={`mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${
              cardView === 'grid' ? '' : 'hidden'
            }`}
          >
            {data.pages.map((pageData) =>
              pageData.posts.map((post: any) => (
                <PostCard
                  {...post}
                  type={type}
                  style={{ overflowWrap: 'break-word' }}
                  badgeLabel={post.category.name}
                  tags={post.tags
                    .map((e: any) => e.name)
                    .sort((a: any, b: any) => a.length - b.length)}
                  key={post.slug}
                  image={post.bannerImage}
                />
              ))
            )}
          </div>
          <div
            className={`mt-5 flex flex-col gap-4 ${
              cardView === 'list' ? '' : 'hidden'
            }`}
          >
            {data.pages.map((pageData) =>
              pageData.posts.map((post: any) => (
                <div className="w-full" key={post.slug}>
                  {/* {JSON.stringify(Math.min(...post.package.map((e) => e.deliveryDays)))} */}
                  <PostCardList
                    {...post}
                    price={
                      type === 'job'
                        ? post.budget
                        : Math.min(...post.package.map((e) => e.price))
                    }
                    until={type === 'job' ? post.deadline : null}
                    delivery_days={
                      type === 'service'
                        ? Math.min(...post.package.map((e) => e.deliveryDays))
                        : null
                    }
                    type={type}
                    style={{ overflowWrap: 'break-word' }}
                    badgeLabel={post.category.name}
                    tags={post.tags
                      .map((e: any) => e.name)
                      .sort((a: any, b: any) => a.length - b.length)}
                    key={post.slug}
                    image={post.bannerImage}
                  />
                </div>
              ))
            )}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                onClick={() => fetchNextPage()}
                className="btn-sm ml-3 mt-[24px] bg-gray-900 text-gray-200 hover:bg-gray-800"
              >
                Загрузить ещё
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
