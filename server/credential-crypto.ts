import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

import { ENV } from "./_core/env";

const VERSION = "v1";

function deriveKey(secret: string) {
  if (!secret) {
    throw new Error("Credential encryption is unavailable because the project session secret is missing.");
  }
  return createHash("sha256").update(`prompt-bridge/openai-credential/${secret}`).digest();
}

export function encryptCredential(plainText: string, secret = ENV.cookieSecret) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptCredential(payload: string, secret = ENV.cookieSecret) {
  const [version, ivEncoded, tagEncoded, encryptedEncoded] = payload.split(".");
  if (version !== VERSION || !ivEncoded || !tagEncoded || !encryptedEncoded) {
    throw new Error("Stored credential format is not valid.");
  }

  const decipher = createDecipheriv("aes-256-gcm", deriveKey(secret), Buffer.from(ivEncoded, "base64url"));
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedEncoded, "base64url")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export function credentialHint(apiKey: string) {
  const suffix = apiKey.trim().slice(-4);
  return suffix ? `••••${suffix}` : "••••";
}
