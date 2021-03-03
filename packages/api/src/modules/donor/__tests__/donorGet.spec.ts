import {
    clearDbAndRestartCounters,
    connectMongoose,
    disconnectMongoose,
} from "@eop/test";
import { createGetApiCall } from "../../../../test/restUtils";
import {createDonor} from "../fixtures/createDonor";

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const getUrl = (id: string) => `/donor/${id}`;

it("should return error for id invalid", async () => {
    const response = await createGetApiCall({
        url: getUrl("12345"),
    });

    expect(response.status).toBe(400);

    expect(response.body.error).toBe("id is invalid");
});

it("should get donor by id", async () => {
    const donor = await createDonor();

    const response = await createGetApiCall({
        url: getUrl(donor._id),
    });

    expect(response.status).toBe(200);

    expect(response.body.donor.name).toBe(donor.name);
    expect(response.body.donor.email).toBe(donor.email);
    expect(response.body.donor.taxID.taxID).toBe(donor.taxID.taxID);
});
