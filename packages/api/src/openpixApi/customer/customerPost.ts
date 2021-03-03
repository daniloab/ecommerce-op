import { baseUrl, getAuthorization } from '../api';

const url = '/api/openpix/v1/customer'

const getUrl = () => `${baseUrl}${url}`;

export type DonorPostPayload = {
  name: string,
  taxID: string,
  email?: string,
};

export const customerPost = async (payload: DonorPostPayload) => {
  const response = await fetch(getUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getAuthorization(),
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  const data = await response.json();

  console.log('data', {
    data,
  });

  return data;
}
