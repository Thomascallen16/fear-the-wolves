type AssistantMode = "refine" | "research" | "communication" | "task";

const OPENAI_API_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-5.6";

const modeInstructions: Record<AssistantMode, string> = {
  refine: "Improve the user's prompt without changing its objective. Return a ready-to-paste prompt first, then a concise explanation of the changes.",
  research: "Act as a source-first research coach. Separate verified facts, direct quotes, inferences, unknowns, and next verification actions. Do not invent sources, records, citations, or web-search results.",
  communication: "Act as a clear, respectful communication coach. Preserve the user's facts and intent, make the purpose and next step explicit, and avoid adding facts or inflammatory claims.",
  task: "Help the user plan a practical task. State assumptions, ask only essential clarifying questions, sequence the work, identify safety or qualification boundaries, and avoid overclaiming.",
};

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function responseError(response: Response, fallback: string) {
  const body = await response.text().catch(() => "");
  return body ? `${fallback} (${response.status}): ${body.slice(0, 300)}` : `${fallback} (${response.status})`;
}

export async function validateOpenAIKey(apiKey: string) {
  const response = await fetch(`${OPENAI_API_URL}/models`, { headers: headers(apiKey) });
  if (!response.ok) {
    throw new Error(await responseError(response, "OpenAI key validation failed"));
  }
  return true;
}

export async function requestAssistant({
  apiKey,
  mode,
  prompt,
  context,
}: {
  apiKey: string;
  mode: AssistantMode;
  prompt: string;
  context?: string;
}) {
  const instructions = [
    "You are Prompt Bridge, a practical assistant for well-structured prompts, public-records research, work, learning, and communication.",
    modeInstructions[mode],
    "Do not claim access to the user's ChatGPT history, private accounts, hidden information, or external records. If material is not provided, say so plainly.",
    "For legal, trade, medical, financial, or safety-sensitive questions, give general educational information and flag when a licensed or qualified professional is appropriate.",
    "Use concise Markdown with a useful answer first.",
  ].join("\n\n");

  const input = context?.trim()
    ? `User request:\n${prompt}\n\nRelevant context supplied by the user:\n${context}`
    : prompt;

  const response = await fetch(`${OPENAI_API_URL}/responses`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      instructions,
      input,
    }),
  });

  if (!response.ok) {
    throw new Error(await responseError(response, "OpenAI assistant request failed"));
  }

  const result = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  const fallback = result.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();

  const answer = result.output_text?.trim() || fallback;
  if (!answer) {
    throw new Error("OpenAI returned no usable text response.");
  }

  return { answer, model: DEFAULT_MODEL };
}
