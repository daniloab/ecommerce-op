// createDonor.ts
import { getCounter } from '@eop/test';

import Donor, { IDonor } from '../DonorModel';
import { DeepPartial } from '../../twitchDonate/fixtures/createTwitchDonate';

export const createDonor = async (args: DeepPartial<IDonor> = {}) => {
  const n = getCounter('donor');

  const {
    name = `User ${n}`,
    email = `user${n}@test.com`,
    taxID = '187.323.286-13',
  } = args;

  return await new Donor({
    name,
    email,
    taxID,
  }).save();
};
