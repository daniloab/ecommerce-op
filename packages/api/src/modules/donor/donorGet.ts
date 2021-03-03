import { Types } from "mongoose";
import { Context } from "koa";

import Donor from "./DonorModel";

export const donorGet = async (ctx: Context) => {
  const { id } = ctx.params;

  if (!Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      error: "id is invalid",
    };
    return;
  }

  const donor = await Donor.findOne({
    _id: id,
  }).lean();

  ctx.body = {
    donor: {
      name: donor.name,
      taxID: donor.taxID,
      email: donor.email,
    },
  };
  ctx.status = 200;
};
