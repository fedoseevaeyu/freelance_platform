import { Button, Group, Modal, Rating, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

import { readCookie } from '../../apps/utils/cookie';
import { notifyAboutError } from '../../apps/utils/error';
import { URLBuilder } from '../../apps/utils/url';

interface Props {
  freelancerUsername: string;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function ReviewModal({
  freelancerUsername,
  modalOpen,
  setModalOpen,
}: Props) {
  const formState = useForm({
    initialValues: {
      content: '',
      rating: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      opened={modalOpen}
      onClose={() => setModalOpen((o) => !o)}
      title="Leave A Review"
      centered
    >
      <form
        onSubmit={formState.onSubmit((d) => {
          setLoading(true);
          const token = readCookie('token')!;
          axios
            .post(
              URLBuilder('/reviews/create'),
              {
                ...d,
                freelancerUsername,
              },
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            )
            .then((_) => {
              setLoading(false);
              showNotification({
                title: 'Review Submitted',
                message: 'Your review has been submitted',
                color: 'green',
              });

              setModalOpen(false);
            })
            .catch((err) => {
              setLoading(false);
              notifyAboutError(err);
            });
        })}
      >
        <Rating
          value={formState.values.rating}
          fractions={2}
          onChange={(e) => {
            formState.setFieldValue('rating', e);
          }}
        />

        <TextInput
          mt={'xl'}
          label="Review"
          placeholder="Leave a review"
          required
          {...formState.getInputProps('content')}
        />
        <Group mt="xl" position="center">
          <Button variant="outline" color="red">
            Cancel
          </Button>
          <Button
            variant="outline"
            color="green"
            type="submit"
            loading={loading}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
