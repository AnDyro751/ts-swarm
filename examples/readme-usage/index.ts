/**
 * This is the usage example for the README.md file.
 */

import 'dotenv/config';
import { createAgent, runSwarm } from '../../src';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { z } from 'zod';

// Create the Weather Agent
const weatherAgent = createAgent({
  id: 'Weather_Agent',
  model: openai('gpt-4o-2024-08-06', { structuredOutputs: true }),
  system: `You are a weather assistant. 
  Your role is to:
    - Provide weather information for requested locations
    - Use the weather tool to fetch weather data`,
  tools: [
    {
      id: 'weather',
      description: 'Get the weather for a specific location',
      parameters: z.object({
        location: z.string().describe('The location to get weather for'),
      }),
      execute: async ({ location }) => {
        // Mock weather API call
        return `The weather in ${location} is sunny with a high of 67°F.`;
      },
    },
  ],
});

// Create the Triage Agent
const triageAgent = createAgent({
  id: 'Triage_Agent',
  model: openai('gpt-4o-2024-08-06', { structuredOutputs: true }),
  system: `You are a helpful triage agent. 
  Your role is to:
    - Answer the user's questions by transferring to the appropriate agent`,
  tools: [
    // Add ability to transfer to weather agent
    () => weatherAgent,
  ],
});

async function demo() {
  // Example conversation
  const messages = [
    { role: 'user' as const, content: "What's the weather like in New York?" },
  ];

  // Run the swarm
  const result = await runSwarm({
    agent: triageAgent,
    messages,
  });

  // Log the last message (or the entire conversation if you prefer)
  const lastMessage = result.messages[result.messages.length - 1];
  console.log(
    `${lastMessage.swarmMeta?.agentId || 'User'}: ${lastMessage.content}`,
  );
}

demo();
