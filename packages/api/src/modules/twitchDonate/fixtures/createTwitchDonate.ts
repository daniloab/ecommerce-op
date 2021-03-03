// createTwitchDonate.ts
import { getCounter } from '@eop/test';

import TwitchDonate, {
  ITwitchDonate,
  TWITCH_DONATE_STATUS,
} from '../TwitchDonateModel';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>;
};

export const createTwitchDonate = async (
  args: DeepPartial<ITwitchDonate> = {},
) => {
  const n = getCounter('twitchDonate');

  const {
    name = `User ${n}`,
    email = `user${n}@test.com`,
    comment = 'good luck!',
    value = 10000,
    correlationID = 'correlationID',
    brCode = '00020101021226880014br.gov.bcb.pix2566qrcodes-pix.gerencianet.com.br/v2/7a8b3d64929d4e96a5638a57be943d5b52040000530398654040.015802BR5909ADMIN PIX6009Sao Paulo62360532d33f6e91ff524d2a8d2198fe57b5ac3763045C93',
    status = TWITCH_DONATE_STATUS.OPEN,
  } = args;

  return await new TwitchDonate({
    name,
    email,
    comment,
    value,
    correlationID,
    brCode,
    status,
  }).save();
};
