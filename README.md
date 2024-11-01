# TS-SWARM 🐝

[![npm version](https://img.shields.io/npm/v/ts-swarm.svg)](https://www.npmjs.com/package/ts-swarm)
![NPM Downloads](https://img.shields.io/npm/dw/ts-swarm?link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fts-swarm)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

TS-SWARM is a minimal TypeScript Agentic library mixing the simplicity of [OpenAI Swarm API](https://github.com/openai/swarm) with the flexibility of the [Vercel AI SDK](https://github.com/vercel/ai).

> [!WARNING]
> This library is under active development and likely to continue to evolve towards the goal of simplicity and flexibility when working with ai agents. All feedback and contributions are welcome.

## Features

- **Multi-Agent System**: Create and manage multiple AI agents with different roles and capabilities.
- **Flexible Agent Configuration**: Easily define agent behaviors, instructions, and available functions.
- **Task Delegation**: Agents can transfer tasks to other specialized agents.
- **Tools**: Agents can use tools to perform tasks.
- **Zod Validation**: Tools can use zod validation to ensure the input is correct.
- **Model Choice**: Easily switch between different LLMs by changing a single line of code.
- **Local Agents**: Option to run locally with the [ollama-ai-provider](https://sdk.vercel.ai/providers/community-providers/ollama).

## Examples

Some examples of agents and agentic patterns, additionally take a look at [`examples/run.ts`](./examples/run.ts) on how to have a conversation with agents.

- [Local Agent with Ollama](./examples/local/localAgent.ts)
- [Pokemon Agent](./examples/pokemon/pokemonAgent.ts)
- [Web Scraper Agent](./examples/webscraper/webScraperAgent.ts)
- [Filesystem Agent](./examples/filesystem/filesystemAgent.ts)
- [Triage Weather Email Agents](./examples/triage-weather-email/index.ts)
- [All Agents Connected](./examples/all/index.ts)

> [!TIP]
> Grab the repo and invoke the examples via scripts provided in the [package.json](./package.json) :)

Demo using the [All Agents Connected](./examples/all/index.ts) example:
![All Agents Chat Example](./assets/all_agents_chat_example.jpg)

## Installation

Use your preferred package manager:

```bash
pnpm add ts-swarm ai zod
```

Depending on the LLM you want to use via the Vercel AI SDK, you will need to install the appropriate package.

**Run via an LLM provider service** such as OpenAI:

```bash
# OpenAI - Ensure OPENAI_API_KEY environment variable is set
pnpm add @ai-sdk/openai
```

**Or run locally** with [ollama-ai-provider](https://sdk.vercel.ai/providers/community-providers/ollama):

```bash
# Ollama - Ensure you leverage a model that supports tool calling
pnpm add ollama-ai-provider
```

## Usage

> [!TIP]
> The `createAgent` util is a thin wrapper over [`generateText` from the Vercel AI SDK](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-text). Thus you have access to **tools**, **zod validation**, and **model choice**. ⚡

```typescript
import { createAgent, runSwarm } from 'ts-swarm';
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
    weatherAgent,
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
// Query: What's the weather like in New York?
// Result: The weather in New York is sunny with a high of 67°F.
```

The following diagram demonstrates the usage above. A simple multi-agent system that allows for delegation of tasks to specialized agents.

![Swarm Diagram](./assets/swarm_diagram.png)

To see more examples, check out the [examples](./examples) directory.

Otherwise, for more examples please refer to the original openai repo: [swarm](https://github.com/openai/swarm)

The primary goal of Swarm is to showcase the handoff & routines patterns explored in the [Orchestrating Agents: Handoffs & Routines cookbook](https://cookbook.openai.com/examples/orchestrating_agents)

## Roadmap

- [ ] Support streaming
- [ ] Provide agentic design pattern examples
- [ ] More test coverage
- [ ] Bash the bugs
- [ ] Continue to find as much simplicity while maintaining flexibility :)

## Contributing

We welcome contributions to TS-SWARM! If you'd like to contribute, please see [CONTRIBUTING.md](./CONTRIBUTING.md) for more information.

## Troubleshooting

If you're experiencing issues, please [open an issue](https://github.com/joshmu/ts-swarm/issues) on the GitHub repository with a detailed description of the problem and steps to reproduce it.

## Acknowledgements

It goes without saying that this project would not have been possible without the original work done by the OpenAI & Vercel teams. :) Go give the [Swarm API](https://github.com/openai/swarm) & [Vercel AI SDK](https://github.com/vercel/ai) a star! ⭐

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) for details.
