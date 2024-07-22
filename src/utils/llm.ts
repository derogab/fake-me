// Dependencies.
import * as dotenv from 'dotenv';
import { Ollama } from 'ollama';
import OpenAI from 'openai';

// Types.
import type { ChatCompletionMessageParam } from 'openai/resources';
import type { Message } from 'ollama';

export type MessageInputParam = ChatCompletionMessageParam | Message;

// Configs.
dotenv.config();

/**
 * Generate a response from the OpenAI API.
 * 
 * @param messages the messages to be sent to the OpenAI API.
 * @returns the response string from the OpenAI API.
 */
async function generate_openai(messages: ChatCompletionMessageParam[]): Promise<ChatCompletionMessageParam> {
  // Create a new instance of the OpenAI class.
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // Call the OpenAI API.
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-4o-mini',
  });
  // Return the response.
  return chatCompletion.choices[0].message;
}

/**
 * Generate a response using Ollama Local API.
 * 
 * @param messages the messages to be sent to Ollama.
 * @returns the response string.
 */
async function generate_ollama(messages: Message[]): Promise<Message> {
  // Create a new instance of the OpenAI class.
  const ollama = new Ollama({ host: process.env.OLLAMA_URI || 'http://localhost:11434' });
  // Call the Ollama API.
  const response = await ollama.chat({
    model: process.env.OLLAMA_MODEL || 'llama3',
    messages: messages,
  });
  // Return the response.
  return response['message'];
}

/**
 * Generate a response using an LLM.
 * 
 * @param messages the messages to be sent to the LLM.
 * @returns the response string.
 */
export async function generate(messages: MessageInputParam[]): Promise<MessageInputParam> {
  // Check what LLM to use, based on the environment variable.
  if (process.env.OPENAI_API_KEY) {
    // If openai key is available, use openai.
    return await generate_openai(messages as ChatCompletionMessageParam[]);
  
  } else if (process.env.OLLAMA_URI) {
    // If ollama is available, use ollama.
    return await generate_ollama(messages as Message[]);

  } else {
    // Throw an error if no LLM is available.
    throw new Error('No available LLM found.');
  }
}
