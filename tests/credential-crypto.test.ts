import { describe, expect, it } from "vitest";

import { credentialHint, decryptCredential, encryptCredential } from "../server/credential-crypto";

describe("user credential encryption", () => {
  it("encrypts and decrypts an API key without returning the raw value in its stored payload", () => {
    const apiKey = "sk-example-user-owned-key-1234567890";
    const stored = encryptCredential(apiKey, "test-session-secret");

    expect(stored).not.toContain(apiKey);
    expect(decryptCredential(stored, "test-session-secret")).toBe(apiKey);
    expect(credentialHint(apiKey)).toBe("••••7890");
  });

  it("refuses to decrypt with a different project secret", () => {
    const stored = encryptCredential("sk-example-user-owned-key-1234567890", "first-secret");
    expect(() => decryptCredential(stored, "second-secret")).toThrow();
  });
});

