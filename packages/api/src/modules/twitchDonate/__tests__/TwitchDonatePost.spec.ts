import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from "@eop/test";
import { createApiCall } from "../../../../test/restUtils";
import fetchMock from "jest-fetch-mock";
import { TWITCH_DONATE_STATUS } from "../TwitchDonateModel";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = "/donate";

const brCode =
  "00020101021226880014br.gov.bcb.pix2566qrcodes-pix.gerencianet.com.br/v2/7a8b3d64929d4e96a5638a57be943d5b52040000530398654040.015802BR5909ADMIN PIX6009Sao Paulo62360532d33f6e91ff524d2a8d2198fe57b5ac3763045C93";

it("should create a new donate", async () => {
  const payload = {
    name: "Danilo Assis",
    email: "danilo@test.com",
    comment: "good luck!",
    value: 10000,
    correlationID: "correlationID",
  };

  const { correlationID, ...chargePayload } = payload;

  fetchMock.mockResponseOnce(
    JSON.stringify({
      charge: {
        ...chargePayload,
      },
      correlationID,
      brCode,
    })
  );

  const response = await createApiCall({ url, payload });

  expect(response.status).toBe(200);

  const { body: twitchDonate } = response;

  expect(twitchDonate.namme).toBe(payload.namme);
  expect(twitchDonate.email).toBe(payload.email);
  expect(twitchDonate.comment).toBe(payload.comment);
  expect(twitchDonate.value).toBe(payload.value);
  expect(twitchDonate.brCode).toBe(brCode);
  expect(twitchDonate.status).toBe(TWITCH_DONATE_STATUS.OPEN);
});
