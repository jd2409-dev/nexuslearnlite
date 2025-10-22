import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {defineString} from 'genkit';

const geminiApiKey = defineString({
  name: 'GEMINI_API_KEY',
  description: 'Your Gemini API key',
});

export const ai = genkit({
  plugins: [googleAI({apiKey: geminiApiKey})],
  model: 'googleai/gemini-2.5-flash',
});
