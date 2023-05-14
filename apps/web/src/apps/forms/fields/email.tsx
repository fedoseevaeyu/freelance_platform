import type { TextInputProps } from '@mantine/core';
import { TextInput } from '@mantine/core';

export default function EmailField(props: TextInputProps) {
  return (
    <TextInput
      label="Email"
      placeholder="example@ya.ru"
      type="email"
      {...props}
    />
  );
}
