export const validateEmail = (email: string | null) => {
  if (!email) {
    return 'Email не может быть пусытм';
  }
  if (!/^\S+@\S+$/.test(email)) {
    return 'Недействительный email';
  }

  return null;
};
export const validatePassword = (password: string) =>
  password.length <= 8 ? 'Пароль должен быть не меньше 8 символов' : null;
export const validateTitle = (title: string) => {
  if (title.length < 20) {
    return 'Заголовок должен содержать не менее 20 символов';
  }
  if (title.length > 100) {
    return 'Заголовок должен содержать не более 1000 символов';
  }

  return null;
};
export const validateDescription = (description: string) => {
  if (description.length < 100) {
    return 'Описание должен содержать не менее 100 символов';
  }
  if (description.length > 1000) {
    return 'Описания должно содержать не более 1000 символов';
  }

  return null;
};

export const validatePrice = (price: string | null) => {
  if (Number(price) > 0 && Number(price) < 100) {
    return 'Цена должна быть больше 100 руб.';
  }

  return null;
};
