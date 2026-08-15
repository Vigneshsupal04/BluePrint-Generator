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
          name: {
            type: "string",
            description: "The title of the feature."
          },
          description: {
            type: "string",
            description: "A detailed description of the feature."
          }
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
          category: {
            type: "string",
            description: "The category (e.g., Frontend, Backend, Database, Deployment)."
          },
          recommendation: {
            type: "string",
            description: "The recommended technology."
          },
          reason: {
            type: "string",
            description: "A brief justification for the recommendation."
          }
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
          name: {
            type: "string",
            description: "The name of the milestone."
          },
          description: {
            type: "string",
            description: "What will be accomplished in this milestone."
          },
          duration: {
            type: "string",
            description: "Estimated time to complete."
          }
        },
        required: ["name", "description", "duration"]
      }
    },
    uiDesignPrototype: {
      type: "object",
      description: "A concept for the UI/UX design.",
      properties: {
        concept: {
          type: "string",
          description: "The overall design philosophy."
        },
        layout: {
          type: "string",
          description: "A description of the main screen layout."
        },
        colorPalette: {
          type: "array",
          description: "A list of 3-5 hex color codes.",
          items: {
            type: "string"
          }
        }
      },
      required: ["concept", "layout", "colorPalette"]
    }
  },
  required: [
    "projectName",
    "description",
    "features",
    "techStack",
    "milestones",
    "uiDesignPrototype"
  ]
};

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API_KEY or GEMINI_API_KEY environment variable is not set."
    );
  }

  return apiKey;
};

export const generateBlueprint = async (
  idea: string
): Promise<ProjectBlueprint> => {
  const apiKey = getApiKey();

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://blueprint-generator.local",
          "X-Title": "Blueprint Generator"
        },

        body: JSON.stringify({
  model: "openrouter/free",
  max_tokens: 4000,
  messages: [
    {
      role: "system",
      content: `You are a senior software architect.

Generate a project blueprint from the user's idea.

Return ONLY valid JSON matching this schema:

${JSON.stringify(blueprintSchema)}`
    },
    {
      role: "user",
      content: idea
    }
  ],
  response_format: {
    type: "json_object"
  }
});

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        `OpenRouter API error: ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI returned an empty response.");
    }

    // Remove markdown code fences if the model adds them
    const jsonText = content
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const blueprint = JSON.parse(jsonText) as ProjectBlueprint;

    return blueprint;

  } catch (error) {
    console.error("Error generating blueprint:", error);

    if (error instanceof Error) {
      throw new Error(
        `Failed to generate blueprint from AI: ${error.message}`
      );
    }

    throw new Error(
      "An unknown error occurred while generating the blueprint."
    );
  }
};

export const generateAllMockups = async (): Promise<any> => {
  // Kept for compatibility
  return {};
};
