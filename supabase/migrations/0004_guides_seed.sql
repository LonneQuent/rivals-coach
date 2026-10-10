-- Rivals Coach — premiers guides : Jeff the Land Shark et le rôle Strategist.
-- Contenu reformulé en français à partir de vidéos de joueurs haut niveau (sources créditées dans chaque guide).
-- À exécuter après 0003_guides_goals_radar.sql. Modifiable ensuite dans Admin > Guides.

insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json$
{
  "summary": "Jeff se joue comme un flanqueur qui harcèle la backline adverse, pas comme un healer de fond. Il gagne les fights en attirant l'attention et les dégâts sur lui pendant que son équipe nettoie.",
  "patch_note": "Conseils tirés d'une vidéo de la saison 2. Les valeurs du kit, les team-ups et la méta ont pu changer depuis : vérifie en jeu.",
  "sections": [
    {
      "title": "Philosophie de jeu",
      "items": [
        "Si tu te contentes de soigner, tu joues Jeff à l'envers : ta valeur vient de la pression que tu mets sur les supports adverses.",
        "Prends un angle de flanc, harcèle les supports, attire l'aggro, puis repars avant de tomber.",
        "Absorber l'attention de l'adversaire, c'est soigner ton équipe indirectement : ça ne se voit pas au tableau des scores, mais dans le résultat.",
        "Si tu préfères soigner en retrait, un Strategist comme Rocket, Luna Snow ou Loki sera plus adapté."
      ]
    },
    {
      "title": "Soin (Joyful Splash)",
      "items": [
        "Le jet traverse les alliés : aligne-toi pour soigner plusieurs cibles d'un coup.",
        "C'est un projectile, pas un rayon instantané : anticipe un peu à longue distance et soigne une cible juste avant qu'elle encaisse.",
        "Reviens au soin dans des cas précis : quand tu es chassé de ton angle et que ton équipe prend cher (ça charge aussi ton ult très vite).",
        "Protège en priorité un allié en pleine ult (un Punisher, par exemple) ou proche de l'avoir (une Luna Snow plongée qui doit survivre pour la sortir).",
        "Le reste du temps, les dégâts passent avant le soin."
      ]
    },
    {
      "title": "Dégâts (Aqua Burst)",
      "items": [
        "Vise les pieds de la cible ou le mur derrière elle : les dégâts de zone compensent un tir direct raté.",
        "Ce tir ne fait pas de headshot : vise le corps.",
        "Un héros volant loin de tout mur ne vaut pas tes munitions : change de cible.",
        "Cibles prioritaires : supports et DPS. Ne tire pas sur les tanks, tu ne leur fais presque rien et tu les attires sur toi.",
        "Ton but : faire paniquer les supports adverses pour arracher un kill ou les forcer à sortir une ult."
      ]
    },
    {
      "title": "Survie et déplacements",
      "items": [
        "Sous terre (Hide and Seek), Jeff va plus vite, se soigne, ne peut pas prendre de headshot et n'expose qu'un aileron.",
        "Il peut nager sur les murs et y rester immobile pour tendre une embuscade, très efficace en défense. Option confort : régler la plongée en appui simple dans les paramètres.",
        "Cycle de base : pose une bulle, passe dedans, plonge, file vers ton angle, harcèle ; dès qu'on te répond, nouvelle bulle et repli.",
        "Le bonus de vitesse des bulles ne se cumule pas : n'en enchaîne pas pour rien.",
        "Avant de partir en flanc, laisse 2 ou 3 bulles à tes supports.",
        "Garde toujours 1 ou 2 bulles pour ta propre fuite. Bien géré, Jeff ne devrait presque jamais mourir.",
        "Son passif réduit les dégâts des coups critiques. En te déplaçant en huit, tu deviens encore plus dur à toucher."
      ]
    },
    {
      "title": "Ultime (It's Jeff)",
      "items": [
        "Avant le fight, pose une traînée de bulles vers le vide où tu veux recracher les ennemis : vitesse et soin pour finir le trajet.",
        "Attention aux héros mobiles (Invisible Woman, Doctor Strange, Wolverine, Psylocke) : ils reviennent si l'angle n'est pas assez raide. Dans le doute, emporte-les avec toi hors de la carte.",
        "L'ult avale aussi tes alliés : ne les jette pas dans le vide, et ne vide pas ton propre point en prolongation.",
        "Un bon Magneto garde son ult pour toi : force-la avant, ou attends qu'il la lâche ailleurs.",
        "Certains héros ne peuvent pas être avalés pendant leur ult (Emma Frost, Punisher).",
        "L'adversaire se disperse pour te contrer : avale vite, ou vise une prolongation sur le point, quand ils doivent rester groupés.",
        "Une ou deux cibles clés suffisent souvent, par exemple le Groot qui prépare un combo.",
        "En défense, avale ton équipe juste avant un gros combo ou une ult adverse (Magneto, Iron Man, Hawkeye).",
        "Timing très rentable : au moment où un support adverse lance son ult."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "items": [
        "Jouer Jeff en healer de fond.",
        "Gaspiller toutes ses bulles et ne plus pouvoir fuir.",
        "Flanquer trop loin, dans des positions faciles à atteindre.",
        "Tirer sur les tanks.",
        "Lancer l'ult sur le point en prolongation et sortir sa propre équipe."
      ]
    }
  ],
  "counters": [
    { "hero": "captain-america", "note": "Il suit Jeff partout et annule son flanc." },
    { "hero": "star-lord", "note": "Très mobile, et la hitbox de Jeff est facile à toucher." },
    { "hero": "iron-man", "note": "Dégâts de zone quasi impossibles à rater, et Jeff a du mal à le toucher en l'air." },
    { "hero": "loki", "note": "Ses projectiles explosifs et ses runes compliquent la vie de Jeff." }
  ],
  "synergies": [
    { "hero": "luna-snow", "note": "Team-up : munitions glacées qui ralentissent et tapent plus fort. Le meilleur duo, à vérifier selon la saison." },
    { "hero": "captain-america", "note": "Tank de dive : leurs dégâts combinés écrasent la backline." },
    { "hero": "venom", "note": "Autre tank de dive qui accompagne bien la pression de Jeff." },
    { "hero": "human-torch", "note": "Il pousse les supports à reculer pendant que Jeff les empêche de fuir." },
    { "hero": "black-panther", "note": "DPS de dive qui profite du chaos créé par Jeff." },
    { "hero": "iron-fist", "note": "DPS de dive, bonne complémentarité." }
  ],
  "sources": [
    { "title": "Guide Jeff the Land Shark", "author": "Paz (padswagger)" }
  ]
}
$json$::jsonb
from public.heroes h
where h.slug = 'jeff-the-land-shark'
on conflict do nothing;

insert into public.guides (kind, role, status, content)
values ('role', 'Strategist', 'published', $json$
{
  "summary": "Soigner, c'est le minimum. Ce qui sépare un bon Strategist d'un mauvais, c'est de rester en vie, de bien gérer son ult et d'apporter plus que du soin.",
  "patch_note": "Principes valables quelle que soit la saison. Les exemples de héros dépendent de la méta du moment.",
  "sections": [
    {
      "title": "Ton vrai objectif : charger ton ult",
      "items": [
        "Soins, dégâts et survie servent tous un même but : charger ton ult le plus vite possible.",
        "Cette idée t'indique comment jouer chaque héros : Adam Warlock prend des angles et fait des dégâts, Rocket reste derrière son équipe et soigne en continu.",
        "Un héros joué à contre-emploi (Adam qui soigne en retrait, Rocket qui flanque) charge son ult lentement et apporte peu."
      ]
    },
    {
      "title": "Rester en vie",
      "items": [
        "Ta mort en plein fight, surtout avec ton ult chargée, fait presque toujours perdre le fight.",
        "Ne te place jamais devant tes tanks, et à peine à côté. Exceptions : pendant ton ult, ou quand le fight est déjà gagné.",
        "Joue près d'une couverture. Test simple : si une Scarlet Witch lançait son ult à côté de toi, aurais-tu un mur derrière lequel te cacher ?",
        "Exercice : pendant une partie rapide entière, reste toujours collé à un mur ou à un obstacle. Tu sentiras vite la différence.",
        "Survivre ne suffit pas : à trop rester en retrait, tu ne soignes plus et tu n'apportes rien."
      ]
    },
    {
      "title": "Se placer selon l'adversaire",
      "items": [
        "Contre un bagarreur au corps à corps (The Thing) : garde tes distances, tes tanks ne te protègent pas de lui.",
        "Contre le dive (Venom, Captain America) : au contraire, reste près de ton équipe pour qu'elle puisse te défendre.",
        "Contre le poke à distance (Hawkeye, Hela) : joue à couvert, derrière les murs et les boucliers de tes tanks."
      ]
    },
    {
      "title": "Bien utiliser ton ult",
      "items": [
        "Seulement pendant un vrai fight : ni avant, quand l'ennemi peut juste reculer, ni après, quand c'est trop tard.",
        "Regarde le tableau (Tab) : si personne n'avance ni ne recule, le fight est serré et ton ult peut le faire basculer.",
        "Si deux joueurs ou plus sont morts d'un côté, le fight est décidé : garde ton ult pour le suivant.",
        "Ne réponds pas automatiquement à l'ult d'un support adverse : attends le dernier moment utile. Certaines ults durent plus longtemps que d'autres (celle de Luna Snow, par exemple).",
        "Avec l'autre support, annoncez qui ult en premier pour ne jamais lancer les deux en même temps.",
        "Bonnes raisons d'ult : contrer une ult adverse dangereuse, sauver une cible clé, ou tenter de retourner un fight important (le dernier avant un checkpoint en Convoi)."
      ]
    },
    {
      "title": "Faire plus que soigner",
      "items": [
        "Ajoute des dégâts dès que tu peux, même entre deux soins : ce sont les dégâts qui gagnent les fights.",
        "Essai : une partie où tes dégâts dépassent tes soins. Tu verras que ton équipe tient quand même.",
        "Luna Snow, Invisible Woman : place-toi pour que tes tirs touchent à la fois tes tanks et les ennemis.",
        "Rocket : tire sur quiconque s'approche trop de toi.",
        "Cloak & Dagger : passe en Cloak de temps en temps pour mettre de la pression.",
        "Adam Warlock, Mantis : tire en continu.",
        "Pense à ton utilitaire : attraction d'Invisible Woman, stuns de Luna Snow et de Mantis, bonus de dégâts de Mantis sur tes DPS."
      ]
    },
    {
      "title": "Choisir qui soigner",
      "items": [
        "Quand deux alliés vont tomber, sauve celui qui pèse le plus sur la suite du fight.",
        "Un Punisher en ult vaut le coup si l'ennemi n'a pas de tank pour l'encaisser. Un Groot proche de son ult vaut le coup si tu as un combo prêt derrière.",
        "Éliminer une menace (une Hela isolée sur un angle) revient à soigner toute ton équipe à l'avance."
      ]
    },
    {
      "title": "Suivre les ults adverses",
      "items": [
        "Repère : chaque joueur récupère son ult environ tous les deux fights. C'est plus lent en triple support, plus rapide si quelqu'un meurt tôt.",
        "Exercice : regarde en replay une partie d'un ami où tu n'étais pas, masque l'affichage des ults, devine après chaque fight qui l'a, puis vérifie.",
        "Annonce ces infos à ton équipe : savoir quelle ult arrive permet de garder la bonne réponse."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "items": [
        "Jouer devant ou à côté de ses tanks.",
        "Lancer son ult hors d'un vrai fight.",
        "Lancer son ult en même temps que l'autre support.",
        "Ne faire que soigner.",
        "Rester si loin qu'on n'apporte plus rien."
      ]
    }
  ],
  "sources": [
    { "title": "Guide général du support", "author": "Paz (padswagger)" },
    { "title": "Useless Strategists", "author": "Auteur à préciser" }
  ]
}
$json$::jsonb)
on conflict do nothing;
