import { Bot } from "grammy";
import { Context } from "grammy";
import { generate } from '../utils/llm';
import Storage, * as dataUtils from "../utils/data";

/**
 * Generate a key from a chat id.
 * 
 * @param chatId the chat id.
 * @returns the generated key.
 */
function generate_key(chatId: string | number) {
  return `chat:${chatId}`;
}

/**
 * Function to be called when a message is received.
 * 
 * @param storage the storage instance.
 * @param ctx the context of the telegram message.
 */
export async function onMessageReceived(storage: Storage, ctx: Context) {
  // Get the message from the context and extract info.
  const message = ctx.update.message || ctx.update.business_message;
  const text = message?.text;
  const chatId = message?.chat.id ? ''+message?.chat.id : undefined;
  const fromId = message?.from?.id ? ''+message?.from?.id : undefined;
  const businessConnectionId = message?.business_connection_id;

  // Check if chatId is not available.
  if (!chatId) throw new Error('No Chat found.');

  // Generate key.
  const key = generate_key(chatId);

  // Save business connection id if available.
  if (businessConnectionId) await dataUtils.saveBusinessConnectionId(storage, chatId, businessConnectionId);

  // Update history if text is not empty.
  if (text) {
    // Define role based on the sender. If the sender is my-self, consider it as a message from the AI.
    const role = fromId == process.env.TELEGRAM_OWN_ID ? 'assistant' : 'user';
    // Update history.
    await dataUtils.updateHistory(storage, key, { role: role, content: text });
    // Add chat to queue, only if the message is not from my-self.
    if (fromId !== process.env.TELEGRAM_OWN_ID) await dataUtils.addChat(storage, 'chat-queue', '' + chatId);
  }
}

/**
 * Function to send a message.
 * 
 * @param storage the storage instance.
 */
export async function sendMessage(bot: Bot, storage: Storage) {
  // Retrieve a chat from the queue.
  const chatId = await dataUtils.getChat(storage, 'chat-queue');
  // If no chat is available, return.
  if (!chatId) return;

  // Set the bot as typing.
  await bot.api.sendChatAction(chatId, 'typing').catch(() => {});
  
  // Generate key.
  const key = generate_key(chatId);
  // Get history.
  const history = await dataUtils.getHistory(storage, key);

  // Generate a smart reply using the AI based on instructions and chat history.
  const m = await generate([
    // Instructions for the AI.
    { role: 'system', content: "You are an AI that can pretend to be a real person, but no one has to know about it." },
    { role: 'system', content: "You will receive messages and you will have to respond by pretending to be the recipient of the messages without getting caught." },
    { role: 'system', content: "Do not answer with a question unless it is really necessary in the speech." },
    { role: 'system', content: "You are not an assistant. You don't have to serve the user but just have conversation." },
    { role: 'system', content: "It is important that you respond using the same language used by the other person." },
    // Chat history.
    ... history
  ]);

  // Get business connection id.
  const businessConnectionId = await dataUtils.getBusinessConnectionId(storage, chatId);
  // Generate options.
  const options = businessConnectionId ? { business_connection_id: businessConnectionId } : {};
  // Send the message.
  await bot.api.sendMessage(chatId, m.content as string, options);
  // Update history with the response.
  await dataUtils.updateHistory(storage, key, m);
}
