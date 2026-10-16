/**
 * Conseils généraux du Prof, affichés sur l'accueil (un par jour).
 * Volontairement indépendants des saisons : pas de chiffres, pas de héros précis.
 */
export const PROF_TIPS = [
  "Avant chaque fight, regarde **quelles ults** l'adversaire a en stock. C'est la moitié du travail.",
  "Mourir en premier, c'est jouer à 5 contre 6. **Rester en vie** vaut souvent plus qu'un kill.",
  "Un support qui charge son ult **plus vite** que celui d'en face gagne la moitié des fights à l'avance.",
  "Tu n'as pas besoin de tuer pour gagner : **forcer un cooldown** adverse, c'est déjà ouvrir le fight.",
  "Après un fight gagné, ne reste pas planté : **prépare ta position** pour le suivant.",
  "Les dégâts sur un tank bien soigné **chargent l'ult de leurs supports**. Choisis tes cibles.",
  "Joue **à couvert** : chaque dégât évité, c'est un soin de moins à fournir.",
  "Une ult **lancée maintenant, même imparfaite,** vaut mieux qu'une ult parfaite que tu gardes trop longtemps.",
  "Si tu perds trois fights de la même façon, **change quelque chose** : position, héros ou plan.",
  "Le tilt coûte plus cher qu'un mauvais pick. Une pause de deux minutes, **ça marche**.",
  "Note tes erreurs dans la saisie : au bout de **dix parties**, les tendances sautent aux yeux.",
  "Annonce tes cooldowns importants à ton équipe : **une phrase** suffit à éviter un fight perdu.",
];

/** Un conseil stable pour la journée (même valeur côté serveur et client). */
export function tipOfTheDay(date = new Date()): string {
  const day = Math.floor(date.getTime() / 86_400_000);
  return PROF_TIPS[day % PROF_TIPS.length];
}
