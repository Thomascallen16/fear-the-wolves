import { afterEach, describe, expect, it, vi } from "vitest";

import { requestAssistant, validateOpenAIKey } from "../server/openai-assistant";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("OpenAI assistant server client", () => {
  it("validates a user-supplied key through the models endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    global.fetch = fetchMock;

    await expect(validateOpenAIKey("sk-user-example-1234567890")).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/models",
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer sk-user-example-1234567890" }) }),
    );
  });

  it("uses the Responses API and returns only the assistant text to the caller", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ output_text: "Ready-to-paste prompt" }), { status: 200 }),
    );
    global.fetch = fetchMock;

    await expect(requestAssistant({
      apiKey: "sk-user-example-1234567890",
      mode: "refine",
      prompt: "Make my prompt clearer.",
    })).resolves.toEqual({ answer: "Ready-to-paste prompt", model: "gpt-5.6" });

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(request.headers).toEqual(expect.objectContaining({ Authorization: "Bearer sk-user-example-1234567890" }));
    expect(request.body).toContain("Make my prompt clearer.");
  });
});
