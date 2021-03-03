import { ParameterizedContext } from 'koa';
import { chargePost as chargePostApi } from '../../openpixApi/charge/chargePost';
import TwitchDonate from './TwitchDonateModel';

type ChargePostBody = {
    name: string,
    email: string,
    comment: string,
    value: number,
}

export const twitchDonatePost = async (ctx: ParameterizedContext<{}, {}, ChargePostBody>) => {
    const { body } = ctx.request;

    const donation = await new TwitchDonate({
        name: body.name,
        email: body.email,
        comment: body.comment,
        value: body.value,
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

    await TwitchDonate.updateOne({
        _id: donation._id,
    }, {
        $set: {
            brCode,
        },
    });

    ctx.body = {
        name: donation?.name,
        email: donation?.email,
        comment: donation.comment,
        value: donation.value,
        id: donation._id.toString(),
        status: donation.status,
        brCode,
    };
    ctx.status = 200;
}