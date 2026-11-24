import cs2Cover from "@assets/games/cs2-cover.webp";
import valorantCover from "@assets/games/valorant-cover.webp";
import fcCover from "@assets/games/fc-cover.webp";
import codCover from "@assets/games/cod-cover.webp";
import cs16Cover from "@assets/games/cs16-cover.webp";
import arenaPc from "@assets/games/arena-pc.webp";
import arenaPs5 from "@assets/games/arena-ps5.webp";

/*
 * Official store / press artwork (Valve, Riot Games, EA SPORTS, Activision),
 * used to show which titles are available at the lounge. Trademarks belong
 * to their respective owners. To add a game: drop a 600x900 webp into
 * src/assets/games and add an entry below.
 */

export interface Game {
  id: string;
  name: string;
  short: string;
  tag: string;
  platform: "PC" | "PS5" | "PC · LAN";
  cover?: string;
  accent: string;
}

export const GAMES: Game[] = [
  { id: "cs2", name: "Counter-Strike 2", short: "CS2", tag: "Competitive 5v5", platform: "PC", cover: cs2Cover, accent: "#FF9F1C" },
  { id: "valorant", name: "VALORANT", short: "VAL", tag: "Tactical hero shooter", platform: "PC", cover: valorantCover, accent: "#FF4655" },
  { id: "fc", name: "EA SPORTS FC 26", short: "FC", tag: "The FIFA experience", platform: "PS5", cover: fcCover, accent: "#00CED1" },
  { id: "cod", name: "Call of Duty", short: "COD", tag: "Squad up & drop in", platform: "PS5", cover: codCover, accent: "#9B51E0" },
  { id: "cs16", name: "Counter-Strike 1.6", short: "1.6", tag: "Old-school LAN battles", platform: "PC · LAN", cover: cs16Cover, accent: "#F5C518" },
];

export interface Arena {
  id: string;
  overline: string;
  title: string;
  text: string;
  chips: string[];
  image?: string;
  imagePosition?: string;
  accent: string;
  cta: ArenaCta;
  secondary?: ArenaCta;
}

export type ArenaCta = { kind: "link"; label: string; to: string } | { kind: "call"; label: string };

export const ARENAS: Arena[] = [
  {
    id: "pc",
    overline: "PC Arena",
    title: "Frag on PC",
    text: "High-end rigs tuned for ranked play — CS2, VALORANT and classic CS 1.6 on LAN.",
    chips: ["RTX 5070", "32GB RAM", "244Hz", "Fiber internet"],
    image: arenaPc,
    imagePosition: "78% center",
    accent: "#FF9F1C",
    cta: { kind: "link", label: "Book a PC", to: "/reserve?type=pc" },
    secondary: { kind: "link", label: "See free PCs", to: "/gaming" },
  },
  {
    id: "ps5",
    overline: "PS5 Rooms",
    title: "Own the pitch",
    text: "Two private PS5 rooms for EA SPORTS FC, Call of Duty and the latest console games.",
    chips: ["2 private rooms", "EA SPORTS FC 26", "Call of Duty"],
    image: arenaPs5,
    imagePosition: "40% 30%",
    accent: "#00CED1",
    cta: { kind: "link", label: "Book a PS5 room", to: "/reserve?type=playstation" },
    secondary: { kind: "call", label: "Call us" },
  },
];
