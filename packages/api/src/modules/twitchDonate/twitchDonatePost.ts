import { ParameterizedContext } from 'koa';

import { chargePost as chargePostApi } from '../../openpixApi/charge/chargePost';

import Donor from '../donor/DonorModel';
import {createDonor, onlyDigits} from '../donor/donorPost';

import TwitchDonate, {ITwitchDonate} from './TwitchDonateModel';

const getDonorPayload = async (donation: ITwitchDonate) => {
  if (!donation?.donor) return {};

  const donorFromDonate = await Donor.findOne({
    _id: donation.donor,
    removedAt: null,
  });

  return {
    donor: {
      name: donorFromDonate.name,
      taxID: donorFromDonate.taxID,
      email: donorFromDonate?.email,
    },
  };
};

const getOrCreateDonor = async (body: ChargePostBody) => {
  const { name = '', email = '', taxID = '', donorId = '' } = body;

  if (donorId) {
    const donor = await Donor.findOne({
      _id: donorId,
      removedAt: null,
    });

    if (!donor?._id) {
      return 'Donor not found';
    }

    return {
      donor,
      error: null,
    };
  }

  // empty donor
  if (!name && !taxID) {
    return { error: null, donor: null };
  }

  const bodyDonor = {
    name,
    email,
    taxID,
  };

  const { error, donor } = await createDonor(bodyDonor);

  const fullDonor = await Donor.findOne({
    'taxID.taxID': onlyDigits(donor?.taxID),
    removedAt: null,
  });

  if (error) {
    return { error, donor: null };
  }

  if(!fullDonor) {
    return 'Donor not found';
  }

  return { donor: fullDonor, error: null };
};

type ChargePostBody = {
  name?: string;
  email?: string;
  taxID?: string;
  donorId?: string;
  comment: string;
  value: number;
};

export const twitchDonatePost = async (
  ctx: ParameterizedContext<{}, {}, ChargePostBody>,
) => {
  const { body } = ctx.request;

  const { error: errorDonor, donor } = await getOrCreateDonor(body);

  if (errorDonor) {
    ctx.status = 400;
    ctx.body = {
      error: errorDonor,
    };
    return;
  }

  const getDonor = () => {
    if (!donor?._id) return {};

    return {
      donor: donor._id,
    };
  };

  const donation = await new TwitchDonate({
    name: body.name,
    email: body.email,
    comment: body.comment,
    value: body.value,
    ...getDonor(),
  }).save();

  const payload = {
    correlationID: donation._id.toString(),
    value: body.value,
    comment: body.comment,
  };

  const { brCode, error } = await chargePostApi(payload);

  if (error) {
    ctx.status = 400;
    ctx.body = {
      error,
    };
    return;
  }

  await TwitchDonate.updateOne(
    {
      _id: donation._id,
    },
    {
      $set: {
        brCode,
      },
    },
  );

  const donorFromDonate = await getDonorPayload(donation);

  ctx.body = {
    twitchDonate: {
      comment: donation.comment,
      value: donation.value,
      id: donation._id.toString(),
      status: donation.status,
      brCode,
      ...donorFromDonate,
    },
  };
  ctx.status = 200;
};
