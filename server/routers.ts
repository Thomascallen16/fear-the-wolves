import { COOKIE_NAME } from "../shared/const.js";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { credentialHint, decryptCredential, encryptCredential } from "./credential-crypto";
import { requestAssistant, validateOpenAIKey } from "./openai-assistant";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const apiKeyInput = z.object({
  apiKey: z.string().trim().min(20, "Enter a valid OpenAI API key.").max(500),
});

const assistantInput = z.object({
  mode: z.enum(["refine", "research", "communication", "task"]),
  prompt: z.string().trim().min(3, "Add a request before sending.").max(12_000),
  context: z.string().trim().max(12_000).optional(),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  openai: router({
    status: protectedProcedure.query(async ({ ctx }) => {
      const connection = await db.getOpenAIConnection(ctx.user.id);
      return connection
        ? { connected: true, keyHint: connection.keyHint, validatedAt: connection.validatedAt, model: connection.model }
        : { connected: false, keyHint: null, validatedAt: null, model: null };
    }),

    connect: protectedProcedure.input(apiKeyInput).mutation(async ({ ctx, input }) => {
      await validateOpenAIKey(input.apiKey);
      await db.saveOpenAIConnection({
        userId: ctx.user.id,
        encryptedApiKey: encryptCredential(input.apiKey),
        keyHint: credentialHint(input.apiKey),
        validatedAt: new Date(),
      });
      return { connected: true, keyHint: credentialHint(input.apiKey) };
    }),

    disconnect: protectedProcedure.mutation(async ({ ctx }) => {
      await db.removeOpenAIConnection(ctx.user.id);
      return { connected: false };
    }),

    assist: protectedProcedure.input(assistantInput).mutation(async ({ ctx, input }) => {
      const connection = await db.getOpenAIConnection(ctx.user.id);
      if (!connection) {
        throw new Error("Connect your OpenAI Platform API key in Settings before using the assistant.");
      }

      return requestAssistant({
        apiKey: decryptCredential(connection.encryptedApiKey),
        mode: input.mode,
        prompt: input.prompt,
        context: input.context,
      });
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
