import mongoose, { Document, Model } from 'mongoose';

export const TWITCH_DONATE_STATUS = {
  OPEN: 'OPEN',
  PAYED: 'PAYED',
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
    value: {
      type: Number,
      description: 'value of this charge in cents',
    },
    comment: {
      type: String,
      description: 'comments about this charge',
      index: true,
      trim: true,
    },
    status: {
      type: String,
      default: TWITCH_DONATE_STATUS.OPEN,
      enum: Object.values(TWITCH_DONATE_STATUS),
      index: true,
      description: 'The status of this charge',
    },
    brCode: {
      type: String,
      description: 'brcode of this donation',
    },
  },
  {
    collection: 'TwitchDonate',
    timestamps: true,
  },
);

export interface ITwitchDonate extends Document {
  name: string;
  email: string;
  value: number;
  comment: string;
  status: string;
  brCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const TwitchDonateModel: Model<ITwitchDonate> = mongoose.model('TwitchDonate', Schema);

export default TwitchDonateModel;