import mongoose, { Document, Model } from 'mongoose';

export interface TaxID {
  taxID: string;
  type: string;
}

export const TAXID_TYPE = {
  BR_CPF: 'BR:CPF',
  BR_CNPJ: 'BR:CNPJ',
  US_SOCIALSECURITY: 'US:SOCIALSECURITY',
};

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: 'name of person or whatever',
    },
    email: {
      type: String,
      description: 'email of person or whatever',
    },
    taxID: {
      taxID: {
        type: String,
        description: 'TaxId could also be used to login in the system',
        index: true,
      },
      type: {
        type: String,
        uppercase: true,
        enum: Object.values(TAXID_TYPE),
      },
    },
  },
  {
    collection: 'Donor',
    timestamps: true,
  },
);

export interface IDonor extends Document {
  name: string;
  email: string;
  taxID?: TaxID;
  createdAt: Date;
  updatedAt: Date;
}

const DonorModel: Model<IDonor> = mongoose.model('Donor', Schema);

export default DonorModel;
