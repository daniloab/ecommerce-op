import { Types } from 'mongoose';
import { Context } from 'koa';

import TwitchDonate from './TwitchDonateModel';

export const twitchDonateGet = async (ctx: Context) => {
  const { id } = ctx.params;

  if (!Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      error: 'id is invalid',
    };
    return;
  }

  const twitchDonate = await TwitchDonate.findOne({
    _id: id,
  }).lean();

  ctx.body = {
    twitchDonate: {
      name: twitchDonate.name,
      email: twitchDonate.email,
      comment: twitchDonate.comment,
      value: twitchDonate.value,
      id: twitchDonate._id.toString(),
      status: twitchDonate.status,
      brCode: twitchDonate.brCode,
    },
  };
  ctx.status = 200;
};
