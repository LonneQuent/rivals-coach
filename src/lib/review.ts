/**
 * Bilan d'une partie : verdict (ce qui a fait perdre ou gagner, et quoi faire), compo, counters, synergies, swaps.
 * Tout est calculé par règles à partir de la feuille de match, des guides (counters, synergies, team-ups,
 * faiblesses, style) et des compos (qui bat qui). Aucun texte n'est généré : les explications viennent des
 * guides, et chaque cause affichée est un écart mesuré sur la feuille de match.
 */
import { ROLES, type Role } from "@/lib/types";

export type ReviewHero = { id: number; slug: string; name: string; roles: Role[]; portrait_url?: string | null };
export type GuideLite = {
  counters: { hero: string; note: string }[];
  synergies: { hero: string; note: string }[];
  teamups: { name: string; partners: string[]; text: string }[];
  /** Style de jeu en quelques mots (« Dive », « Brawl »…). */
  tags?: string[];
};
/** Compo de référence : sert à reconnaître le style d'une équipe et à savoir quel style bat lequel. */
export type CompLite = {
  slug: string;
  name: string;
  tagline: string;
  /** Héros de la compo et leurs remplaçants (slugs). */
  heroes: string[];
  strong_vs: { comp: string; note: string }[];
  weak_vs: { comp: string; note: string }[];
};

type Stats = { kills: number | null; deaths: number | null; assists: number | null; final_hits: number | null; damage: number | null; damage_blocked: number | null; healing: number | null; accuracy: number | null };
export type RosterEntry = { side: "ally" | "enemy"; me: boolean; hero_id: number | null; /** Rôle lu sur la capture. */ role?: Role | null } & Stats;

export type ReviewInput = {
  result: "win" | "loss";
  /** Héros joués par le joueur, le principal en premier, avec le rôle tenu. */
  mine: { hero: ReviewHero; role: Role }[];
  /** Les cinq autres joueurs de son équipe (vide si la partie a été saisie à la main). */
  allies: ReviewHero[];
  enemies: ReviewHero[];
  guides: Map<string, GuideLite>;
  /** Héros que le joueur sait jouer : mains, héros à entraîner, héros déjà joués. */
  pool: ReviewHero[];
  roster: RosterEntry[];
  comps?: CompLite[];
  /** Totaux du joueur sur cette partie (utiles quand il n'y a pas de feuille de match). */
  totals?: { deaths: number | null };
  /** Moyennes du joueur sur ce héros, hors de cette partie. */
  baseline?: { matches: number; deaths: number | null } | null;
};

export type Note = { tone: "good" | "warn" | "info"; text: string };
export type Matchup = { hero: ReviewHero; note: string };
export type Step = { who: "toi" | "equipe"; title: string; detail: string; link?: { href: string; label: string } };
export type Verdict = {
  kind: "loss" | "win";
  /** La cause principale, en une phrase. */
  headline: string;
  /** Les écarts mesurés qui appuient le verdict. */
  causes: string[];
  /** Ce qu'il fallait faire (défaite) ou ce qui reste à corriger (victoire), par ordre d'importance. */
  steps: Step[];
  /** Le verdict s'appuie sur la feuille de match complète (12 joueurs). */
  full: boolean;
};
export type Style = "brawl" | "dive" | "poke";
export type Review = {
  verdict: Verdict | null;
  comp: { ally: Record<Role, number> | null; enemy: Record<Role, number> | null; notes: Note[]; allyStyle: Style | null; enemyStyle: Style | null };
  /** Adversaires qui contrent ton héros (d'après son guide). */
  threats: Matchup[];
  /** Adversaires que ton héros contre (d'après leur guide). */
  targets: Matchup[];
  synergies: Matchup[];
  teamups: { name: string; partner: ReviewHero; text: string }[];
  /** Alliés pris pour cible par la compo adverse. */
  pressured: { ally: ReviewHero; by: ReviewHero[] }[];
  swaps: { hero: ReviewHero; reasons: string[] }[];
  facts: string[];
};

const STYLES: Style[] = ["brawl", "dive", "poke"];
const count = (heroes: { roles: Role[] }[]) => {
  const out = { Vanguard: 0, Duelist: 0, Strategist: 0 } as Record<Role, number>;
  for (const h of heroes) out[h.roles[0]]++;
  return out;
};

export const compLabel = (c: Record<Role, number>) => ROLES.map((r) => c[r]).join("-");

function compNotes(c: Record<Role, number>): Note[] {
  const notes: Note[] = [];
  const V = c.Vanguard, D = c.Duelist, S = c.Strategist;
  if (V === 2 && D === 2 && S === 2) notes.push({ tone: "good", text: "Compo équilibrée : deux Vanguards, deux Duelists, deux Strategists." });
  if (V === 0) notes.push({ tone: "warn", text: "Aucun Vanguard : personne ne tient la ligne de front, chaque fight se joue directement sur vos supports." });
  else if (V === 1) notes.push({ tone: "info", text: "Un seul Vanguard : il encaisse seul. S'il tombe, l'accès à votre backline est ouvert." });
  else if (V >= 3) notes.push({ tone: "info", text: `${V} Vanguards : beaucoup de présence, mais moins de dégâts pour finir les cibles.` });
  if (S === 0) notes.push({ tone: "warn", text: "Aucun Strategist : sans soins, les fights longs tournent contre vous." });
  else if (S === 1) notes.push({ tone: "warn", text: "Un seul Strategist : tous les soins reposent sur lui, c'est la cible prioritaire d'en face." });
  else if (S >= 3) notes.push({ tone: "info", text: `${S} Strategists : beaucoup de soins et d'ults défensives, moins de dégâts.` });
  if (D >= 4) notes.push({ tone: "warn", text: `${D} Duelists : peu de soins et de protection pour autant de héros fragiles.` });
  return notes;
}

const pct = (v: number) => `${Math.round(v * 100)} %`;
const fr = (v: number, d = 0) => v.toLocaleString("fr-FR", { maximumFractionDigits: d });
const list = (names: string[]) => (names.length <= 1 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`);
const times = (v: number) => `${fr(v)} fois`;

function facts(roster: RosterEntry[], role: Role | null): string[] {
  const allies = roster.filter((r) => r.side === "ally");
  const me = allies.find((r) => r.me);
  if (!me || allies.length < 4) return [];
  const out: string[] = [];
  const share = (key: "damage" | "healing" | "damage_blocked", label: string, floor: number) => {
    const mine = me[key];
    const total = allies.reduce((s, r) => s + (r[key] ?? 0), 0);
    if (mine === null || total <= 0 || mine / total < floor) return;
    const rank = allies.filter((r) => (r[key] ?? 0) > mine).length + 1;
    out.push(`${pct(mine / total)} ${label} de ton équipe (${rank === 1 ? "1er" : `${rank}e`} sur ${allies.length}).`);
  };
  if (role !== "Strategist") share("damage", "des dégâts", 0);
  if (role === "Strategist") share("healing", "des soins", 0);
  if (role === "Vanguard") share("damage_blocked", "des dégâts bloqués", 0);
  if (role === "Strategist") share("damage", "des dégâts", 0.2);
  const enemyKills = roster.filter((r) => r.side === "enemy").reduce((s, r) => s + (r.final_hits ?? 0), 0);
  const allyKills = allies.reduce((s, r) => s + (r.final_hits ?? 0), 0);
  if (me.final_hits !== null && allyKills > 0 && enemyKills > 0) out.push(`Final hits : ${allyKills} pour ton équipe, ${enemyKills} pour l'équipe adverse (${me.final_hits} pour toi).`);
  return out;
}

type Row = RosterEntry & { hero: ReviewHero | null; r: Role | null };
/** `personal` : la règle porte sur les chiffres du joueur lui-même (ses morts, ses dégâts, son héros). */
type Finding = { weight: number; headline: string; cause: string; steps: Step[]; personal?: boolean; id?: "counters" };

/** Les règles du verdict. Chaque règle part d'un écart mesuré et propose au plus une action par cible. */
function findings(ctx: {
  input: ReviewInput;
  rows: Row[];
  me: { hero: ReviewHero; role: Role };
  ally: Record<Role, number> | null;
  enemy: Record<Role, number> | null;
  allyStyle: Style | null;
  enemyStyle: Style | null;
  styleVotes: (h: ReviewHero) => Record<Style, number>;
  threats: Matchup[];
  targets: Matchup[];
  swaps: Review["swaps"];
  canSwap: (role: Role, prefer?: (h: ReviewHero) => boolean) => ReviewHero | null;
}): Finding[] {
  const { input, rows, me, ally, enemy, threats, targets, swaps } = ctx;
  const out: Finding[] = [];
  const A = rows.filter((r) => r.side === "ally");
  const E = rows.filter((r) => r.side === "enemy");
  const mine = A.find((r) => r.me) ?? null;
  const sheet = A.length >= 5 && E.length >= 5 && rows.some((r) => r.deaths !== null);
  const sum = (rs: Row[], k: keyof Stats) => rs.reduce((s, r) => s + (r[k] ?? 0), 0);
  const avg = (rs: Row[], k: keyof Stats) => (rs.length ? sum(rs, k) / rs.length : 0);
  const of = (rs: Row[], role: Role) => rs.filter((r) => r.r === role);
  const named = (r: Row, side: "leur" | "votre") => r.hero?.name ?? `${side} ${r.r ?? "joueur"}`;
  /** Explication du premier counter qui se lit seule (certaines renvoient à la ligne précédente du guide). */
  const explained = threats.find((t) => t.note && !/^(m[êe]me|pareil|idem|comme )/i.test(t.note)) ?? threats[0];
  const threatNote = explained ? `${explained.hero.name} : ${explained.note.charAt(0).toLowerCase()}${explained.note.slice(1)}` : "";
  const duelistGuide = { href: "/guides/duelist", label: "Guide du rôle Duelist" };
  const compsGuide = { href: "/guides/team-comps", label: "Construire et contrer une compo" };

  // 1. Répartition des rôles
  if (ally && enemy) {
    const fill = (role: Role, title: string, why: string): Step[] => {
      const steps: Step[] = [{ who: "equipe", title, detail: why }];
      const swap = me.role === "Duelist" && ally.Duelist >= 3 ? ctx.canSwap(role) : null;
      if (swap) steps.push({ who: "toi", title: `Passer sur ${swap.name}`, detail: `Tu joues déjà ${swap.name}, et ton équipe avait ${ally.Duelist} Duelists : c'était le changement le plus simple.`, link: { href: `/heros/${swap.slug}`, label: `Guide de ${swap.name}` } });
      return steps;
    };
    if (ally.Vanguard === 0)
      out.push({
        weight: 9,
        headline: "Sans Vanguard, chaque fight se jouait directement sur vos soutiens.",
        cause: `Aucun Vanguard chez vous, ${enemy.Vanguard} en face.`,
        steps: fill("Vanguard", "Prendre un Vanguard", "Personne ne tenait la ligne de front. Un seul passage de Duelist à Vanguard donnait de l'espace à toute l'équipe."),
      });
    else if (ally.Strategist <= 1 && enemy.Strategist >= 2)
      out.push({
        weight: 8,
        headline: "Avec un seul soutien, vous ne pouviez pas tenir les fights longs.",
        cause: `${ally.Strategist} Strategist chez vous, ${enemy.Strategist} en face.`,
        steps: fill("Strategist", "Prendre un second soutien", "Tous les soins reposaient sur un joueur, qui devenait la cible évidente. Un second soutien double les soins et les ults défensives."),
      });
    else if (ally.Vanguard === 1 && enemy.Vanguard >= 2)
      out.push({
        weight: 5,
        headline: `Un seul tank contre ${enemy.Vanguard} : ils prenaient l'espace à chaque fight.`,
        cause: `1 Vanguard chez vous, ${enemy.Vanguard} en face.`,
        steps: fill("Vanguard", "Prendre un second tank", "Votre tank encaissait seul. Avec un second, l'un tient le front pendant que l'autre protège les soutiens."),
      });
    else if (ally.Strategist === 2 && enemy.Strategist >= 3)
      out.push({
        weight: 4.5,
        headline: `${enemy.Strategist} soutiens en face : des dégâts répartis étaient tous soignés.`,
        cause: `${enemy.Strategist} Strategists en face, 2 chez vous.`,
        steps: [{ who: "equipe", title: "Tirer tous sur la même cible", detail: "Contre trois soutiens, seule une cible prise à plusieurs tombe. Choisissez-la avant le fight, en commençant par un soutien.", link: compsGuide }],
      });
  }

  if (sheet) {
    // 2. Soutiens : qui est mort le plus souvent
    const aS = of(A, "Strategist"), eS = of(E, "Strategist");
    if (aS.length && eS.length) {
      const a = avg(aS, "deaths"), e = avg(eS, "deaths");
      if (a - e >= 2 && a >= 5) {
        const divers = E.filter((r) => r.hero && r.r !== "Strategist" && ctx.styleVotes(r.hero).dive > 0).sort((x, y) => (y.final_hits ?? 0) - (x.final_hits ?? 0));
        const suspects = divers.slice(0, 2).map((r) => named(r, "leur"));
        const steps: Step[] = [
          {
            who: "equipe",
            title: "Protéger vos soutiens",
            detail: `${suspects.length ? `${list(suspects)} ${suspects.length > 1 ? "sont des héros de dive : ce sont eux qui vont" : "est un héros de dive : c'est lui qui va"} chercher les soutiens. ` : "Ils mouraient nettement plus que ceux d'en face. "}Un Duelist ou le second tank devait rester à portée d'eux et se retourner dès qu'ils étaient attaqués : un attaquant mort, c'est un fight à 6 contre 5.`,
            link: ctx.enemyStyle === "dive" ? { href: "/compos/anti-dive", label: "Compo anti-dive" } : undefined,
          },
        ];
        if (me.role === "Strategist") {
          if ((mine?.deaths ?? 0) >= a)
            steps.push({ who: "toi", title: "Jouer plus près de ton équipe", detail: `Tu es mort ${times(mine?.deaths ?? 0)}. Contre des divers, reste à portée de tes alliés et d'un mur : loin d'eux, personne ne peut te défendre.`, link: { href: "/guides/strategist", label: "Guide du rôle Strategist" } });
        } else steps.push({ who: "toi", title: suspects[0] ? `Te retourner sur ${suspects[0]}` : "Défendre tes soutiens", detail: "Quand tes soutiens sont attaqués, ils passent avant ta cible : tue celui qui les attaque, puis reprends ta pression.", link: me.role === "Duelist" ? duelistGuide : undefined });
        out.push({
          weight: 6 + Math.min(3, (a - e) / 2),
          headline: "La partie s'est perdue sur vos soutiens.",
          cause:
            aS.length === eS.length
              ? `Vos soutiens sont morts ${times(sum(aS, "deaths"))}, les leurs ${times(sum(eS, "deaths"))}.`
              : `Morts par soutien : ${fr(a, 1)} chez vous, ${fr(e, 1)} chez eux.`,
          steps,
        });
      }
    }

    // 3. Un adversaire a porté son équipe
    const key: keyof Stats = E.some((r) => r.final_hits !== null) ? "final_hits" : "kills";
    const ranked = [...E].sort((x, y) => (y[key] ?? 0) - (x[key] ?? 0));
    const top = ranked[0], total = sum(E, key);
    if (top && total > 0 && (top[key] ?? 0) >= 8 && ((top[key] ?? 0) / total >= 0.28 || (top[key] ?? 0) >= 1.5 * (ranked[1]?.[key] ?? 0))) {
      const name = named(top, "leur");
      const safe = top.deaths !== null && top.deaths <= 4;
      const counters = top.hero ? (input.guides.get(top.hero.slug)?.counters ?? []).map((c) => c.hero) : [];
      const allyCounters = A.filter((r) => !r.me && r.hero && counters.includes(r.hero.slug)).map((r) => r.hero!.name);
      const steps: Step[] = [
        {
          who: "equipe",
          title: `Faire tomber ${name} en premier`,
          detail: `${safe ? `${fr(top.deaths ?? 0)} mort${(top.deaths ?? 0) > 1 ? "s" : ""} seulement de son côté : ce joueur n'a jamais été inquiété. ` : ""}${allyCounters.length ? `${list(allyCounters)} ${allyCounters.length > 1 ? "figurent" : "figure"} parmi ses counters : c'était le duel à provoquer. ` : ""}Annoncez sa position et tirez dessus à plusieurs à chaque apparition.`,
          link: top.hero ? { href: `/heros/${top.hero.slug}`, label: `Ce qui gêne ${name}` } : undefined,
        },
      ];
      if (counters.includes(me.hero.slug)) steps.push({ who: "toi", title: `Marquer ${name}`, detail: `${me.hero.name} fait partie de ses counters. C'était ta première cible à chaque fight, avant les tanks.` });
      else {
        const swap = ctx.canSwap(me.role, (h) => counters.includes(h.slug));
        if (swap) steps.push({ who: "toi", title: `Passer sur ${swap.name}`, detail: `Tu joues déjà ${swap.name}, qui fait partie des counters de ${name}.`, link: { href: `/heros/${swap.slug}`, label: `Guide de ${swap.name}` } });
      }
      const share = (top[key] ?? 0) / total;
      out.push({
        weight: 5 + Math.max(0, share - 0.28) * 12 + (safe ? 1.5 : 0),
        headline: `Personne n'a su répondre à ${name}.`,
        cause: `${name} : ${fr(top[key] ?? 0)} des ${fr(total)} ${key === "final_hits" ? "final hits" : "éliminations"} adverses${top.deaths !== null ? `, ${fr(top.deaths)} mort${top.deaths > 1 ? "s" : ""}` : ""}.`,
        steps,
      });
    }

    // 4. Écart de soins : leurs soutiens ont vécu tranquilles
    const healA = sum(A, "healing"), healE = sum(E, "healing");
    if (healA > 0 && healE >= healA * 1.25 && eS.length) {
      const eDeaths = avg(eS, "deaths");
      const quiet = eDeaths <= 4 && (!aS.length || eDeaths < avg(aS, "deaths"));
      // Moins de soutiens que l'adversaire : l'écart de soins vient d'abord de la compo, déjà signalée
      const byComp = ally && enemy && ally.Strategist < enemy.Strategist ? 3 : 0;
      const names = eS.filter((r) => r.hero).map((r) => r.hero!.name);
      const reach = targets.filter((t) => t.hero.roles[0] === "Strategist").map((t) => t.hero.name);
      const steps: Step[] = [
        {
          who: "equipe",
          title: "Aller chercher leurs soutiens",
          detail: `${quiet ? `${fr(sum(eS, "deaths"))} morts seulement pour leurs soutiens` : "Leurs soutiens ont tenu assez longtemps pour tout soigner"}${names.length ? ` (${list(names)})` : ""}. Tant qu'ils vivent, vos dégâts sont soignés : une cible commune, annoncée avant le fight.`,
        },
      ];
      if (me.role === "Duelist")
        steps.push({ who: "toi", title: reach.length ? `Viser ${list(reach)}` : "Viser le soutien du fond", detail: `${reach.length ? `${me.hero.name} les contre d'après leur guide. ` : ""}Prends un angle qui les découvre et vise celui du fond : celui de devant ne se retourne pas pour le soigner.`, link: duelistGuide });
      out.push({
        weight: 4 + Math.min(3, (healE / healA - 1.25) * 6) + (quiet ? 1 : 0) - byComp,
        headline: "Ils ont tenu plus longtemps que vous : l'écart est dans les soins.",
        cause: `Soins : ${fr(healE)} pour eux, ${fr(healA)} pour vous (${pct(healE / healA - 1)} de plus).`,
        steps,
      });
    }

    // 5. Tes dégâts et tes éliminations, face aux joueurs du même rôle en face
    if (mine && me.role === "Duelist") {
      const eD = of(E, "Duelist");
      const dmg = mine.damage ?? 0, fh = mine.final_hits ?? 0;
      const eDmg = avg(eD, "damage"), eFh = avg(eD, "final_hits");
      if (eD.length && eDmg > 0 && mine.damage !== null) {
        if (dmg >= eDmg * 0.85 && eFh >= 4 && fh <= eFh * 0.6)
          out.push({
            weight: 5.5,
            personal: true,
            headline: "Beaucoup de dégâts, pas assez d'éliminations.",
            cause: `Toi : ${fr(dmg)} dégâts pour ${fr(fh)} final hits. Leurs Duelists : ${fr(eDmg)} dégâts pour ${fr(eFh, 1)} en moyenne.`,
            steps: [{ who: "toi", title: "Tirer sur ce qui peut mourir", detail: "Autant de dégâts pour si peu d'éliminations : ils partaient sans doute sur des cibles soignées, ce qui charge les ults adverses. Vise le joueur isolé ou celui que ton équipe tire déjà, et quitte le tank dès qu'une autre cible se montre.", link: duelistGuide }],
          });
        else if (dmg < eDmg * 0.7)
          out.push({
            weight: 4 + Math.min(2.5, (1 - dmg / eDmg) * 4),
            personal: true,
            headline: "Leurs Duelists ont pesé plus lourd que toi dans les fights.",
            cause: `Tes dégâts : ${fr(dmg)}. Leurs Duelists : ${fr(eDmg)} en moyenne.`,
            steps: [
              threats.length
                ? { who: "toi", title: swaps[0] ? `Passer sur ${swaps[0].hero.name}` : `Changer de héros face à ${list(threats.map((t) => t.hero.name))}`, detail: `${list(threats.map((t) => t.hero.name))} ${threats.length > 1 ? "te contraient" : "te contrait"}. ${threatNote}`, link: swaps[0] ? { href: `/heros/${swaps[0].hero.slug}`, label: `Guide de ${swaps[0].hero.name}` } : undefined }
                : { who: "toi", title: "Passer plus de temps à tirer", detail: "Peu de dégâts sans counter en face : tu étais trop souvent mort, en déplacement ou hors de portée. Prends un angle court, d'où tu tires dès que le fight commence.", link: duelistGuide },
            ],
          });
      }
    }
    if (mine && me.role === "Strategist" && mine.healing !== null) {
      const eAvg = avg(eS, "healing");
      if (eS.length && eAvg > 0 && mine.healing < eAvg * 0.7)
        out.push({
          weight: 4 + Math.min(2, (1 - mine.healing / eAvg) * 4),
          personal: true,
          headline: "Leurs soutiens ont soigné nettement plus que toi.",
          cause: `Tes soins : ${fr(mine.healing)}. Leurs soutiens : ${fr(eAvg)} en moyenne.`,
          steps: [
            (mine.deaths ?? 0) >= 6
              ? { who: "toi", title: "Rester en vie pour soigner", detail: `Tu es mort ${times(mine.deaths ?? 0)} : chaque mort coupe les soins de ton équipe le temps du retour. Joue près d'un mur et jamais devant tes tanks.`, link: { href: "/guides/strategist", label: "Guide du rôle Strategist" } }
              : { who: "toi", title: "Rester à portée du fight", detail: "Peu de morts et peu de soins : tu étais trop loin ou sans ligne de vue sur tes alliés. Avance d'un couvert pour garder tes tanks en vue.", link: { href: "/guides/strategist", label: "Guide du rôle Strategist" } },
          ],
        });
    }
  }

  // 6. Tes morts
  const deaths = mine?.deaths ?? input.totals?.deaths ?? null;
  if (deaths !== null) {
    const teamAvg = sheet ? rows.filter((r) => r.side === "ally").reduce((s, r) => s + (r.deaths ?? 0), 0) / A.length : null;
    const usual = input.baseline && input.baseline.matches >= 4 ? input.baseline.deaths : null;
    const overTeam = teamAvg !== null && deaths >= Math.max(7, teamAvg + 2);
    const overUsual = usual !== null && deaths >= Math.max(6, usual * 1.4);
    if (overTeam || overUsual) {
      const refs = [teamAvg !== null ? `${fr(teamAvg, 1)} en moyenne dans ton équipe` : "", usual !== null ? `${fr(usual, 1)} d'habitude sur ${me.hero.name}` : ""].filter(Boolean);
      out.push({
        weight: 4 + Math.min(4, Math.max(teamAvg !== null ? (deaths - teamAvg) / 2 : 0, usual !== null ? (deaths - usual) / 2 : 0)),
        personal: true,
        headline: "Tu as trop souvent laissé ton équipe à cinq.",
        cause: `Tu es mort ${times(deaths)} (${refs.join(", ")}).`,
        steps: [
          threats.length
            ? { who: "toi", title: `Mourir moins face à ${list(threats.slice(0, 2).map((t) => t.hero.name))}`, detail: `${threatNote} Garde ta capacité de fuite pour ce duel et ressors dès qu'on se retourne sur toi.`, link: { href: `/heros/${me.hero.slug}`, label: `Guide de ${me.hero.name}` } }
            : { who: "toi", title: "Ressortir avant de mourir", detail: "Chaque mort fait jouer un fight à 5 contre 6. Entre quand ton équipe se bat, et sors dès que tu as utilisé tes capacités ou qu'on te vise.", link: { href: `/heros/${me.hero.slug}`, label: `Guide de ${me.hero.name}` } },
        ],
      });
    }
  }

  // 7. Style de compo : qui bat qui, d'après les compos de référence
  const comps = input.comps ?? [];
  const compOf = (s: Style | null) => comps.find((c) => c.slug === s);
  const theirs = compOf(ctx.enemyStyle);
  if (theirs) {
    const beats = theirs.strong_vs.find((v) => v.comp === ctx.allyStyle);
    const answer = comps.find((c) => c.slug === theirs.weak_vs[0]?.comp);
    // Les notes des compos s'adressent à ceux qui les jouent : on prend celles écrites de notre point de vue
    const how = answer?.strong_vs.find((v) => v.comp === ctx.enemyStyle)?.note || answer?.tagline || "";
    const why = compOf(ctx.allyStyle)?.weak_vs.find((v) => v.comp === ctx.enemyStyle)?.note || "";
    if (beats && ctx.allyStyle)
      out.push({
        weight: 5,
        headline: `Leur ${ctx.enemyStyle} contrait votre ${ctx.allyStyle}.`,
        cause: `Ils jouaient ${ctx.enemyStyle}, vous ${ctx.allyStyle} : le ${ctx.enemyStyle} bat le ${ctx.allyStyle}.${why ? ` ${why}` : ""}`,
        steps: [answer ? { who: "equipe", title: `Basculer vers « ${answer.name} »`, detail: `${how} Deux changements de héros suffisent souvent à changer de style.`, link: { href: `/compos/${answer.slug}`, label: answer.name } } : { who: "equipe", title: "Changer de style", detail: why || "Regardez vos tanks : ils fixent le style, les autres complètent.", link: compsGuide }],
      });
    else if (!ctx.allyStyle && sheet)
      out.push({
        weight: 3,
        headline: `Ils avaient un plan commun (${ctx.enemyStyle}), vous non.`,
        cause: `En face, une compo ${ctx.enemyStyle}. Chez vous, des héros de styles différents.`,
        steps: [answer ? { who: "equipe", title: `Jouer « ${answer.name} »`, detail: `${how} Regardez vos tanks, puis complétez dans le même style.`, link: { href: `/compos/${answer.slug}`, label: answer.name } } : { who: "equipe", title: "Jouer le même style", detail: "Regardez vos tanks : ils fixent le style, les autres complètent.", link: compsGuide }],
      });
    else if (!sheet && answer)
      out.push({
        weight: 2.5,
        headline: `En face, une compo ${ctx.enemyStyle}.`,
        cause: `Leurs héros forment une compo ${ctx.enemyStyle}.`,
        steps: [{ who: "equipe", title: `Répondre avec « ${answer.name} »`, detail: how, link: { href: `/compos/${answer.slug}`, label: answer.name } }],
      });
  }

  // 8. Ton héros était contré, et tu avais mieux dans ton pool
  if (threats.length >= 2 && swaps[0])
    out.push({
      weight: 3 + Math.min(3, threats.length),
      personal: true,
      id: "counters",
      headline: `${me.hero.name} était contré par ${list(threats.map((t) => t.hero.name))}.`,
      cause: `${threats.length} adversaires contraient ${me.hero.name}.`,
      steps: [{ who: "toi", title: `Passer sur ${swaps[0].hero.name}`, detail: `Parmi les héros que tu joues : ${swaps[0].reasons.join(", ")}.`, link: { href: `/heros/${swaps[0].hero.slug}`, label: `Guide de ${swaps[0].hero.name}` } }],
    });

  return out.sort((a, b) => b.weight - a.weight);
}

/**
 * Trois actions au plus : la première pour l'équipe, la première pour le joueur (de préférence tirée de ses
 * propres chiffres), puis la suivante par ordre d'importance. Renvoie aussi les règles retenues, pour que
 * chaque action affichée soit appuyée par son écart mesuré.
 */
function pickSteps(found: Finding[], max = 3): { steps: Step[]; used: Finding[] } {
  const all: { step: Step; from: Finding }[] = [];
  for (const f of found) for (const step of f.steps) if (!all.some((x) => x.step.title === step.title)) all.push({ step, from: f });
  const picked = new Set<Step>();
  const team = all.find((x) => x.step.who === "equipe");
  const self = all.find((x) => x.step.who === "toi" && x.from.personal) ?? all.find((x) => x.step.who === "toi");
  for (const x of [team, self]) if (x) picked.add(x.step);
  // Les places restantes vont d'abord aux règles pas encore représentées
  const usedNow = () => new Set(all.filter((x) => picked.has(x.step)).map((x) => x.from));
  for (const fresh of [true, false])
    for (const x of all) {
      if (picked.size >= max) break;
      if (fresh && usedNow().has(x.from)) continue;
      if ([...picked].filter((s) => s.who === x.step.who).length < 2) picked.add(x.step);
    }
  const kept = all.filter((x) => picked.has(x.step));
  return { steps: kept.map((x) => x.step), used: [...new Set(kept.map((x) => x.from))] };
}

export function buildReview(input: ReviewInput): Review | null {
  const main = input.mine[0];
  if (!main || (!input.enemies.length && !input.allies.length)) return null;
  const guideOf = (h: ReviewHero) => input.guides.get(h.slug);
  const everyone = [...input.enemies, ...input.allies, ...input.pool, ...input.mine.map((m) => m.hero)];
  const bySlug = new Map(everyone.map((h) => [h.slug, h]));
  const byId = new Map(everyone.map((h) => [h.id, h]));
  const enemySlugs = new Set(input.enemies.map((h) => h.slug));
  const allySlugs = new Set(input.allies.map((h) => h.slug));

  // Qui contre qui : « counters » d'un guide = les héros qui posent problème à ce héros
  const threatsOf = (h: ReviewHero): Matchup[] =>
    (guideOf(h)?.counters ?? []).filter((c) => enemySlugs.has(c.hero)).map((c) => ({ hero: bySlug.get(c.hero)!, note: c.note }));
  const targetsOf = (h: ReviewHero): Matchup[] =>
    input.enemies.flatMap((e) => {
      const c = guideOf(e)?.counters.find((x) => x.hero === h.slug);
      return c ? [{ hero: e, note: c.note }] : [];
    });
  const synergiesOf = (h: ReviewHero): Matchup[] =>
    (guideOf(h)?.synergies ?? []).filter((c) => allySlugs.has(c.hero)).map((c) => ({ hero: bySlug.get(c.hero)!, note: c.note }));

  const threats = threatsOf(main.hero);
  const targets = targetsOf(main.hero);
  const synergies = synergiesOf(main.hero);
  const teamups = (guideOf(main.hero)?.teamups ?? []).flatMap((t) =>
    t.partners.filter((p) => allySlugs.has(p)).map((p) => ({ name: t.name, partner: bySlug.get(p)!, text: t.text })),
  );

  const pressured = input.allies
    .map((ally) => ({ ally, by: threatsOf(ally).map((t) => t.hero) }))
    .filter((p) => p.by.length >= 2)
    .sort((a, b) => b.by.length - a.by.length)
    .slice(0, 3);

  // Swaps : parmi les héros que le joueur sait jouer au même rôle, ceux que la compo adverse gêne moins
  const score = (h: ReviewHero) => targetsOf(h).length - threatsOf(h).length + 0.5 * synergiesOf(h).length;
  const current = score(main.hero);
  const taken = new Set([...allySlugs, ...input.mine.map((m) => m.hero.slug)]);
  const swaps = input.pool
    .filter((h) => h.roles.includes(main.role) && !taken.has(h.slug) && guideOf(h))
    .map((h) => ({ hero: h, score: score(h), good: targetsOf(h), bad: threatsOf(h), syn: synergiesOf(h) }))
    .filter((c) => c.score >= current + 1 && c.bad.length <= threats.length)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((c) => ({
      hero: c.hero,
      reasons: [
        c.good.length ? `gêne ${c.good.map((g) => g.hero.name).join(", ")}` : "",
        c.bad.length ? `craint ${c.bad.map((g) => g.hero.name).join(", ")}` : "aucun de ses counters en face",
        c.syn.length ? `synergie avec ${c.syn.map((g) => g.hero.name).join(", ")}` : "",
      ].filter(Boolean),
    }));
  /** Meilleur héros du pool pour un rôle donné, face à cette compo adverse. */
  const canSwap = (role: Role, prefer?: (h: ReviewHero) => boolean): ReviewHero | null =>
    input.pool
      .filter((h) => h.roles.includes(role) && !taken.has(h.slug) && (!prefer || prefer(h)))
      .sort((a, b) => score(b) - score(a))[0] ?? null;

  // Rôles : ceux lus sur la capture quand elle les donne (fiable même si un héros n'est pas identifié)
  const fromRoster = (side: RosterEntry["side"]) => {
    const rows = input.roster.filter((r) => r.side === side);
    if (rows.length < 5 || rows.some((r) => !r.role)) return null;
    const out = { Vanguard: 0, Duelist: 0, Strategist: 0 } as Record<Role, number>;
    for (const r of rows) out[r.role!]++;
    return out;
  };
  const ally = fromRoster("ally") ?? (input.allies.length >= 4 ? count([{ roles: [main.role] }, ...input.allies]) : null);
  const enemy = fromRoster("enemy") ?? (input.enemies.length >= 5 ? count(input.enemies) : null);
  const notes = ally ? compNotes(ally) : [];
  const n = (v: number, word: string) => `${v} ${word}${v > 1 ? "s" : ""}`;
  if (ally && enemy) {
    if (enemy.Strategist > ally.Strategist) notes.push({ tone: "info", text: `L'équipe adverse avait ${n(enemy.Strategist, "Strategist")} contre ${ally.Strategist} : plus de soins en face, il fallait finir les cibles vite ou viser leurs supports.` });
    if (enemy.Vanguard > ally.Vanguard) notes.push({ tone: "info", text: `L'équipe adverse avait ${n(enemy.Vanguard, "Vanguard")} contre ${ally.Vanguard} : elle prenait l'espace plus facilement.` });
  }

  // Style d'une équipe : ce que disent les guides (tags) et les compos de référence, les tanks comptant double
  const comps = input.comps ?? [];
  const styleVotes = (h: ReviewHero) => {
    const v = { brawl: 0, dive: 0, poke: 0 } as Record<Style, number>;
    for (const s of STYLES) if (comps.find((c) => c.slug === s)?.heroes.includes(h.slug)) v[s] += 1;
    for (const raw of guideOf(h)?.tags ?? []) {
      const t = raw.toLowerCase();
      if (t === "brawl") v.brawl += 2;
      else if (t === "dive") v.dive += 2;
      else if (t === "poke" || t === "sniper") v.poke += 2;
    }
    return v;
  };
  const teamStyle = (heroes: { hero: ReviewHero; role: Role }[]): Style | null => {
    if (heroes.length < 5) return null;
    const total = { brawl: 0, dive: 0, poke: 0 } as Record<Style, number>;
    for (const { hero, role } of heroes) {
      const v = styleVotes(hero);
      for (const s of STYLES) total[s] += v[s] * (role === "Vanguard" ? 2 : 1);
    }
    const [first, second] = [...STYLES].sort((a, b) => total[b] - total[a]);
    return total[first] >= 5 && total[first] >= total[second] * 1.4 ? first : null;
  };
  const allyStyle = teamStyle([main, ...input.allies.map((h) => ({ hero: h, role: h.roles[0] }))]);
  const enemyStyle = teamStyle(input.enemies.map((h) => ({ hero: h, role: h.roles[0] })));

  const theirComp = comps.find((c) => c.slug === enemyStyle);
  const ourComp = comps.find((c) => c.slug === allyStyle);
  if (allyStyle && theirComp?.strong_vs.some((v) => v.comp === allyStyle)) {
    const why = ourComp?.weak_vs.find((v) => v.comp === enemyStyle)?.note;
    notes.unshift({ tone: "warn", text: `Leur ${enemyStyle} contrait votre ${allyStyle}${why ? ` : ${why.charAt(0).toLowerCase()}${why.slice(1)}` : "."}` });
  }
  if (enemyStyle && ourComp?.strong_vs.some((v) => v.comp === enemyStyle)) notes.unshift({ tone: "good", text: `Votre ${allyStyle} contrait leur ${enemyStyle}.` });

  const rows: Row[] = input.roster.map((r) => {
    const hero = r.me ? main.hero : r.hero_id ? (byId.get(r.hero_id) ?? null) : null;
    return { ...r, hero, r: r.me ? main.role : (r.role ?? hero?.roles[0] ?? null) };
  });
  const found = findings({ input, rows, me: main, ally, enemy, allyStyle, enemyStyle, styleVotes, threats, targets, swaps, canSwap });
  const full = rows.filter((r) => r.side === "ally").length >= 5 && rows.filter((r) => r.side === "enemy").length >= 5;

  let verdict: Verdict | null = null;
  if (input.result === "loss") {
    const A = rows.filter((r) => r.side === "ally"), E = rows.filter((r) => r.side === "enemy");
    const fhA = A.reduce((s, r) => s + (r.final_hits ?? 0), 0), fhE = E.reduce((s, r) => s + (r.final_hits ?? 0), 0);
    const close = full && fhA > 0 && fhE > 0 && Math.abs(fhA - fhE) / Math.max(fhA, fhE) <= 0.1;
    if (found.length) {
      const { steps, used } = pickSteps(found);
      // Les causes affichées : la principale, puis celles qui appuient les actions retenues
      const causes = [...new Set([found[0], ...used, ...found].map((f) => f.cause))].slice(0, 4);
      verdict = {
        kind: "loss",
        headline: found[0].headline,
        causes: [...causes, ...(close ? [`Partie serrée : ${fhA} final hits contre ${fhE}. Un seul de ces points pouvait la faire basculer.`] : [])],
        steps,
        full,
      };
    }
    else if (full)
      verdict = {
        kind: "loss",
        headline: close ? "Partie serrée : elle s'est jouée sur des détails." : "Aucun écart net sur la feuille de match.",
        causes: fhA > 0 && fhE > 0 ? [`Final hits : ${fhA} pour vous, ${fhE} pour eux.`] : [],
        steps: [{ who: "equipe", title: "Regarder les ults", detail: "Quand les chiffres sont proches, la différence se fait sur les ults : qui avait la sienne au dernier fight, et qui l'a lancée en second.", link: { href: "/guides/game-sense", label: "Guide game sense" } }],
        full,
      };
  } else {
    const A = rows.filter((r) => r.side === "ally"), E = rows.filter((r) => r.side === "enemy");
    const sum = (rs: Row[], k: keyof Stats) => rs.reduce((s, r) => s + (r[k] ?? 0), 0);
    const good: string[] = [];
    if (full) {
      const fhA = sum(A, "final_hits"), fhE = sum(E, "final_hits");
      const top = [...A].sort((x, y) => (y.final_hits ?? 0) - (x.final_hits ?? 0))[0];
      if (top && fhA > 0 && (top.final_hits ?? 0) / fhA >= 0.28 && (top.final_hits ?? 0) >= 8)
        good.push(top.me ? `Tu as signé ${top.final_hits} des ${fhA} final hits de ton équipe.` : `${top.hero?.name ?? "Un allié"} a signé ${top.final_hits} des ${fhA} final hits de ton équipe.`);
      const aS = A.filter((r) => r.r === "Strategist"), eS = E.filter((r) => r.r === "Strategist");
      if (aS.length && eS.length && sum(eS, "deaths") / eS.length - sum(aS, "deaths") / aS.length >= 2) good.push(`Leurs soutiens sont morts ${times(sum(eS, "deaths"))}, les vôtres ${times(sum(aS, "deaths"))}.`);
      const hA = sum(A, "healing"), hE = sum(E, "healing");
      if (hE > 0 && hA >= hE * 1.25) good.push(`Vous avez soigné ${fr(hA)} contre ${fr(hE)} pour eux.`);
      if (fhA > 0 && fhE > 0 && good.length < 2) good.push(`Final hits : ${fhA} pour vous, ${fhE} pour eux.`);
    }
    const ours = comps.find((c) => c.slug === allyStyle);
    if (ours && enemyStyle && ours.strong_vs.some((v) => v.comp === enemyStyle)) good.push(`Votre ${allyStyle} contrait leur ${enemyStyle}.`);
    if (targets.length) good.push(`${main.hero.name} contrait ${list(targets.map((t) => t.hero.name))}.`);
    // Sur une victoire, on ne garde que ce qui te concerne
    const personal = found.filter((f) => f.personal && f.id !== "counters");
    if (good.length || personal.length)
      verdict = {
        kind: "win",
        headline: good[0] ?? "Victoire, avec un point à corriger de ton côté.",
        causes: [...good.slice(1, 3), ...personal.slice(0, 1).map((f) => f.cause)],
        steps: personal.slice(0, 2).flatMap((f) => f.steps).slice(0, 2),
        full,
      };
  }

  return { verdict, comp: { ally, enemy, notes, allyStyle, enemyStyle }, threats, targets, synergies, teamups, pressured, swaps, facts: facts(input.roster, main.role) };
}
