/** Shared round types for Larkspur. Positions are never trusted as competitive
 *  authority — this is a casual two-friend game, so each browser simulates its
 *  own body and tells the other where it is. */

export type Role = "hider" | "seeker";
export type Phase = "lobby" | "hide" | "seek" | "result";
export type PickRole = "hider" | "seeker" | "either";

export type NetMsg =
  | { k: "hi"; name: string; creator: boolean; pick: PickRole; ready: boolean }
  | { k: "lobby"; pick: PickRole; ready: boolean }
  | {
      k: "start";
      round: number;
      hiderId: string;
      seekerId: string;
      hideMs: number;
      seekMs: number;
      contested: boolean;
    }
  | { k: "end"; round: number; winner: Role; reason: "tag" | "time" }
  | { k: "tag"; round: number }
  | { k: "pose"; seq: number; x: number; z: number; yaw: number; pitch: number; c: 0 | 1 };
