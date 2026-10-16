/** Nom court d'une carte : « Tokyo 2099: Spider-Islands » → « Spider-Islands ». */
export const mapShortName = (name: string) => (name.includes(":") ? name.split(":").slice(1).join(":").trim() : name);
/** Zone de la carte : « Tokyo 2099: Spider-Islands » → « Tokyo 2099 ». */
export const mapZone = (name: string) => (name.includes(":") ? name.split(":")[0].trim() : "");

export const mapSlug = (name: string) =>
  mapShortName(name)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Guides généraux (hors héros, rôles et cartes). */
export const GENERAL_GUIDES = [
  { slug: "game-sense", title: "Game sense", blurb: "Cooldowns, cycle d'ults, staggers, espace : lire la partie." },
  { slug: "solo-queue", title: "Survivre en solo queue", blurb: "Mental, flex, comms et réglages pour monter seul." },
] as const;
