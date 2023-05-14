import { inter } from '@fonts';
import type { TextareaProps } from '@mantine/core';
import { Textarea as T } from '@mantine/core';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface Props extends TextareaProps {
  labelString: string;
  required?: boolean;
  id: string;
  wordsComponent?: ReactNode;
}

export default function Textarea({
  labelString,
  wordsComponent,
  required,
  ...props
}: Props) {
  return (
    <div className="mt-4">
      <label
        className={clsx('py-2 text-sm font-bold', {
          [inter.className]: true,
        })}
        htmlFor={props.id}
      >
        {labelString}
        {required && (
          <span>
            <span className="text-red-500">*</span>
          </span>
        )}
      </label>
      <div
        className={clsx(
          'flex flex-col rounded-md  border-[1px] border-[#ced4da]',
          {}
        )}
      >
        <T
          required={required}
          labelProps={{
            className: clsx({
              [inter.className]: true,
            }),
          }}
          {...props}
          classNames={{
            input: clsx('border-0', {}),
            ...props.classNames,
          }}
          error={null}
        />
        {wordsComponent}
      </div>
      <span
        className={clsx('text-sm text-red-500', {
          [inter.className]: true,
        })}
      >
        {props.error}
      </span>
    </div>
  );
}
