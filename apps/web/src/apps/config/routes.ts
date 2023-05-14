export const routes = {
  home: '/',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  search: '/search',
  searchCategory: (category: string, tab?: 'services' | 'jobs') =>
    `/search/${category}${tab ? `?tab=${tab}` : ''}`,
  privacy: '/privacy',
  agreement: '/agreement',
  profile: (username: string) => `/profile/${username}`,
  profileOrder: (username: string, orderId: string) =>
    `/profile/${username}/order/${orderId}`,
};
