
import { ProjectBlueprint } from '../types';

const blueprintSchema = {
  type: "object",
  properties: {
    projectName: {
      type: "string",
      description: "A creative and catchy name for the project."
    },
    description: {
      type: "string",
      description: "A concise, one-paragraph summary of the project idea."
    },
    features: {
      type: "array",
      description: "A list of key features for the application.",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "The title of the feature." },
          description: { type: "string", description: "A detailed description of the feature." }
        },
        required: ["name", "description"]
      }
    },
    techStack: {
      type: "array",
      description: "Recommended technology stack, categorized.",
      items: {
        type: "object",
        properties: {
          category: { type: "string", description: "The category (e.g., Frontend, Backend, Database, Deployment)." },
          recommendation: { type: "string", description: "The recommended technology (e.g., React, Node.js, PostgreSQL, Vercel)." },
          reason: { type: "string", description: "A brief justification for the recommendation." }
        },
        required: ["category", "recommendation", "reason"]
      }
    },
    milestones: {
      type: "array",
      description: "A high-level project plan with key milestones.",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the milestone (e.g., 'Phase 1: MVP Development')." },
          description: { type: "string", description: "What will be accomplished in this milestone." },
          duration: { type: "string", description: "Estimated time to complete (e.g., '4 weeks')." }
        },
        required: ["name", "description", "duration"]
      }
    },
    uiDesignPrototype: {
      type: "object",
      description: "A concept for the UI/UX design.",
      properties: {
        concept: { type: "string", description: "The overall design philosophy (e.g., 'Minimalist and Clean', 'Data-rich Dashboard')." },
        layout: { type: "string", description: "A description of the main screen layout." },
        colorPalette: { 
            type: "array", 
            description: "A list of 3-5 hex color codes for the primary, secondary, and accent colors.",
            items: { type: "string" }
        }
      },
      required: ["concept", "layout", "colorPalette"]
    }
  },
  required: ["projectName", "description", "features", "techStack", "milestones", "uiDesignPrototype"]
};

const getApiKey = () => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY or GEMINI_API_KEY environment variable is not set.");
    }
    return apiKey;
}

export const generateBlueprint = async (idea: string): Promise<ProjectBlueprint> => {
  const apiKey = getApiKey();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://blueprint-generator.local",
        "X-Title": "Blueprint Generator",
      },
    //   body: JSON.stringify({
    //     // model: "google/gemini-2.0-flash-001",
    //     model: "google/gemini-2.5-flash",
    //     messages: [
    //       {
    //         role: "system",
    //         content: `You are a world-class senior software architect and product manager. Your task is to take a user's project idea and generate a comprehensive, structured project blueprint. Be creative, practical, and provide insightful recommendations. Your response MUST be in JSON format and strictly adhere to the provided schema: ${JSON.stringify(blueprintSchema)}`
    //       },
    //       {
    //         role: "user",
    //         content: idea
    //       }
    //     ],
    //     response_format: { type: "json_object" }
    //   })
    // });

      body: JSON.stringify({
  model: "openrouter/free",
  max_tokens: 8000,
  messages: [
    {
      role: "system",
      content: `You are a world-class senior software architect and product manager.
Your task is to take a user's project idea and generate a comprehensive,
structured project blueprint.

Your response MUST be in JSON format and strictly adhere to the provided schema:
${JSON.stringify(blueprintSchema)}`
    },
    {
      role: "user",
      content: idea
    }
  ],
  response_format: { type: "json_object" }
})
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const jsonText = data.choices[0].message.content.trim();
    return JSON.parse(jsonText) as ProjectBlueprint;
  } catch (error) {
    console.error("Error generating blueprint:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate blueprint from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the blueprint.");
  }
};

export const generateAllMockups = async (): Promise<any> => {
    // This function is no longer needed but kept for compatibility during transition
    return {};
};
