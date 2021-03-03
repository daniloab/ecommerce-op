import fetchMock from "jest-fetch-mock";
import { createApiCall } from "../../../../test";

import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from "@eop/test";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const url = "/donor";

it("should create a new donor as cpf", async () => {
  const payload = {
    name: "Danilo Assis",
    email: "danilo@test.com",
    taxID: "242.285.572-52",
  };

  fetchMock.mockResponseOnce(
    JSON.stringify({
      customer: {
        ...payload,
        taxID: {
          taxID: payload.taxID,
        },
      },
    }),
  );

  const response = await createApiCall({ url, payload });

  expect(response.status).toBe(200);

  expect(response.body.donor.name).toBe(payload.name);
  expect(response.body.donor.email).toBe(payload.email);
  expect(response.body.donor.taxID.taxID).toBe(payload.taxID);
});
