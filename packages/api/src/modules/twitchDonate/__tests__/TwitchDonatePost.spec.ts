import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from '@eop/test';

import fetchMock from 'jest-fetch-mock';

import { createApiCall } from '../../../../test/restUtils';
import { TWITCH_DONATE_STATUS } from '../TwitchDonateModel';
import {onlyDigits} from "../../donor/donorPost";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = '/donate';

const brCode =
  '00020101021226880014br.gov.bcb.pix2566qrcodes-pix.gerencianet.com.br/v2/7a8b3d64929d4e96a5638a57be943d5b52040000530398654040.015802BR5909ADMIN PIX6009Sao Paulo62360532d33f6e91ff524d2a8d2198fe57b5ac3763045C93';

it('should create a new donate', async () => {
  const payload = {
    name: 'Danilo Assis',
    email: 'danilo@test.com',
    taxID: '261.141.227-80',
    comment: 'good luck!',
    value: 10000,
    correlationID: 'correlationID',
  };

  const { correlationID, ...chargePayload } = payload;

  fetchMock.mockResponseOnce(
    JSON.stringify({
      customer: {
        name: payload.name,
        email: payload.email,
        taxID: payload.taxID,
      },
    }),
  );

  fetchMock.mockResponseOnce(
    JSON.stringify({
      charge: {
        ...chargePayload,
      },
      correlationID,
      brCode,
    }),
  );

  const response = await createApiCall({ url, payload });

  expect(response.status).toBe(200);

  const { twitchDonate } = response.body;

  expect(twitchDonate.donor.name).toBe(payload.name);
  expect(twitchDonate.donor.email).toBe(payload.email);
  expect(twitchDonate.donor.taxID.taxID).toBe(onlyDigits(payload.taxID));
  expect(twitchDonate.comment).toBe(payload.comment);
  expect(twitchDonate.value).toBe(payload.value);
  expect(twitchDonate.brCode).toBe(brCode);
  expect(twitchDonate.status).toBe(TWITCH_DONATE_STATUS.OPEN);
});
