-- Rivals Coach — guides au nouveau format : en bref, difficulté, style de jeu, intros de section,
-- capacités et touches, mots-clés en gras (**…**), bloc « À éviter ».
-- À exécuter après 0007. Remplace le contenu des guides Jeff et Strategist créés en 0004.

update public.guides set content = $json$
{
  "summary": "Jeff se joue comme un flanqueur qui harcèle la backline adverse, pas comme un healer de fond. Il gagne les fights en attirant l'attention et les dégâts sur lui pendant que son équipe nettoie.",
  "patch_note": "Conseils tirés d'une vidéo de la saison 2. Les valeurs du kit, les team-ups et la méta ont pu changer depuis : vérifie en jeu.",
  "tldr": [
    "Joue **en flanc** : ta vraie valeur, c'est la pression sur les supports adverses.",
    "Tes **bulles** sont ta survie : garde-en toujours une ou deux pour fuir.",
    "Ton **ultime** gagne un fight avec une ou deux cibles clés, pas besoin d'avaler tout le monde."
  ],
  "difficulty": 2,
  "tags": ["Flanc", "Pression backline", "Soin d'appoint", "Très mobile"],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "lead": "Jeff a l'air d'un healer, mais il se joue comme un DPS de flanc. Le soin vient en second.",
      "kind": "tips",
      "items": [
        "Si tu te contentes de soigner, tu joues Jeff à l'envers : ta valeur vient de la **pression sur les supports** adverses.",
        "Prends un **angle de flanc**, harcèle, **attire l'aggro**, puis repars avant de tomber.",
        "Absorber l'attention adverse, c'est **soigner ton équipe indirectement** : ça ne se voit pas au tableau, mais dans le résultat.",
        "Tu préfères soigner en retrait ? **Rocket, Luna Snow ou Loki** te conviendront mieux."
      ]
    },
    {
      "title": "Soin",
      "ability": "Joyful Splash",
      "key": "Clic G",
      "lead": "Ton jet de soin est simple à utiliser. Toute la difficulté, c'est de savoir quand t'en servir.",
      "items": [
        "Le jet **traverse les alliés** : aligne-toi pour soigner plusieurs cibles d'un coup.",
        "C'est un **projectile**, pas un rayon instantané : anticipe à longue distance et soigne une cible **juste avant** qu'elle encaisse.",
        "Reviens au soin quand tu es **chassé de ton angle** et que ton équipe prend cher. Bonus : ça charge ton ult très vite.",
        "Protège en priorité un allié **en pleine ult** (un Punisher) ou **sur le point de l'avoir** (une Luna Snow plongée qui doit survivre).",
        "Le reste du temps, **les dégâts passent avant le soin**."
      ]
    },
    {
      "title": "Dégâts",
      "ability": "Aqua Burst",
      "key": "Clic D",
      "lead": "Tes projectiles d'eau font des dégâts de zone. Bien visés, ils font paniquer n'importe quel support.",
      "items": [
        "Vise **les pieds** de la cible, ou **le mur derrière elle** : la zone compense un tir direct raté.",
        "Pas de headshot sur ce tir : **vise le corps**.",
        "Un héros volant loin de tout mur ne vaut pas tes munitions : **change de cible**.",
        "Cibles prioritaires : **supports et DPS**. Jamais les tanks : tu ne leur fais presque rien et tu les attires sur toi.",
        "Ton but : faire paniquer les supports pour **arracher un kill** ou **forcer une ult**."
      ]
    },
    {
      "title": "Survie et déplacements",
      "ability": "Hide and Seek · Bulles",
      "key": "Maj · E",
      "lead": "Sous terre et avec tes bulles, Jeff devient presque impossible à tuer. C'est ce qui lui permet de jouer aussi loin.",
      "items": [
        "Sous terre, Jeff **va plus vite**, **se soigne**, ne prend **aucun headshot** et n'expose qu'un aileron.",
        "Il nage sur les murs et peut y **rester immobile en embuscade**, très efficace en défense.",
        "Cycle de base : **bulle → passer dedans → plonger → filer vers ton angle**. Dès qu'on te répond, nouvelle bulle et repli.",
        "Le bonus de vitesse des bulles **ne se cumule pas** : n'en enchaîne pas pour rien.",
        "Avant de partir en flanc, **laisse 2 ou 3 bulles à tes supports**.",
        "Garde **toujours 1 ou 2 bulles pour ta fuite**. Bien géré, Jeff ne meurt presque jamais.",
        "Son passif réduit les **coups critiques**. Déplace-toi **en huit** pour être encore plus dur à toucher.",
        "Confort : tu peux passer la plongée en **appui simple** dans les paramètres."
      ]
    },
    {
      "title": "Ultime",
      "ability": "It's Jeff",
      "key": "Q",
      "lead": "Jeff avale tout ce qui se trouve autour de lui, alliés compris. Recraché au bon endroit, c'est une sortie de carte garantie.",
      "items": [
        "Avant le fight, pose **une traînée de bulles vers le vide** où tu veux recracher : vitesse et soin pour finir le trajet.",
        "Les héros mobiles (**Invisible Woman, Doctor Strange, Wolverine, Psylocke**) reviennent si l'angle n'est pas assez raide. Dans le doute, emporte-les avec toi.",
        "Tu avales **aussi tes alliés** : ne les jette pas dans le vide, et ne vide pas ton propre point en prolongation.",
        "Un bon **Magneto** garde son ult pour toi : force-la avant, ou attends qu'il la lâche ailleurs.",
        "Certains héros **ne s'avalent pas pendant leur ult** (Emma Frost, Punisher).",
        "L'adversaire se disperse pour te contrer : **avale vite**, ou vise une **prolongation sur le point**.",
        "**Une ou deux cibles clés** suffisent, par exemple le Groot qui prépare un combo.",
        "En défense : avale **ton équipe** juste avant un gros combo ou une ult adverse (Magneto, Iron Man, Hawkeye).",
        "Timing très rentable : **quand un support adverse lance son ult**."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer Jeff en **healer de fond**.",
        "Gaspiller toutes ses bulles et **ne plus pouvoir fuir**.",
        "Flanquer **trop loin**, dans des positions faciles à atteindre.",
        "Tirer sur **les tanks**.",
        "Lancer l'ult sur le point en prolongation et **sortir sa propre équipe**."
      ]
    }
  ],
  "counters": [
    { "hero": "captain-america", "note": "Il suit Jeff partout et annule son flanc." },
    { "hero": "star-lord", "note": "Très mobile, et la hitbox de Jeff est facile à toucher." },
    { "hero": "iron-man", "note": "Dégâts de zone quasi impossibles à rater, dur à atteindre en l'air." },
    { "hero": "loki", "note": "Projectiles explosifs et runes qui compliquent tout." }
  ],
  "synergies": [
    { "hero": "luna-snow", "note": "Team-up : munitions glacées qui ralentissent. Le meilleur duo, à vérifier selon la saison." },
    { "hero": "captain-america", "note": "Tank de dive : vos dégâts combinés écrasent la backline." },
    { "hero": "venom", "note": "Autre tank de dive qui accompagne bien ta pression." },
    { "hero": "human-torch", "note": "Il fait reculer les supports, tu les empêches de fuir." },
    { "hero": "black-panther", "note": "DPS de dive qui profite du chaos que tu crées." },
    { "hero": "iron-fist", "note": "DPS de dive, très bonne complémentarité." }
  ],
  "sources": [
    { "title": "Guide Jeff the Land Shark", "author": "Paz (padswagger)" }
  ]
}
$json$::jsonb
where kind = 'hero' and hero_id = (select id from public.heroes where slug = 'jeff-the-land-shark');

update public.guides set content = $json$
{
  "summary": "Soigner, c'est le minimum. Ce qui sépare un bon Strategist d'un mauvais, c'est de rester en vie, de bien gérer son ult et d'apporter plus que du soin.",
  "patch_note": "Principes valables quelle que soit la saison. Les exemples de héros dépendent de la méta du moment.",
  "tldr": [
    "Ton vrai objectif : **charger ton ult** le plus vite possible.",
    "**Ne meurs pas en plein fight** : sans toi, ton équipe tombe presque toujours.",
    "**Fais plus que soigner** : dégâts et utilitaire gagnent les fights."
  ],
  "difficulty": 1,
  "tags": ["Placement", "Gestion d'ult", "Lecture du fight"],
  "sections": [
    {
      "title": "Ton vrai objectif : charger ton ult",
      "lead": "Soins, dégâts et survie servent tous le même but. Penser « ult » t'indique comment jouer chaque héros.",
      "kind": "tips",
      "items": [
        "Tout ce que tu fais doit servir à **charger ton ult le plus vite possible**.",
        "**Adam Warlock** prend des angles et fait des dégâts. **Rocket** reste derrière son équipe et soigne en continu.",
        "Un héros joué à contre-emploi (Adam qui soigne en retrait, Rocket qui flanque) **charge lentement et apporte peu**."
      ]
    },
    {
      "title": "Rester en vie",
      "lead": "Ta mort en plein fight, surtout avec ton ult chargée, fait presque toujours perdre le fight.",
      "items": [
        "Ne te place **jamais devant tes tanks**, et à peine à côté. Exceptions : pendant ton ult, ou quand le fight est déjà gagné.",
        "Joue **près d'une couverture**. Test : si une Scarlet Witch lançait son ult à côté de toi, aurais-tu un mur pour te cacher ?",
        "Exercice : pendant une partie rapide entière, **reste collé à un mur ou à un obstacle**. Tu sentiras vite la différence.",
        "Survivre ne suffit pas : **trop en retrait, tu n'apportes plus rien**."
      ]
    },
    {
      "title": "Se placer selon l'adversaire",
      "lead": "Il n'y a pas de bon placement universel : tout dépend de ce que l'ennemi veut te faire.",
      "items": [
        "Contre un **bagarreur au corps à corps** (The Thing) : garde tes distances, tes tanks ne te protègent pas de lui.",
        "Contre le **dive** (Venom, Captain America) : au contraire, **reste près de ton équipe** pour qu'elle te défende.",
        "Contre le **poke à distance** (Hawkeye, Hela) : joue **à couvert**, derrière les murs et les boucliers."
      ]
    },
    {
      "title": "Bien utiliser ton ult",
      "lead": "Une ult de support peut gagner ou perdre un fight à elle seule. Le timing compte plus que tout.",
      "items": [
        "Seulement **pendant un vrai fight** : ni avant (l'ennemi recule), ni après (trop tard).",
        "Regarde le **tableau (Tab)** : si personne n'avance ni ne recule, le fight est serré et ton ult peut le faire basculer.",
        "**Deux morts ou plus** d'un côté ? Le fight est décidé : garde ton ult pour le suivant.",
        "Ne réponds pas **automatiquement** à l'ult d'un support adverse : attends le dernier moment utile. Certaines ults durent plus longtemps que d'autres.",
        "Avec l'autre support, **annoncez qui ult en premier**.",
        "Bonnes raisons d'ult : **contrer** une ult dangereuse, **sauver** une cible clé, **retourner** un fight important (le dernier avant un checkpoint en Convoi)."
      ]
    },
    {
      "title": "Faire plus que soigner",
      "lead": "Si les deux équipes soignent, c'est celle qui fait le plus en plus du soin qui gagne.",
      "kind": "tips",
      "items": [
        "Ajoute des **dégâts dès que tu peux** : ce sont les dégâts qui gagnent les fights.",
        "Essai : une partie où **tes dégâts dépassent tes soins**. Ton équipe tiendra quand même.",
        "**Luna Snow, Invisible Woman** : place-toi pour que tes tirs touchent à la fois tes tanks et les ennemis.",
        "**Rocket** : tire sur quiconque s'approche trop. **Cloak & Dagger** : passe en Cloak de temps en temps.",
        "**Adam Warlock, Mantis** : tire en continu.",
        "Pense à ton **utilitaire** : attraction d'Invisible Woman, stuns de Luna Snow et de Mantis, bonus de dégâts de Mantis."
      ]
    },
    {
      "title": "Choisir qui soigner",
      "lead": "Parfois, tu ne peux sauver qu'une personne. Choisis celle qui pèse le plus sur la suite.",
      "items": [
        "Un **Punisher en ult** vaut le coup si l'ennemi n'a pas de tank pour l'encaisser.",
        "Un **Groot proche de son ult** vaut le coup si tu as un combo prêt derrière.",
        "**Éliminer une menace** (une Hela isolée) revient à soigner toute ton équipe à l'avance."
      ]
    },
    {
      "title": "Suivre les ults adverses",
      "lead": "Savoir quelle ult arrive en face, c'est garder la bonne réponse au bon moment.",
      "items": [
        "Repère : chacun récupère son ult **environ tous les deux fights**. Plus lent en triple support, plus rapide si quelqu'un meurt tôt.",
        "Exercice : regarde **en replay** une partie d'un ami où tu n'étais pas, **masque les ults**, devine qui l'a après chaque fight, puis vérifie.",
        "**Annonce ces infos** à ton équipe."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer **devant ou à côté** de ses tanks.",
        "Lancer son ult **hors d'un vrai fight**.",
        "Ult **en même temps** que l'autre support.",
        "**Ne faire que soigner.**",
        "Rester **si loin** qu'on n'apporte plus rien."
      ]
    }
  ],
  "counters": [],
  "synergies": [],
  "sources": [
    { "title": "Guide général du support", "author": "Paz (padswagger)" },
    { "title": "Useless Strategists", "author": "Auteur à préciser" }
  ]
}
$json$::jsonb
where kind = 'role' and role = 'Strategist';
