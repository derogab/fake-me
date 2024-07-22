// Dependencies.
import { Bot } from "grammy";
import { CronJob } from 'cron';
import * as dotenv from 'dotenv';

import Storage from './utils/data';
import { onMessageReceived, sendMessage } from './controller/core';

// Configs.
dotenv.config();

// Init storage.
const storage = new Storage();

// Init bot.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN ?? '');

// Add message event listener(s).
bot.on('business_message', (ctx) => onMessageReceived(storage, ctx));

// Add cron job to send messages.
const msgJob = CronJob.from({
  cronTime: '*/7 * * * *',
  onTick: async () => { await sendMessage(bot, storage); },
  start: true,
  timeZone: process.env.TZ || 'UTC'
});

// Start bot.
bot.start({ allowed_updates: ["business_message"] })

// Enable graceful stop.
process.once('SIGINT', () => { bot.stop(); });
process.once('SIGTERM', () => { bot.stop(); });
