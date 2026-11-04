import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/game/GameApp";

export const Route = createFileRoute("/house")({
  component: GameApp,
  head: () => ({
    meta: [
      { title: "Larkspur" },
      { name: "description", content: "Two-player first-person hide and seek in a night house." },
    ],
  }),
});
