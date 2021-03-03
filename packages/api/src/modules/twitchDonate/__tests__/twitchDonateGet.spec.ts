import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
} from "@eop/test";
import { createGetApiCall } from "../../../../test/restUtils";
import { TWITCH_DONATE_STATUS } from "../TwitchDonateModel";
import { createTwitchDonate } from "../fixtures/createTwitchDonate";
import {debugConsole} from "../../../../debugConsole";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const getUrl = (id: string) => `/donate/${id}`;

it("should return error for id invalid", async () => {
    const response = await createGetApiCall({
        url: getUrl('12345'),
    });

    expect(response.status).toBe(400);

    // expect(response.body.twitchDonate.name).toBe(twitchDonate.name);
});

it("should get donate by id", async () => {
  const twitchDonate = await createTwitchDonate();

  const response = await createGetApiCall({
    url: getUrl(twitchDonate._id),
  });

  expect(response.status).toBe(200);

  expect(response.body.twitchDonate.name).toBe(twitchDonate.name);
  expect(response.body.twitchDonate.email).toBe(twitchDonate.email);
  expect(response.body.twitchDonate.comment).toBe(twitchDonate.comment);
  expect(response.body.twitchDonate.value).toBe(twitchDonate.value);
  expect(response.body.twitchDonate.brCode).toBe(twitchDonate.brCode);
  expect(response.body.twitchDonate.status).toBe(TWITCH_DONATE_STATUS.OPEN);
});
