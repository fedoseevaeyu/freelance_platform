import { Button, MultiSelect, Paper, Select } from '@mantine/core';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { PostCard } from '../../apps/ui/card/post';
import { URLBuilder } from '../../apps/utils/url';

async function fetchPosts(type: any, category: any, tags: any[], page: any) {
  return axios
    .get(
      URLBuilder(
        `/posts?type=${type}&category=${category}&tags=${tags.join(
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
      ['posts', type, category, tags],
      ({ pageParam = 1 }) => fetchPosts(type, category, tags, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  return (
    <div className="container py-[32px]">
      <Paper p="md" shadow="xs" className="mb-[24px] flex gap-4">
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
          value={tags}
          onChange={(value) => setTags(value)}
          data={tagsOptions?.map((e) => ({ value: e.id, label: e.name })) ?? []}
        />
      </Paper>

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Что-то пошло не так...</p>}
      {!isLoading && !isError && (
        <>
          <div className="grid gap-[12px] md:grid-cols-3">
            {data.pages.map((pageData) =>
              pageData.posts.map((post: any) => (
                <PostCard
                  {...post}
                  type={type}
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
          {!!hasNextPage && (
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
