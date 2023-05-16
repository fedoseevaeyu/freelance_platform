import { Button, Group } from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

export default function Editor(props: {
  onSubmit: (d: string) => any;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });

  return (
    <div className="container">
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
        <div
          className={clsx('my-2 flex items-end justify-end pr-3 text-sm ', {
            'text-red-500': (editor?.getText()?.length ?? 0) < 100,
            'text-green-500': (editor?.getText()?.length ?? 0) >= 100,
          })}
        >
          {editor?.getText()?.length ?? 0}
        </div>
      </RichTextEditor>
      <Group position="center" className="mt-5">
        <Button
          onClick={() => {
            props.setActive((o) => o - 1);
          }}
          variant="filled"
          className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
        >
          Назад
        </Button>

        <Button
          onClick={() => {
            if (editor?.getHTML) {
              props.onSubmit(editor.getHTML());
            }
          }}
          variant="filled"
          className={clsx('bg-[#1e88e5] hover:bg-[#1976d2]')}
        >
          Следующий шаг
        </Button>
      </Group>
    </div>
  );
}
