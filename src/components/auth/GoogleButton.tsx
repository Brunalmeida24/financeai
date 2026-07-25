"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface GoogleButtonProps {
  mode: "signin" | "signup";
  callbackUrl?: string;
}

/**
 * Botão "Entrar com Google" — usa next-auth/react para disparar o fluxo
 * OAuth. O provider só funciona se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
 * estiverem setadas (válido no `authOptions`).
 */
export function GoogleButton({ mode, callbackUrl = "/dashboard" }: GoogleButtonProps) {
  const label =
    mode === "signup" ? "Cadastrar com Google" : "Entrar com Google";

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl })}
      leftIcon={
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.8 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C33.6 6.1 29.1 4 24 4c-7.5 0-14 4.1-17.7 10.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5 0 9.5-1.9 13-5l-6-5c-2 1.5-4.4 2.4-7 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.9 16.3 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.6 5l6 5c4.2-3.9 6.7-9.6 6.7-16 0-1.2-.1-2.4-.4-3.5z"
          />
        </svg>
      }
    >
      {label}
    </Button>
  );
}
