import axios from 'axios';

import { URLBuilder } from './url';

export async function uploadFiles(
  files: File[],
  token: string,
  folderName?: string
) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return axios
    .post<{ paths: string[] }>(
      URLBuilder(`/upload/multiple?to=${folderName || 'images'}`),
      formData,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((e) => e.data);
}

export async function uploadFile(file: File, token: string, to?: string) {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post<{ path: string }>(
      URLBuilder(`/upload?to=${to || 'images'}`),
      formData,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((e) => e.data);
}
