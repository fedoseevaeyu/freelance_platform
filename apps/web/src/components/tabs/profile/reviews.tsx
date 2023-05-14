import { inter } from '@fonts';
import { Button, LoadingOverlay, Paper, Rating } from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Fragment } from 'react';

import { r } from '../../../apps/utils/date';
import { profileImageRouteGenerator } from '../../../apps/utils/profile';
import { assetURLBuilder, URLBuilder } from '../../../apps/utils/url';

interface Props {
  username: string;
}
const Reviews = ({ username }: Props) => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{
    reviews: {
      author: {
        avatarUrl: any;
        id: string;
        username: string;
        name: string;
      };
      comment: string;
      id: string;
      rating: number;
      createdAt: string;
    }[];
    next?: number;
  }>({
    queryKey: ['reviews', username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/reviews/${username}?take=${pageParam}`)
      );
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
  return (
    <div className={clsx('container')}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.reviews?.map((post) => (
            <div key={post.id} className="flex flex-col">
              <Paper withBorder radius="md" p="md" my="sm">
                <div className="flex flex-row ">
                  <div className="flex flex-row items-center">
                    <img
                      src={
                        post.author.avatarUrl
                          ? assetURLBuilder(post.author.avatarUrl)
                          : profileImageRouteGenerator(post.author.username)
                      }
                      className="h-10 w-10 rounded-full"
                      alt="avatar"
                    />
                    <div className="ml-2 flex flex-col">
                      <span className="font-bold">{post.author.name}</span>
                      <span className="text-sm text-gray-500">
                        @{post.author.username}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-row items-center">
                    <span className={clsx('ml-4 text-sm text-gray-500')}>
                      {r(post.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="ml-12 mt-2 flex flex-col">
                  <Rating readOnly value={post.rating} fractions={2} />
                  <span
                    className="text-sm text-gray-500 "
                    style={{ lineClamp: 2 }}
                  >
                    {post.comment}
                  </span>
                </div>
              </Paper>
            </div>
          ))}
        </Fragment>
      ))}
      <div>
        {hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            fullWidth
            color="black"
            className={clsx('bg-gray-900 hover:bg-black', {
              [inter.className]: true,
            })}
          >
            Load More
          </Button>
        ) : null}
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
      {data?.pages[0].reviews.length === 0 && (
        <div className="container flex w-[100%] flex-col items-center justify-center">
          <p>
            <span className="font-bold">{username}</span> has not posted any job
            <p className="opacity-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum,
              perspiciatis velit. Magni, error reprehenderit quidem provident
              vitae deleniti placeat in!
            </p>
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
