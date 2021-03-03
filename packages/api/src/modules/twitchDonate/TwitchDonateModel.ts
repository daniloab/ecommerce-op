import mongoose, { Document, Model, Types } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export const TWITCH_DONATE_STATUS = {
  OPEN: 'OPEN',
  PAYED: 'PAYED',
};

const Schema = new mongoose.Schema(
  {
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
    donor: {
      type: ObjectId,
      ref: 'Donor',
      index: true,
      required: false,
      description: 'Donor from this donate',
    },
  },
  {
    collection: 'TwitchDonate',
    timestamps: true,
  },
);

export interface ITwitchDonate extends Document {
  value: number;
  comment: string;
  status: string;
  brCode: string;
  donor?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TwitchDonateModel: Model<ITwitchDonate> = mongoose.model(
  'TwitchDonate',
  Schema,
);

export default TwitchDonateModel;
