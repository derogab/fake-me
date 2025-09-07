<p align="center">
  <img src="./.github/assets/logo.png" width="140px" style="border-radius: 15%;">
</p>
<h1 align="center">Fake Me</h1>
<p align="center">A Telegram bot that can impersonate you by responding to messages using custom instructions</p>
<p align="center">
  <a href="https://github.com/derogab/fake-me/actions/workflows/docker-publish.yml">
    <img src="https://github.com/derogab/fake-me/actions/workflows/docker-publish.yml/badge.svg">
  </a>
</p>

## Overview
This bot monitors your Telegram business messages and responds automatically by pretending to be you, making it appear as if you're actively participating in conversations.

> Warning: this bot is designed to impersonate you on Telegram. Use responsibly and ensure compliance with Telegram's Terms of Service and applicable laws in your jurisdiction.

## Features

- 🤖 **AI-powered responses**: Uses LLM to generate human-like replies
- 📝 **Multiple instruction sets**: Configure different behaviors for different chats
- 💼 **Business message support**: Works with Telegram Business accounts
- 🗄️ **Redis storage**: Persistent conversation history and queue management
- ⏰ **Configurable scheduling**: Responds to messages every 7 minutes by default
- 🐳 **Docker support**: Easy deployment with Docker Compose

## Requirements

- Node.js
- Redis server
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- LLM service (OpenAI, Cloudflare AI, Ollama or OpenAI Compatible API)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd fake-me
```

2. Install dependencies:
```bash
npm install
```

3. Create configuration file:
```bash
cp config.template.yml config.yml
```

4. Create environment file:
```bash
cp .env.template .env
```

5. Configure your environment variables in `.env`

6. Configure your configuration in `config.yml`

7. Compile TypeScript:
```bash
npm run compile
```

8. Start the bot:
```bash
npm start
```

### Docker Deployment

1. Copy `.env.template` to `.env` and configure with own keys, etc.

2. Copy `config.template.yml` to `config.yml` and configure with chats instructions.

3. Start with Docker Compose:
```bash
docker-compose -f docker/docker-compose.yml up -d # --build to build from source
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token (required) | - |
| `TELEGRAM_OWN_ID` | Your Telegram user ID (to distinguish your messages) (required) | - |
| `OPENAI_API_KEY` | Your OpenAI API key (optional, for OpenAI integration) | - |
| `OLLAMA_URI` | URI for the Ollama server (optional) | http://localhost:11434 |
| `OLLAMA_MODEL` | Model to use with Ollama (optional) | llama3.1 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (optional, for Cloudflare AI) | - |
| `CLOUDFLARE_AUTH_KEY` | Cloudflare authorization key (optional, for Cloudflare AI) | - |
| `CLOUDFLARE_MODEL` | Cloudflare model name (optional, for Cloudflare AI) | - |
| `REDIS_URL` | URL for the Redis server (optional) | redis://localhost:6379 |
| `TZ` | Timone | UTC |

### Chat Configuration (`config.yml`)

The bot uses instruction sets to define different behaviors for different chats:

```yaml
version: 1

instruction_sets:
  default:
    name: Default behavior
    description: Pretend to be the user and reply without getting caught
    instructions:
      - You are an AI that can pretend to be a real person, but no one has to know about it.
      - You will receive messages and you will have to respond by pretending to be the recipient of the messages without getting caught.
      - Do not answer with a question unless it is really necessary in the speech.
      - You are not an assistant. You don't have to serve the user but just have conversation.
      - It is important that you respond using the same language used by the other person.
  
  emojis:
    name: Emojis behavior
    description: Reply always with only emojis
    instructions:
      - Reply always with only emojis

chats:
  - instruction_set: default
    ids:
      - 13579
      - 24680
  - instruction_set: emojis
    ids:
      - 123456789
```

## How It Works

1. **Message Reception**: The bot listens for business messages on Telegram
2. **Message Storage**: Incoming messages are stored in Redis with conversation history
3. **Queue Management**: Non-self messages are added to a processing queue
4. **Scheduled Processing**: Every 7 minutes, the bot processes queued chats
5. **AI Response**: Generates responses using configured instruction sets and chat history
6. **Message Sending**: Sends AI-generated responses back to the original chat

## Usage

1. Set up a Telegram Business account
2. Create a bot using [@BotFather](https://t.me/botfather)
3. Configure LLM to use
4. Configure the bot with your credentials 
5. Add chat IDs and instruction sets to your `config.yml` file
   - Finding chat IDs: forward a message of target chat to a bot like [@my_id_bot](https://t.me/my_id_bot)
6. Start the bot and let it handle your messages automatically

## Credits
_Fake Me_ is made with ♥ by [derogab](https://github.com/derogab) and it's released under the [MIT license](./LICENSE).

## Contributors

<a href="https://github.com/derogab/fake-me/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=derogab/fake-me" />
</a>

## Tip
If you like this project or directly benefit from it, please consider buying me a coffee:  
🔗 `bc1qd0qatgz8h62uvnr74utwncc6j5ckfz2v2g4lef`  
⚡️ `derogab@sats.mobi`  
💶 [Sponsor on GitHub](https://github.com/sponsors/derogab)

## Stargazers over time
[![Stargazers over time](https://starchart.cc/derogab/fake-me.svg?variant=adaptive)](https://starchart.cc/derogab/fake-me)
