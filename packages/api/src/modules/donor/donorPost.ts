import { ParameterizedContext } from 'koa';

import { isCNPJ, isCPF } from 'brazilian-values';

import { customerPost } from '../../openpixApi/customer/customerPost';

import DonorModel, { TAXID_TYPE } from './DonorModel';

export const onlyDigits = (value?: string) => {
  if (!value) {
    return null;
  }

  return value.toString().trim().match(/\d/g).join('');
};

const getTaxID = (taxID: string) => {
  if (isCNPJ(taxID)) {
    return {
      taxID: {
        taxID: onlyDigits(taxID),
        type: TAXID_TYPE.BR_CNPJ,
      },
      error: null,
    };
  }

  if (isCPF(taxID)) {
    return {
      taxID: {
        taxID: onlyDigits(taxID),
        type: TAXID_TYPE.BR_CPF,
      },
      error: null,
    };
  }

  return {
    error: 'Invalid Customer CPF or CNPJ',
  };
};

export const createDonor = async (
  body,
) => {
  const { error: errorTaxID, taxID } = getTaxID(body.taxID);

  if (errorTaxID) {
    return errorTaxID;
  }

  const donor = await new DonorModel({
    name: body.name,
    email: body?.email,
    taxID: taxID,
  }).save();

  const payload = {
    name: donor.name,
    taxID: donor.taxID.taxID,
    email: donor?.email,
  };

  const { customer, error } = await customerPost(payload);

  if (error) {
    return error;
  }

  return {
    donor: {
      name: customer.name,
      taxID: customer.taxID,
      email: customer?.email,
    },
    error: null,
  };
};

type DonorPostBody = {
  name: string;
  taxID: string;
  email?: string;
};

export const donorPost = async (
  ctx: ParameterizedContext<{}, {}, DonorPostBody>,
) => {
  const { body } = ctx.request;

  if (!body?.name || !body.taxID) {
    ctx.body = {
      error: 'name or tax id invalid',
    };
    ctx.status = 400;
    return;
  }

  const { donor, error } = await createDonor(body);

  if (error) {
    ctx.status = 400;
    ctx.body = {
      error,
    };
    return;
  }

  ctx.body = {
    donor,
  };
  ctx.status = 200;
};
