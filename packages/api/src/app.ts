import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';
import cors from 'koa-cors';

import { version } from '../package.json';

import { twitchDonatePost } from './modules/twitchDonate/twitchDonatePost';
import { twitchDonateGet } from './modules/twitchDonate/twitchDonateGet';
import {donorPost} from "./modules/donor/donorPost";

const app = new Koa();

const router = new Router();

app.use(logger());
app.use(cors({ maxAge: 86400 }));
app.use(bodyParser());

//Open APIS (APIs that dont need to Authenticate)
router.get('/api/version', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'OK',
    message: version,
  };
});

router.get('/donate/:id', twitchDonateGet);
router.post('/donate', twitchDonatePost);

router.post('/donor', donorPost);

app.use(router.routes());

// Default not found 404
app.use((ctx) => {
  ctx.status = 404;
});

export default app;
