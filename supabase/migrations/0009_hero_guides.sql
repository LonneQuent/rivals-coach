-- Rivals Coach — fiches héros tirées des vidéos de Paz (padswagger), reformulées en français.
-- À exécuter après 0008. Crée ou remplace la fiche de chaque héros et la publie.
-- Les chiffres du kit et les team-ups ont été retirés : ils changent à chaque saison.
-- Un héros absent de la table heroes est simplement ignoré.

-- adam-warlock
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Adam Warlock est le support le plus exigeant mais l'un des plus rentables : il gagne en mettant la pression depuis des angles décalés, en chargeant son ult à grande vitesse et en utilisant son lien d'âmes pour annuler les ults adverses.",
  "tldr": [
    "Joue **sur un angle décalé** et fais des dégâts : c'est ce qui charge ta résurrection.",
    "Ton **lien d'âmes** est ta meilleure capacité : garde-le pour contrer une ult qui tuerait un allié.",
    "Place ta **résurrection à couvert**, loin des ennemis, et survis pendant qu'elle agit."
  ],
  "difficulty": 3,
  "tags": [
    "Angles décalés",
    "Dégâts",
    "Anti-ult",
    "Résurrection"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Si tu restes en retrait à soigner, n'importe quel autre support fera mieux le travail. Adam se joue agressif.",
      "items": [
        "Prends des **angles décalés**, fais un maximum de dégâts et **charge ton ult** plus vite que les autres supports.",
        "Utilise ton **lien d'âmes** pour bloquer une ult adverse clé ou pour permettre à ton équipe de forcer un fight.",
        "Les meilleurs Adam ne sont pas ceux qui visent le mieux : ce sont ceux qui **combinent dégâts et soins au bon moment**."
      ]
    },
    {
      "title": "Dégâts",
      "ability": "Quantum Magic · Cosmic Cluster",
      "key": "Clic G · Clic D",
      "lead": "Ton tir principal touche instantanément et fait très mal pour un support. Deux tirs à la tête laissent la plupart des cibles à un souffle.",
      "items": [
        "Le tir principal est **instantané** (hitscan) : très fiable, mais il **perd de la puissance à longue distance**.",
        "Le tir chargé envoie une salve de projectiles **sans perte de dégâts** à distance : idéal pour finir une cible de loin. Écarte un peu ta visée pour toucher plus de projectiles.",
        "Combo rapproché : **tir principal, tir chargé, tir principal**. Bien placé, il élimine une cible fragile.",
        "Les deux tirs partagent les **mêmes munitions** : recharge avant le fight pour ne pas être à sec au mauvais moment.",
        "Charge ton tir chargé **en tournant les angles** pour poker. Mais évite les dégâts inutiles qui donnent de l'ult gratuite aux supports adverses.",
        "Entraîne-toi à la visée **par clics** (statique et dynamique) : c'est exactement ce que demande Adam."
      ]
    },
    {
      "title": "Soin",
      "ability": "Regenerative Cocoon (« le snap »)",
      "lead": "Ton soin rebondit entre les alliés proches de ta cible, en priorité vers ceux qui ont le moins de PV. Tu n'en as que deux charges.",
      "items": [
        "Le soin **rebondit** sur les alliés autour de la cible, toujours vers celui qui a **le moins de PV bruts**.",
        "Sans allié autour, les rebonds reviennent sur la cible, puis **sur toi**. Vise le sol pour te soigner directement.",
        "N'utilise pas une charge sur un allié **à peine touché** : attends qu'il ait perdu une bonne partie de sa vie pour rentabiliser chaque soin.",
        "Tes auto-soins font d'Adam un **excellent duelliste**, mais c'est risqué : si tu gâches tes deux charges sur toi, ton équipe n'a plus de soins.",
        "Sur ton angle, **prends le moins de dégâts possible** : joue autour des couvertures et sors de préférence par la droite."
      ]
    },
    {
      "title": "Lien d'âmes",
      "ability": "Soul Bond",
      "key": "Maj",
      "lead": "Le lien partage les dégâts entre tous les alliés liés et les soigne un peu. Sa portée est courte : reste proche de ton équipe.",
      "items": [
        "Garde-le pour **contrer une ult qui tuerait un allié** : un Magneto qui vise ton support en pleine ult, une Psylocke, un Winter Soldier…",
        "Lance-le **un peu en avance** : il y a un court temps d'incantation pendant lequel tu peux être tué ou étourdi.",
        "Il ne sauve pas tout : si l'ult adverse fait plus de dégâts que vos PV cumulés, la cible meurt quand même.",
        "Lie en priorité les **personnages fragiles**. Les tanks ont déjà assez de PV et leur grosse hitbox casse le lien trop vite.",
        "Erreur classique : le lancer **trop tôt**, ou au contraire **le garder éternellement**. Sans ult en face, il peut aussi servir à forcer un fight que vous perdriez sinon.",
        "Le lien se rompt si tu t'éloignes trop de ton équipe."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Karmic Revival",
      "key": "Q",
      "lead": "Tu ressuscites les alliés qui meurent pendant quelques secondes. C'est l'ult la plus longue à charger du jeu, et l'une des plus fortes.",
      "items": [
        "Les alliés ressuscités reviennent **très faibles** : place l'ult **derrière un mur**, hors de portée des ennemis.",
        "Tu peux **mourir pendant l'incantation** : lance-la depuis un endroit sûr.",
        "Contre un combo d'ults inévitable (par exemple un Groot prêt à combiner), **joue à l'écart et ressuscite après** : une ult en contre deux.",
        "La portée se compte **autour de toi**, pas autour du point posé : tu peux marcher vers les alliés tombés, même ceux sortis de la carte.",
        "Pas besoin de tout le monde : ramener **un seul joueur clé** (un allié sur le point d'avoir son ult) peut gagner le fight.",
        "Plus tu montes en rang, plus l'ennemi **surveille ton ult** : joue encore plus prudemment quand elle est prête."
      ]
    },
    {
      "title": "Passif : auto-résurrection",
      "ability": "Soul Perseverance",
      "lead": "Quand elle est disponible, tu peux te relever après ta mort. Ça te permet de prendre un angle un peu plus risqué.",
      "items": [
        "Avec l'auto-résurrection prête, ose **un cran plus d'agressivité** : tu trouveras des kills que tu n'aurais pas tentés.",
        "L'ennemi **voit ton fantôme** et peut camper ton corps : relève-toi à l'abri.",
        "Ne te relève pas si le fight est déjà perdu : **garde-la pour le prochain**."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester **en retrait à soigner** au lieu de prendre un angle.",
        "**Gâcher ses soins** sur des alliés presque pleins.",
        "Lancer le lien **trop tôt** ou ne jamais l'utiliser.",
        "Poser la résurrection **à découvert**, où les alliés meurent aussitôt.",
        "Être **à sec de munitions** au début d'un fight."
      ]
    }
  ],
  "counters": [
    {
      "hero": "venom",
      "note": "Il fond sur toi et force tes deux soins très vite : Adam a peu de mobilité."
    },
    {
      "hero": "captain-america",
      "note": "Même problème : il colle Adam et vide ses ressources."
    },
    {
      "hero": "groot",
      "note": "Ses murs bloquent tes angles et sont longs à détruire."
    },
    {
      "hero": "hela",
      "note": "Elle gagne le duel à distance si elle vise bien la tête."
    }
  ],
  "synergies": [
    {
      "hero": "luna-snow",
      "note": "Son ult longue couvre les fights où toi tu joues sur un angle."
    },
    {
      "hero": "star-lord",
      "note": "Il tourne autour des ennemis : vos dégâts combinés trouvent vite des kills."
    },
    {
      "hero": "loki",
      "note": "Bon duo de supports pour se protéger mutuellement pendant une résurrection."
    }
  ],
  "sources": [
    {
      "title": "Adam Warlock Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=GqRusLyDjL0"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'adam-warlock'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- angela
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Angela est un tank volant qui va chercher une cible sur un angle et la ramène dans son équipe pour qu'elle la finisse. Une fois le pick obtenu, elle passe aux haches et brawle avec ses alliés en leur donnant de la vie bonus.",
  "tldr": [
    "Ton rôle : **attraper une cible et la ramener** vers ton équipe, pas la tuer seule.",
    "Lance ta charge **quand tu as une ligne de retour** vers tes alliés.",
    "Après le pick, pose ta **zone de jugement** et brawle groupé : tes alliés gagnent de la vie bonus."
  ],
  "difficulty": 2,
  "tags": [
    "Pick",
    "Déplacement d'ennemis",
    "Brawl",
    "Vol"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Angela fait peu de dégâts seule. Sa force, c'est de déplacer un ennemi au bon endroit, au bon moment.",
      "items": [
        "Prends un **léger angle**, attrape une cible isolée et **ramène-la dans ton équipe** pour qu'elle la focus.",
        "Sans équipe pour suivre, le pick ne se convertit pas : **joue avec tes alliés**, pas seule dans leur dos.",
        "Elle est aussi bonne **contre le dive** : groupez-vous dans ta zone pour profiter de la vie bonus."
      ]
    },
    {
      "title": "Vol et lance",
      "ability": "Seraphic Sword · Spear of Ichor",
      "lead": "Angela vole en permanence et charge la jauge sous son viseur en se déplaçant. Plus la jauge est pleine, plus la lance frappe fort.",
      "items": [
        "Le vol **remplit ta jauge de dégâts**. Astuce : vole contre un mur pour la charger **sans t'exposer** pendant les phases de poke.",
        "Tu es **très bruyante** en vol : n'espère pas surprendre. Ne pars en flanc que si tu es sûre de revenir.",
        "Combo de base : **coup de mêlée puis coup de lance**, puis lève ton bouclier pour regagner de la jauge.",
        "La lance **transperce** : deux ennemis alignés prennent tous les deux.",
        "Garde un coup de lance chargé pour **pousser un ennemi dans le vide** : son effet de projection rend les éjections bien plus fiables."
      ]
    },
    {
      "title": "Charge de l'assassin",
      "ability": "Assassin's Charge",
      "key": "Maj",
      "lead": "Tu fonces et embarques jusqu'à deux ennemis. C'est ta capacité signature, et elle vide vite ton énergie quand tu portes quelqu'un.",
      "items": [
        "Lance-la quand tu as une **ligne directe vers ton équipe** : la cible doit atterrir chez tes alliés quand ton énergie s'épuise.",
        "Ne l'utilise **pas en début de fight** : place-toi d'abord, dépense ta jauge de dégâts, puis attrape.",
        "Porter une cible **recharge vite ta jauge de dégâts** : enchaîne coup de lance, charge, puis nouveau coup.",
        "Très forte pour **sortir un support de son ult** (Cloak & Dagger, Invisible Woman) : ton équipe n'a plus qu'à le focus.",
        "Les contrôles (gel, étourdissement, projection) **t'arrêtent net** en pleine charge.",
        "Option : le mode **maintenir pour charger** est plus précis, à tester dans les paramètres."
      ]
    },
    {
      "title": "Zone de jugement et haches",
      "ability": "Divine Judgment · Axes of Ichor",
      "key": "E",
      "lead": "Tu plonges au sol, poses une zone et passes aux haches. Chaque coup dans la zone te donne de la vie bonus, et à tes alliés aussi.",
      "items": [
        "Dans la zone, tu vas **plus vite** et chaque coup de hache donne de la **vie bonus** à toi et à tes alliés présents.",
        "Les haches **frappent plusieurs ennemis** à la fois : idéal pour brawler sur le point.",
        "Le temps de recharge ne repart que quand tu **reprends ta forme de vol** : ne reste pas aux haches une fois la zone disparue.",
        "Exception : reste aux haches si tu frappes beaucoup d'ennemis à la fois (pendant une ult de support), ça charge ton ult."
      ]
    },
    {
      "title": "Bouclier",
      "key": "Clic D",
      "lead": "Petit bouclier frontal qui ne te ralentit pas et remplit ta jauge de dégâts quand il encaisse.",
      "items": [
        "Ne bloque pas les petits dégâts : ta barre de vie s'en charge. **Garde-le pour l'important**.",
        "Bloque **les contrôles** quand tu repars, et les ults comme celles de Hela, Magneto ou Doctor Strange.",
        "Fonce sur un support **bouclier levé** pour ne pas te faire geler en approchant."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Heaven's Retribution",
      "key": "Q",
      "lead": "Tu plantes ta lance au sol : les ennemis autour y sont attachés et fortement ralentis. Réappuie pour bondir dessus et créer une zone gratuite.",
      "items": [
        "Vise **le sol, un mur ou un plafond** : lancée sur un ennemi en l'air, la lance traverse et se perd. Évite les escaliers.",
        "Les ennemis attachés ne peuvent pas utiliser leurs **déplacements** : parfait pour enchaîner avec une ult de zone (Moon Knight, Phoenix, Human Torch…).",
        "Combo fort : **sortir un support de son ult** avec la charge, puis l'attacher pour que ton équipe le finisse.",
        "Le rebond sur la lance est une **zone de jugement gratuite** : utilise ta vraie zone tôt dans le fight, puis l'ult pour la seconde vague.",
        "Elle est **longue à charger** pour les dégâts que tu fais : optimise ton kit pour l'obtenir."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Charger une cible **sans ligne de retour** vers ton équipe.",
        "Utiliser la charge **dès le début** du fight.",
        "Partir en flanc **bruyamment** et mourir seule.",
        "Lever le bouclier sur des **dégâts insignifiants**.",
        "Lancer l'ult **sur un ennemi en l'air** au lieu du sol."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Sa bulle protège ta cible et annule ta charge."
    },
    {
      "hero": "hulk",
      "note": "Même chose avec sa bulle sur ses alliés."
    },
    {
      "hero": "the-punisher",
      "note": "Ses dégâts continus te font fondre."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses poussées et attractions coupent tout ce que tu tentes."
    },
    {
      "hero": "luna-snow",
      "note": "Elle peut te geler en pleine charge."
    }
  ],
  "synergies": [
    {
      "hero": "emma-frost",
      "note": "Elle tient la ligne de front pendant que tu joues ton angle."
    },
    {
      "hero": "magneto",
      "note": "Autre tank solide pour tenir le point à ta place."
    },
    {
      "hero": "phoenix",
      "note": "Elle finit facilement la cible que tu ramènes."
    },
    {
      "hero": "jeff-the-land-shark",
      "note": "Ses bulles de vitesse te permettent d'emmener une cible beaucoup plus loin."
    }
  ],
  "sources": [
    {
      "title": "Angela Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=HRkY4e6CFow"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'angela'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- black-cat
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Black Cat est une plongeuse qui frappe vite et fort après avoir forcé les cooldowns adverses. Tout son kit tourne autour de l'or : elle en gagne en touchant ses capacités et le dépense pour des gadgets qui rendent ses engagements mortels.",
  "tldr": [
    "**Pas d'or, pas de Black Cat** : touche ton grappin en début de fight pour te refaire.",
    "Combo de base : **grappin, dash aux pieds, coups, fouet, poursuite fantôme**.",
    "Ta poursuite fantôme te rend **intouchable** un court instant : garde-la pour esquiver un contrôle."
  ],
  "difficulty": 3,
  "tags": [
    "Plongée",
    "Économie d'or",
    "Duels",
    "Utilitaire"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Black Cat ne farme pas des dégâts sur la durée : elle force les cooldowns, puis frappe en rafale pour trouver un kill.",
      "items": [
        "Entre deux plongées, **farme de l'or** : il rend ton prochain engagement bien plus dangereux.",
        "Vise d'avoir un **bon matelas d'or** avant d'engager pour de vrai.",
        "Mourir te fait **perdre une partie de ton or** : si la mort est inévitable, achète un gadget avant, il reste après la réapparition.",
        "En duel isolé, elle est redoutable grâce à la **vie bonus** de ses coups : cherche les 1v1."
      ]
    },
    {
      "title": "Gagner de l'or",
      "ability": "Sticky Paws · Turn of Fortune",
      "key": "E",
      "lead": "Chaque capacité qui touche rapporte de l'or. Le grappin est ta principale source : rate-le et tu ne fais plus rien du fight.",
      "items": [
        "Le **grappin** rapporte beaucoup d'or et un peu de vie bonus. Vise les **tanks** : grosse hitbox, impossible à rater.",
        "En milieu de fight, un grappin sur une cible épaisse te donne de la **vie bonus** pour rester plus longtemps.",
        "Tes coups marquent les ennemis : tu les **vois à travers les murs** et ils ont une chance de rater leurs headshots sur toi.",
        "Concentre-toi sur la **précision du grappin** quand tu apprends le perso : tu vis ou tu meurs par l'or."
      ]
    },
    {
      "title": "Combat rapproché",
      "ability": "Feline Fury · Fortune's Favor",
      "key": "Clic G · Clic D",
      "lead": "Tes griffes et ton fouet font des dégâts de zone devant toi et te donnent de la vie bonus.",
      "items": [
        "Alterne **coups de griffes et fouet** : c'est rentable en or et tu gagnes de la vie bonus à chaque touche.",
        "Le fouet frappe **en cône** devant toi, plus efficace face à la cible qu'à ses côtés.",
        "**Poursuite fantôme** : un bond à distance qui te rend **intouchable** un instant. Il esquive des ults (Doctor Strange, Winter Soldier, Magneto) ou des contrôles (boule de neige de Luna, flash de Cloak).",
        "Garde la poursuite pour **finir une cible qui fuit** ou **esquiver un contrôle**. En duel, le fouet suffit souvent."
      ]
    },
    {
      "title": "Mobilité",
      "ability": "Cat's Cradle",
      "key": "Maj",
      "lead": "Deux dashes à long temps de recharge, un double saut et l'escalade des murs. Ta survie dépend de leur gestion.",
      "items": [
        "Le dash **traverse les cibles** : vise leurs **pieds** pour t'arrêter sur elles.",
        "Règle simple : **un dash pour entrer, un pour sortir**. Ne les gâche pas pour te déplacer.",
        "Chaque capacité **recharge ton double saut** : tu peux enchaîner saut, mur et capacités pour rester en l'air.",
        "Accroche-toi au-dessus d'un passage étroit et **tombe sur les supports** quand ils passent."
      ]
    },
    {
      "title": "Les gadgets",
      "ability": "Gilded Deal",
      "key": "F",
      "lead": "Six objets à usage unique contre de l'or. Bien choisis au bon moment, ce sont eux qui gagnent les fights.",
      "items": [
        "**Crâne enflammé** (pas cher) : montre les ennemis à travers les murs à toute ton équipe tant qu'il n'est pas détruit. À poser **en hauteur dans un coin**, et à déplacer s'ils le visent.",
        "**Poisson** : zone qui ralentit, bloque les déplacements et cloue les volants au sol. Le meilleur ouvreur d'engagement, aussi utile pour **protéger tes supports**.",
        "**Invisibilité** : utile surtout **pour entrer** sans gaspiller un dash, et pour forcer les cooldowns adverses.",
        "**Anneau-portail** : passage à travers un mur ou un plafond pour toi **et ton équipe**. Très fort sur les cartes à goulots.",
        "**Cristal anti-contrôle** : correct si tu as de l'or en trop, mais la poursuite fantôme fait souvent le même travail.",
        "**Rune de jeu** : à éviter, sauf juste avant de mourir pour tenter ta chance à la réapparition."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Calling Card",
      "key": "Q",
      "lead": "Tous les ennemis reçoivent une carte : tu peux bondir derrière n'importe lequel et l'exécuter. Chaque kill relance le bond.",
      "items": [
        "Trois appuis : **activer**, **bondir** sur la cible, puis **finir le combo**. Beaucoup de joueurs oublient le dernier.",
        "La carte devient **rouge quand la cible va mourir** au prochain appui.",
        "Évite de commencer par un héros **très mobile** (Scarlet Witch, White Fox) si son évasion est encore disponible.",
        "Attends que **ton équipe soit prête** à suivre : l'ult crée surtout de l'espace pour elle.",
        "Pas besoin d'or au départ : l'ult t'en donne largement."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Engager **sans or**.",
        "**Rater le grappin** et passer le fight à ne rien faire.",
        "Gâcher ses dashes pour **se déplacer**.",
        "Lancer l'ult **seule**, sans équipe prête à suivre.",
        "Miser sur la **rune de jeu**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "the-thing",
      "note": "Il te verrouille au corps à corps."
    },
    {
      "hero": "peni-parker",
      "note": "Son nid gêne tes plongées. Contourne-le avec l'anneau-portail."
    },
    {
      "hero": "phoenix",
      "note": "Ses auto-soins et ses étourdissements cassent tes combos."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses poussées et attractions la rendent très dure à plonger."
    }
  ],
  "synergies": [
    {
      "hero": "venom",
      "note": "Le tank de dive idéal pour plonger avec toi."
    },
    {
      "hero": "captain-america",
      "note": "Autre tank de dive qui suit tes engagements."
    },
    {
      "hero": "daredevil",
      "note": "Duo de plongeurs qui écrase la backline."
    },
    {
      "hero": "psylocke",
      "note": "Pression combinée sur les supports."
    }
  ],
  "sources": [
    {
      "title": "Black Cat Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=pL7mAWytrB0"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'black-cat'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- black-panther
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Black Panther est un assassin qui vit de la surprise : il prépare son engagement en silence, plonge sur une cible fragile et enchaîne ses dashes en les rechargeant grâce à ses marques. S'il est repéré avant d'entrer, il perd son intérêt.",
  "tldr": [
    "Entre **plein de vie et sans être vu** : la surprise fait tout le travail.",
    "**Pas de dash disponible, pas d'engagement** : chaque dash doit traverser une cible marquée pour se recharger.",
    "Cible les **personnages fragiles**, jamais les tanks, et repars dès que tu as ton kill."
  ],
  "difficulty": 3,
  "tags": [
    "Assassin",
    "Plongée",
    "Burst",
    "Patience"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Contrairement à d'autres plongeurs, Panther doit s'engager à fond ou ne rien faire. Tout se joue avant d'entrer.",
      "items": [
        "Ne prends **aucun dégât** et ne te fais **pas repérer** avant ton engagement.",
        "Sors par un flanc, attends qu'un **support s'isole**, frappe, puis **repars** : inutile de rester une fois le kill obtenu.",
        "Tu n'es **pas obligé de finir un combo** : si tu vas mourir, sauve ta vie.",
        "Si l'ennemi lâche un gros cooldown défensif (bulle, runes de Loki), **pars** : tu as déjà gagné l'échange."
      ]
    },
    {
      "title": "Dash et marques",
      "ability": "Spear Rend",
      "key": "Maj",
      "lead": "Ton dash est ta principale source de dégâts. Traverser une cible marquée le recharge immédiatement et te donne de la vie bonus.",
      "items": [
        "**N'ouvre jamais** un engagement au dash : marque d'abord, puis dash pour qu'il se recharge.",
        "Rythme de base : **capacité qui marque, dash, capacité, dash**… jusqu'à te mettre à l'abri.",
        "Une marque reste quelques secondes : si on te regarde, **attends derrière un mur**, la menace suffit à mettre la pression.",
        "Tu **vois les cibles marquées à travers les murs** : pratique pour repérer celle qui s'isole.",
        "Ton passif te fait **taper plus fort à bas PV**, mais n'entre jamais déjà blessé."
      ]
    },
    {
      "title": "Lances et coup de pied",
      "ability": "Spear Toss · Spinning Kick",
      "lead": "Les lances marquent de loin, le coup de pied marque en te déplaçant. Ce sont tes outils pour préparer chaque dash.",
      "items": [
        "Les **lances** sont ta seule attaque à distance : lance-les **avec l'intention d'engager**, pas pour arroser.",
        "Astuce : lance en **tombant d'un mur**, puis dash dès que tu es à portée.",
        "Le **coup de pied** est orientable mais pas instantané. Une fois utilisé, tu es vulnérable : sois sûr de trouver le kill.",
        "Pour fuir, utilise de préférence le coup de pied : **le dash vaut plus cher** car il fait tes dégâts.",
        "Toute **projection** pendant le coup de pied l'annule : attention aux Invisible Woman et Magneto."
      ]
    },
    {
      "title": "Déplacements discrets",
      "ability": "Subtle Step",
      "lead": "Tes pas sont bruyants. L'escalade des murs et le double saut te permettent d'approcher en silence.",
      "items": [
        "Déplace-toi **par les murs** pour arriver par surprise.",
        "Garde tes capacités pour le combat : elles font tes dégâts, pas tes trajets."
      ]
    },
    {
      "title": "Combos",
      "kind": "tips",
      "lead": "Avec l'habitude, ces enchaînements deviennent automatiques. Ajoute un coup de griffe dès que possible pour sécuriser le kill.",
      "items": [
        "**De base** : lance, lance, dash, dash. Rapide, mais juste contre un support qui reçoit des soins.",
        "**Plus de dégâts** : lance, dash, lance, dash, dash. Plus long, idéal en prolongation quand les soins manquent.",
        "**Variante courante** : lance, dash, coup de pied, dash.",
        "**Tout lâcher** : lance, dash, coup de pied, dash, lance, double dash. Seulement quand il ne reste qu'un tank à abattre.",
        "Pour le coup final, **investis tes deux dashes**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Bast's Descent",
      "key": "Q",
      "lead": "Une panthère géante frappe et marque tous les ennemis touchés, et recharge ton dash.",
      "items": [
        "Ne l'utilise pas pour **ouvrir** : garde-la pour **finir** une cible ou ajouter du burst.",
        "Tu es **vulnérable pendant l'animation** : entre avec assez de vie.",
        "Quand les supports adverses n'ont pas d'ult, n'hésite pas à la lancer tôt : elle est **longue à recharger**.",
        "Avec l'ult prête, tu peux **insister** sur une cible même après avoir forcé un cooldown défensif."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Engager **sans dash** disponible.",
        "Se faire **repérer** ou blesser avant d'entrer.",
        "Plonger sur **un tank**.",
        "**Rester** après avoir obtenu son kill.",
        "Utiliser le coup de pied **sans être sûr** du kill."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Sa bulle annule le kill et la recharge de ton dash."
    },
    {
      "hero": "the-thing",
      "note": "Force son impact au sol avant de lancer ton gros combo."
    },
    {
      "hero": "peni-parker",
      "note": "Ses nids et ses toiles bloquent tes plongées."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses poussées et attractions te sortent de ton combo."
    },
    {
      "hero": "ultron",
      "note": "Il vole et ses drones protègent ses cibles."
    },
    {
      "hero": "namor",
      "note": "Ses tourelles te repèrent et t'usent avant que tu entres."
    }
  ],
  "synergies": [
    {
      "hero": "venom",
      "note": "Il affaiblit les supports avant que tu plonges."
    },
    {
      "hero": "captain-america",
      "note": "Même logique de plongée sur la backline."
    },
    {
      "hero": "star-lord",
      "note": "Un DPS qui tire sur ta cible fait passer tous tes combos."
    },
    {
      "hero": "luna-snow",
      "note": "Ses soins à distance t'aident à survivre en sortant."
    }
  ],
  "sources": [
    {
      "title": "Black Panther Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=0AkMzA-n-EA"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'black-panther'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- black-widow
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Black Widow est une sniper très mobile qui contrôle des zones entières de la carte. Avec un bonus de dégâts (Mantis, Storm, Cloak & Dagger), un tir à la tête suffit à éliminer la plupart des personnages fragiles, ults de support comprises.",
  "tldr": [
    "Choisis des **angles sûrs et durables** : un tir pris sans pression est bien plus facile à réussir.",
    "**Dé-scope régulièrement** pour surveiller les plongeurs autour de toi.",
    "Ton coup de pied **étourdit** : garde-le pour couper une ult ou te défendre."
  ],
  "difficulty": 2,
  "tags": [
    "Sniper",
    "Contrôle de zone",
    "Mobilité",
    "Pick"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Widow ne cherche pas toujours le kill : elle interdit des zones à l'ennemi, ce qui ouvre le jeu pour ton autre DPS.",
      "items": [
        "Ton angle dépend de ta compo : **en brawl**, tire sur ce que ton équipe peut finir. **En dive**, va plus loin pour affaiblir les supports.",
        "Tu n'as **pas besoin de tout toucher** : ta seule présence empêche l'ennemi de se placer où il veut.",
        "Elle est bien plus forte avec un **bonus de dégâts** : un tir à la tête devient alors mortel sur la plupart des cibles.",
        "Ce qui la distingue des autres tireurs : **portée + mobilité** pour changer d'angle en un instant."
      ]
    },
    {
      "title": "Le fusil",
      "ability": "Red Room Rifle · Straight Shooter",
      "key": "Clic G · Clic D",
      "lead": "Oublie les matraques : le fusil fait plus de dégâts. Le vrai savoir-faire, c'est de savoir quand viser et quand tirer à la hanche.",
      "items": [
        "Les **matraques** sont moins efficaces que le fusil : ne les sors pas.",
        "**De près, tire à la hanche.** De loin, **vise** : la lunette supprime la perte de dégâts à distance.",
        "Ne reste pas **lunette collée** plusieurs tirs d'affilée : tu vois mal autour de toi et tu bouges lentement, une proie facile pour les plongeurs.",
        "Visée : **un mouvement rapide vers la cible, puis un petit ajustement** vers la tête, plutôt qu'un seul flick.",
        "**Respire et détends le poignet** : tu n'as pas besoin de tout toucher pour être utile.",
        "Anticipe les trajectoires évidentes (un ennemi qui retombe d'un saut, qui revient du spawn en ligne droite) et attends-le."
      ]
    },
    {
      "title": "Course",
      "ability": "Fleet Foot",
      "key": "Maj",
      "lead": "Tu cours plus vite et sautes plus haut pendant quelques secondes. C'est ton outil pour changer d'angle.",
      "items": [
        "Utilise-la pour **passer d'un angle à l'autre** entre deux fights, ou quand ton angle ne marche plus.",
        "Les tirs en plein saut sont spectaculaires mais **rarement rentables** : ils vident ton énergie et te rendent vulnérable.",
        "Un saut au bon moment **esquive les attaques au sol** (impacts de Venom ou Captain America) et te laisse riposter."
      ]
    },
    {
      "title": "Coup de pied",
      "ability": "Edge Dancer",
      "key": "E",
      "lead": "Un premier coup de pied tout autour de toi, puis un second à distance qui étourdit. C'est ton seul vrai cooldown : rentabilise-le.",
      "items": [
        "Le second coup de pied reste disponible **quelques secondes** après le premier : charge-le sur un tank, puis garde-le en réserve.",
        "Il peut **interrompre des ults** (Doctor Strange, Scarlet Witch, ults de support) et **sortir Loki de sa copie** au moment où il redevient fragile.",
        "Combo sûr sur une cible fragile : **tir au corps, coup de pied, tir au corps**. Pas besoin de headshot.",
        "Garde-le pour **défendre tes supports** contre un plongeur : c'est l'un des meilleurs anti-Black Panther du jeu.",
        "Il te sauve aussi la vie : **étourdir le tank** qui fonce sur toi te laisse le temps de reculer."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Electro-Plasma Explosion",
      "key": "Q",
      "lead": "Un lance-grenade qui ralentit les ennemis et les rend plus vulnérables. Il se recharge très vite : lance-le à chaque fight.",
      "items": [
        "Plus tu **maintiens le tir**, plus l'explosion fait mal.",
        "Cibles idéales : un **support en ult** assez bas pour mourir, un **plongeur** sur tes supports, un **groupe** d'ennemis.",
        "Utilise-la pour **forcer les ults de support**, puis profite de la vulnérabilité pour les éliminer.",
        "La pire erreur : **la garder**. Elle revient très vite, lance-la."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester **lunette collée** et se faire plonger.",
        "Viser à longue distance **sans lunette**.",
        "Gaspiller le coup de pied quand un **plongeur** menace tes supports.",
        "Faire des **tirs sautés** sans raison.",
        "**Garder son ult** pour le moment parfait."
      ]
    }
  ],
  "counters": [
    {
      "hero": "psylocke",
      "note": "Elle te plonge sans entrer dans la portée de ton coup de pied."
    },
    {
      "hero": "captain-america",
      "note": "Il te rejoint facilement et tu peines à le tuer."
    },
    {
      "hero": "venom",
      "note": "Même problème, surtout avec un autre plongeur."
    },
    {
      "hero": "magneto",
      "note": "Son bouclier bloque tes tirs sur le point."
    },
    {
      "hero": "luna-snow",
      "note": "Son ult est protégée par un bouclier : très dure à couper."
    }
  ],
  "synergies": [
    {
      "hero": "mantis",
      "note": "Son bonus de dégâts rend tes tirs à la tête mortels."
    },
    {
      "hero": "storm",
      "note": "Même effet, mais tu dois rester dans sa zone."
    },
    {
      "hero": "cloak-and-dagger",
      "note": "Son flash donne aussi un bonus de dégâts."
    },
    {
      "hero": "psylocke",
      "note": "Avec un Captain America, la pression combinée fait tomber les supports."
    }
  ],
  "sources": [
    {
      "title": "Black Widow Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=LMej9-pVFek"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'black-widow'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- blade
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Blade est un duelliste de mi-distance méthodique : il accumule des charges de rage, coupe les soins adverses et pare les grosses menaces pour retourner les fights. Il se joue lentement et avec patience, pas en fonçant tête baissée.",
  "tldr": [
    "Ton fusil est un **blaster de mi-distance**, pas une arme de corps à corps.",
    "Garde ta **parade** pour les grosses menaces : ults, étourdissements, plongées.",
    "Accumule tes **charges de rage** avant de t'engager : c'est là que Blade devient dangereux."
  ],
  "difficulty": 2,
  "tags": [
    "Mi-distance",
    "Anti-soin",
    "Parade",
    "Brawl"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Blade n'est pas un assassin qui plonge : il grignote, coupe les soins et attend le bon moment pour basculer en rage.",
      "items": [
        "Joue **lentement et méthodiquement** : construis tes charges, puis appuie quand l'ennemi est affaibli.",
        "Reste au **contact de ton équipe** et protège tes supports contre les plongeurs (Captain America, Iron Fist…).",
        "Ton anti-soin est précieux : vise les cibles qui comptent sur leurs **soins pour survivre**."
      ]
    },
    {
      "title": "Fusil et épée",
      "lead": "Le fusil à pompe se joue comme un blaster de mi-distance. L'épée est faible tant que tu n'es pas en rage.",
      "items": [
        "Ne colle pas ta cible : le fusil est efficace **à mi-distance**, où tu restes à l'abri.",
        "L'épée hors rage fait **peu de dégâts** : ne l'utilise pas par défaut.",
        "Combo de base : **tir, dash, tir**. Le dash au fusil applique l'anti-soin entre deux tirs."
      ]
    },
    {
      "title": "Parade",
      "key": "Clic D",
      "lead": "La parade bloque les dégâts de face et te rend insensible aux contrôles au tout début. Les dégâts bloqués rechargent ton dash.",
      "items": [
        "Le tout début de la parade **ignore les contrôles** : un réflexe rapide suffit.",
        "Pare les **moments clés** : ults d'Iron Man ou Magneto, étourdissements de Phoenix ou Hela, plongée de Human Torch, ult de Jeff.",
        "Ne la gâche pas sur des **petits dégâts** : elle vaut beaucoup plus contre une vraie menace.",
        "Bloquer des dégâts **recharge ton dash** : une bonne parade relance ton combo."
      ]
    },
    {
      "title": "Dash",
      "ability": "Daywalker Dash",
      "key": "Maj",
      "lead": "Deux charges. Au fusil, il applique l'anti-soin ; à l'épée, il ralentit et fait un tourbillon.",
      "items": [
        "Au fusil : un **outil d'anti-soin** à placer entre deux tirs, pas seulement un déplacement.",
        "À l'épée (en rage) : il **ralentit** et frappe tout autour de toi, idéal pour finir.",
        "Garde une charge pour **sortir** d'un mauvais fight."
      ]
    },
    {
      "title": "Forme de rage",
      "ability": "Bloodline Awakening",
      "key": "E",
      "lead": "En rage, tu voles de la vie et tu frappes plus vite à chaque charge accumulée. Les ennemis à bas PV deviennent visibles à travers les murs.",
      "items": [
        "Accumule des charges **avant** de basculer : la rage est plus forte quand elle est déjà bien remplie.",
        "Passe d'une arme à l'autre avec **la touche dédiée** plutôt qu'à la molette : c'est plus fiable en combat.",
        "Profite de la **vision à travers les murs** pour traquer les cibles qui fuient à bas PV.",
        "Le **vol de vie** te permet de tenir dans un brawl où d'autres duellistes fondraient."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Thousandfold Slash",
      "key": "Q",
      "lead": "Un coup d'épée à distance qui laisse une zone d'anti-soin. Elle se recharge vite : utilise-la souvent.",
      "items": [
        "**Maintiens** la touche pour aller à la portée maximale.",
        "Lance-la **après que les boucliers et bulles** adverses sont tombés, sinon elle est absorbée.",
        "Utilise-la **en rage** pour profiter du vol de vie.",
        "Bon usage : **forcer les ults de soin** adverses, que ton équipe pourra contrer ensuite."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer le fusil **au corps à corps**.",
        "Sortir l'épée **hors de la rage**.",
        "Parer des **dégâts insignifiants**.",
        "Lancer l'ult **dans un bouclier**.",
        "Foncer **sans charges** de rage."
      ]
    }
  ],
  "counters": [
    {
      "hero": "the-thing",
      "note": "Il te verrouille et encaisse sans broncher."
    },
    {
      "hero": "human-torch",
      "note": "Ses dégâts de zone et son vol te compliquent la vie."
    },
    {
      "hero": "hela",
      "note": "Elle te gagne à distance avant que tu sois à portée."
    },
    {
      "hero": "phoenix",
      "note": "Ses étourdissements cassent ton rythme si tu rates ta parade."
    },
    {
      "hero": "adam-warlock",
      "note": "Ses soins à rebond et son lien limitent ton anti-soin."
    },
    {
      "hero": "ultron",
      "note": "Il vole hors de portée et soigne ses alliés à distance."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un tank de ligne qui te laisse jouer à mi-distance derrière lui."
    },
    {
      "hero": "emma-frost",
      "note": "Même logique : elle tient le front pendant que tu grignotes."
    },
    {
      "hero": "groot",
      "note": "Ses murs regroupent les ennemis pour ton ult."
    },
    {
      "hero": "mantis",
      "note": "Son bonus de dégâts accélère tes kills."
    },
    {
      "hero": "cloak-and-dagger",
      "note": "Soins constants qui te permettent de rester dans le brawl."
    }
  ],
  "sources": [
    {
      "title": "Blade Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=WPEDkYY4eGA"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'blade'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- captain-america
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Captain America est un tank de pression et de déplacement : il encercle l'équipe adverse pour préparer une plongée, ou intercepte un flanker avant qu'il n'atteigne tes supports. Il ne se joue jamais en restant devant à frapper les tanks.",
  "tldr": [
    "Ton job : **forcer les cooldowns** adverses par la pression, puis engager pour de vrai.",
    "Garde ton **bouclier et ta charge** pour esquiver les contrôles, pas pour bloquer chaque balle.",
    "Ton ult est une **mini-ult de support** : engager, contrer une menace moyenne ou tenir le point."
  ],
  "difficulty": 2,
  "tags": [
    "Plongée",
    "Pression",
    "Peel",
    "Mobilité"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Cap porte plusieurs casquettes selon ce dont ton équipe a besoin : préparer la plongée ou éteindre les incendies chez toi.",
      "items": [
        "Avec une **Psylocke ou un Daredevil**, aide-les à plonger sur les supports adverses.",
        "Si tes supports souffrent, **intercepte le plongeur** (Black Panther…) avant qu'il n'arrive.",
        "Prends un angle pour **dessiner un cercle** autour de l'ennemi, engage quand tu es prêt, force les ressources, puis fight.",
        "En fight à trois supports, ton rôle est d'**éteindre les incendies** : traite les menaces, force les ults adverses, et trouve des picks sur les DPS.",
        "Le but n'est pas de **tuer tout de suite** : c'est de forcer les cooldowns défensifs pour l'engagement suivant."
      ]
    },
    {
      "title": "Coups et boucliers lancés",
      "ability": "Sentinel Strike",
      "key": "Clic G",
      "lead": "Deux coups de poing débloquent des petits lancers de bouclier qui visent automatiquement autour de ton viseur.",
      "items": [
        "Après **deux coups de poing**, tu passes aux lancers de bouclier à distance.",
        "Le guidage est plus généreux si tu **vises à droite** de ta cible.",
        "Les charges se gagnent aussi sur les **murs de Groot** ou les **clones de Loki**, mais pas sur les boucliers inanimés.",
        "Ne spamme pas sprint et lancer : **attends le son d'impact** du bouclier, sinon tu annules ton attaque."
      ]
    },
    {
      "title": "Sprint et saut écrasé",
      "ability": "Leading Dash · Super-Soldier Slam",
      "key": "Maj",
      "lead": "Le sprint n'a ni temps de recharge ni jauge. En sautant pendant le sprint, tu peux t'écraser au sol et projeter les ennemis en l'air.",
      "items": [
        "Sprinte **entre deux lancers** pour ne jamais lâcher une cible qui fuit.",
        "Le sprint est **bruyant** : pour un flanc discret, marche.",
        "Le saut écrasé **projette en l'air** : idéal pour lancer un combo ou rejoindre un plongeur allié.",
        "Il a un long temps de recharge : si tu l'utilises pour entrer, **tu ne pourras pas t'en servir pour sortir**."
      ]
    },
    {
      "title": "Bouclier",
      "ability": "Living Legend",
      "key": "Clic D",
      "lead": "Le bouclier renvoie les projectiles dans une direction aléatoire. Il se régénère quand il est rangé, mais met du temps à revenir s'il casse.",
      "items": [
        "Il sert surtout à **esquiver les contrôles** : boule de neige de Luna, étourdissement de Hela.",
        "Il peut **protéger tes supports** : dagues de Hela, ults d'Iron Man ou de Magneto.",
        "Les coups de mêlée et les rayons **ne sont pas renvoyés**.",
        "Ne le lève pas juste parce que tu peux : la plupart des dégâts se soignent ou s'évitent avec un **meilleur placement**."
      ]
    },
    {
      "title": "Charge et lancer de bouclier",
      "ability": "Liberty Rush · Vibranium Energy Saw",
      "key": "F · E",
      "lead": "La charge te rend insensible aux contrôles. Le gros lancer de bouclier ricoche entre les cibles.",
      "items": [
        "Pendant la charge, tu es **insensible aux contrôles** : elle esquive boules de neige, ult de Doctor Strange, même l'ult de Jeff.",
        "Elle **s'arrête au contact** d'une cible : c'est soit pour finir, soit pour fuir, rarement les deux.",
        "Vise les **pieds** avec le gros lancer : même raté, il ricoche vers la cible.",
        "Combo complet : **sprint, saut, lancer de bouclier, écrasement, charge, coups**.",
        "En engagement léger, **garde la charge pour sortir** et esquiver les contrôles."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Freedom Charge",
      "key": "Q",
      "lead": "Tu laisses un sillage qui donne vie bonus et vitesse à toi et tes alliés. Ça vaut presque une ult de support, en un bouton.",
      "items": [
        "**Engager** : ton équipe fonce sur la backline sans gaspiller une ult de support.",
        "**Contrer une menace moyenne** : une ult de Star-Lord, un plongeur arrivé sur tes supports, un Punisher en ult.",
        "**Tenir le point** : bouclier levé pendant l'ult, tu bouscules les ennemis et deviens très dur à toucher.",
        "Lance-la **près de ton équipe** pour que tous profitent de la vie bonus.",
        "Laisse parfois tes supports utiliser leurs ults et **garde la tienne pour un moment décisif**. Préviens-les de ton plan.",
        "Astuce : active les **barres de vie alliées** pour sauver tes coéquipiers plus souvent."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester **devant à frapper les tanks** toute la partie.",
        "Spammer sprint et lancers et **annuler ses attaques**.",
        "Lever le bouclier **pour rien** au lieu de le garder contre un contrôle.",
        "Plonger **sans moyen de sortir**.",
        "Chercher le kill tout de suite au lieu de **forcer les cooldowns**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "ultron",
      "note": "Il fait des dégâts bonus contre ton ult et vole hors de portée."
    },
    {
      "hero": "winter-soldier",
      "note": "Il te rattrape et tu peines à fuir sans mobilité."
    },
    {
      "hero": "the-punisher",
      "note": "S'il vise bien, ton bouclier disparaît en un instant."
    },
    {
      "hero": "iron-man",
      "note": "Tu ne peux presque jamais l'atteindre."
    },
    {
      "hero": "loki",
      "note": "Ses runes annulent ton engagement d'un bouton."
    },
    {
      "hero": "adam-warlock",
      "note": "Même chose avec son lien : force-le d'abord."
    }
  ],
  "synergies": [
    {
      "hero": "venom",
      "note": "Deux angles qui convergent sur la même cible : quasi impossible à gérer."
    },
    {
      "hero": "psylocke",
      "note": "La pression combinée écrase la backline."
    },
    {
      "hero": "black-panther",
      "note": "Même plan de jeu : encercler et plonger."
    },
    {
      "hero": "human-torch",
      "note": "Tes coups forcent l'ennemi à reculer dans ses zones de feu."
    },
    {
      "hero": "luna-snow",
      "note": "Un support qui marche dans toutes les compos de dive."
    },
    {
      "hero": "mantis",
      "note": "Son bonus de dégâts rend tes engagements mortels."
    }
  ],
  "sources": [
    {
      "title": "Captain America Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=HZrBVN4tuik"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'captain-america'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- cloak-and-dagger
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Cloak & Dagger est un duo facile à prendre en main mais qui récompense énormément la maîtrise : on gagne en chargeant son ult plus vite que les supports adverses, en alternant soins de Dagger, dégâts de Cloak et cooldowns bien placés.",
  "tldr": [
    "Ta priorité : **charger ton ult plus vite** que les supports d'en face.",
    "Change de forme pour **recharger Dagger** et glisser des dégâts avec Cloak.",
    "Garde l'**intangibilité de Cloak** pour contrer une vraie ult adverse."
  ],
  "difficulty": 1,
  "tags": [
    "Soins de zone",
    "Utilitaire",
    "Anti-ult",
    "Accessible"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Soigner ne suffit pas : ceux qui portent la partie sur C&D sont efficaces avec chaque cooldown et glissent des dégâts dès que possible.",
      "items": [
        "Plus tu montes en rang, plus **l'avance en ult** fait la différence.",
        "Éliminer une cible tôt dans le fight, c'est **autant de dégâts que ton équipe ne prendra pas**.",
        "Ne meurs pas pour un mauvais placement : **joue près des packs de soin et des couverts**, et charge ton ult.",
        "Avec deux ults de support prêtes, tu peux **ouvrir un fight agressivement** pour prendre l'avantage."
      ]
    },
    {
      "title": "Soins de Dagger",
      "key": "Clic G",
      "lead": "Des projectiles à tête chercheuse qui soignent la cible, puis éclatent pour soigner tous les alliés autour.",
      "items": [
        "Le projectile cherche la cible **la plus proche de ton viseur**, seulement si elle a perdu de la vie.",
        "À l'impact, il **éclate et soigne en zone** : vise les groupes d'alliés pour maximiser tes soins et ta charge d'ult.",
        "Le projectile est lent : envoie tes soins **juste avant** qu'un plongeur allié entre en duel, pas après les dégâts.",
        "Tirer sur l'ennemi fait des dégâts et soigne autour, mais **moitié moins** de soin au total."
      ]
    },
    {
      "title": "Changer de forme",
      "key": "Maj",
      "lead": "Passer d'une forme à l'autre est quasi instantané et recharge les projectiles de Dagger plus vite qu'un rechargement normal.",
      "items": [
        "**Double changement de forme** = rechargement plus rapide de Dagger.",
        "Anticipe le passage en Cloak quand tu sens venir une ult adverse : la courte animation peut te coûter cher.",
        "Le rayon de Cloak traque sa cible : utilise-le pour **finir une cible qui fuit** ou charger ton ult quand tout le monde est soigné."
      ]
    },
    {
      "title": "Les voiles",
      "ability": "Veil of Lightforce · Terror Cape",
      "key": "E",
      "lead": "Dagger lance un voile qui soigne et booste les soins reçus. Cloak lance un voile qui aveugle et rend les ennemis plus vulnérables.",
      "items": [
        "Le voile de **Dagger** sert quand ton équipe **pousse groupée** ou doit reculer sous la pression.",
        "Il disparaît s'il touche **un mur ou un bouclier** ennemi : attention aux angles.",
        "Ne le gâche pas pour un seul allié mal placé, sauf s'il a **une ult décisive** prête.",
        "Le voile de **Cloak** aveugle : une ult de Star-Lord ou de Scarlet Witch aveuglée **ne verrouille plus** ses cibles.",
        "Il augmente fortement les **dégâts subis** : c'est l'une des capacités les plus fortes de ton kit. Lance-le à chaque rechargement."
      ]
    },
    {
      "title": "Dôme de soin",
      "ability": "Dagger Storm",
      "lead": "Une salve de dagues crée une zone de soin continu à l'impact.",
      "items": [
        "Vise **les pieds** de ton équipe : leurs corps ne bloquent pas la capacité.",
        "Pose-la, puis **passe en Cloak** pour faire des dégâts pendant qu'elle soigne.",
        "C&D n'a presque pas d'auto-soin : garde-la pour **survivre aux plongeurs** si tu sais qu'ils vont venir."
      ]
    },
    {
      "title": "Intangibilité",
      "ability": "Dark Teleportation",
      "key": "Clic D",
      "lead": "Tous les alliés autour de Cloak deviennent invulnérables et plus rapides quelques instants, tant qu'ils n'agissent pas.",
      "items": [
        "Elle **annule les ults** de Psylocke, Magneto ou Jeff : les ennemis malins chercheront à la forcer avant.",
        "Si ton équipe écoute, **annonce le décompte** pour qu'elle n'en sorte pas par erreur en tirant.",
        "Tu voles pendant l'effet : profites-en pour **te replacer en hauteur** après une plongée."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Eternal Bond",
      "key": "Q",
      "lead": "Quatre dashes rapides qui laissent des traînées de soin pour les alliés et de dégâts pour les ennemis.",
      "items": [
        "Après l'ult, **ne soigne plus** : passe en Cloak et fais des dégâts pour finir le fight.",
        "Tu restes **immobile un instant** après chaque dash : attention à Hawkeye, Punisher, Magneto ou Iron Man en ult.",
        "Trace l'ult **autour du point** pour que ton équipe puisse se battre là où ça compte.",
        "Si l'ennemi n'a qu'une ult à contrer et que ton autre support peut s'en charger, utilise la tienne **pour pousser**.",
        "Tu ne peux pas monter en l'air pendant l'ult : **attention aux chutes**."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Ne **jamais passer en Cloak**.",
        "Oublier le **voile de Cloak**, l'un de tes meilleurs outils.",
        "Gaspiller l'intangibilité avant **l'ult qu'elle devait contrer**.",
        "Continuer à soigner **pendant sa propre ult**.",
        "Tracer l'ult **à découvert** face à un Hawkeye ou un Magneto."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Son ult peut te tuer pendant la tienne."
    },
    {
      "hero": "hawkeye",
      "note": "Un tir à la tête suffit à couper ton ult."
    },
    {
      "hero": "iron-man",
      "note": "Même risque, trace ton ult à couvert."
    },
    {
      "hero": "luna-snow",
      "note": "Plus agressive à distance avec une ult plus forte."
    }
  ],
  "synergies": [
    {
      "hero": "the-thing",
      "note": "En brawl groupé, tes soins de zone font des merveilles."
    },
    {
      "hero": "emma-frost",
      "note": "Même logique de compo serrée autour du point."
    },
    {
      "hero": "black-widow",
      "note": "Ton voile de Cloak donne un bonus de dégâts à ses tirs."
    },
    {
      "hero": "iron-fist",
      "note": "Tes soins à tête chercheuse suivent facilement les plongeurs."
    }
  ],
  "sources": [
    {
      "title": "Cloak and Dagger Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=E9lKTfRFJ6s"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'cloak-and-dagger'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- daredevil
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Daredevil est un duelliste de mêlée polyvalent, capable de plonger sur une cible isolée comme de brawler avec son équipe. Il voit à travers les murs, marque une cible et la traque, et chaque élimination relance son dash.",
  "tldr": [
    "**Isole une cible, tue-la, puis gagne le 6 contre 5** avec ton équipe.",
    "Ton dash est **à haut risque** : sans reset, tu es hors du fight pendant un long moment.",
    "Ton grappin est d'abord un **outil de fuite**, pas d'engagement."
  ],
  "difficulty": 3,
  "tags": [
    "Mêlée",
    "Plongée",
    "Combos",
    "Renvoi"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Selon ta compo, tu attends dans l'ombre qu'un support s'isole, ou tu joues un angle à mi-distance pour charger ton ult en attendant ton moment.",
      "items": [
        "Repère les **cibles isolées** grâce à ta vision à travers les murs, puis frappe.",
        "Si c'est trop risqué d'entrer, reste sur un **angle décalé** et fais pression de loin.",
        "La **patience** est la clé : c'est très facile d'en faire trop et de mourir.",
        "Contre lui : si tu es marqué, **regroupe-toi**. S'il ne trouve pas de reset, il ne peut plus rien faire."
      ]
    },
    {
      "title": "Passifs",
      "lead": "Daredevil voit moins loin, mais il perçoit les ennemis à travers les murs, même immobiles ou invisibles.",
      "items": [
        "La vision à travers les murs révèle aussi **Invisible Woman et Loki** quand ils sont invisibles.",
        "Astuce : active l'option d'**effet de balayage** dans les paramètres d'accessibilité pour distinguer alliés et ennemis.",
        "Il peut **courir sur les murs** à l'infini : passe au-dessus de l'ennemi pour le surprendre."
      ]
    },
    {
      "title": "Matraques et fureur",
      "key": "Clic G",
      "lead": "Une série de quatre coups qui remplit ta jauge de fureur. Après chaque capacité, tu gagnes une attaque bondissante plus puissante pendant quelques secondes.",
      "items": [
        "Glisse un **coup de mêlée** à la fin de la série : le premier frappe deux fois.",
        "L'attaque bondissante (**Righteous Cross**) te propulse en avant : parfaite pour **rattraper une cible mobile** ou fuir.",
        "Apprends à glisser une attaque bondissante **après chaque capacité** : c'est le cœur de son style."
      ]
    },
    {
      "title": "Marque et dash",
      "ability": "Sonic Pursuit",
      "key": "F",
      "lead": "Marque une cible à grande distance pour courir plus vite et encaisser moins. Réappuie pour foncer sur elle, l'aveugler et remplir ta fureur.",
      "items": [
        "Garde **toujours une marque** sur quelqu'un : bonus de vitesse et de résistance gratuits.",
        "Le dash a un **long temps de recharge**, mais il se relance si **n'importe quel ennemi meurt** juste après, même tué par un allié.",
        "Si tu n'es pas sûr d'obtenir le reset, **sois patient** et attends ton moment.",
        "L'aveuglement est utile : une **ult de Star-Lord** aveuglée ne peut plus tirer."
      ]
    },
    {
      "title": "Attaques de fureur",
      "ability": "Devil's Chain · Devil's Throw",
      "key": "E · Clic G / Clic D",
      "lead": "La fureur débloque deux attaques : une frappe au sol en X qui te donne de la vie bonus, et un lancer qui ricoche entre les ennemis.",
      "items": [
        "La **frappe au sol** fait plus de dégâts si tu vises **les pieds** : c'est ton outil pour finir et récupérer ton dash.",
        "Le **lancer** ricoche et ralentit : ton ouvreur de combo de loin, et une bonne source de charge d'ult.",
        "Combo principal : **marque, lancer, dash, attaque bondissante, frappe au sol**, puis une dernière attaque bondissante pour finir.",
        "Deux supports collés l'un à l'autre prennent **beaucoup plus** de dégâts avec le lancer."
      ]
    },
    {
      "title": "Grappin",
      "ability": "Devil's Latch",
      "lead": "Un grappin qui te tire vers un mur ou un ennemi. Son temps de recharge ne démarre qu'au contact : rater ne coûte rien.",
      "items": [
        "C'est surtout ton **outil de fuite**, comme le balancement de Venom.",
        "Pour engager, ne l'utilise que si tu peux **ressortir avec l'attaque bondissante** qu'il te donne.",
        "Agripper un ennemi vous place **tous les deux** au milieu des équipes : tu es solide, mais réfléchis.",
        "Avec un partenaire prêt, tu peux **tirer un support hors de son ult** (Invisible Woman, Cloak & Dagger) pour le tuer."
      ]
    },
    {
      "title": "Renvoi",
      "ability": "Objection",
      "key": "Clic D",
      "lead": "Tu fais tournoyer tes matraques et renvoies tous les projectiles venant de face. Les rayons et coups de mêlée passent quand même.",
      "items": [
        "Il renvoie les **boules de neige de Luna, sommeils de Mantis, ults de Groot, Magneto ou Iron Man**.",
        "Il bloque aussi les ults de **Doctor Strange, Scarlet Witch ou The Thing**, sans les renvoyer.",
        "Les matraques **font des dégâts** pendant le renvoi : parfait pour finir une Luna qui tente de te geler.",
        "Les bons joueurs vont **chercher à le forcer** : ne l'utilise que si nécessaire.",
        "Option : désactive le mode **maintenir pour renvoyer**, le temps de recharge est fixe de toute façon."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Let the Devil Out",
      "key": "Q",
      "lead": "Une aura de dégâts qui aveugle les ennemis qui te regardent. Sa vraie force : une fureur quasi infinie pour enchaîner les combos.",
      "items": [
        "Profite de la **fureur illimitée** pour enchaîner combos et resets de dash.",
        "Combine-la avec ton **renvoi** pour forcer l'ennemi à te regarder sans mourir.",
        "Elle peut **reprendre le tempo** : l'ennemi doit choisir entre te gérer ou continuer son plan.",
        "Comme toute ult de DPS, lance-la **avec le soutien** de ton équipe."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Dasher **sans espoir de reset**.",
        "Engager **au grappin** sans porte de sortie.",
        "Renvoyer **trop tôt** et ne plus l'avoir pour l'ult adverse.",
        "Appuyer sur **clic droit par erreur** en plein combo.",
        "En faire trop et **mourir seul**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Son étranglement te sort du fight. Tu peux le renvoyer si tu l'anticipes."
    },
    {
      "hero": "the-thing",
      "note": "Son impact au sol te bloque sans que tu puisses renvoyer."
    },
    {
      "hero": "peni-parker",
      "note": "Son nid coupe tes plongées."
    },
    {
      "hero": "phoenix",
      "note": "Étourdissement ciblé, dash et régénération : elle te gagne."
    },
    {
      "hero": "star-lord",
      "note": "Il te marque et esquive tes combos."
    },
    {
      "hero": "ultron",
      "note": "Il vole hors de portée et soigne à distance."
    }
  ],
  "synergies": [
    {
      "hero": "venom",
      "note": "En dive, il fait fondre la cible que tu marques."
    },
    {
      "hero": "captain-america",
      "note": "Autre tank de dive pour converger sur la backline."
    },
    {
      "hero": "emma-frost",
      "note": "En brawl, tu finis la cible qu'elle vient de frapper."
    },
    {
      "hero": "hela",
      "note": "Elle couvre les volants que tu ne peux pas atteindre."
    },
    {
      "hero": "phoenix",
      "note": "Même rôle, et vous gagnez les 2 contre 1."
    },
    {
      "hero": "luna-snow",
      "note": "Le support qui marche avec lui dans toutes les compos."
    }
  ],
  "sources": [
    {
      "title": "Daredevil Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=HRXsRdVXMVo"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'daredevil'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- deadpool
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Deadpool se joue dans les trois rôles avec un kit presque identique : deux pistolets, deux katanas, une aura et un rebond sur les têtes. Il monte en niveau au fil de la partie et charge son ult avec des points de style. Chaque version a son propre plan de jeu.",
  "tldr": [
    "**Gagner le fight passe avant monter de niveau** : prends tes selfies quand tes cooldowns sont à plat.",
    "Utilise ton premier dash **sur un ennemi** pour gagner les dashes bonus, jamais pour te déplacer.",
    "Lance ton ult **tôt** : si tu meurs avec, tu perds toute la charge."
  ],
  "difficulty": 2,
  "tags": [
    "Trois rôles",
    "Montée en niveau",
    "Polyvalent",
    "Rebonds"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Deadpool progresse en jeu : chaque kill te permet de prendre un selfie pour gagner de l'expérience et améliorer une capacité. L'expérience est partagée entre les rôles.",
      "items": [
        "Après un coup de grâce, **appuie sur la touche de selfie** près de la victime : tu es invulnérable pendant l'animation et tu gagnes beaucoup d'expérience.",
        "Pense comme dans un MOBA : **achète tes améliorations quand tes cooldowns sont à plat**, pas en plein fight.",
        "Son ult ne se charge pas comme les autres : il gagne des **points de style** selon ses actions.",
        "Ton **passif de régénération** se déclenche si tu prends un gros burst : il te fait survivre à des dégâts qui tueraient d'autres héros.",
        "Astuce rebond : saute quand **tes pieds sont dans la tête** de la cible, pas au-dessus, pour ne pas rater la relance."
      ]
    },
    {
      "title": "Version Vanguard",
      "kind": "tips",
      "lead": "Un tank harceleur, proche d'un gros DPS : il tient l'espace en étant tellement pénible que l'ennemi doit le respecter.",
      "items": [
        "Joue **près de l'ennemi** : les pistolets perdent vite leurs dégâts à distance.",
        "Le **dôme** (clic droit aux pistolets) coupe les soins d'un tank isolé, gagne les duels contre un Hela, ou protège d'une ult (Magneto, Namor, Iron Man).",
        "L'**aura** fait tirer beaucoup plus vite : allume-la quand c'est ton tour de fight, ou pour sécuriser un duel.",
        "L'ult aux katanas est un **joker de survie** : elle te laisse aller plus loin pour forcer les ults adverses.",
        "Ordre d'amélioration conseillé : **pistolets, dash, aura**, puis katanas et dôme. Monte le dôme plus tôt si tu es seul tank."
      ]
    },
    {
      "title": "Version Duelist",
      "kind": "tips",
      "lead": "Il use l'ennemi à distance, puis passe aux katanas pour finir. Patience, puis tout-en-un.",
      "items": [
        "Reste **un peu plus loin** qu'en tank : ses pistolets portent plus loin dans cette version.",
        "Lance le **boomerang** comme une grenade : vise les **pieds**, la zone tourne avant de revenir.",
        "Améliorés, les dashes se relancent **à chaque ennemi touché** : garde-en un pour le mini-jeu de ton ult.",
        "Les **rebonds sur les têtes** chargent ton ult très vite et donnent de la vie bonus.",
        "L'ult aux **pistolets** est utile contre un support prêt à ult : elle le rend vulnérable pour ton équipe.",
        "Améliorations : orientées **pistolets** si l'ennemi est plus fort que toi au corps à corps (The Thing), sinon **dash, aura et katanas**."
      ]
    },
    {
      "title": "Version Strategist",
      "kind": "tips",
      "lead": "La plus forte des trois : énormément de soins, une aura qui booste les dégâts alliés et une ult qui se charge à une vitesse folle.",
      "items": [
        "Ses pistolets soignent **sans perte à distance** : un très bon soin ciblé.",
        "Le **boomerang** soigne tes alliés et blesse les ennemis : lance-le entre les deux, et dans le spawn adverse dès le début.",
        "Les **katanas et le dash** soignent en zone : parfaits en brawl serré et pour défendre ta backline contre un plongeur.",
        "L'**aura améliorée** donne un bonus de dégâts aux alliés : très fort avec Phoenix ou Black Widow.",
        "Les **rebonds sur les alliés blessés** chargent ton ult.",
        "Ult : avance **avec ton équipe dans l'aura** et lance-la **en début de fight**, de façon proactive. Finis le mini-jeu pour qu'elle dure plus longtemps que celle d'en face.",
        "Ordre conseillé : **boomerang puis ult aux katanas** en premier, le reste selon la partie."
      ]
    },
    {
      "title": "Les katanas et le dash",
      "key": "Maj · Clic D",
      "lead": "Maj passe des pistolets aux katanas. Avec les katanas, le clic droit lance un dash qui donne des dashes bonus s'il touche un ennemi.",
      "items": [
        "**Premier dash sur un ennemi** pour débloquer les dashes bonus, puis utilise-les pour bouger.",
        "Brûler tous ses dashes avant l'ult, c'est ne plus pouvoir **finir le mini-jeu**.",
        "Changer d'arme **remet à zéro** le compteur du tir explosif des pistolets améliorés."
      ]
    },
    {
      "title": "Les ultimes",
      "key": "Q",
      "lead": "Une ult différente selon l'arme en main. Celle des katanas lance un mini-jeu : enchaîne rebonds, dashes ou boomerangs pour la renforcer.",
      "items": [
        "Le **mini-jeu** se suit en bas à droite de l'écran : chaque action réussie te rapproche du bonus.",
        "L'ult des katanas est presque toujours la bonne en **Vanguard et Strategist**.",
        "En **Duelist**, l'ult des pistolets peut servir à **isoler un support clé**.",
        "Mourir avec l'ult chargée **la fait perdre** : utilise-la plutôt trop tôt que trop tard."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Prendre des selfies **en plein fight** alors que tes cooldowns sont dispos.",
        "Utiliser le **premier dash pour se déplacer**.",
        "**Mourir avec l'ult** chargée.",
        "En Strategist, foncer seul dans l'ult **sans ton équipe** dans l'aura.",
        "Jouer la version Vanguard **trop loin** de l'ennemi."
      ]
    }
  ],
  "counters": [
    {
      "hero": "the-thing",
      "note": "Il gagne au corps à corps et bloque les rebonds."
    },
    {
      "hero": "hela",
      "note": "Elle punit à distance avant que tu sois amélioré."
    },
    {
      "hero": "phoenix",
      "note": "Son burst passe à travers ta régénération si elle est déjà utilisée."
    }
  ],
  "synergies": [
    {
      "hero": "phoenix",
      "note": "Ton aura de Strategist lui permet d'éliminer d'un coup."
    },
    {
      "hero": "black-widow",
      "note": "Même effet : l'aura rend ses tirs à la tête mortels."
    },
    {
      "hero": "winter-soldier",
      "note": "En Vanguard, un brawler qui profite de ton aura."
    },
    {
      "hero": "wolverine",
      "note": "Autre brawler à accompagner avec ta réduction de dégâts."
    },
    {
      "hero": "groot",
      "note": "Combattez dans les couloirs serrés où tes soins de zone brillent."
    }
  ],
  "sources": [
    {
      "title": "Deadpool Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=JfrdVuQ5mn0"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'deadpool'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- doctor-strange
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Doctor Strange est un tank flexible : il protège son équipe avec un grand bouclier, fait de vrais dégâts de loin, téléporte l'équipe avec ses portails et étourdit tout un groupe avec son ult. Il s'adapte au brawl comme au poke, un peu moins au dive.",
  "tldr": [
    "**Économise ton bouclier** : passe de couvert en couvert et garde-le pour les grosses menaces.",
    "Construis ta **jauge de ténèbres**, puis relâche-la pour finir une cible avant qu'elle ne déborde.",
    "Ne te retourne pas pour **peel** : ta place est de tenir le front."
  ],
  "difficulty": 2,
  "tags": [
    "Bouclier",
    "Portail",
    "Combos",
    "Contrôle de zone"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Strange fait ce que ta compo demande : protéger un brawl, couvrir des tireurs à distance ou prendre la hauteur avec les DPS.",
      "items": [
        "Erreur classique : **tenir le bouclier tout le temps** et oublier de faire des dégâts. Sois actif.",
        "Alterne **tir et petits coups de bouclier** pour bloquer le burst sans vider sa vie.",
        "Si tes alliés se font plonger, **ce n'est pas ton rôle** de te retourner : l'autre tank, un DPS ou un support s'en charge. Toi, tiens la ligne."
      ]
    },
    {
      "title": "Dagues et ténèbres",
      "ability": "Daggers of Denak · Maelstrom of Madness",
      "key": "Clic G",
      "lead": "Tes salves de dagues remplissent une jauge de ténèbres que tu relâches en explosion autour de toi. Plus la jauge est pleine, plus elle fait mal.",
      "items": [
        "Glisse un **coup de mêlée** entre deux salves : plus de dégâts et un rechargement plus rapide.",
        "Les dagues tournoient : vise **un peu à droite** de ta cible à distance. Au-delà d'une certaine portée, elles disparaissent.",
        "**Jauge pleine trop longtemps = anti-soin sur toi** : relâche-la à temps ou arrête de tirer.",
        "Combo : **tir, mêlée, tir, explosion** avec au moins la moitié de la jauge pour éliminer un personnage fragile.",
        "Parfois, mieux vaut **ne rien faire** et garder la jauge sous contrôle."
      ]
    },
    {
      "title": "Bouclier",
      "ability": "Shield of the Seraphim",
      "key": "Clic D",
      "lead": "Un grand bouclier qui encaisse beaucoup et se régénère lentement une fois rangé. Celui qui garde le sien plus longtemps gagne le fight.",
      "items": [
        "Toujours bloquer : les ults qui visent tes supports (**Iron Man, Magneto**). Ne le lève pas trop tôt, sinon ils le cassent avant.",
        "Contre l'ult de **Hela**, monte en l'air et bloque face à elle.",
        "Bloque le **burst** (Hawkeye, Hela, Phoenix) : ils cassent mal le bouclier.",
        "Contre un **Punisher**, encaisse plutôt avec ta vie : il casse vite le bouclier mais te tue lentement.",
        "En attaque : coupe les **soins d'une ult de Luna** ou d'un tank trop avancé."
      ]
    },
    {
      "title": "Portail",
      "ability": "Pentagram of Farallah",
      "key": "F",
      "lead": "Deux portails reliés qui restent ouverts un court moment, avec un très long temps de recharge. Trois usages principaux.",
      "items": [
        "**Revenir du spawn** pour contester. En hauteur pour tes tireurs, face au point pour tes brawlers.",
        "Passe **toujours en premier** : les supports qui traversent avant toi se font piéger.",
        "**Bloquer un passage** : une boucle de portails entre deux portes empêche l'ennemi de contester.",
        "**Préparer une ult** (la tienne ou celle d'un allié), mais les bons joueurs s'y attendent.",
        "En défense, **garde-le** pour revenir. En attaque, tu peux l'utiliser tôt : il reviendra avant la fin du round."
      ]
    },
    {
      "title": "Lévitation",
      "ability": "Cloak of Levitation",
      "lead": "Un vol de quelques secondes. Le temps de recharge ne démarre qu'à la fin du vol.",
      "items": [
        "**Mettre la pression** sur un DPS en hauteur.",
        "**Feinter ton ult** : monte, puis redescends bouclier levé pour faire sortir l'étourdissement de Luna.",
        "**Te faire soigner** hors de portée d'un brawler comme The Thing."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Eye of Agamotto",
      "key": "Q",
      "lead": "Après une longue incantation, tu étourdis tous les ennemis autour de toi et sépares leur âme de leur corps.",
      "items": [
        "Pendant l'incantation, tu peux être **étourdi, poussé, attiré** : prépare-la bien.",
        "Entre avec **une bonne jauge de ténèbres** : tir, mêlée, explosion pour éliminer les fragiles.",
        "Toucher **âme et corps** en même temps double les dégâts de l'explosion.",
        "Plutôt que sauter en plein milieu, **tombe d'un flanc ou d'une hauteur** sur l'ennemi.",
        "Astuce : n'ult pas contre la première ult de soin : **vise la suivante** pour qu'elle ne puisse pas être contrée."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**Casser son bouclier** sur des dégâts sans importance.",
        "Laisser la jauge **déborder** et s'infliger l'anti-soin.",
        "Se retourner pour **peel** et laisser passer toute l'équipe adverse.",
        "Laisser les supports **traverser le portail en premier**.",
        "Ult **en sautant au milieu** de l'ennemi, de façon prévisible."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle charge sur ton bouclier et t'étrangle avant ton ult."
    },
    {
      "hero": "hulk",
      "note": "Il frappe à travers ton bouclier."
    },
    {
      "hero": "the-thing",
      "note": "Même chose, en brawl il te met beaucoup de pression."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses poussées annulent ton ult."
    },
    {
      "hero": "wolverine",
      "note": "Il ignore ton bouclier au corps à corps."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Il bloque le soutenu, toi le burst. Un classique."
    },
    {
      "hero": "winter-soldier",
      "note": "Un DPS qui avance derrière ton bouclier."
    },
    {
      "hero": "the-punisher",
      "note": "Même logique de jeu front contre front."
    },
    {
      "hero": "phoenix",
      "note": "Ton ult regroupe des cibles pour son explosion."
    },
    {
      "hero": "luna-snow",
      "note": "Le duo de supports idéal derrière ton bouclier."
    },
    {
      "hero": "loki",
      "note": "Même chose, très fort en ranked."
    }
  ],
  "sources": [
    {
      "title": "Doctor Strange Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=8ZyNSU1fBAk"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'doctor-strange'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- elsa-bloodstone
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Elsa Bloodstone est une DPS de ligne de front avec une touche d'angle décalé, un mélange de Winter Soldier et de Psylocke. Son fusil à éléphant fait des dégâts en pourcentage qui font fondre les tanks, et son passif réduit le temps de recharge de son dash au fil de la partie.",
  "tldr": [
    "Commence **avec ton équipe** pour charger ton passif et ton ult, puis prends un léger angle.",
    "Glisse un **tir de fusil à éléphant** après chaque capacité : c'est là que sont tes dégâts.",
    "**Recharge souvent** : quatre tirs seulement avant d'être à sec."
  ],
  "difficulty": 2,
  "tags": [
    "Ligne de front",
    "Combos",
    "Anti-tank",
    "Mobilité"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Elsa joue comme beaucoup de DPS méta : elle commence au centre, met la pression sur le front, puis passe sur un angle décalé pour finir le fight.",
      "items": [
        "Tire sur **les tanks** d'abord : ils reculent, et tu peux ensuite chercher un pick dans la backline.",
        "Une fois ton **passif plein**, tu deviens très difficile à ralentir : ne meurs pas pour le garder.",
        "Après un pick sur le **front adverse**, tu peux aller plus loin dans la backline : tes tanks n'ont plus besoin de toi.",
        "**Gère tes munitions** : recharge entre les échanges pour avoir de quoi faire un combo au bon moment."
      ]
    },
    {
      "title": "Les deux fusils",
      "ability": "Double-Barrel Blaster · Monster Piercer",
      "key": "Clic G",
      "lead": "Ton arme de base tire en rafales instantanées. Après chaque capacité, tu passes quelques secondes au fusil à éléphant, qui transperce et fait des dégâts en pourcentage de la vie.",
      "items": [
        "Le fusil de base s'éparpille vite : reste **à mi-distance**, pas trop loin.",
        "Sur un flanc discret, **approche avant de tirer** pour ne pas te dévoiler.",
        "Le fusil à éléphant **transperce les ennemis** (pas les boucliers) et s'étale à l'horizontale : aligne plusieurs cibles pour charger ton ult.",
        "Les capacités **ne rechargent pas** ton arme de base : surveille tes munitions."
      ]
    },
    {
      "title": "Passif et dash",
      "ability": "Inherited Instinct · Helix Advance",
      "lead": "Ta jauge de passif se remplit avec les dégâts et les kills. Chaque palier réduit le temps de recharge de ton dash, qui te donne de la vie bonus et le fusil à éléphant.",
      "items": [
        "Jauge pleine = un dash **presque toujours disponible** : tu peux enchaîner les tirs de fusil à éléphant.",
        "La jauge ne baisse qu'**à ta mort** (d'un palier) ou en fin de round.",
        "Le dash est **uniquement horizontal** et coupe ton élan.",
        "Avant un engagement : **dash, tir, dash, tir** pour ouvrir avec beaucoup de dégâts."
      ]
    },
    {
      "title": "Charge et recul",
      "ability": "Ruthless Pursuit",
      "key": "E",
      "lead": "Une charge vers l'avant qui projette les ennemis en l'air, puis une détonation qui te propulse en arrière. Chaque partie te donne un tir de fusil à éléphant.",
      "items": [
        "Combo de base : **tir, E, tir, E, tir** pour éliminer un personnage fragile.",
        "Utilise la charge pour **tenter un pick risqué**, puis la détonation pour fuir.",
        "Pense à **te retourner** : la seconde partie te pousse vers l'arrière.",
        "Attention aux ennemis qui t'attendent : **The Thing, Invisible Woman, Winter Soldier** peuvent bloquer ta fuite."
      ]
    },
    {
      "title": "Balle vivante",
      "ability": "Living Bullet",
      "key": "Clic D",
      "lead": "Une balle qui ricoche entre les ennemis après son premier impact et les marque à travers les murs.",
      "items": [
        "Elle ne traque **qu'après avoir touché** un ennemi ou le décor : vise près de ta cible.",
        "Les marques révèlent les **ennemis invisibles** (Psylocke, Invisible Woman) et vérifient un coin suspect.",
        "Tirer sur une cible marquée te donne un **bref boost de vitesse**.",
        "Glisse-la dans tes combos : **tir, E, balle, tir** élimine une cible et te laisse ta fuite."
      ]
    },
    {
      "title": "Piège",
      "ability": "Smoky Snare",
      "lead": "Un piège qui devient invisible et indestructible après une seconde. L'ennemi qui marche dessus est immobilisé.",
      "items": [
        "Contre le **dive** (Daredevil…), pose-le près de tes supports.",
        "Contre ceux qui te sautent dessus sur ton angle (**Star-Lord, Psylocke**), pose-le à tes pieds.",
        "Contre un front lourd, pose-le **devant tes tanks** ou dans la backline adverse.",
        "Quand quelqu'un est pris, **dash sur lui** pour un kill facile."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Apex Predator",
      "key": "Q",
      "lead": "Une créature charge droit devant, saisit les ennemis et les mord. Réappuie pour la faire revenir vers toi.",
      "items": [
        "Lance-la **à un dash de ton front**, de l'arrière vers l'avant : bien plus facile d'attraper plusieurs ennemis que depuis un angle bizarre.",
        "Tu peux **sortir un support de son ult** (Invisible Woman, Cloak & Dagger), mais ne la garde pas trois fights pour ça.",
        "Sur certaines cartes, elle peut **éjecter des ennemis** dans le vide, mais c'est risqué.",
        "Elle se charge vite : **utilise-la souvent**."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Être **à sec de munitions** au moment du combo.",
        "Tirer **de trop loin** avec l'arme de base.",
        "Oublier de **tirer au fusil à éléphant** après une capacité.",
        "Garder l'ult **plusieurs fights** pour un contre parfait.",
        "Lancer l'ult **depuis un flanc lointain**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "the-thing",
      "note": "Il bloque ta mobilité. Use-le à distance."
    },
    {
      "hero": "hela",
      "note": "Elle te domine à distance selon la carte."
    },
    {
      "hero": "phoenix",
      "note": "Même problème sur les cartes ouvertes."
    },
    {
      "hero": "luna-snow",
      "note": "Son ult suit sa lanceuse : plus dure à attraper."
    },
    {
      "hero": "gambit",
      "note": "Il peut sortir ses alliés de ton ult."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un tank qui avance et te laisse jouer au front."
    },
    {
      "hero": "emma-frost",
      "note": "Même chose, en brawl rapproché."
    },
    {
      "hero": "groot",
      "note": "Ses murs regroupent les ennemis pour ton ult."
    },
    {
      "hero": "winter-soldier",
      "note": "Duo qui fait fondre le front adverse."
    },
    {
      "hero": "wolverine",
      "note": "Même logique de pression sur les tanks."
    },
    {
      "hero": "deadpool",
      "note": "Un tank harceleur qui joue au contact avec toi."
    }
  ],
  "sources": [
    {
      "title": "Elsa Bloodstone Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=XTUTGUIFfUY"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'elsa-bloodstone'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- emma-frost
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Emma Frost est le tank le plus polyvalent du jeu : elle charge son rayon pendant les longs fights, puis passe en forme de diamant pour finir les cibles au corps à corps avec étranglements et coups de pied. Si tu ne charges pas ton rayon au plus vite, tu perds.",
  "tldr": [
    "Priorité absolue : **charger ton rayon** à fond, puis le garder chargé.",
    "Ton bouclier est **utilitaire** : bloque un angle décalé ou une grosse menace, pas tout le flux de dégâts.",
    "En forme de diamant : **étranglement, coups, coup de pied contre un mur**."
  ],
  "difficulty": 2,
  "tags": [
    "Rayon",
    "Brawl",
    "Contrôle",
    "Polyvalente"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Le début d'un fight ne sert pas à tuer : il sert à charger ton rayon, comme un support charge son ult.",
      "items": [
        "Joue **à portée de rayon**, charge à fond, puis colle l'ennemi en forme de diamant.",
        "Après un fight gagné, va **intercepter l'ennemi à la sortie du spawn** pour garder ta charge.",
        "Ton rayon se vide si tu ne touches personne pendant quelques secondes : **reste actif**."
      ]
    },
    {
      "title": "Rayon télépathique",
      "ability": "Telepathic Pulse",
      "key": "Clic G",
      "lead": "Un rayon dont les dégâts augmentent avec sa charge. Tu le charges en touchant des ennemis, des boucliers, des clones ou tes cristaux.",
      "items": [
        "En duel contre une autre Emma, **ne pose pas ton bouclier** trop tôt : tu lui offrirais de la charge.",
        "Tu charges sur les **bulles de Magneto** et le **bouclier de Captain America**, mais pas sur le grand bouclier de Magneto ni les **murs de Groot**.",
        "Passer en diamant ou utiliser ton ult **met en pause** la perte de charge."
      ]
    },
    {
      "title": "Cristal d'âme",
      "ability": "Psychic Spear",
      "key": "E",
      "lead": "Un projectile qui extrait un cristal de la cible. Le briser lui inflige une partie de sa vie restante.",
      "items": [
        "Tirer sur le cristal **charge ton rayon plus vite** que sur un ennemi : c'est surtout un outil de charge.",
        "Ton rayon **traverse le cristal** pour toucher deux cibles à la fois.",
        "Si la cible s'éloigne trop du cristal, il **disparaît sans dégâts** : utilise-le à portée raisonnable.",
        "Astuce : tu peux extraire l'âme de **Venom ou Jeff** même quand ils sont sous terre."
      ]
    },
    {
      "title": "Bouclier",
      "ability": "Mind's Aegis",
      "key": "Clic D",
      "lead": "Un bouclier qui ne bloque qu'une fois posé. Il n'est pas très solide : c'est un outil pour avancer, pas un mur.",
      "items": [
        "Bloque un **DPS sur un angle décalé** pour l'obliger à changer de place pendant que tu gagnes le front.",
        "Prends le relais quand le **bouclier de ton Magneto** tombe.",
        "Il bloque bien les grosses menaces : **ult de Hela ou Iron Man, flèches de Hawkeye**.",
        "**Coupe les soins** d'un tank, puis étrangle-le et renvoie-le dans ton équipe.",
        "Pose-le toujours **avant de passer en diamant** ou de lancer ton ult."
      ]
    },
    {
      "title": "Forme de diamant",
      "ability": "Diamond Form",
      "key": "Maj",
      "lead": "Tu encaisses moins de dégâts pendant quelques secondes et tu passes aux coups de poing, avec un étranglement et un coup de pied.",
      "items": [
        "L'**étranglement** étourdit sa cible : il annule de nombreuses ults (Doctor Strange, Scarlet Witch, Loki…).",
        "Le **coup de pied** fait beaucoup plus mal si la cible percute un mur (les murs de Groot comptent, pas les corps).",
        "Combo de base : **étranglement, deux coups, coup de pied contre un mur**. Ajoute un coup pour plus de sécurité.",
        "Pousse les fragiles dans les **espaces fermés** avec ton rayon avant d'entrer.",
        "Dans un couloir étroit, un **coup de pied de zone en premier** peut couper les soins avant l'étranglement."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Psionic Seduction",
      "key": "Q",
      "lead": "Un cône qui fait des dégâts et prend le contrôle des ennemis, qui marchent vers toi quelques instants.",
      "items": [
        "Tu ne peux pas passer en diamant avant : **pose un bouclier** ou attends que ton équipe te couvre.",
        "**Casse les boucliers** adverses avant de lancer, sinon ils s'abritent derrière.",
        "Bon usage : contre une **ult de support statique** (Invisible Woman), pour **contrer une plongée** sur tes supports, ou pour **désynchroniser un combo d'ults** adverse.",
        "Pas besoin d'attendre que toute l'équipe soit groupée : **une valeur précise** au bon moment suffit."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Laisser son rayon **se décharger** entre deux fights.",
        "Utiliser le bouclier comme un **mur à encaisser**.",
        "Passer en diamant **sans bouclier** de couverture.",
        "Lancer l'ult **à découvert** ou face à des boucliers intacts.",
        "Coup de pied **sans mur** derrière la cible."
      ]
    }
  ],
  "counters": [
    {
      "hero": "groot",
      "note": "Ses murs ne chargent pas ton rayon."
    },
    {
      "hero": "iron-man",
      "note": "Il vole hors de portée de ton rayon."
    },
    {
      "hero": "human-torch",
      "note": "Même problème avec les volants."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Il tient le grand bouclier, tu prends le relais quand il tombe."
    },
    {
      "hero": "winter-soldier",
      "note": "Vous enchaînez les contrôles sur une même cible."
    },
    {
      "hero": "psylocke",
      "note": "Elle profite de l'espace que tu crées en brawl."
    },
    {
      "hero": "luna-snow",
      "note": "Des soins solides pour te laisser charger."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Même logique, très fort quand il n'est pas banni."
    }
  ],
  "sources": [
    {
      "title": "Emma Frost Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=geqHn_q6k7w"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'emma-frost'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- gambit
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Gambit est un support agressif et autonome : il fait des dégâts dès le début du fight pour charger son ult avant tout le monde, purifie ses alliés des contrôles et des ults, et transforme son équipe en rouleau compresseur avec son ultime.",
  "tldr": [
    "Sors ton **paquet de dégâts** entre les fights et en début de combat : c'est ta charge d'ult.",
    "Anticipe l'ult adverse et **garde le paquet de soin prêt** pour la purifier.",
    "Lance ton ult **une fois collé à l'ennemi**, pas de loin."
  ],
  "difficulty": 3,
  "tags": [
    "Purification",
    "Dégâts",
    "Duels",
    "Économie d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Comme Luna Snow, Gambit gagne en chargeant son ult plus vite que les autres supports. Mais il joue plus près de son équipe et cherche des picks.",
      "items": [
        "Prends un **léger angle décalé** pour poker là où les boucliers ne te bloquent pas, avec la possibilité de revenir en dash vers ton équipe.",
        "Il est excellent pour **marquer les plongeurs** (Psylocke, Iron Fist) : duel-les avant qu'ils atteignent ton équipe.",
        "Détruis les **objets adverses** (clones, tourelles) quand tu peux.",
        "En **double support**, soigne un peu plus. En **triple support**, lâche-toi sur les dégâts et l'anti-soin."
      ]
    },
    {
      "title": "Cartes cinétiques",
      "key": "Clic G",
      "lead": "Des salves de trois cartes qui soignent les alliés et blessent les ennemis. Elles s'écartent avec la distance.",
      "items": [
        "Pas de perte de dégâts avec la distance, mais **l'écart entre les cartes** grandit : reste à distance moyenne.",
        "Très facile de toucher : utilise-les pour **poker** autant que pour soigner."
      ]
    },
    {
      "title": "Dash et frappe au sol",
      "ability": "Cajun Charge · Bayou Bash",
      "lead": "Un dash qui traverse les cibles et une frappe au sol qui soigne les alliés (toi compris) et blesse les ennemis. Combinés, ils deviennent un dash tournoyant.",
      "items": [
        "Contre des flankers (**Daredevil, Psylocke, Captain America**), garde la frappe pour te défendre.",
        "Contre un **brawl lourd**, utilise-la plus agressivement avec ton équipe.",
        "Le **dash renforcé** (frappe pendant le dash) va plus loin et soigne ou blesse en chemin. Fais un **demi-tour** en plein dash pour tout toucher.",
        "Utilise-le pour **revenir soigner** ton équipe après un duel, ou pour aller finir une cible au front."
      ]
    },
    {
      "title": "Les paquets de cartes",
      "kind": "tips",
      "lead": "Tu as quatre charges partagées. Sortir un paquet coûte une charge, jouer une carte en coûte une autre : anticipe ce dont tu auras besoin.",
      "items": [
        "Le **paquet de soin** ne fait que te régénérer : ne le sors que si tu comptes jouer une carte de soin.",
        "Le **paquet de dégâts** booste tous tes dégâts quelques secondes : sors-le dès que possible pour charger ton ult.",
        "Une carte gâchée, c'est **deux charges perdues** : l'autre Gambit gagne l'échange."
      ]
    },
    {
      "title": "Cartes de soin",
      "ability": "Bridge Boost · Purifying Pickup",
      "lead": "Une carte qui rebondit entre les alliés et booste leurs soins reçus, et une volée de cartes qui soigne et purifie.",
      "items": [
        "La **carte rebondissante** est la carte « enabler » : lance-la sur un allié qui lance son ult (Punisher, Star-Lord).",
        "Elle peut **rebondir sur le sol** pour soigner un allié hors de vue.",
        "La **purification** efface les contrôles : ult de Winter Soldier, de Doctor Strange, attrapes d'Angela ou de Wolverine, anti-soin…",
        "Elle ne protège pas à l'avance : **sors le paquet avant l'ult**, puis purifie au bon moment.",
        "Purifier une ult **gagne des parties**. Plus tu montes, plus ça vaut le coup de la guetter."
      ]
    },
    {
      "title": "Cartes de dégâts",
      "ability": "Explosive Trick · Bidding Barrage",
      "lead": "Une carte explosive qui applique l'anti-soin, et une volée qui projette les ennemis en l'air.",
      "items": [
        "L'**anti-soin** aide à tuer à travers une ult de soin, si ton équipe suit.",
        "En ranked, elle sert surtout à **finir une cible**. Avec des combos comme les ults de Groot ou d'Angela, n'hésite pas.",
        "La **projection** coupe les attrapes d'Angela ou Wolverine, les sauts de Hulk, les balancements de Venom.",
        "Combo pick : **paquet de dégâts, tir, dash renforcé, tir, carte anti-soin**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Ragin' Royal Flush",
      "key": "Q",
      "lead": "Tous les alliés dans un grand cône sont purifiés, soignés, accélérés, chargent leur ult plus vite et infligent des dégâts bonus. Une des ults les plus fortes du jeu.",
      "items": [
        "**Engager** : charge-la avant tout le monde, puis lance-la **quand ton équipe est déjà sur l'ennemi**.",
        "**Contre-ult** : quand l'ennemi lance une grosse ult (Doctor Strange…), réponds avec la tienne, même à travers un mur.",
        "Tu peux aussi l'utiliser pour **tuer un support juste avant qu'il ait son ult**.",
        "Lance-la **depuis l'arrière** de ton équipe pour toucher tout le monde, puis passe aux dégâts.",
        "Si tu es en retard sur l'autre support, sois la **deuxième ult** du fight."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester derrière à **soigner tout le fight**.",
        "Sortir un paquet **sans plan** et gâcher deux charges.",
        "Ne pas avoir le **paquet de soin prêt** quand l'ult adverse arrive.",
        "Lancer l'ult **de trop loin** : l'ennemi a le temps de fuir.",
        "Duel un **Daredevil** sans soutien."
      ]
    }
  ],
  "counters": [
    {
      "hero": "daredevil",
      "note": "Son burst te tue avant que tu te soignes."
    },
    {
      "hero": "hela",
      "note": "Même problème à distance."
    },
    {
      "hero": "elsa-bloodstone",
      "note": "Elle saisit tes alliés en boucle avec son ult."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un tank de brawl qui avance avec toi."
    },
    {
      "hero": "psylocke",
      "note": "Ton anti-soin sur la backline lui offre des kills."
    },
    {
      "hero": "captain-america",
      "note": "En dive, tu suis facilement grâce à ta mobilité."
    },
    {
      "hero": "venom",
      "note": "Même logique de plongée."
    },
    {
      "hero": "luna-snow",
      "note": "Un duo de supports qui rend la backline presque immortelle."
    }
  ],
  "sources": [
    {
      "title": "Gambit Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=WIHDdJujzUs"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'gambit'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- groot
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Groot est un tank de ligne de front qui découpe le champ de bataille avec ses murs : il isole une cible de ses soigneurs pour que son équipe la tue, et son ult regroupe les ennemis pour lancer des combos dévastateurs.",
  "tldr": [
    "**Isole un tank de ses soigneurs** avec tes murs, puis focus-le avec ton équipe.",
    "Garde ton **mur de bois de fer** pour un vrai engagement, pas pour décorer.",
    "Avant ton ult, vérifie que **ton partenaire de combo** est prêt."
  ],
  "difficulty": 2,
  "tags": [
    "Murs",
    "Combos d'ult",
    "Couloirs",
    "Ligne de front"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Groot a peu d'options sans ses capacités. Tout son jeu repose sur le bon mur au bon moment.",
      "items": [
        "Arrive en position **à couvert** sans gaspiller tes murs, puis coupe les tanks de leurs soigneurs.",
        "Sois **patient** : force d'abord les capacités de fuite (le saut de Strange…), puis isole la cible pour de bon.",
        "Joue les **couloirs étroits** : un grand mur et un petit au-dessus suffisent à renvoyer l'équipe adverse au spawn.",
        "Contre le **dive**, place tes murs devant le front adverse pour laisser à ton équipe le temps de gérer le plongeur.",
        "Tu peux aussi **protéger une ult alliée** (l'amplificateur de Rocket, un support face à Hawkeye) derrière un mur."
      ]
    },
    {
      "title": "Dégâts",
      "ability": "Vine Strike · Spore Bomb",
      "key": "Clic G",
      "lead": "De gros projectiles faciles à toucher, une série de trois coups de mêlée et une bombe de spores à lancer comme une grenade.",
      "items": [
        "Pas de tir à la tête : vise **les jambes**, la hitbox est plus large.",
        "Glisse des **coups de mêlée** entre les tirs : le troisième repousse et projette en l'air.",
        "La **bombe** fait mal aux groupes et aux pieds des tanks.",
        "Une bombe sur les **supports adverses** les empêche de soigner tranquillement."
      ]
    },
    {
      "title": "Murs d'épines",
      "ability": "Thornlash Wall",
      "key": "Maj",
      "lead": "Deux murs en stock, rechargés rapidement. Chaque appui change l'orientation : vertical, diagonal (escalier) ou horizontal (plafond).",
      "items": [
        "**Vertical** pour couper les ennemis entre eux, **diagonal** pour créer un escalier vers une hauteur, **horizontal** pour piéger un passage.",
        "Les murs **blessent les ennemis proches** quand ton équipe leur inflige des dégâts.",
        "Ils sont fragiles face à **Punisher, Loki ou Iron Man**.",
        "Leur temps de recharge démarre à la pose : **laisse-les en place**."
      ]
    },
    {
      "title": "Mur de bois de fer",
      "ability": "Ironwood Wall",
      "lead": "Un grand mur très solide, posé plus près de toi. À côté, les dégâts de ton équipe te donnent de la vie bonus.",
      "items": [
        "C'est ton outil d'**engagement** : utilise-le pour un vrai pick ou pour forcer un gros cooldown (lampes, lien d'Adam).",
        "Ne le lance pas **n'importe comment** : sans lui, tu es vulnérable un long moment.",
        "Une fois l'engagement fait, **récupère-le** avec F : son temps de recharge est plus court s'il a peu souffert.",
        "Ne laisse pas de mur hors de portée : une **Emma** adverse s'en servirait pour charger son rayon."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Strangling Prison",
      "key": "Q",
      "lead": "Un projectile qui attire et retient les ennemis au centre. Sa force : les combos avec d'autres ults pour tuer à travers une ult de soin.",
      "items": [
        "Elle se charge **très vite** : au premier fight, lance-la si l'ennemi n'a pas d'ult de support.",
        "Combos classiques : **Moon Knight, Namor, Winter Soldier, Human Torch**, avec le voile de Cloak en bonus.",
        "Regarde le **tableau des scores** entre les fights pour savoir avec qui combiner.",
        "Sans combo face à une ult de support : **force-la d'abord**, ou coupe la Luna de son équipe avec un mur.",
        "Méfie-toi d'**Adam Warlock** (sa résurrection annule ton combo) et du **bouclier de Magneto**, qui bloque le projectile.",
        "Pendant l'ult, **isole avec un mur** les supports qui ne sont pas pris dedans."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**Jeter ses murs** sans plan.",
        "Laisser le grand mur en place **après l'engagement**.",
        "Ult **sans partenaire** prêt à suivre.",
        "Lancer l'ult **dans un bouclier** de Magneto.",
        "Laisser un mur **à portée d'une Emma** adverse."
      ]
    }
  ],
  "counters": [
    {
      "hero": "wolverine",
      "note": "Le pire matchup : il t'attrape dans les couloirs. Garde un grand mur."
    },
    {
      "hero": "iron-man",
      "note": "Il reste hors de portée et casse tes murs."
    },
    {
      "hero": "winter-soldier",
      "note": "Son grappin te tire hors de ta position."
    },
    {
      "hero": "emma-frost",
      "note": "Elle charge son rayon sur tes murs."
    },
    {
      "hero": "captain-america",
      "note": "Il ignore tes murs en plongeant."
    },
    {
      "hero": "loki",
      "note": "Il casse tes murs sans trop de risque."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un tank flexible pour peel ou avancer."
    },
    {
      "hero": "emma-frost",
      "note": "Même chose, quand Magneto est pris."
    },
    {
      "hero": "moon-knight",
      "note": "Le combo d'ult classique."
    },
    {
      "hero": "namor",
      "note": "Son ult achève les ennemis que tu regroupes."
    },
    {
      "hero": "human-torch",
      "note": "Ses zones de feu font fondre ta prison."
    },
    {
      "hero": "cloak-and-dagger",
      "note": "Son voile booste les dégâts sur tes cibles isolées."
    }
  ],
  "sources": [
    {
      "title": "Groot Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=l6xG6WAsYMU"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'groot'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- hawkeye
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Hawkeye est un tireur à très haut risque et très haute récompense : ses flèches chargées tuent d'un tir à la tête, ce qui lui permet de couper une ult de support tout seul. En échange, il a peu de mobilité et souffre face au dive.",
  "tldr": [
    "**Garde ta visée sur une cible** pour charger tes flèches : deux tirs au corps suffisent souvent.",
    "Installe-toi **en marchant** et garde ton saut pour survivre aux plongeurs.",
    "En duel, **arrête de bouger** au moment du tir : tu simplifies ta visée."
  ],
  "difficulty": 3,
  "tags": [
    "Sniper",
    "One-shot",
    "Anti-ult",
    "Parade"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Hawkeye vit ou meurt par sa visée. Mais tu n'as pas besoin de ne faire que des tirs à la tête : des tirs au corps réguliers suffisent à peser.",
      "items": [
        "Son point fort unique : **tuer un support à travers son ult** sans aide, très fort contre le triple support.",
        "Charge tes flèches **à couvert**, en ne montrant qu'un bout de ton corps : l'ennemi ne peut presque pas te toucher.",
        "Si tu as l'avantage, **deux tirs au corps** valent mieux qu'un tir à la tête raté.",
        "Charger une flèche **te ralentit** : ne reste pas armé face à un plongeur."
      ]
    },
    {
      "title": "Flèches",
      "key": "Clic G",
      "lead": "Plus une flèche est chargée, plus elle fait mal. Ton passif ajoute des dégâts quand ton viseur reste sur un ennemi.",
      "items": [
        "Les flèches sont **très rapides** : tu dois à peine anticiper.",
        "Tu peux charger ton passif **sur les tanks** au front avant de viser une cible lointaine.",
        "Les **flèches explosives** servent à casser le décor, les clones de Loki, ou à mettre la pression sur une cible que tu ne peux pas viser longtemps."
      ]
    },
    {
      "title": "Flèche hypersonique",
      "ability": "Hypersonic Arrow",
      "lead": "Une flèche qui transperce les ennemis, les ralentit et fait tomber les volants. Une excellente source de charge d'ult.",
      "items": [
        "Tire-la dans un **groupe** : chaque cible touchée charge beaucoup ton ult.",
        "Elle **fait tomber** Iron Man, Angela ou Ultron.",
        "Combo : **flèche hypersonique puis flèche chargée** au corps pour tuer un personnage fragile.",
        "Ne l'oublie pas : beaucoup de joueurs la laissent de côté."
      ]
    },
    {
      "title": "Coup d'épée et parade",
      "ability": "Crescent Slash · Ronin Slash",
      "lead": "Un coup d'épée de zone qui repousse les ennemis, et un coup de mêlée qui pare les projectiles s'il est bien synchronisé.",
      "items": [
        "Le coup de zone est ta **survie contre les plongeurs** : utilise-le **après** le saut de Captain America ou de Venom.",
        "Un bon **Iron Fist** le parera : sois malin.",
        "Combo : **deux coups de mêlée, coup de zone, flèche chargée au corps**.",
        "La **parade** bloque les projectiles non explosifs : coups de poing, flèches, boules de neige de Luna.",
        "Les meilleurs Hawkeye **parent, attendent le rechargement adverse**, puis placent leur flèche."
      ]
    },
    {
      "title": "Saut",
      "ability": "Skyward Leap",
      "lead": "Un double saut dans la direction choisie. C'est ta seule vraie porte de sortie.",
      "items": [
        "Ne l'utilise pas pour **monter sur ton angle** en début de fight : les plongeurs te verront arriver.",
        "Installe-toi **en marchant** ou après un fight gagné.",
        "Quand ils plongent, **descends vers ton équipe**, puis remonte en sautant quand ils te suivent."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Hunter's Sight",
      "key": "Q",
      "lead": "Tes flèches se chargent quasi instantanément et les ennemis laissent des images rémanentes que tu peux toucher.",
      "items": [
        "C'est une ult **aussi redoutée que celles de Star-Lord ou Punisher** : attends-toi à être focus.",
        "Lance-la dans un **espace ouvert**, quand l'ennemi n'a pas de quoi y répondre.",
        "Face à l'ult de **Magneto**, saute : tu ne peux pas la parer.",
        "Même un seul pick ou une ult adverse forcée, c'est **suffisant** : survis pour la suite.",
        "Elle se charge **vite** : tu l'auras presque à chaque fight."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Garder une flèche **chargée face à un plongeur**.",
        "Utiliser le **saut pour s'installer**.",
        "Chercher la **tête à tout prix** au lieu de deux tirs au corps.",
        "Oublier la **flèche hypersonique**.",
        "Lancer l'ult **sans couverture** d'équipe."
      ]
    }
  ],
  "counters": [
    {
      "hero": "venom",
      "note": "Il te plonge et t'oblige à te replacer sans cesse."
    },
    {
      "hero": "captain-america",
      "note": "Même problème, il ignore ton angle."
    },
    {
      "hero": "iron-fist",
      "note": "Il pare tes flèches et coupe tes capacités."
    },
    {
      "hero": "psylocke",
      "note": "Invisible, elle comble la distance facilement."
    },
    {
      "hero": "moon-knight",
      "note": "Tu ne peux pas charger sur ses ankhs."
    },
    {
      "hero": "magneto",
      "note": "Son bouclier te prive de tes cibles."
    }
  ],
  "synergies": [
    {
      "hero": "luna-snow",
      "note": "Le support idéal à côté duquel jouer ton angle."
    },
    {
      "hero": "invisible-woman",
      "note": "Son bouclier te protège pendant que tu tires."
    },
    {
      "hero": "venom",
      "note": "Un tir au corps et il finit la cible."
    },
    {
      "hero": "captain-america",
      "note": "Même logique en dive."
    }
  ],
  "sources": [
    {
      "title": "Hawkeye Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=L10v3F9r5Hs"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'hawkeye'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- hela
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Hela est une tireuse instantanée qui élimine les personnages fragiles en deux tirs à la tête. Sa vraie force n'est pas que la visée : c'est de se placer sur des angles décalés où les tirs deviennent faciles, et de fuir invulnérable en corbeau.",
  "tldr": [
    "Prends des **angles décalés** où l'ennemi ne te voit pas : tes tirs deviennent bien plus faciles.",
    "Ton **corbeau est une fuite**, pas un engagement : rejoins ton angle à pied.",
    "Lance ton ult **là où l'ennemi ne peut pas fuir**, après avoir forcé ses réponses."
  ],
  "difficulty": 2,
  "tags": [
    "Hitscan",
    "Angles décalés",
    "Burst",
    "Invulnérabilité"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Les meilleures Hela ne sont pas celles qui touchent tout : ce sont celles qui se rendent la tâche facile.",
      "items": [
        "Prends un angle, **fais des dégâts rapides**, puis passe à autre chose.",
        "Un DPS sert d'abord à **chasser l'ennemi des positions fortes**, pas seulement à tuer.",
        "**Ne sacrifie pas ton placement** pour un kill : un tir à la tête suffit souvent à sortir une cible du fight.",
        "Entraîne-toi à la visée **par clics** (statique et dynamique)."
      ]
    },
    {
      "title": "Dagues",
      "ability": "Nightsword Thorn · Piercing Night",
      "key": "Clic G · Clic D",
      "lead": "Des dagues instantanées qui tuent en deux tirs à la tête, et une volée de dagues explosives qui collent aux cibles.",
      "items": [
        "Au-delà d'une certaine distance, les dégâts baissent : il faut alors **un tir de plus**.",
        "La **volée explosive** sert sur les groupes, les boucliers, ou pour finir une cible blessée par le corbeau de ton passif.",
        "Les dagues **collent** : la cible ramène l'explosion au milieu de son équipe."
      ]
    },
    {
      "title": "Étourdissement",
      "ability": "Soul Drainer",
      "key": "E",
      "lead": "Un projectile qui attire et étourdit brièvement. Assez pour placer un tir à la tête facile.",
      "items": [
        "**Tir à la tête, étourdissement, tir à la tête** : le combo de base.",
        "Il **coupe l'incantation** d'ults comme celle de Doctor Strange.",
        "Garde-le contre les plongeurs (**Black Panther, Iron Fist, Magik**) : ils guettent ton étourdissement pour te sauter dessus.",
        "Les étourdir en plein déplacement **annule aussi leur capacité**."
      ]
    },
    {
      "title": "Corbeau",
      "ability": "Astral Flock",
      "lead": "Tu te transformes en nuée de corbeaux, invulnérable, et tu fonces dans la direction visée.",
      "items": [
        "Erreur classique : l'utiliser **pour engager**. Sans lui, tu es très vulnérable.",
        "Ne t'envole pas pour **planer au-dessus des boucliers** sans raison : tu deviens une cible facile.",
        "Il **esquive les ults** : Doctor Strange, Magneto, Storm, Winter Soldier…",
        "Il y a un **petit délai** avant la transformation : anticipe.",
        "Si tu en sors à bas PV, **ping-le** pour que tes supports le sachent."
      ]
    },
    {
      "title": "Passifs",
      "ability": "Nastrond Crowstorm · Hel's Descent",
      "lead": "Chaque kill fait apparaître un corbeau qui explose peu après. Hela peut aussi planer en l'air.",
      "items": [
        "Le corbeau **affaiblit les ennemis proches** : un tir à la tête et un au corps suffisent ensuite.",
        "Combo : tue une cible, puis **attire la seconde dans l'explosion** avec ton étourdissement.",
        "Planer après un kill sur un angle permet d'**enchaîner**, mais attention aux autres tireurs."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Goddess of Death",
      "key": "Q",
      "lead": "Tu t'envoles et tires des corbeaux explosifs. Tu vois les ennemis à travers les murs, et seul un gros burst te fait redescendre.",
      "items": [
        "Contre des brawlers (**Magik, Invisible Woman, The Thing**), envole-toi et lâche-toi : ils ne peuvent pas te descendre.",
        "Contre des tireurs, **élimine-les ou force-les** d'abord.",
        "Force les **ults de support et cooldowns défensifs** avant de lancer.",
        "Contre un **Doctor Strange**, abîme son bouclier avant : il viendra te bloquer.",
        "Lance-la **là où l'ennemi ne peut pas fuir** : sur le point ou en prolongation."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**S'acharner** après quelques tirs ratés.",
        "Utiliser le **corbeau pour engager**.",
        "Lancer l'étourdissement **n'importe comment** face à des plongeurs.",
        "Ult **quand l'ennemi peut s'abriter**.",
        "Oublier l'**explosion du corbeau** après un kill."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hulk",
      "note": "Il te colle et te prive de ton angle."
    },
    {
      "hero": "venom",
      "note": "Même problème, surtout avec un DPS plongeur."
    },
    {
      "hero": "captain-america",
      "note": "Il te rejoint très vite."
    },
    {
      "hero": "doctor-strange",
      "note": "Son bouclier te bloque sur les cartes sans angle."
    },
    {
      "hero": "invisible-woman",
      "note": "Son bouclier protège ceux qui te duellent."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Ses packs d'armure cassent ton tue-en-deux."
    }
  ],
  "synergies": [
    {
      "hero": "thor",
      "note": "Un tank qui te protège des plongeurs."
    },
    {
      "hero": "loki",
      "note": "Un support qui t'accompagne sur ton angle."
    },
    {
      "hero": "namor",
      "note": "Ses tourelles repoussent les plongeurs."
    },
    {
      "hero": "mantis",
      "note": "Elle peut se battre sur l'angle avec toi."
    },
    {
      "hero": "adam-warlock",
      "note": "Même chose, et ses dégâts suivent les tiens."
    }
  ],
  "sources": [
    {
      "title": "Hela Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=KD6ORSun0ZE"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'hela'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- hulk
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Hulk est l'un des tanks les plus exigeants : il brawle au front, plonge sur les tireurs perchés et protège ses alliés avec des bulles au bon moment. Savoir quand engager légèrement et quand engager pour de vrai fait toute la différence.",
  "tldr": [
    "**Charge ton saut en permanence**, même en frappant : c'est ton outil principal.",
    "Utilise tes **bulles pour tes alliés**, pas seulement pour toi.",
    "Réfléchis à ton **exil** avant chaque fight : il doit sortir une ult adverse du jeu."
  ],
  "difficulty": 3,
  "tags": [
    "Plongée",
    "Bulles",
    "Contrôle",
    "Exigeant"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Hulk s'adapte : brawl au front contre une compo serrée, plongée sur les angles contre une compo à distance. La souplesse mentale est la clé.",
      "items": [
        "**Engagement léger** : saute sur un angle sans investir ta bulle ni ton ult, attire l'attention, force leurs cooldowns (corbeau de Hela, clap de Luna), puis reviens.",
        "**Engagement total** : une fois leurs cooldowns brûlés, reviens pour confirmer le pick ou prendre la position.",
        "Ne passe pas **trop de temps** sur une cible que tu ne peux pas tuer, mais **engage-toi à fond** quand le kill est possible.",
        "Après un pick, profite de l'avantage numérique pour aller sur la backline."
      ]
    },
    {
      "title": "Coups et clap",
      "ability": "Heavy Blow · Gamma Burst",
      "key": "Clic G",
      "lead": "Des coups de poing à bonne portée et un clap qui envoie un projectile traversant.",
      "items": [
        "Le **clap** en début de fight charge ton ult et chasse une cible isolée de sa position.",
        "**Coup de poing puis clap** enchaînés pour finir une cible.",
        "Aligne le clap sur **plusieurs ennemis**, puis saute sur le retardataire.",
        "Clappe **pendant ton saut** pour frapper dès l'atterrissage."
      ]
    },
    {
      "title": "Bulles",
      "ability": "Indestructible Guard",
      "lead": "Des bulles qui protègent tous les alliés proches quelques instants. Les dégâts absorbés sur ta propre bulle chargent ton ult.",
      "items": [
        "**Activer un allié** : saute sur ta Hela qui se fait flanquer et bulle-la.",
        "**Protéger un brawl** : bulle tout ton groupe quand il pousse.",
        "**Contrer une ult** : Doctor Strange, Magneto, Psylocke. Contre Iron Man, saute, bulle-toi et intercepte le projectile.",
        "Contre un **plongeur** sur ta backline, bulle tes supports puis saute sur lui.",
        "L'erreur : **ne bulle que toi** en permanence."
      ]
    },
    {
      "title": "Saut prodigieux",
      "ability": "Incredible Leap",
      "lead": "Maintiens le saut pour le charger, puis relâche. Tu peux t'accrocher aux murs et attraper les volants.",
      "items": [
        "**Charge-le tout le temps**, même en frappant ou en bullant.",
        "Les contrôles (repoussement, étourdissement) **annulent la charge** : esquive les poussées d'Invisible Woman, les repoussements de Magneto.",
        "Toucher un **volant** (Star-Lord, Iron Man, Human Torch) l'attrape et le ramène au sol, ce qui gâche son ult.",
        "En **brawl miroir**, saute en l'air pour te faire soigner à l'abri.",
        "Contre une compo **à distance**, saute pour chasser les tireurs de leurs angles."
      ]
    },
    {
      "title": "Exil",
      "ability": "Radioactive Lockdown",
      "lead": "Un projectile lent qui sort une cible du jeu deux secondes : elle ne peut ni agir, ni prendre de dégâts, ni contester l'objectif.",
      "items": [
        "Il sert à **retirer une menace** : la Psylocke en ult que tes supports ne peuvent pas contrer, l'Iron Man qui vise ta Luna.",
        "Attention : une cible exilée **survit aux ults de ton équipe**. Seul Hulk peut la libérer en la frappant.",
        "Exile le **Doctor Strange qui revient du spawn** en portail.",
        "Ne le gâche pas pour un **clip spectaculaire** sur un volant."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Hulk Smash · World Breaker",
      "key": "Q",
      "lead": "Tu deviens Monster Hulk avec énormément de vie, des coups qui repoussent, un clap très rapide et un exil rechargé plus vite. Tu perds tes bulles.",
      "items": [
        "**Jongle** : projette un ennemi en l'air, puis saute dessus pour l'étourdir. Plus facile contre un mur, et plus utile sur les tanks.",
        "**Coup, clap, coup** élimine vite un personnage fragile.",
        "World Breaker t'immobilise avec une cible : utilise-le pour **couper une ult** (un Loki en pleine copie).",
        "Ton ult sert à **prolonger un engagement** ou à **tenir le point**. Fais contester un allié pendant ta transformation.",
        "Si tu meurs, tu redeviens **Bruce Banner** : tire et lance des grenades sur toi pour recharger vite ton ult."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**Ne pas charger** son saut entre deux actions.",
        "Se **bulle-r soi-même** systématiquement.",
        "Lancer l'exil **sans plan**, ou sauver un ennemi des ults alliées.",
        "Engager **à fond** quand l'ennemi a encore tous ses cooldowns.",
        "Rester **trop longtemps** sur une cible inaccessible."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle charge sur toi : saute quand elle te cristallise."
    },
    {
      "hero": "groot",
      "note": "Ses murs t'isolent : saute, casse-les."
    },
    {
      "hero": "the-punisher",
      "note": "Il te farme de loin."
    },
    {
      "hero": "squirrel-girl",
      "note": "Même chose avec ses dégâts de zone."
    },
    {
      "hero": "iron-man",
      "note": "Il reste en l'air et te fait fondre."
    },
    {
      "hero": "invisible-woman",
      "note": "Elle te ramène quand tu tentes de fuir."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un tank qui gère ce qui te contre."
    },
    {
      "hero": "psylocke",
      "note": "Elle plonge avec toi, puis brawle au centre."
    },
    {
      "hero": "namor",
      "note": "Ses tourelles et tes bulles rendent la plongée adverse très dure."
    },
    {
      "hero": "wolverine",
      "note": "Tu peux le lancer pour qu'il attrape une cible."
    },
    {
      "hero": "luna-snow",
      "note": "Elle te soutient pour aller plus loin."
    }
  ],
  "sources": [
    {
      "title": "Hulk Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=YZf3psRKPmE"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'hulk'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- human-torch
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Human Torch n'est pas un chasseur de picks : c'est un contrôleur de zone volant. Il pose des boules de feu et des murs pour découper l'équipe adverse, empêcher les supports de soigner tranquillement, puis finit les cibles affaiblies au fusil.",
  "tldr": [
    "**Crée de la pression** avec tes zones de feu, ne cherche pas le kill tout de suite.",
    "Garde ton **fusil et ton plongeon** pour finir le fight, pas pour l'ouvrir.",
    "Prépare ton ult : **boules de feu déjà posées**, à couvert et dans la vue de tes supports."
  ],
  "difficulty": 2,
  "tags": [
    "Contrôle de zone",
    "Vol",
    "Dégâts sur la durée",
    "Combos d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Contrairement à Iron Man qui pèse par les dégâts bruts, Johnny dicte où l'ennemi peut ou ne peut pas jouer.",
      "items": [
        "Pose tes zones pour **séparer les ennemis** depuis le ciel, puis frappe les cibles affaiblies.",
        "Passe **de couvert en couvert** : en début de fight, plonger sur les supports, c'est perdre.",
        "Avant de plonger, garde **au moins une charge de fusil** et un peu de vol pour repartir.",
        "Avant ton ult ou ton plongeon, **jette un œil à tes supports** : sois dans leur ligne de vue."
      ]
    },
    {
      "title": "Fusil de feu",
      "ability": "Fire Cluster",
      "key": "Clic G",
      "lead": "Un fusil à projectiles qui ne se recharge pas : ses munitions reviennent toutes seules quand tu ne tires pas.",
      "items": [
        "Au-delà de la mi-distance, il **s'éparpille et perd des dégâts** : reste proche.",
        "Un **coup de mêlée** accélère la recharge des munitions : enchaîne tir et mêlée.",
        "C'est ton **outil de fin de fight** pour confirmer les kills."
      ]
    },
    {
      "title": "Boules de feu",
      "ability": "Blazing Blast",
      "key": "Clic D",
      "lead": "Trois charges de boules de feu qui laissent une zone brûlante. C'est ton vrai outil de poke à distance.",
      "items": [
        "Utilise-les sur **les tanks et les supports** pour leur interdire des zones.",
        "Débusque les **supports cachés sous un toit** pour les forcer à découvert.",
        "Avant de plonger sur un support : **une boule derrière lui, une sur lui**.",
        "**Jamais en duel contre un volant** : ton fusil fait bien mieux.",
        "Évite de les lancer en terrain ouvert, où l'ennemi n'a qu'à faire un pas de côté."
      ]
    },
    {
      "title": "Prison de flammes",
      "ability": "Pyro-Prison",
      "lead": "Relie au moins trois boules de feu au sol pour créer des murs de flammes qui enferment et brûlent les ennemis.",
      "items": [
        "Un rectangle visible de loin est **facile à éviter** : les bons joueurs partent avant.",
        "En défense ou après un fight gagné, **pose tes boules à l'avance** et active les murs quand l'ennemi arrive sur le point.",
        "Utilise aussi les murs pour **prolonger une bonne zone** dans un couloir, ou pour **couper les supports** l'un de l'autre.",
        "Teste en entraînement la **distance maximale** entre deux points."
      ]
    },
    {
      "title": "Plongeon",
      "ability": "Flaming Meteor",
      "lead": "Tu plonges au sol, repousses les ennemis et gagnes de la vie bonus. Sur une boule de feu, tu la fais exploser.",
      "items": [
        "Repousse les ennemis **dans une autre zone de feu** ou un tank **vers ton équipe**.",
        "Il peut **sortir Cloak & Dagger ou Invisible Woman de leur ult**.",
        "Pas besoin de boule de feu pour plonger : supports, ne vous croyez pas à l'abri.",
        "Long temps de recharge : c'est une **action de fin de fight**, avec ton équipe prête à suivre."
      ]
    },
    {
      "title": "Vol rapide",
      "ability": "Plasma Body",
      "key": "Maj",
      "lead": "Maintiens pour voler beaucoup plus vite, tant que ta jauge le permet.",
      "items": [
        "Ne tombe **jamais à sec** en terrain découvert.",
        "Avant ton ult, utilise-le pour **te placer** plutôt que de chercher ta position en pleine ult."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Supernova",
      "key": "Q",
      "lead": "Une onde de choc autour de toi, puis tes boules de feu deviennent des tornades enflammées qui s'empilent. Tu encaisses moins de dégâts.",
      "items": [
        "Deux ou trois tornades au même endroit **traversent n'importe quelle ult de soin**.",
        "Avec une **ult de Groot**, lance la tienne un peu avant pour être prêt quand les ennemis sont regroupés.",
        "Astuce : lance une boule de feu **juste avant** l'ult, elle devient une tornade. Les boules déjà au sol ne se transforment pas.",
        "**Tire au fusil** entre deux tornades pour ajouter des dégâts.",
        "Place les tornades sur les **entrées du point** pour bloquer l'ennemi."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Plonger sur les supports **en début de fight**.",
        "Lancer des boules de feu **en duel** contre un volant.",
        "Tomber **à court de vol** à découvert.",
        "Ult **hors de la vue** de ses supports, puis blâmer les soins.",
        "Prison en rectangle **trop visible**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hulk",
      "note": "Il saute pour te ramener au sol."
    },
    {
      "hero": "star-lord",
      "note": "Il te met la pression et t'empêche de t'installer."
    },
    {
      "hero": "iron-man",
      "note": "Il te bat à distance. Ne le duel qu'à courte portée."
    },
    {
      "hero": "magneto",
      "note": "Son ult avale tes tornades."
    },
    {
      "hero": "ultron",
      "note": "Un duelliste à longue portée qui ne meurt jamais."
    },
    {
      "hero": "luna-snow",
      "note": "Elle te met la pression en l'air et te gèle après ta plongée."
    }
  ],
  "synergies": [
    {
      "hero": "groot",
      "note": "Le combo d'ult le plus satisfaisant du jeu."
    },
    {
      "hero": "captain-america",
      "note": "Il repousse les ennemis dans tes zones."
    },
    {
      "hero": "psylocke",
      "note": "Elle finit les cibles que tu as affaiblies."
    },
    {
      "hero": "spider-man",
      "note": "Un plongeur qui suit tes zones."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses soins et ses outils t'aident à survivre en l'air."
    },
    {
      "hero": "luna-snow",
      "note": "Le meilleur support pour te garder en vie."
    }
  ],
  "sources": [
    {
      "title": "Human Torch Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=P9NvGuL_cho"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'human-torch'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- invisible-woman
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Invisible Woman brille dans les compos groupées : elle aligne alliés et ennemis pour charger son ult très vite, attire les cibles importantes dans la portée de son équipe et protège les menaces clés avec son bouclier personnel.",
  "tldr": [
    "**Aligne un maximum de cibles** avec tes orbes : chaque tir charge énormément ton ult.",
    "Ta **poussée-attraction** est ce qui te fait porter les parties : un pick ou un sauvetage à chaque utilisation.",
    "Ton ult ne bouge pas : place-la **sur le point**, de préférence en seconde ult."
  ],
  "difficulty": 2,
  "tags": [
    "Brawl",
    "Déplacement d'ennemis",
    "Bouclier",
    "Charge d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Tu n'as pas les dégâts pour tuer seule : ton rôle est d'amener les bonnes cibles devant ton équipe et de charger ton ult au plus vite.",
      "items": [
        "Elle est forte quand **tout le monde joue groupé**, faible contre les compos éclatées sur plusieurs angles.",
        "Si ton équipe joue **dive**, préfère Luna ou Cloak & Dagger.",
        "Joue **près de ton autre support** pour pouvoir être aidée, et garde ton saut pour les urgences."
      ]
    },
    {
      "title": "Orbes",
      "key": "Clic G",
      "lead": "Des orbes qui partent en ligne droite puis reviennent comme un boomerang. Ils touchent alliés et ennemis à l'aller et au retour.",
      "items": [
        "Aligne **un maximum d'alliés et d'ennemis** : c'est ta meilleure source de charge d'ult.",
        "Vise **le sol au niveau de la dernière cible** pour déclencher le retour plus tôt.",
        "Reste **un peu en retrait** : le retour touche plus facilement."
      ]
    },
    {
      "title": "Bouclier gardien",
      "ability": "Guardian Shield",
      "key": "Clic D",
      "lead": "Un petit bouclier personnel posé sur un allié, qui le soigne aussi. C'est un sauve-qui-peut ciblé, pas un mur.",
      "items": [
        "Bloque le **burst** qui va tuer : ult de Magneto ou de Doctor Strange, dagues de Hela, flèches de Hawkeye. Pas les dégâts continus d'un Punisher.",
        "**Rends un DPS invincible** sur son angle : un Star-Lord ou Punisher en ult, un Hela repéré.",
        "Il **ralentit** l'ennemi qui le traverse.",
        "**Rappelle-le avec F** avant qu'il casse : il revient bien plus vite.",
        "Avec un autre support en difficulté, pose-le sur ton équipe en marchant pour avoir **couvert et soins** pour toi aussi."
      ]
    },
    {
      "title": "Poussée et attraction",
      "ability": "Force Physics",
      "key": "E · Clic G / Clic D",
      "lead": "Tu repousses ou attires les ennemis dans la zone visée. Maîtriser cette capacité, c'est maîtriser Invisible Woman.",
      "items": [
        "**Attire** un DPS perché ou un tank trop avancé dans ton équipe : pick gratuit.",
        "**Repousse** un plongeur (Spider-Man, Magik, Black Panther, Iron Fist), mais seulement **quand il n'a plus de mobilité**.",
        "Sur certaines cartes, la poussée **éjecte** les ennemis du terrain.",
        "Garde la poussée quand le **Doctor Strange adverse a son ult** : tu l'envoies hors de portée.",
        "Le meilleur contre à **Wolverine** : attire-le hors de son agrippement.",
        "Ne ramène pas un ennemi **dans ton équipe blessée**, et ne sauve pas une cible qui allait mourir."
      ]
    },
    {
      "title": "Vortex",
      "ability": "Psionic Vortex",
      "key": "Maj",
      "lead": "Une boule qui crée une zone de ralentissement et d'attraction. Réappuie pour la faire éclater où tu veux.",
      "items": [
        "En **brawl contre brawl**, mets-la sur les tanks quand ils poussent.",
        "Elle peut **piéger un DPS** sur son angle pour ton DPS.",
        "Contre un plongeur, pose-la **à tes pieds**, saute, puis pousse-le dedans.",
        "Elle n'éclate pas sur le bouclier de Magneto : **déclenche-la toi-même**."
      ]
    },
    {
      "title": "Saut et invisibilité",
      "ability": "Veiled Step · Covert Advance",
      "lead": "Sans agir ni prendre de dégâts, tu deviens invisible et te soignes. Le double saut te rend invisible immédiatement.",
      "items": [
        "Le saut est un **outil de survie**, pas de déplacement.",
        "Plongée sur toi ? **Saute**. Ult de Magneto ? **Saute**, puis protège ton autre support.",
        "Tes **pas sont bruyants** même invisible."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Invisible Boundary",
      "key": "Q",
      "lead": "Une zone fixe qui soigne et rend invisibles tes alliés à l'intérieur. Les ennemis qui entrent ou sortent sont fortement ralentis.",
      "items": [
        "Place-la **sur le point** : l'ennemi doit se battre ou abandonner l'objectif.",
        "Coupe l'équipe adverse **en deux** pour que leurs supports ne voient plus leurs tanks.",
        "Elle ne bouge pas : ne l'utilise **pas pour engager**, sers-t'en plutôt en **seconde ult**.",
        "Si tu meurs, elle disparaît : **reste en vie** face aux ults de Magneto, Punisher ou un Hawkeye."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Tirer sans **aligner les cibles**.",
        "Laisser casser le bouclier au lieu de le **rappeler**.",
        "Repousser un plongeur **pendant son déplacement**.",
        "Utiliser le saut **pour se déplacer**.",
        "Lancer l'ult **loin du point**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "spider-man",
      "note": "Les compos éclatées de dive te privent de valeur."
    },
    {
      "hero": "venom",
      "note": "Même problème, il plonge sur toi."
    },
    {
      "hero": "iron-man",
      "note": "Il te surclasse à distance, hors d'atteinte."
    },
    {
      "hero": "hela",
      "note": "Elle te gagne à distance si tu ne peux pas l'attirer."
    },
    {
      "hero": "hawkeye",
      "note": "Même chose, et il peut te tuer dans ton ult."
    }
  ],
  "synergies": [
    {
      "hero": "the-thing",
      "note": "Tu attires les cibles dans sa portée."
    },
    {
      "hero": "doctor-strange",
      "note": "Un tank de brawl derrière lequel tu brilles."
    },
    {
      "hero": "groot",
      "note": "Attire une cible, il l'isole avec un mur."
    },
    {
      "hero": "winter-soldier",
      "note": "Un DPS qui veut le contact."
    },
    {
      "hero": "magik",
      "note": "Même logique de brawl rapproché."
    },
    {
      "hero": "wolverine",
      "note": "Tu lui amènes ses cibles."
    },
    {
      "hero": "human-torch",
      "note": "Tu l'aides à survivre pendant ses plongées."
    }
  ],
  "sources": [
    {
      "title": "Invisible Woman Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=mRt2zFGqrws"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'invisible-woman'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- iron-fist
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Iron Fist est un combattant de mêlée polyvalent, capable de plonger comme de brawler. Il harcèle avec ses coups de base pour forcer les contrôles adverses, pare, puis déchaîne des coups renforcés qui font fondre les tanks.",
  "tldr": [
    "**Harcèle, pare, puis frappe** : ta parade débloque tes vrais dégâts.",
    "Les coups renforcés font **plus mal aux tanks** : excellent pour charger ton ult.",
    "Garde de la **hauteur** avec murs et triple saut pour repérer la cible isolée."
  ],
  "difficulty": 3,
  "tags": [
    "Mêlée",
    "Parade",
    "Anti-volant",
    "Anti-tank"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Iron Fist ressemble à Daredevil : il plonge ou brawle selon les besoins. Dans le doute, médite, force des cooldowns, pare, puis brawle avec ton équipe.",
      "items": [
        "Sois **patient** : la parade est ta ressource, tu vis et meurs avec elle.",
        "Dans un fight serré à 6 contre 6, **force d'abord leurs contrôles** avec les coups de base, puis riposte.",
        "Avec un pick d'avance, tu peux **parer tout de suite** et faire boule de neige.",
        "Astuce : pare, **ressors avec ta vie bonus**, puis reviens sur un support quand l'équipe adverse se disperse."
      ]
    },
    {
      "title": "Mobilité",
      "ability": "Crane Leap · Wall Runner",
      "lead": "Trois sauts consécutifs et la course sur les murs. Iron Fist peut presque voler.",
      "items": [
        "Les sauts ne se rechargent qu'**en touchant une surface** : enchaîne sauts et course sur les murs pour rester en hauteur.",
        "Garde **une vue d'ensemble** pour repérer le support isolé.",
        "Les sauts **esquivent** les dégâts de zone (Iron Man) et l'ult de The Thing."
      ]
    },
    {
      "title": "Coups de base",
      "key": "Clic G",
      "lead": "Une série de six coups dont le dernier projette en l'air. Ils te propulsent vers une cible proche et réduisent le temps de recharge de ta parade.",
      "items": [
        "Leur rôle : **harceler** et forcer les contrôles (boule de neige de Luna…), pas tuer.",
        "Le dernier coup **fait tomber les volants** : prépare-le sur un mur, puis garde-le pour une cible en l'air.",
        "Frapper l'air **ralentit ta chute**.",
        "Le verrouillage fonctionne même **sans visibilité**, mais pas à travers les boucliers."
      ]
    },
    {
      "title": "Parade et coups renforcés",
      "ability": "Dragon's Defense",
      "key": "Clic D",
      "lead": "Tu bloques tout pendant un instant et convertis les dégâts en vie bonus. Ensuite, tu gagnes des coups très rapides qui infligent des dégâts en pourcentage de la vie.",
      "items": [
        "La parade bloque **tout** : boules de neige, capacités de Magneto ou Iron Man, ult de Jeff.",
        "Les coups renforcés font **plus de dégâts aux tanks**, mais restent très forts sur les fragiles.",
        "**Suis ta cible** avec tes déplacements, sinon tu te détaches et perds des coups.",
        "Force d'abord la **fuite d'un tank** (le saut de Strange, le balancement de Venom), puis pare et frappe.",
        "Contre Iron Fist : **ne tire pas sur lui pendant sa parade**."
      ]
    },
    {
      "title": "Coup de pied",
      "key": "Maj",
      "lead": "Un coup de pied tournoyant qui te propulse en avant. Le second impact fait double dégâts sur une cible à moins de la moitié de sa vie.",
      "items": [
        "Excellent **outil pour finir** : anticipe si le premier impact fera passer la cible sous la moitié.",
        "Sert aussi à **rejoindre un volant** ou à fuir.",
        "Il **s'arrête au contact** : pour fuir, éloigne-toi des ennemis.",
        "Utilise **un saut avant** pour aller plus loin."
      ]
    },
    {
      "title": "Méditation",
      "ability": "Harmony Recovery",
      "lead": "Tu te soignes rapidement et gagnes de la vie bonus, mais tu es immobile et bruyant.",
      "items": [
        "Médite **avant le fight**, à couvert ou au-dessus d'un passage.",
        "Cycle : **plonge, force des cooldowns, ressors, médite, recommence**.",
        "Tu flottes en méditant : tu peux t'installer dans des **positions inattendues**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Living Chi",
      "key": "Q",
      "lead": "Bonus de dégâts et de vitesse, portée doublée, coups renforcés permanents et parade presque toujours disponible.",
      "items": [
        "Plus besoin de parer pour frapper fort : la parade sert à **bloquer et te soigner**.",
        "Tu deviens la priorité adverse : **pare au bon moment**.",
        "Utilise-la pour **forcer les ults de support**, puis recharge la suivante.",
        "Elle se charge vite en frappant les tanks.",
        "Après ton premier pick, **respire** : n'en fais pas trop."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Parer **dès le début** contre une équipe qui garde ses contrôles.",
        "Mal **suivre sa cible** et perdre ses coups renforcés.",
        "Méditer **à découvert**.",
        "Gâcher le **coup de pied** alors qu'il fallait fuir.",
        "Rester trop longtemps après son pick."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Sa bulle protège la cible que tu engages."
    },
    {
      "hero": "emma-frost",
      "note": "En forme de diamant, elle te sort de ton combo."
    },
    {
      "hero": "peni-parker",
      "note": "Ses nids et toiles gênent tes plongées."
    },
    {
      "hero": "namor",
      "note": "Tu ne verrouilles pas ses tourelles."
    },
    {
      "hero": "winter-soldier",
      "note": "Un matchup très difficile."
    },
    {
      "hero": "adam-warlock",
      "note": "Son lien rend ton burst inutile."
    }
  ],
  "synergies": [
    {
      "hero": "luna-snow",
      "note": "Le support idéal, qui se débrouille seule."
    },
    {
      "hero": "venom",
      "note": "En dive, vous éliminez vite les supports."
    },
    {
      "hero": "captain-america",
      "note": "Même logique de plongée."
    },
    {
      "hero": "psylocke",
      "note": "Pression combinée sur la backline."
    },
    {
      "hero": "cloak-and-dagger",
      "note": "Autre support autonome qui te laisse un slot DPS."
    }
  ],
  "sources": [
    {
      "title": "Iron Fist Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=xfZl57O8_OQ"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'iron-fist'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- iron-man
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Iron Man n'est pas un DPS classique : son ult se charge très vite et peut annuler les ults adverses. Il poke les groupes avec ses répulseurs pour charger, puis passe en surcharge pour faire fondre une cible isolée avec son rayon.",
  "tldr": [
    "Sur un **groupe**, tire aux répulseurs ; sur une **cible isolée**, passe au rayon.",
    "Active la **surcharge derrière un mur**, jamais à découvert.",
    "Ton ult sert à **punir une ult de support** : place-toi à l'abri avant de tirer."
  ],
  "difficulty": 2,
  "tags": [
    "Vol",
    "Charge d'ult",
    "Anti-ult",
    "Poke"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Iron Man demande de la patience : il charge son ult à toute vitesse et attend le moment précis où elle change le fight.",
      "items": [
        "Garde ton **temps de tir au maximum** : il y a presque toujours quelqu'un à toucher.",
        "Reste à **bonne distance**, environ à la portée maximale du rayon : la cible est plus facile à suivre.",
        "Évite de **flanquer en volant** : c'est la capacité la plus bruyante du jeu.",
        "Sur les tanks soutenus par deux soigneurs, tu nourris surtout **l'ult adverse**."
      ]
    },
    {
      "title": "Répulseurs",
      "ability": "Repulsor Blast",
      "key": "Clic G",
      "lead": "Des projectiles explosifs en série de trois. Une bonne partie des dégâts vient de l'explosion.",
      "items": [
        "Vise **les pieds** en duel : même raté, tu infliges des dégâts de zone.",
        "Ils servent surtout à **charger ton ult** sur des ennemis groupés.",
        "Tire dans une **ult de support** adverse pour charger la tienne et la contrer ensuite.",
        "Le troisième tir part **plus vite** : ajuste ta visée."
      ]
    },
    {
      "title": "Uni-Beam",
      "key": "Clic D",
      "lead": "Un rayon instantané qui partage les munitions de tes répulseurs. C'est ton vrai outil pour éliminer une cible.",
      "items": [
        "**Recharge avant** d'aller chercher une cible : garde de la marge de munitions.",
        "Sa portée **dépasse celle d'Emma Frost**.",
        "Poke aux répulseurs, puis **finis au rayon**."
      ]
    },
    {
      "title": "Surcharge",
      "ability": "Armor Overdrive",
      "key": "E",
      "lead": "Après une courte animation, tes attaques sont renforcées, tes munitions illimitées, et tu gagnes de la vie bonus.",
      "items": [
        "**Toujours derrière un mur** : l'animation te rend vulnérable.",
        "Elle **ne recharge pas** ton arme à la fin : prévois un endroit sûr pour recharger.",
        "Avant de l'activer, demande-toi si tu peux **vraiment mettre la pression** sur une cible sans te faire punir.",
        "Les **micro-missiles** en surcharge sont un bonus de dégâts, pas une priorité."
      ]
    },
    {
      "title": "Vol rapide",
      "ability": "Hyper-Velocity",
      "key": "Maj",
      "lead": "Un vol très rapide qui consomme de l'énergie. La surcharge te la remplit.",
      "items": [
        "Sert à **rejoindre un angle** pour passer en surcharge, ou à **fuir** une menace.",
        "Utilise-le pour te **placer en sécurité** avant ton ult."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Invincible Pulse Cannon",
      "key": "Q",
      "lead": "Un gros projectile lent qui explose et élimine presque tout dans sa zone. Une des ults les plus rapides à charger.",
      "items": [
        "Tu seras visé : demande un **bouclier d'Emma** ou une **bulle de Magneto**, ou force d'abord les menaces (fais fuir la Hela).",
        "Ne vole pas en flanc pour ult **tout de suite** : attends quelques secondes qu'on t'oublie.",
        "Cible prioritaire : **les ults de support**, surtout celle de Luna. Ne sois pas trop loin, sinon ils fuient.",
        "Même sans kill, elle **force des cooldowns** (runes, bulles, murs) qui gagnent le fight.",
        "Un **Magneto** en ult peut l'absorber : force la sienne avant."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Activer la surcharge **à découvert**.",
        "Viser au rayon un **tank soutenu** par deux soigneurs.",
        "Partir au rayon **sans munitions**.",
        "Ult **juste après un vol bruyant** en flanc.",
        "Garder l'ult trop longtemps alors qu'elle revient vite."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hela",
      "note": "Elle te descend du ciel. Joue près des couverts."
    },
    {
      "hero": "hawkeye",
      "note": "Même chose, et il peut couper ton rayon."
    },
    {
      "hero": "spider-man",
      "note": "Il te rejoint partout dans les airs."
    },
    {
      "hero": "star-lord",
      "note": "Pousse-le à trop te poursuivre."
    },
    {
      "hero": "psylocke",
      "note": "Même idée : fais-la sortir de position."
    },
    {
      "hero": "magneto",
      "note": "Son ult avale ton canon."
    },
    {
      "hero": "adam-warlock",
      "note": "Ses tirs instantanés te punissent en l'air."
    }
  ],
  "synergies": [
    {
      "hero": "ultron",
      "note": "Un autre volant qui te soigne en l'air."
    },
    {
      "hero": "magneto",
      "note": "Sa bulle te protège pendant ton ult."
    },
    {
      "hero": "emma-frost",
      "note": "Son bouclier te couvre pendant ton ult."
    },
    {
      "hero": "hela",
      "note": "Elle gère les tireurs qui te visent."
    },
    {
      "hero": "psylocke",
      "note": "Elle s'occupe de Hela et Hawkeye."
    },
    {
      "hero": "invisible-woman",
      "note": "Son bouclier sécurise ton ult."
    }
  ],
  "sources": [
    {
      "title": "Iron Man Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=3hV4kz3Repc"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'iron-man'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- jeff-the-land-shark
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Jeff se joue comme un flanker qui met la pression sur la backline adverse : il attire l'attention loin de son équipe, survit grâce à la nage et à ses bulles, et peut retirer des ennemis du terrain avec son ult. Le jouer en simple soigneur, c'est le jouer mal.",
  "patch_note": "Guide tiré d'une vidéo de Paz enregistrée en saison 2 : le kit de Jeff a été retouché depuis et ses team-ups ont changé. On a gardé le plan de jeu et retiré les chiffres, les team-ups et les astuces de carte périmées. Vérifie en jeu.",
  "tldr": [
    "Prends un **angle de flanc** et vise les **supports et DPS**, jamais les tanks.",
    "**Gère tes bulles** : garde-en toujours une ou deux pour fuir.",
    "Une ult qui retire **un ou deux ennemis clés** suffit largement."
  ],
  "difficulty": 2,
  "tags": [
    "Flanc",
    "Pression",
    "Mobilité",
    "Ult de pick"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Ton vrai soin, c'est d'attirer les dégâts et l'attention sur toi plutôt que sur ton équipe. Ça ne se voit pas au tableau des scores, mais ça se voit au résultat.",
      "items": [
        "Nage jusqu'à un **angle décalé**, mets la pression sur la backline, puis repars quand ils réagissent.",
        "Avant de partir, **laisse deux ou trois bulles** à ton autre support.",
        "Casse les **objets adverses** (tourelles, amplificateurs) depuis ton flanc.",
        "Ne sois pas **trop gourmand** : reste sur des positions difficiles d'accès.",
        "En **triple support**, tu peux te concentrer encore plus sur les dégâts."
      ]
    },
    {
      "title": "Soin et dégâts",
      "ability": "Joyful Splash · Aqua Burst",
      "key": "Clic G · Clic D",
      "lead": "Un jet d'eau qui soigne et traverse les alliés, et des projectiles d'eau qui explosent à l'impact.",
      "items": [
        "Le jet est un projectile : **anticipe un peu** et soigne avant les dégâts.",
        "Reviens soigner quand **un allié lance son ult** ou quand ta Luna, presque prête, se fait plonger.",
        "Vise **les pieds** avec les projectiles : l'explosion compense un tir raté.",
        "Contre un volant, vise **le mur derrière lui**. Sinon, change de cible.",
        "Ne tire **jamais sur les tanks** : tu ne fais que les énerver."
      ]
    },
    {
      "title": "Nage",
      "ability": "Hide and Seek",
      "key": "Maj",
      "lead": "Sous terre, tu vas plus vite, tu te soignes, tu ne peux pas être touché à la tête et tu peux nager sur les murs.",
      "items": [
        "Combo de base : **pose une bulle, passe dedans, plonge** pour filer à ton angle.",
        "Tu peux **attendre sur un mur** et surprendre un ennemi qui passe.",
        "Option : passe la nage murale en mode **appui simple** dans les paramètres si c'est plus confortable.",
        "Sous terre, tu **ne contestes pas** l'objectif."
      ]
    },
    {
      "title": "Bulles",
      "ability": "Healing Bubble",
      "key": "E",
      "lead": "Des bulles posées au sol qui soignent, accélèrent et boostent les soins reçus. Elles restent longtemps en place.",
      "items": [
        "Ne les **empile pas** : l'accélération ne se cumule pas.",
        "Avec une bonne gestion des bulles, **un bon Jeff ne meurt presque jamais**.",
        "Avant un fight, trace un **chemin de bulles** vers le bord de la carte pour sortir les ennemis avec ton ult.",
        "Pense à **ton hitbox** : un mouvement en huit rend Jeff très dur à toucher."
      ]
    },
    {
      "title": "Ultime",
      "ability": "It's Jeff!",
      "key": "Q",
      "lead": "Tu plonges et avales tous les ennemis (et alliés) dans la zone, puis tu les recraches, idéalement hors de la carte.",
      "items": [
        "Les héros mobiles (**Invisible Woman, Doctor Strange, Wolverine, Psylocke**) peuvent revenir si tu les recraches mal : vise un angle franc.",
        "Attention à **ne pas sortir tes alliés** de la carte ou du point en prolongation.",
        "Un **Magneto** garde souvent son ult pour toi : force-la ou attends qu'elle soit utilisée.",
        "Lance-la **quand les supports adverses lancent leur ult** : tu en attraperas souvent un.",
        "En défense : **avale ton équipe** juste avant un combo d'ults adverse pour l'esquiver."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester derrière à **ne faire que soigner**.",
        "Tirer **sur les tanks**.",
        "Gaspiller toutes ses bulles et **ne plus pouvoir fuir**.",
        "Avaler **ses alliés** et les sortir du point.",
        "Ult **dans un Magneto** qui garde la sienne."
      ]
    }
  ],
  "counters": [
    {
      "hero": "captain-america",
      "note": "Il te suit partout et annule ton flanc."
    },
    {
      "hero": "star-lord",
      "note": "Mobile, il vide son chargeur sur ta grosse hitbox."
    },
    {
      "hero": "iron-man",
      "note": "Ses dégâts de zone te touchent toujours."
    },
    {
      "hero": "loki",
      "note": "Ses projectiles explosifs et ses runes te compliquent la vie."
    },
    {
      "hero": "magneto",
      "note": "Son ult te punit pendant la tienne."
    }
  ],
  "synergies": [
    {
      "hero": "captain-america",
      "note": "Ensemble vous fermez le cercle derrière l'ennemi."
    },
    {
      "hero": "venom",
      "note": "Autre tank de dive qui suit ta pression."
    },
    {
      "hero": "human-torch",
      "note": "Il bloque les supports, toi tu les empêches de fuir."
    },
    {
      "hero": "black-panther",
      "note": "Un plongeur qui finit les cibles que tu harcèles."
    },
    {
      "hero": "luna-snow",
      "note": "Elle soigne l'équipe pendant que tu flanques."
    }
  ],
  "sources": [
    {
      "title": "Jeff the Land Shark Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=bEtshLmrVyw"
    }
  ]
}$json$::jsonb
from public.heroes h where h.slug = 'jeff-the-land-shark'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- luna-snow
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Luna Snow est facile à prendre en main, mais ce qui distingue une vraie joueuse de Luna, c'est la vitesse à laquelle elle charge son ult et sa capacité à rester en vie. Son ult rend l'équipe presque immortelle pendant de longues secondes.",
  "tldr": [
    "Ta mission : **rester en vie et charger ton ult** plus vite que l'autre Luna.",
    "Glisse des **dégâts entre les fights** : casse les objets adverses, finis les cibles basses.",
    "Fais **tourner ta marque** sur l'allié qui va en avoir besoin."
  ],
  "difficulty": 1,
  "tags": [
    "Soins",
    "Charge d'ult",
    "Anti-ult",
    "Polyvalente"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Soigner ne suffit pas : les vraies Luna glissent des dégâts utiles et chargent leur ult à une vitesse folle.",
      "items": [
        "Entre deux fights, **poke l'ennemi** pour charger ton ult, mais sans t'exposer à un Hawkeye.",
        "Ne poke **plus une fois l'ult prête** : tu ne fais que charger celle des supports adverses.",
        "Tu as souvent la meilleure vue : **casse les ankhs de Moon Knight, les tourelles de Namor**.",
        "**Finis les cibles** que ton DPS a laissées à un fil, et repousse les flankers avant qu'ils engagent.",
        "Entraîne ta visée en **suivi de cible** (tracking)."
      ]
    },
    {
      "title": "Tir principal",
      "key": "Clic G",
      "lead": "Des rafales instantanées qui soignent les alliés et blessent les ennemis. La perte de dégâts à distance ne touche pas les soins.",
      "items": [
        "Soigner de loin n'est pas un problème : **reste en retrait** si besoin.",
        "Pour tuer un fragile, il faut **viser la tête**."
      ]
    },
    {
      "title": "Clap",
      "ability": "Ice Arts",
      "key": "Maj",
      "lead": "Pendant quelques secondes, tu lances des stalactites qui traversent alliés et ennemis, soignant les uns et blessant les autres. Tu te soignes aussi un peu.",
      "items": [
        "Aligne **un maximum de cibles** : c'est ta meilleure source de charge d'ult.",
        "Ne l'utilise pas **trop tôt** (personne n'en a besoin) ni **trop tard** (ton équipe meurt pendant l'animation).",
        "Moment idéal : tes tanks à **mi-vie**, ou ton équipe qui **engage**.",
        "Contre le dive, il peut **protéger ton autre support** tout en blessant le plongeur."
      ]
    },
    {
      "title": "Boule de neige",
      "ability": "Absolute Zero",
      "lead": "Un projectile qui gèle la cible quelques secondes. Tu peux tirer une rafale juste après sans la dégeler.",
      "items": [
        "Elle **coupe les ults à incantation** (Doctor Strange, Storm).",
        "Contre un plongeur, lance-la **juste avant qu'il fonce sur toi** en ligne droite.",
        "Elle peut aussi **créer un pick** : un Punisher en train de faire fondre tes tanks, gelé.",
        "Si un plongeur peut te sauter dessus après, **garde-la**.",
        "Beaucoup de Luna **l'oublient** : regarde le tableau des scores pour savoir sur qui la garder."
      ]
    },
    {
      "title": "Marque",
      "ability": "Share the Stage",
      "lead": "Une marque sur un allié qui augmente tes soins sur lui et le soigne quand tu soignes quelqu'un d'autre.",
      "items": [
        "Ne la laisse pas simplement sur ton DPS de flanc : **fais-la tourner**.",
        "Pose-la sur l'allié **qui s'apprête à agir** : ton Hulk qui saute sur un angle, puis ton DPS qui s'active.",
        "Sur un **tank agressif** (Hulk, The Thing, Captain America, Venom), elle charge beaucoup ton ult.",
        "Si ton DPS part loin tôt dans le fight, **marque-le avant**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Fate of Both Worlds",
      "key": "Q",
      "lead": "Une grosse zone de soin qui dure longtemps. Réappuie pour passer en aura de bonus de dégâts.",
      "items": [
        "**Annonce-le** en vocal : on perd facilement le compte de sa durée.",
        "Passe en **bonus de dégâts** pour une ult alliée clé (Venom, Namor) ou pour tuer vite une cible. Pendant ce temps, tu ne soignes plus.",
        "Tu **n'es pas invincible** : flèche de Hawkeye, ult de Magneto, ult de Punisher boostée peuvent te tuer.",
        "Les **boucliers et le décor** bloquent tes soins.",
        "Vérifie que ton ult est **vraiment nécessaire** : un bouclier de Strange ou des clones de Loki peuvent suffire.",
        "Ne l'utilise pas **pour engager** pendant que l'équipe marche : attends qu'elle soit en position.",
        "Règle perso de Paz : vers **100 PV avec l'ult prête**, lance-la."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Ne faire **que soigner** et charger son ult trop lentement.",
        "Oublier la **boule de neige**.",
        "Laisser la marque **sur le même allié** toute la partie.",
        "**Mourir avec l'ult** prête.",
        "Rester trop longtemps en **bonus de dégâts**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hela",
      "note": "Elle te punit si tu es mal placée."
    },
    {
      "hero": "star-lord",
      "note": "Il vole, esquive ta boule et force tes cooldowns."
    },
    {
      "hero": "black-panther",
      "note": "Il plonge après ta boule ratée."
    },
    {
      "hero": "magik",
      "note": "Même logique de plongée."
    },
    {
      "hero": "doctor-strange",
      "note": "Son bouclier peut bloquer tes soins d'ult."
    }
  ],
  "synergies": [
    {
      "hero": "loki",
      "note": "Il copie ton ult : de très longues secondes d'immortalité."
    },
    {
      "hero": "namor",
      "note": "Ton bonus de dégâts rend son ult mortelle."
    },
    {
      "hero": "venom",
      "note": "Même effet avec son ult."
    },
    {
      "hero": "jeff-the-land-shark",
      "note": "Il flanque pendant que tu tiens l'équipe."
    },
    {
      "hero": "iron-fist",
      "note": "Un plongeur que tes soins suivent facilement."
    }
  ],
  "sources": [
    {
      "title": "Luna Snow Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=jzICK22y7Is"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'luna-snow'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- magik
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Magik est une combattante de mêlée à combos, capable de plonger sur une cible isolée comme de brawler au centre. Ses portails la rendent intouchable, sa vie bonus la garde en vie, et son ult la transforme en version surpuissante d'elle-même.",
  "tldr": [
    "**Ne fonce pas** : attends que ton équipe puisse suivre avant de dasher.",
    "Apprends **un combo à la fois** en entraînement, puis enchaîne-les.",
    "Tes **portails sont ta survie** : garde-en toujours un pour sortir."
  ],
  "difficulty": 3,
  "tags": [
    "Mêlée",
    "Combos",
    "Plongée",
    "Vie bonus"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Selon ta compo, tu isoles une cible avec une bulle de ton Magneto, ou tu brawles au centre avec tes tanks.",
      "items": [
        "En **dive**, commence sur ton angle, combo une cible, puis **reviens vers ton équipe** récupérer tes cooldowns.",
        "En **brawl**, ton projectile traversant charge vite ton ult et réduit le temps de recharge de tes portails.",
        "Les Magik **patientes** tuent plus en faisant moins.",
        "Magik **teste l'ennemi** : s'il change de compo juste pour te contrer, tes alliés respirent."
      ]
    },
    {
      "title": "Épée et projectile",
      "ability": "Soul Sword · Magik Slash",
      "key": "Clic G · Clic D",
      "lead": "Des coups d'épée lents mais puissants, et un projectile chargé qui traverse les ennemis.",
      "items": [
        "L'épée perd des dégâts **en bout de portée** : frappe de près.",
        "Glisse un **coup de mêlée** après chaque coup d'épée.",
        "Chaque ennemi touché par le projectile **réduit le temps de recharge** de tes portails.",
        "Le projectile est **gros** : il se fait bloquer par les boucliers et le décor. Anticipe un peu à distance.",
        "Astuce : chargé mais pas tiré, il **reste disponible** après un portail."
      ]
    },
    {
      "title": "Portails",
      "ability": "Stepping Discs",
      "lead": "Deux charges de portail. Tu es invulnérable pendant le passage, et chaque portail débloque soit un tourbillon, soit un démon.",
      "items": [
        "Le **tourbillon** (Eldritch Whirl) fait des dégâts autour de toi : idéal en début de combo ou en brawl.",
        "Le **démon** (clic droit après un portail) frappe devant lui et empêche les ennemis de te poursuivre. Excellent contre la **tourelle du Punisher**.",
        "Ne gâche pas les deux charges **pour te rapprocher** : marche ou dash pour entrer, portail pour prolonger ou sortir."
      ]
    },
    {
      "title": "Dash",
      "ability": "Umbral Incursion",
      "key": "E",
      "lead": "Un dash rapide qui projette la cible et toi en l'air. C'est ton ouvreur de combo.",
      "items": [
        "Vise **à droite** de ta cible pour le rendre plus fiable.",
        "**Trop tôt**, ton équipe ne suit pas. **Trop tard**, elle a déjà perdu le 5 contre 6.",
        "Tu peux dasher **pendant le tourbillon** pour frapper tout le monde en chemin."
      ]
    },
    {
      "title": "Combos",
      "kind": "tips",
      "lead": "Du plus simple au plus fort. Apprends-les un par un, puis choisis selon la distance et la cible.",
      "items": [
        "**Simple** : projectile chargé, dash, coup d'épée. Évident, mais force les cooldowns. Ne dash jamais avant le projectile.",
        "**Avec portail** : projectile, portail, dash, épée. Plus imprévisible, et esquive une boule de neige.",
        "**Discret** : dash, épée, projectile non chargé, épée, coup de mêlée.",
        "**Au contact** : épée, mêlée, projectile, épée, puis dash pour finir.",
        "**Élimination** : portail, tourbillon, dash, épée, mêlée, projectile."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Darkchild",
      "key": "Q",
      "lead": "Tu deviens Darkchild : toutes tes capacités font beaucoup plus mal, tes portails reviennent bien plus vite et tes capacités sont réinitialisées à la sortie.",
      "items": [
        "Spamme le **tourbillon** : énormes dégâts de zone.",
        "Combo : **portail, tourbillon, dash**, plus un coup d'épée si besoin.",
        "**Projectile chargé puis dash** élimine un fragile, même à travers une ult de soin avec un bonus de dégâts.",
        "Tu restes **fragile** et deviens la cible prioritaire : n'en fais pas trop."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Dasher **avant** le projectile chargé.",
        "Brûler ses **deux portails** pour entrer.",
        "Oublier le **démon**.",
        "Engager **avant que l'équipe suive**.",
        "Plonger **jusque dans le spawn** adverse."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "En diamant, elle bloque tes entrées et sorties."
    },
    {
      "hero": "peni-parker",
      "note": "Tu n'as pas de moyen fiable de détruire ses nids."
    },
    {
      "hero": "the-thing",
      "note": "Son impact au sol coupe tes combos."
    },
    {
      "hero": "human-torch",
      "note": "Un volant rapide, dur à combo."
    },
    {
      "hero": "namor",
      "note": "Ses tourelles t'usent avant que tu engages."
    },
    {
      "hero": "winter-soldier",
      "note": "Avec son dash, ne t'approche pas."
    },
    {
      "hero": "loki",
      "note": "Ses runes : force-les avant ton combo."
    },
    {
      "hero": "ultron",
      "note": "Son drone casse tes seuils de kill."
    }
  ],
  "synergies": [
    {
      "hero": "doctor-strange",
      "note": "Un tank polyvalent qui suit ta flexibilité."
    },
    {
      "hero": "magneto",
      "note": "Sa bulle te laisse confirmer ton kill."
    },
    {
      "hero": "hela",
      "note": "Elle gère les menaces que tu ne peux pas atteindre."
    },
    {
      "hero": "phoenix",
      "note": "Même rôle de soutien à distance."
    },
    {
      "hero": "psylocke",
      "note": "Pression combinée sur la backline."
    },
    {
      "hero": "luna-snow",
      "note": "Son bonus de dégâts rend tes combos mortels."
    }
  ],
  "sources": [
    {
      "title": "Magik Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=4vilAy9tSwY"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'magik'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- magneto
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Magneto est probablement le tank le plus flexible du jeu : contre le dive, il protège sa backline avec ses bulles ; contre le brawl, il se bulle lui-même pour frapper fort. Son ult, l'une des plus décisives du jeu, sert surtout à punir les ults de support.",
  "tldr": [
    "**Ouvre le tableau des scores** entre chaque fight : c'est à toi de savoir qui bulle-r.",
    "Contre des plongeurs, ta bulle va **sur tes supports**. Sinon, **sur toi** pour plus de dégâts.",
    "Ton ult vise en priorité **les ults de support** adverses."
  ],
  "difficulty": 2,
  "tags": [
    "Bulles",
    "Bouclier",
    "Anti-ult",
    "Flexible"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Magneto s'adapte à tout, mais il faut savoir ce que les deux équipes jouent pour bien utiliser son kit.",
      "items": [
        "Joue **près des couverts** pour économiser ton bouclier.",
        "Poker au centre pour **charger ton ult** est souvent plus utile que chercher un kill.",
        "Ne compte pas sur tes supports pour **demander une bulle** : en ranked, c'est à toi de surveiller les plongeurs."
      ]
    },
    {
      "title": "Tir et canon",
      "ability": "Iron Volley · Mag-Cannon",
      "key": "Clic G · Clic D",
      "lead": "Un projectile qui explose à l'impact, et un canon qui se charge par paliers. Au dernier palier, il repousse fortement.",
      "items": [
        "Combo rapide : **tir, coup de mêlée, canon, coup de mêlée**. Mets la mêlée sur un bouton de souris.",
        "De loin, l'explosion est **plus large**, mais pas plus forte.",
        "Évite le canon au **premier palier**, trop faible.",
        "Le repoussement envoie un tank **dans son équipe** pour toucher plus d'ennemis, ou chasse un plongeur (Spider-Man, Iron Fist, **Wolverine**) de ta backline."
      ]
    },
    {
      "title": "Bulles",
      "ability": "Metallic Chaos",
      "key": "E · F",
      "lead": "E bulle un allié, F te bulle toi-même. Les deux partagent le même temps de recharge. Une bulle cassée remplit d'un coup ton canon.",
      "items": [
        "**Règle 1** : contre des plongeurs (Black Panther, Psylocke, Iron Fist, Spider-Man), garde la bulle pour **ta backline**.",
        "**Règle 2** : sinon, **bulle-toi** pour frapper plus fort et avancer.",
        "**Règle 3** : garde-la pour **les ults**, celles qui menacent tes supports (Magneto, Iron Man, Winter Soldier) comme celles de tes alliés (Iron Man, Punisher en ult).",
        "Tire au canon **pendant la bulle** : si elle casse, tu en as un autre prêt."
      ]
    },
    {
      "title": "Rideau magnétique",
      "ability": "Magnetic Curtain",
      "key": "Maj",
      "lead": "Un bouclier à énergie qui ne tient qu'un instant mais avale tout ce qui le touche, y compris des capacités et des ults.",
      "items": [
        "Il sert à bloquer un **gros burst** ou une **capacité précise** : dagues de Hela, vortex d'Invisible Woman, étourdissements.",
        "Face à une **ult de Punisher**, il le rend inoffensif le temps que ton équipe le tue.",
        "Il avale les ults d'**Iron Man** et des autres **Magneto**.",
        "Ce n'est pas un bouclier pour avancer longtemps : **anticipe** ce que tu veux bloquer."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Meteor M",
      "key": "Q",
      "lead": "Tu flottes et absorbes les projectiles ennemis autour de toi pendant quelques secondes, puis tu lances un météore dévastateur.",
      "items": [
        "Cible prioritaire : **les supports en ult**. Les éliminer suffit à porter les parties.",
        "Méfie-toi des **runes de Loki** et des **bulles de Magneto** adverses : force-les avant.",
        "Contre une **ult de Luna**, fais d'abord tomber son bouclier.",
        "Il **contre** les ults de Star-Lord, Punisher, Iron Man ou Ultron, mais parfois ton bouclier suffit et tu gardes l'ult pour plus tard.",
        "Les **rayons** passent à travers l'absorption.",
        "Contre Cloak & Dagger en ult, n'attends pas le dernier dash : **lance au troisième**."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Ne **jamais regarder** la compo adverse.",
        "Se bulle-r alors qu'un **plongeur** est sur ses supports.",
        "Tirer le canon **au premier palier**.",
        "Gâcher son ult sur une ult **déjà contrée** par autre chose.",
        "Lancer son ult dans des **runes** ou une **bulle**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Bloque ses cristaux, sinon elle te roule dessus."
    },
    {
      "hero": "groot",
      "note": "Ses murs te coupent de ton équipe."
    },
    {
      "hero": "loki",
      "note": "Ses runes annulent ton ult."
    },
    {
      "hero": "adam-warlock",
      "note": "Son lien d'âmes annule ton ult."
    }
  ],
  "synergies": [
    {
      "hero": "emma-frost",
      "note": "Le duo de tanks idéal."
    },
    {
      "hero": "magik",
      "note": "Ta bulle lui permet de confirmer ses kills."
    },
    {
      "hero": "star-lord",
      "note": "Bulle-le pour qu'il tourne au milieu de l'ennemi."
    },
    {
      "hero": "the-punisher",
      "note": "Protège-le pendant son ult."
    },
    {
      "hero": "luna-snow",
      "note": "La meilleure paire de supports derrière toi."
    },
    {
      "hero": "loki",
      "note": "Même chose."
    }
  ],
  "sources": [
    {
      "title": "Magneto Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=7qG9KH9UkNc"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'magneto'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- mantis
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Mantis est une DPS déguisée en support : ses tirs à la tête rechargent ses feuilles, qui servent à soigner ou à donner un bonus de dégâts. Elle porte en trouvant des kills et en gardant son bonus de dégâts actif en permanence sur les bonnes cibles.",
  "tldr": [
    "**Tire à la tête** : chaque tir réussi recharge une feuille.",
    "Garde le **bonus de dégâts actif** sur tes DPS qui s'engagent, puis sur toi.",
    "Lance ton ult **en premier** pour pousser, pas pour contrer."
  ],
  "difficulty": 2,
  "tags": [
    "Dégâts",
    "Bonus de dégâts",
    "Sommeil",
    "Angles"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Faire des dégâts, c'est soigner : un ennemi éliminé ne blesse plus personne. Si tu ne fais que soigner, prends un autre support.",
      "items": [
        "Prends des **angles** et mets la pression : ton efficacité dépend de tes tirs à la tête.",
        "Les tirs à la tête **sur les tanks** comptent aussi : de quoi recharger tes feuilles.",
        "**Gère tes ressources** : surveille en bas à droite qui a déjà tes soins et ton bonus.",
        "Elle brille en **triple support**, où elle joue presque comme un DPS."
      ]
    },
    {
      "title": "Tirs",
      "key": "Clic G",
      "lead": "Des projectiles rapides : deux tirs à la tête et un au corps éliminent un personnage fragile.",
      "items": [
        "Les tirs partent de ton personnage, pas de ton viseur : **de près, vise au-dessus à droite** de la tête.",
        "Ce sont des projectiles : **anticipe un peu** à distance plutôt que de te rapprocher.",
        "Entraîne la visée **par clics** (statique et dynamique)."
      ]
    },
    {
      "title": "Fleur de soin",
      "ability": "Healing Flower",
      "key": "Clic D",
      "lead": "Un soin immédiat suivi d'un soin sur la durée. Il ne soigne pas beaucoup, mais il continue même hors de vue.",
      "items": [
        "Donne-le à un **flanker qui va quitter ta vue** pour un duel, avec un bonus de dégâts.",
        "Priorité : **ton autre support**, puis tes DPS. Les tanks seulement si tu as des ressources en trop.",
        "Attends qu'un allié ait **perdu une partie de sa vie** pour ne pas gâcher la feuille.",
        "Astuce : baisse la **sensibilité de visée** des soins dans les paramètres si tu rates tes cibles."
      ]
    },
    {
      "title": "Bonus de dégâts",
      "ability": "Allied Inspiration · Natural Anger",
      "key": "E",
      "lead": "Un bonus de dégâts pour un allié (ou pour toi) qui dure longtemps. Il s'applique au moment du tir, pas à l'impact.",
      "items": [
        "C'est **la capacité la plus importante** : garde-le actif le plus possible.",
        "Booste les DPS **qui s'engagent** : un Star-Lord en duel, un Punisher qui arrose, une Storm.",
        "Il **accélère aussi la charge d'ult** : utile pour qu'un allié obtienne la sienne à temps.",
        "Booste **avant** l'ult d'un Namor, pas après.",
        "Ne relance pas sur un allié **déjà boosté** : attends la dernière seconde.",
        "Sur toi, il permet d'**éliminer une Luna** avec ton combo et te soigne un peu."
      ]
    },
    {
      "title": "Sommeil",
      "ability": "Spore Slumber",
      "lead": "Une bombe qui endort l'ennemi le plus proche de l'impact. Il se réveille s'il est touché.",
      "items": [
        "Contre des flankers (**Star-Lord, Psylocke, Black Panther, Spider-Man**), garde-le pour toi.",
        "Il **coupe les ults** à incantation : Doctor Strange, Scarlet Witch, Storm.",
        "Cible endormie : **maintiens le tir** pour placer deux projectiles d'un coup. Booste-toi avant.",
        "Toucher l'**illusion violette** derrière la cible la réveille aussi."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Soul Resurgence",
      "key": "Q",
      "lead": "Une zone qui soigne, donne de la vie bonus au-delà du maximum et accélère ton équipe.",
      "items": [
        "Utilise-la **pour pousser**, idéalement en première ult, puis laisse l'autre support contrer.",
        "Si tu es le **seul** support avec ult, garde-la pour ton équipe.",
        "Ne laisse pas ton équipe derrière : **avance avec elle**.",
        "Pendant l'ult, **ne soigne plus** : booste toute ton équipe et élimine l'ennemi.",
        "Les **boucliers** et le décor bloquent tes soins."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer Mantis **en simple soigneuse**.",
        "Relancer un bonus de dégâts **déjà actif**.",
        "Utiliser le sommeil **trop tôt** face à un flanker.",
        "Soigner **pendant sa propre ult**.",
        "Courir trop vite et **laisser son équipe** derrière."
      ]
    }
  ],
  "counters": [
    {
      "hero": "black-panther",
      "note": "Avec un tank qui plonge aussi, ton sommeil ne suffit plus."
    },
    {
      "hero": "venom",
      "note": "Même problème quand ils arrivent à deux."
    },
    {
      "hero": "the-thing",
      "note": "Les compos de brawl collé te privent d'angles."
    },
    {
      "hero": "magik",
      "note": "Même chose en double support."
    }
  ],
  "synergies": [
    {
      "hero": "black-widow",
      "note": "Ton bonus rend ses tirs à la tête mortels."
    },
    {
      "hero": "star-lord",
      "note": "Ton bonus rend son ult bien plus meurtrière."
    },
    {
      "hero": "venom",
      "note": "Un tank de dive qui profite de ton bonus."
    },
    {
      "hero": "captain-america",
      "note": "Même logique."
    },
    {
      "hero": "psylocke",
      "note": "Une plongeuse facile à soigner et à booster."
    },
    {
      "hero": "luna-snow",
      "note": "Elle soigne assez pour te laisser faire des dégâts."
    }
  ],
  "sources": [
    {
      "title": "Mantis Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=Fifg2W8-PO4"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'mantis'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- mister-fantastic
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Mister Fantastic est un brawler hybride, entre DPS et tank : il protège sa backline des plongeurs, puis gonfle pour écraser le front adverse. Tout l'art consiste à savoir quand avancer, quand protéger, et quand gonfler.",
  "tldr": [
    "Contre le **dive**, utilise tes capacités pour protéger tes supports : ça charge aussi ta forme gonflée.",
    "Contre un **brawl**, synchronise ta forme gonflée avec une ult alliée.",
    "Reste **à portée de poing**, pas collé à l'ennemi : ton allonge est ton avantage."
  ],
  "difficulty": 2,
  "tags": [
    "Brawl",
    "Peel",
    "Contrôle",
    "Hybride"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Il peut à la fois protéger sa backline et faire fondre le front adverse. Les meilleurs choisissent le bon rôle au bon moment.",
      "items": [
        "Contre des plongeurs, **force leurs cooldowns** en protégeant tes alliés, puis gonfle et avance au centre.",
        "Contre une compo serrée, **gonfle en même temps** qu'une ult alliée (Gambit…).",
        "Choisis **où te battre** : prends les couloirs et les passages étroits avant l'ennemi.",
        "Avant de gonfler, **vérifie que tes supports te suivent**."
      ]
    },
    {
      "title": "Forme gonflée",
      "ability": "Elastic Strength",
      "lead": "Tes coups, tes attractions et tes grappins remplissent une jauge. Pleine, tu gonfles : vie supplémentaire, coups plus rapides et plus forts, déplacement plus rapide.",
      "items": [
        "Cette vie supplémentaire **se soigne** : tu deviens un vrai tank temporaire.",
        "Tes coups gonflés **traversent les boucliers** : idéal pour atteindre la backline.",
        "La jauge **redescend** si tu n'agis pas : utilise l'attraction pour la maintenir.",
        "Pendant la forme gonflée, tu **ne peux pas protéger** tes alliés avec tes capacités."
      ]
    },
    {
      "title": "Coups allongés",
      "ability": "Stretch Punch",
      "key": "Clic G",
      "lead": "Des coups à longue portée qui touchent plusieurs ennemis si tu balaies ton viseur.",
      "items": [
        "Balaie dans la direction du bras pour **toucher tout un groupe**.",
        "Erreur courante : **coller l'ennemi** alors que tu as de l'allonge. Frappe depuis un couvert.",
        "C'est ta principale source de **charge** en début de fight."
      ]
    },
    {
      "title": "Agrippement",
      "ability": "Distended Grip",
      "key": "Clic D",
      "lead": "Un projectile lent qui agrippe une cible pour l'attirer vers toi ou la projeter contre un autre ennemi. La cible ne peut plus utiliser ses déplacements un instant.",
      "items": [
        "Le vrai intérêt : **bloquer la fuite** d'une cible. Agrippe Venom après ses boucliers, ou Gambit après son premier dash.",
        "Rapproche-toi : il est **lent et de courte portée**.",
        "Projeter deux ennemis l'un contre l'autre les **immobilise tous les deux**.",
        "Il peut aussi **éjecter** un ennemi du terrain."
      ]
    },
    {
      "title": "Élongation",
      "ability": "Flexible Elongation",
      "lead": "Tu t'étires vers un allié ou un ennemi proche et gagnes de la vie bonus. Sur un ennemi, tu le ralentis, et tu peux même faire tomber un volant.",
      "items": [
        "Après avoir agrippé une cible, **fonce dessus** pour la ralentir et confirmer le pick.",
        "Si tu rates un plongeur, **étire-toi vers ton support** pour lui donner de la vie bonus et le défendre.",
        "Proche de la jauge pleine, une élongation suffit à **gonfler en arrivant** sur la cible.",
        "Deux charges : **ne laisse jamais les deux** inutilisées."
      ]
    },
    {
      "title": "Forme réfrigérateur",
      "ability": "Reflexive Rubber",
      "lead": "Tu deviens invulnérable et absorbes les dégâts, puis tu en renvoies une partie en projectile. Tu es lent et sans capacités pendant ce temps.",
      "items": [
        "Tu peux **contester le point** en restant invulnérable.",
        "Utilise-la pour **survivre** ou pour **couvrir un allié** sur le point d'avoir son ult.",
        "Combine **élongation puis réfrigérateur** pour bloquer une ult (Magneto, Iron Man, Punisher) sur un support.",
        "Erreur : la lancer **trop tôt** alors qu'un couvert suffisait."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Brainiac Bounce",
      "key": "Q",
      "lead": "Tu gonfles instantanément et rebondis plusieurs fois. Chaque rebond qui touche fait plus mal et ralentit plus.",
      "items": [
        "Idéal **juste après** ta forme gonflée, pour récupérer la vie perdue et maintenir la pression.",
        "Utilise-la pour **protéger ta backline**, puis retourner le fight.",
        "Sous un **plafond bas**, les rebonds s'accélèrent.",
        "Elle peut **contrer une ult de Jeff** ou de Gambit avec ton équipe.",
        "Rater un rebond **coupe la série** : vise bien."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Gonfler alors que des **plongeurs** attaquent ta backline.",
        "Coller l'ennemi au lieu d'utiliser **ton allonge**.",
        "Agripper une cible **avant** qu'elle ait utilisé sa capacité.",
        "Forme réfrigérateur **trop tôt**.",
        "Engager sans que ses **supports suivent**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle charge son rayon sur toi."
    },
    {
      "hero": "groot",
      "note": "Son grand mur te bloque."
    },
    {
      "hero": "the-punisher",
      "note": "Il te fait fondre à distance."
    },
    {
      "hero": "moon-knight",
      "note": "Même problème avec ses dégâts à distance."
    },
    {
      "hero": "hela",
      "note": "Elle te force en réfrigérateur et te laisse sans options."
    },
    {
      "hero": "phoenix",
      "note": "Même chose."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Tu lui permets d'être beaucoup plus agressif."
    },
    {
      "hero": "the-thing",
      "note": "Il veut faire la même chose que toi : protéger et frapper."
    },
    {
      "hero": "winter-soldier",
      "note": "Tu lui crées l'espace pour faire des dégâts."
    },
    {
      "hero": "gambit",
      "note": "Son ult te laisse rouler sur l'équipe adverse."
    },
    {
      "hero": "invisible-woman",
      "note": "Elle t'aide à tenir pendant tes engagements."
    }
  ],
  "sources": [
    {
      "title": "Mister Fantastic Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=V4DFywKwdFk"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'mister-fantastic'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- moon-knight
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Moon Knight est une machine à dégâts : ses tirs ricochent entre les ennemis groupés et chargent son ult à une vitesse folle. Contre des équipes sans bouclier, il peut lancer une ult à presque chaque fight. En échange, il manque de mobilité.",
  "tldr": [
    "Vise les **groupes** : chaque ricochet charge ton ult.",
    "Ne tire **pas sur l'ankh** directement, tire sur les ennemis à côté.",
    "Prévois ton **placement avant le fight** : tu es lent, ta mobilité sert à fuir."
  ],
  "difficulty": 1,
  "tags": [
    "Dégâts de zone",
    "Ricochets",
    "Charge d'ult",
    "Combos d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Fais des dégâts, charge ton ult, élimine l'équipe adverse, recommence. Mais attention à ne pas nourrir les ults de soin adverses.",
      "items": [
        "Une fois ton ult prête, **ne spamme plus** des dégâts inutiles : tu charges les ults de support adverses.",
        "Avec ton ankh, tu gagnes **les duels** : prends un léger angle, puis reviens vers ton équipe.",
        "Reste à **bonne distance** de l'ennemi : ne sacrifie pas ton placement pour des tirs plus faciles.",
        "Comme un canon de verre, **choisis ton angle avant le fight** et utilise tes déplacements de base pour y aller."
      ]
    },
    {
      "title": "Fléchettes",
      "ability": "Crescent Dart",
      "key": "Clic G",
      "lead": "Des rafales de trois projectiles qui ricochent sur les ennemis proches les uns des autres, avec des dégâts réduits à chaque rebond.",
      "items": [
        "Les ennemis doivent être **assez proches** les uns des autres pour que les tirs rebondissent.",
        "Pour finir une cible isolée et basse, **vise-la directement** : le premier impact fait le plus mal.",
        "Même vitesse de projectile que **Storm et Namor** : tu peux transférer ta visée."
      ]
    },
    {
      "title": "Lame lunaire",
      "ability": "Moon Blade",
      "key": "Clic D",
      "lead": "Une grosse lame qui ricoche aussi et te donne de la vie bonus à chaque rebond. Tu en as deux charges.",
      "items": [
        "Ouvre un fight avec une lame pour la **vie bonus**, garde la seconde pour **finir**.",
        "De près, vise **au-dessus de la tête** pour un tir à la tête.",
        "Elle est un peu **plus lente** que tes fléchettes."
      ]
    },
    {
      "title": "Ankh",
      "ability": "Ancient Ankh",
      "lead": "Un ankh qui s'accroche au décor, attire les ennemis proches et sert de point de rebond pour tes tirs.",
      "items": [
        "L'attraction est **sa vraie force** : elle t'aide à gagner un duel contre un Star-Lord.",
        "Tirer sur l'ankh **te prive des dégâts du premier impact** : tire sur l'ennemi à côté.",
        "Il **ramène les ennemis** dans ton ult, même ceux qui fuient.",
        "Tu peux en avoir **deux** : pré-place-les sur les passages en défense."
      ]
    },
    {
      "title": "Combo",
      "kind": "tips",
      "lead": "Le seul combo dont tu as vraiment besoin pour éliminer un personnage fragile.",
      "items": [
        "**Ankh, une rafale au corps, lame lunaire**.",
        "Avec un tir à la tête dans la rafale, la cible tombe presque à coup sûr.",
        "Attention à **ne pas viser trop bas** et toucher l'ankh au lieu de la cible."
      ]
    },
    {
      "title": "Mobilité",
      "ability": "Night Glider · Moon Knight Hook",
      "key": "Maj · F",
      "lead": "Double saut, planeur et grappin. Le grappin est lent à lancer mais rapide une fois accroché.",
      "items": [
        "Le grappin est ton **outil de fuite** : ne l'utilise pas si un saut suffit.",
        "Le planeur sert à **passer d'une hauteur à l'autre**, pas à esquiver les tireurs.",
        "Astuce : vise **le côté d'un mur** au grappin, puis saute pour monter plus haut.",
        "Bien utilisé, le grappin **esquive une ult de Magneto**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Hand of Khonshu",
      "key": "Q",
      "lead": "Des mains explosives tombent du ciel en triangle autour de ta cible pendant plusieurs secondes.",
      "items": [
        "Le centre de la zone fait le plus mal : vise **un peu à droite, devant ou derrière** l'ennemi selon sa direction.",
        "Combos mortels avec l'**ult de Groot** ou celle d'**Angela**.",
        "Sans combo, **lance-la quand même** : elle revient très vite.",
        "Astuce : sortir l'ult (l'ankh au-dessus de ta tête) peut **pousser un support adverse à utiliser la sienne**. Ne le fais pas à chaque fois."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Tirer **sur l'ankh** au lieu des ennemis.",
        "Utiliser le **grappin pour se déplacer**.",
        "S'approcher trop pour **toucher plus facilement**.",
        "Spammer des dégâts **avec l'ult déjà prête**.",
        "Sortir l'ult **toujours de la même façon**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Son bouclier coupe tes ricochets et son ult avale la tienne."
    },
    {
      "hero": "doctor-strange",
      "note": "Même chose, en un peu moins fort."
    },
    {
      "hero": "captain-america",
      "note": "Il te colle et tu ne peux pas fuir."
    },
    {
      "hero": "iron-man",
      "note": "Les volants ne te laissent pas ricocher."
    },
    {
      "hero": "psylocke",
      "note": "Elle esquive ton ankh et punit ton manque de mobilité."
    },
    {
      "hero": "ultron",
      "note": "Un autre volant difficile à toucher."
    }
  ],
  "synergies": [
    {
      "hero": "groot",
      "note": "Son ult regroupe tout le monde pour la tienne."
    },
    {
      "hero": "angela",
      "note": "Même combo d'ult, moins fort en neutre."
    },
    {
      "hero": "magneto",
      "note": "Il te protège pour que tu tires plus longtemps."
    },
    {
      "hero": "hela",
      "note": "Elle s'occupe des volants à ta place."
    },
    {
      "hero": "mantis",
      "note": "Son bonus de dégâts te fait charger ton ult encore plus vite."
    },
    {
      "hero": "luna-snow",
      "note": "Toujours un bon choix."
    }
  ],
  "sources": [
    {
      "title": "Moon Knight Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=yHH6KBvciPg"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'moon-knight'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- namor
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Namor est un DPS à tourelles : il protège sa backline des plongeurs, puis devient une menace sur les angles décalés grâce à ses combos tridents et tourelles. Sans ses tourelles bien placées, il ne sert à rien.",
  "tldr": [
    "D'abord **repérer et gérer les plongeurs**, ensuite seulement prendre un angle.",
    "Pose **une tourelle avant de poker** : tes tridents rechargent tes tourelles.",
    "Ton trident secondaire n'a pas besoin de toucher : **vise les pieds**."
  ],
  "difficulty": 1,
  "tags": [
    "Tourelles",
    "Anti-dive",
    "Angles décalés",
    "Combos d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Procède par étapes : y a-t-il un flanker dans ta backline ? Si oui, gère-le. Sinon, prends un angle agressif.",
      "items": [
        "Contre des plongeurs (**Black Panther, Magik, Psylocke**), garde tes tourelles pour eux.",
        "Une fois la menace gérée, prends un **angle décalé** pour attaquer les supports.",
        "N'engage pas **tes deux tourelles** si tu n'es pas sûr du kill.",
        "Tes **pas sont bruyants** : les bons joueurs t'entendront arriver en flanc."
      ]
    },
    {
      "title": "Tridents",
      "ability": "Trident of Neptune · Wrath of the Seven Seas",
      "key": "Clic G · Clic D",
      "lead": "Des tridents qui tuent en deux tirs à la tête, et un trident explosif qui déclenche une attaque renforcée de toutes tes tourelles.",
      "items": [
        "Joue à **mi-distance**, pas besoin de coller.",
        "Chaque trident qui touche **réduit le temps de recharge** de tes tourelles. Un tir à la tête les rend **frénétiques**.",
        "Le trident explosif a une **zone d'impact** : vise les pieds, même raté il déclenche tes tourelles.",
        "Combo : **tir à la tête puis trident explosif**, en annulant l'animation du premier, avec tes tourelles posées."
      ]
    },
    {
      "title": "Tourelles",
      "ability": "Aquatic Dominion",
      "key": "E",
      "lead": "Des petites tourelles qui s'accrochent au décor et verrouillent la première cible visible. Deux maximum à la fois.",
      "items": [
        "**Poker** : pose-les sur des angles difficiles d'accès en début de fight.",
        "**Repérer le dive** : une tourelle sur un flanc courant révèle le plongeur avant qu'il engage.",
        "**Attaquer** : lance-les sur un mur juste avant de te montrer, pour qu'elles tirent en même temps que toi.",
        "Ne les place pas **trop loin** : elles verrouillent la mauvaise cible et laissent tes supports seuls."
      ]
    },
    {
      "title": "Bulle",
      "ability": "Blessing of the Deep",
      "lead": "Tu montes dans une bulle invulnérable et insensible aux contrôles, avec un long temps de recharge.",
      "items": [
        "Les bons joueurs vont **chercher à la forcer** avant leur ult.",
        "Ne l'utilise pas **juste pour monter** en hauteur, sauf si personne ne peut te punir.",
        "Tes **tourelles tirent** pendant que tu es dans la bulle.",
        "Astuce : elle peut **esquiver une ult de Magneto**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Horn of Proteus",
      "key": "Q",
      "lead": "Une baleine géante s'écrase dans une zone. Les ennemis dedans ne peuvent plus utiliser leurs capacités de déplacement.",
      "items": [
        "Le **cercle central** fait énormément de dégâts. Avec un bonus de dégâts, le cercle extérieur tue aussi les fragiles.",
        "Avec l'**ult de Groot**, aucune ult de soin ne sauve l'ennemi : lance vite après lui.",
        "Elle **bloque les déplacements** : portails de Magik, patinage de Luna, intangibilité de Cloak…",
        "Elle coupe l'ult de **Cloak & Dagger** à la fin du quatrième dash.",
        "Elle se charge vite : **utilise-la souvent**."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Partir en flanc alors qu'un **plongeur** menace ta backline.",
        "Placer ses tourelles **trop loin** ou à découvert.",
        "Chercher à **toucher** le trident explosif au lieu de viser les pieds.",
        "Gâcher sa **bulle** pour un déplacement.",
        "Poser **deux tourelles** sans être sûr du kill."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle garde sa charge en tapant tes tourelles."
    },
    {
      "hero": "hela",
      "note": "Elle te domine à distance et casse tes tourelles."
    },
    {
      "hero": "luna-snow",
      "note": "Elle détruit tes tourelles en deux rafales."
    },
    {
      "hero": "magneto",
      "note": "Les compos à bouclier qui jouent au centre t'obligent à flanquer."
    }
  ],
  "synergies": [
    {
      "hero": "hulk",
      "note": "Ses bulles et tes tourelles rendent la plongée adverse impossible."
    },
    {
      "hero": "groot",
      "note": "Le combo d'ult parfait."
    },
    {
      "hero": "winter-soldier",
      "note": "Il ramène des cibles dans la portée de tes tourelles."
    },
    {
      "hero": "luna-snow",
      "note": "Son bonus de dégâts rend ton ult mortelle."
    },
    {
      "hero": "mantis",
      "note": "Même chose : booste au lancement."
    }
  ],
  "sources": [
    {
      "title": "Namor Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=FPPs-i1ee-g"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'namor'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- peni-parker
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Peni Parker contrôle le terrain avec ses nids, ses toiles et ses mines. Elle protège ses supports des plongeurs en défense, et peut aussi s'installer sur un angle agressif pour aider un DPS à trouver des kills. C'est d'abord un contre, ensuite un soutien.",
  "tldr": [
    "**Adapte tes nids** : en backline contre le dive, près du front contre le brawl, sur un angle en attaque.",
    "Garde **toujours une mine** en rechargement et pose-les par groupes.",
    "Ton snare peut **couper une ult** en pleine incantation."
  ],
  "difficulty": 2,
  "tags": [
    "Contrôle de zone",
    "Anti-dive",
    "Pièges",
    "Défense"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "En défense comme en attaque, ton rôle est de donner à tes supports et DPS les positions dont ils ont besoin.",
      "items": [
        "En **défense**, sois le gardien de ta backline : attends les flankers et fais-leur perdre leur temps.",
        "En **attaque**, pose un nid sur un angle décalé : l'ennemi doit envoyer deux joueurs pour te déloger, et ton équipe gagne au centre.",
        "Quand l'ennemi recule, **avance** et pose un nid sur sa position pour lui retirer ses coins sûrs.",
        "Ton seul abri face aux gros DPS est ton **grappin** : maîtrise-le."
      ]
    },
    {
      "title": "Tir et snare",
      "ability": "Cyber-Web Cluster · Cyber-Web Snare",
      "key": "Clic G · Clic D",
      "lead": "Des projectiles explosifs sans rechargement, et une toile lente qui étourdit si elle touche, ou laisse une toile au sol si elle rate.",
      "items": [
        "Vise **les pieds** pour plus de régularité, ou la tête si tu as confiance en ta visée.",
        "Le snare **coupe une incantation** : ult de Doctor Strange, d'Iron Man ou de Scarlet Witch.",
        "Les **toiles au sol** soignent, donnent de la vie bonus et de la vitesse à toi et tes alliés.",
        "Tu ne peux avoir que **trois toiles** à la fois : surveille le compteur en bas à gauche."
      ]
    },
    {
      "title": "Grappin",
      "ability": "Cyber-Bond",
      "lead": "Tu te tires vers le décor et restes attachée. Relâche ton déplacement pour revenir en fronde vers le point d'accroche.",
      "items": [
        "Sers-t'en pour **mettre la pression** sur la backline puis revenir vers ton équipe.",
        "Détache-toi pour **traverser la carte** : pose un nid, grappin, récupère le nid, recommence.",
        "Astuce : baisse la **sensibilité de ciblage** dans les paramètres pour garder le contrôle."
      ]
    },
    {
      "title": "Mines",
      "ability": "Arachno-Mine",
      "lead": "Des mines qui explosent quand un ennemi passe. Posées dans une toile, elles deviennent invisibles.",
      "items": [
        "Pose-les **par trois ou quatre** pour éliminer un personnage fragile.",
        "Contre une **Hela**, mine ses hauteurs habituelles. Contre un **Black Panther**, mine ta backline.",
        "Mine **les couverts derrière ton équipe** pour couper l'ult de Cloak & Dagger.",
        "En attaque, **lance-les sur les supports** quand ton équipe les presse."
      ]
    },
    {
      "title": "Nid d'araignées",
      "ability": "Bionic Spider-Nest",
      "lead": "Un nid qui crée une grande toile et envoie des araignées qui blessent et ralentissent. Tu peux le récupérer à tout moment.",
      "items": [
        "Contre le **dive**, en backline. Contre le **brawl**, près du front pour accélérer ton équipe.",
        "Place-le **derrière un coin** : l'ennemi doit s'exposer pour le casser.",
        "Un nid intact **revient tout de suite** : utilise-le pour te déplacer.",
        "Face à une ult (Gambit), **récupère un nid avancé** et repose-le derrière ton équipe.",
        "Prolonge sa toile avec tes **snares**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Spider-Sweeper",
      "key": "Q",
      "lead": "Tu gagnes beaucoup de vie bonus et de vitesse, des coups qui projettent, des mines à lancer et des araignées en continu.",
      "items": [
        "Ne **commence pas** le fight avec : tu deviens la cible prioritaire.",
        "En plein fight, elle **étend tes toiles sur le point** pour toute l'équipe.",
        "Avance **avec ton équipe**, pas seule par une fenêtre.",
        "Si l'ennemi a une ult à couper (Doctor Strange, Iron Man), **garde ton snare** avant de lancer la tienne."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**Oublier ses mines** pendant tout le fight.",
        "Placer son nid **à découvert**.",
        "Lancer l'ult **en ouverture** du fight.",
        "Rester attachée au grappin **au milieu des ennemis**.",
        "Garder un nid **au même endroit** alors que la menace a changé."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle charge sur toi et casse tes nids."
    },
    {
      "hero": "groot",
      "note": "Un mur sur ton nid le détruit."
    },
    {
      "hero": "the-punisher",
      "note": "Ses dégâts continus te dévorent."
    },
    {
      "hero": "moon-knight",
      "note": "Même chose, ta grosse hitbox est facile à toucher."
    },
    {
      "hero": "phoenix",
      "note": "Elle te farme et son ult détruit tout."
    },
    {
      "hero": "ultron",
      "note": "Il casse tes nids depuis les airs."
    }
  ],
  "synergies": [
    {
      "hero": "rocket-raccoon",
      "note": "Un support qui joue la défense de zone avec toi."
    },
    {
      "hero": "doctor-strange",
      "note": "Son bouclier gère les DPS qui te contrent."
    },
    {
      "hero": "magneto",
      "note": "Même chose."
    },
    {
      "hero": "hela",
      "note": "Un nid sur son angle la protège des plongeurs."
    },
    {
      "hero": "the-punisher",
      "note": "Même logique."
    }
  ],
  "sources": [
    {
      "title": "Peni Parker Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=fHwTq8w2FVU"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'peni-parker'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- phoenix
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Phoenix est une tireuse instantanée qui marque les ennemis et déclenche des réactions en chaîne d'explosions. Contrairement à Hela, elle ne gagne pas à longue distance : elle brille en brawl et en dive, quand les ennemis sont groupés.",
  "tldr": [
    "Commence **au centre** pour poser des marques, puis vole vers un angle en plein fight.",
    "Reste **à mi-distance** : ses dégâts chutent fortement de loin.",
    "Avant ton ult, pose **deux marques** sur les fragiles : l'impact les achève."
  ],
  "difficulty": 2,
  "tags": [
    "Hitscan",
    "Marques",
    "Brawl",
    "Anti-bouclier"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Phoenix demande un peu plus de réflexion qu'un tireur classique : ses dégâts viennent des explosions en chaîne sur des ennemis groupés.",
      "items": [
        "Avec des tanks de brawl (**Magneto, The Thing**), joue au centre, lance des chaînes, puis vole vers un angle décalé.",
        "Avec des tanks de dive (**Captain America**), guette le moment où les supports adverses se regroupent avec leur front et fais-les exploser.",
        "Contre **Hela** à longue distance, tu perds le duel : force-la à se battre de près.",
        "Charge ton ult **avec tes tanks** au début : pas besoin d'angle fou tout de suite."
      ]
    },
    {
      "title": "Flammes et marques",
      "ability": "Cosmic Flames",
      "key": "Clic G",
      "lead": "Des tirs instantanés qui posent des marques. À trois marques, la cible explose et marque les ennemis autour d'elle.",
      "items": [
        "Un tir à la tête pose **deux marques** d'un coup.",
        "Chaîne type : **corps sur A, tête sur B, tête sur A**, et tout explose.",
        "Les marques **disparaissent** au bout de quelques secondes.",
        "Chaque explosion te **soigne** un peu sur la durée.",
        "Les **clones de Loki** permettent des chaînes faciles."
      ]
    },
    {
      "title": "Dash",
      "ability": "Telepathic Illusion",
      "lead": "Un dash qui laisse une illusion explosive derrière toi. Tu es insensible aux dégâts pendant le mouvement.",
      "items": [
        "Combo : **tir, coup de mêlée, dash** pour annuler l'animation. Ajoute ton explosion en ouverture pour presque tuer un fragile.",
        "Il **esquive** les ults d'Iron Man ou de Magneto.",
        "Dash dans tous les sens : l'ennemi croit que **tu te téléportes**.",
        "Ne l'utilise **jamais pour monter** en hauteur : c'est le rôle du vol."
      ]
    },
    {
      "title": "Vol",
      "ability": "Dark Ascent",
      "lead": "Quelques secondes de vol rapide qui rechargent aussi tes munitions. Très bruyant.",
      "items": [
        "Sers-t'en pour **passer sur un angle** en plein fight, après avoir lancé tes chaînes au centre.",
        "Tirer ou utiliser une capacité **coupe le vol** : attention au-dessus du vide.",
        "On t'entend arriver : ne t'**isole pas**, une Psylocke te guette."
      ]
    },
    {
      "title": "Explosion télékinétique",
      "ability": "Telekinesis Burst",
      "key": "Clic D",
      "lead": "Trois explosions en ligne. La première étourdit brièvement, les deux suivantes ralentissent. Toutes posent une marque.",
      "items": [
        "L'étourdissement **coupe les ults** de Doctor Strange ou de Scarlet Witch (anticipe l'animation).",
        "Contre un **plongeur**, lance-la à tes pieds : il se fait étourdir ou ralentir en arrivant.",
        "Combinée à un coup de **Winter Soldier**, elle prolonge le contrôle de sa cible."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Endsong Inferno",
      "key": "Q",
      "lead": "Tu t'élèves puis t'écrases sur une zone, puis une onde de choc détruit boucliers, invocations et vie bonus adverses, même à travers les murs.",
      "items": [
        "Deux marques sur une cible fragile, et **l'impact l'achève**.",
        "L'onde de choc **casse** les boucliers de Strange et Magneto, la vie bonus de Venom, les clones de Loki, l'ult de Rocket.",
        "Avec un **bonus de dégâts** (Luna, Rocket, Cloak & Dagger), vise **la zone d'impact**, pas ton point de départ.",
        "Tu sors de l'ult avec ta vie d'avant : ne la lance pas **trop près du front**, où l'ennemi peut te piéger.",
        "Ta forme en l'air peut **être abattue** : contre une équipe prête, écrase-toi derrière un mur pour l'onde de choc seule.",
        "**The Thing** peut sauter pour l'intercepter."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer comme une **Hela** à longue distance.",
        "Gâcher le dash **pour monter** en hauteur.",
        "Voler et **s'isoler** bruyamment.",
        "Ult **trop près du front** adverse.",
        "Laisser les marques **expirer** sans les faire exploser."
      ]
    }
  ],
  "counters": [
    {
      "hero": "captain-america",
      "note": "Petite cible, rarement collé à son équipe : tes marques ne prennent pas."
    },
    {
      "hero": "hela",
      "note": "Elle te bat à distance."
    },
    {
      "hero": "psylocke",
      "note": "Elle force ta mobilité et te saute dessus après ton vol."
    },
    {
      "hero": "winter-soldier",
      "note": "Trop de vie pour être brûlé vite."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Ses soins et packs cassent tes combos."
    },
    {
      "hero": "the-thing",
      "note": "Il peut intercepter ton ult."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un brawl au centre où tu poses tes marques."
    },
    {
      "hero": "black-panther",
      "note": "Les supports qu'il plonge se regroupent : tu les fais exploser."
    },
    {
      "hero": "captain-america",
      "note": "Même logique de dive."
    },
    {
      "hero": "winter-soldier",
      "note": "Tu prolonges le contrôle de sa cible."
    },
    {
      "hero": "wolverine",
      "note": "Un brawler qui profite de tes explosions."
    },
    {
      "hero": "invisible-woman",
      "note": "Elle regroupe les ennemis et te protège sur ton angle."
    }
  ],
  "sources": [
    {
      "title": "Phoenix Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=OoQyu_WzbBY"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'phoenix'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- psylocke
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Psylocke est une assassine de flanc : elle évite le couloir principal, s'approche invisible d'une cible isolée, l'élimine d'un combo, puis repart vers son équipe. Ses tirs réduisent le temps de recharge de toutes ses capacités.",
  "tldr": [
    "Prends **un flanc à l'écart** du centre et isole les cibles en duel.",
    "Active ton **invisibilité à la bonne distance** pour arriver pile à portée.",
    "**Farme les tanks** entre deux plongées pour récupérer tes capacités."
  ],
  "difficulty": 3,
  "tags": [
    "Assassin",
    "Invisibilité",
    "Combos",
    "Flanc"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Patience, timing et confiance : force les bonnes cibles au bon moment, puis exécute.",
      "items": [
        "Cycle de base : **plonge par derrière, combo un fragile, dash vers ton équipe**, puis recommence.",
        "La visée compte, mais c'est surtout ton **approche** : si la cible ne te voit pas, tu touches tout.",
        "Excellente contre les **tireurs oppressants** (Hela, Hawkeye) : rejoins-les invisible.",
        "N'engage pas **hors de ta portée efficace**, même si tu meurs d'envie."
      ]
    },
    {
      "title": "Arbalète",
      "ability": "Psionic Crossbow",
      "key": "Clic G",
      "lead": "Des rafales instantanées en triangle autour de ton viseur. Chaque projectile qui touche réduit le temps de recharge de toutes tes capacités.",
      "items": [
        "Au-delà de la mi-distance, la dispersion rend **la tête inutile** : approche-toi.",
        "En difficulté, **tire sur un tank**, même de loin, pour récupérer ton dash.",
        "Un **coup de mêlée** en fin de rechargement raccourcit l'animation."
      ]
    },
    {
      "title": "Shurikens",
      "ability": "Wing Shurikens",
      "key": "Clic D",
      "lead": "Cinq shurikens lancés en carré, puis rappelés vers toi. Ils te donnent un peu de vie bonus.",
      "items": [
        "Pas de dégâts à la tête : vise **le torse**.",
        "Au rappel, ils passent par **l'endroit que tu vises** avant de revenir.",
        "Combo : **tir, shurikens, rappel, deux tirs** pour éliminer un fragile.",
        "Variante : **tir, shurikens, dash à travers la cible** (le dash rappelle les shurikens)."
      ]
    },
    {
      "title": "Dash",
      "ability": "Psi-Blade Dash",
      "lead": "Deux charges de dash qui blessent les ennemis traversés. Une pour entrer, une pour sortir.",
      "items": [
        "Vise **le sol en angle** pour raccourcir le dash et finir face à ta cible, sans te retourner.",
        "Garde **toujours un dash** pour fuir.",
        "Tes tirs **réduisent** le temps de recharge du dash déjà utilisé."
      ]
    },
    {
      "title": "Invisibilité",
      "ability": "Psychic Stealth",
      "lead": "Quelques secondes d'invisibilité et de vitesse. Le début et la fin sont bruyants.",
      "items": [
        "**Cacher ton flanc** : traverse le centre invisible pour que l'ennemi ne sache pas d'où tu viens.",
        "**Engager** : ni trop tôt (tu réapparais avant d'arriver), ni trop tard (on t'a déjà vue).",
        "**Fuir** : dash derrière un mur, puis invisibilité. L'ennemi perd toute info sur toi.",
        "L'utiliser **sous les yeux de l'ennemi** ne sert à rien.",
        "Tu peux **recharger** et ramasser des packs de soin en étant invisible."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Dance of the Butterfly",
      "key": "Q",
      "lead": "Tu tranches les ennemis autour de toi pendant quelques secondes, en priorité ceux qui ont été le moins touchés.",
      "items": [
        "Vise **un ou deux ennemis isolés**, pas le centre de l'équipe : ils se répartissent les coups.",
        "Les **clones de Loki** absorbent les coups, et un ennemi invisible ne peut pas être ciblé.",
        "**Force d'abord** les ults de support et les cooldowns défensifs.",
        "Après l'ult, tu ne peux **pas dasher tout de suite** : finis-la près d'une sortie.",
        "Sers-t'en pour **charger** quand deux ults de support s'affrontent, puis frappe après."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer **au centre** comme un DPS classique.",
        "Activer l'invisibilité **trop tôt ou devant l'ennemi**.",
        "Utiliser **les deux dashes** pour entrer.",
        "Ult **au milieu** de toute l'équipe adverse.",
        "Dasher **à travers** la cible et perdre son angle."
      ]
    }
  ],
  "counters": [
    {
      "hero": "peni-parker",
      "note": "Ses nids te révèlent et bloquent ton flanc."
    },
    {
      "hero": "hulk",
      "note": "Ses bulles bloquent ton ult."
    },
    {
      "hero": "namor",
      "note": "Ses tourelles te repèrent."
    },
    {
      "hero": "star-lord",
      "note": "Il te marque et te force à sortir de l'invisibilité."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Ses packs d'armure cassent tes seuils de kill."
    },
    {
      "hero": "loki",
      "note": "Ses clones annulent ton ult."
    }
  ],
  "synergies": [
    {
      "hero": "captain-america",
      "note": "Il plonge par l'autre côté pendant que tu arrives."
    },
    {
      "hero": "venom",
      "note": "Même idée."
    },
    {
      "hero": "emma-frost",
      "note": "Elle tient le front pendant tes flancs."
    },
    {
      "hero": "jeff-the-land-shark",
      "note": "Il attire l'attention et affaiblit tes cibles."
    },
    {
      "hero": "luna-snow",
      "note": "Elle te permet d'aller plus loin en flanc."
    }
  ],
  "sources": [
    {
      "title": "Psylocke Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=Vsua14VUmGg"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'psylocke'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- rocket-raccoon
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Rocket Raccoon est un support de soins de zone qui fait rebondir ses orbes sur le décor, ressuscite ses alliés avec sa balise et donne un gros bonus de dégâts avec son ult. Sa survie repose entièrement sur sa mobilité.",
  "tldr": [
    "**Rester en vie et charger ton ult** : le reste vient après.",
    "Place ta **balise de résurrection à l'abri** et déplace-la si un plongeur s'en approche.",
    "Pose ton ult **derrière un coin** où l'ennemi doit s'exposer pour la casser."
  ],
  "difficulty": 1,
  "tags": [
    "Soins de zone",
    "Résurrection",
    "Mobilité",
    "Bonus de dégâts"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Comme tous les supports, Rocket gagne en chargeant son ult plus vite que l'adversaire, sans mourir.",
      "items": [
        "**Avant le fight**, glisse des dégâts pour charger ton ult.",
        "**Pendant le fight**, concentre-toi sur les soins et la survie.",
        "Ne garde pas tes dashes de côté pour rien, mais **ne les gaspille pas** avant que les plongeurs arrivent."
      ]
    },
    {
      "title": "Orbes de soin",
      "key": "Clic D",
      "lead": "Des orbes qui soignent en passant près des alliés et en les touchant directement. Ils rebondissent sur les murs et restent un moment sur place.",
      "items": [
        "Fais **rebondir les orbes** sur le sol et les murs pour toucher plusieurs alliés.",
        "Vise **les pieds** de tes alliés.",
        "Les orbes **ralentissent près des alliés** : les soins collent mieux.",
        "Ne vide pas ton chargeur **juste avant que ton équipe engage**."
      ]
    },
    {
      "title": "Tir laser",
      "key": "Clic G",
      "lead": "Une rafale rapide qui fait beaucoup de dégâts de près, mais perd vite en puissance avec la distance.",
      "items": [
        "Sers-t'en pour **casser les objets** adverses (tourelles de Namor, ults posées).",
        "Si deux Rocket lancent leur ult en même temps, **casse la sienne** en premier.",
        "Pendant une **ult de support alliée**, tu peux passer aux dégâts."
      ]
    },
    {
      "title": "Balise de résurrection",
      "ability": "Battle Rebirth Beacon",
      "lead": "Une balise qui distribue des packs d'armure et de super-saut, et ressuscite un allié tombé à portée.",
      "items": [
        "Place-la **à l'abri**, tout en restant à portée du fight.",
        "Récupérée intacte, elle **revient vite**. Cassée, elle met très longtemps.",
        "Contre des flankers (**Captain America, Iron Fist**), surveille-la et **déplace-la** avant qu'ils la cassent.",
        "Pose-la **avant** que tes alliés soient en danger : un petit recul, la balise, puis retour aux soins."
      ]
    },
    {
      "title": "Jetpack et murs",
      "ability": "Jetpack Dash · Wild Crawl",
      "key": "Maj",
      "lead": "Deux charges de dash, la course sur les murs et un vol plané. Ta survie dépend de comment tu bouges.",
      "items": [
        "Contre **Hela, Hawkeye, Black Widow** : dash derrière un couvert.",
        "Contre **Iron Fist, Spider-Man, Venom** : dash vers ton équipe pour qu'elle s'occupe du plongeur.",
        "Contre **The Thing, Emma Frost** : dash à l'opposé pour les forcer à te poursuivre.",
        "Accroche-toi à un mur puis **dash vers le haut** : tu disparais de l'écran adverse.",
        "Passe **d'un couvert à l'autre** pour que Hela ne puisse pas forcer tes dashes."
      ]
    },
    {
      "title": "Ultime",
      "ability": "C.Y.A.",
      "key": "Q",
      "lead": "Un amplificateur posé au sol qui donne bonus de dégâts et vie bonus à tous les alliés en vue. Il peut être détruit.",
      "items": [
        "Place-le **derrière un coin** : l'ennemi doit s'exposer pour le casser.",
        "Le bonus dépend de la **ligne de vue** : ne le cache pas complètement si tu comptes avancer.",
        "Ne l'utilise pas **trop tôt** : l'ennemi n'a qu'à reculer.",
        "C'est une ult de **retournement** : quand l'ennemi pousse en croyant gagner, pose-la et renverse le fight.",
        "Pour contrer une grosse ult de DPS, l'**autre support** est souvent mieux placé."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Gaspiller **ses dashes** avant que les plongeurs arrivent.",
        "Laisser la balise **se faire casser** au lieu de la déplacer.",
        "Poser l'ult **à découvert** ou trop tôt.",
        "Tirer au laser **en plein fight** au lieu de soigner.",
        "Vider son chargeur **juste avant l'engagement**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "captain-america",
      "note": "Il te colle et trouve ta balise."
    },
    {
      "hero": "venom",
      "note": "Même chose avec ses plongées."
    },
    {
      "hero": "iron-fist",
      "note": "Une fois sur toi, c'est fini sans aide."
    },
    {
      "hero": "hela",
      "note": "Elle force tes dashes de loin."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Une compo groupée où tes soins de zone brillent."
    },
    {
      "hero": "emma-frost",
      "note": "Même logique."
    },
    {
      "hero": "groot",
      "note": "Ses murs font rebondir tes orbes."
    },
    {
      "hero": "the-punisher",
      "note": "Ton ult booste ses dégâts constants."
    },
    {
      "hero": "winter-soldier",
      "note": "Un brawler qui profite de tes soins."
    },
    {
      "hero": "luna-snow",
      "note": "Un duo de supports solide."
    }
  ],
  "sources": [
    {
      "title": "Rocket Raccoon Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=CGw4ZlAMAF4"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'rocket-raccoon'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- rogue
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Rogue est un tank exigeant, basé sur les combos : elle bloque les dégâts, projette et regroupe les ennemis, et absorbe les capacités de ses adversaires. Son ult empêche l'ennemi de lancer ses propres ults.",
  "tldr": [
    "**Utilise les couverts** pour arriver au contact avec un maximum de vie.",
    "Le coup de pied doit **toucher** pour garantir ton absorption, qui coûte cher si tu la rates.",
    "Lance ton ult **en premier**, jamais après deux ults adverses."
  ],
  "difficulty": 3,
  "tags": [
    "Combos",
    "Absorption",
    "Contrôle",
    "Anti-ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Rogue demande de l'initiative et de l'efficacité. Ton plan change selon la force de ton front.",
      "items": [
        "Avec un **front plus fort** que l'adversaire, avance au centre et écrase-le.",
        "Avec un **front plus faible**, verrouille un **couloir latéral** pour offrir de bons angles à tes DPS.",
        "Sans cooldowns disponibles, **ne t'engage pas à fond**.",
        "Ne bloque pas tout : certains dégâts peuvent être encaissés et **chargent l'ult** de tes supports."
      ]
    },
    {
      "title": "Garde et ruée",
      "ability": "Southern Brawl",
      "key": "Clic D · Clic G",
      "lead": "Une garde frontale qui réduit fortement les dégâts reçus. Pendant la garde, tu peux charger une ruée qui projette une onde d'énergie.",
      "items": [
        "Elle encaisse l'**ult de Magneto** ou même celle d'**Iron Man** si tu es pleine de vie.",
        "Pour protéger un allié d'Iron Man, **fonce intercepter** le projectile : l'explosion touche quand même autour de toi.",
        "L'onde part **après** la ruée : tu peux fuir, te retourner, et toucher quand même.",
        "Plus tu as bloqué de dégâts, **plus la ruée fait mal**."
      ]
    },
    {
      "title": "Coup de pied",
      "ability": "Kinetic Kick",
      "key": "E",
      "lead": "Une charge suivie d'un coup de pied qui projette en l'air. Tu peux ensuite voler un instant, lancer deux coups de pied à distance, puis t'écraser au sol.",
      "items": [
        "Enchaîne un **coup de pied à distance juste après la projection** : il touche à coup sûr.",
        "Au front, utilise-le pour **écarter un tank** et ouvrir le fight.",
        "Sur un angle, **renvoie une cible vers ton équipe**.",
        "En dive, **isole un support** ou un peeler (Mister Fantastic).",
        "Contre **Groot**, reste en l'air pour éviter ses murs.",
        "Combo : **deux coups de poing, coup de pied, tir de pied, écrasement, tir de pied**."
      ]
    },
    {
      "title": "Attraction",
      "ability": "Fatal Attraction",
      "lead": "Une charge, puis une zone qui attire tous les ennemis vers toi au moment où tu le décides.",
      "items": [
        "L'attraction **interrompt les déplacements** (dash de Black Panther, de Winter Soldier…), mais c'est dur à synchroniser.",
        "Elle **ramène les ennemis** dans une ult alliée (Moon Knight, Namor, Daredevil).",
        "Combo de regroupement : **dash, zone d'attraction, coup de pied** pour envoyer une cible au milieu de son équipe."
      ]
    },
    {
      "title": "Absorption",
      "ability": "Ability Absorption",
      "lead": "Tu fonces sur une cible et absorbes son énergie : un bonus selon son rôle, et souvent l'une de ses capacités.",
      "items": [
        "Rater coûte **très cher** : garantis-la avec le coup de pied.",
        "**Tank** : vie maximale bonus. **DPS** : gros bonus de dégâts, idéal pour tes combos. **Support** : régénération.",
        "Certains héros te donnent une **capacité** (icône au-dessus de leur tête), les autres rechargent ton dash.",
        "Voler une **boule de neige de Luna** ou une **poussée d'Invisible Woman** peut contrer une ult de Doctor Strange.",
        "Pendant l'absorption, la cible est au sol : tu **retires son bouclier** un instant."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Heartbreaker",
      "key": "Q",
      "lead": "Une aura qui vide la charge d'ult des ennemis proches de l'avoir, et te donne des bonus selon les rôles touchés.",
      "items": [
        "**Prends l'initiative** : lance-la et plonge sur le support qui allait utiliser son ult.",
        "Sans ult de support adverse prête, vise le **Star-Lord ou le Punisher** avant qu'il lance la sienne.",
        "La lancer **après deux ults adverses**, c'est la gâcher.",
        "Tu peux être **étourdie** pendant l'incantation (étranglement d'Emma) : lance-la à couvert.",
        "Elle permet aussi de **tenir le point** très longtemps."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rater l'**absorption** sans l'avoir préparée.",
        "Bloquer **tous** les dégâts au lieu des plus dangereux.",
        "S'engager **sans cooldowns**.",
        "Lancer l'ult **trop tard** dans le fight.",
        "Incanter l'ult **à découvert** face à une Emma."
      ]
    }
  ],
  "counters": [
    {
      "hero": "the-thing",
      "note": "Son impact au sol t'immobilise."
    },
    {
      "hero": "hela",
      "note": "Elle te punit si tu ne joues pas les couverts."
    },
    {
      "hero": "phoenix",
      "note": "Même chose."
    },
    {
      "hero": "winter-soldier",
      "note": "Son dash coupe ta mobilité."
    },
    {
      "hero": "wolverine",
      "note": "Il t'oblige à jouer lentement."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses poussées cassent tes combos."
    }
  ],
  "synergies": [
    {
      "hero": "gambit",
      "note": "Son ult te laisse traverser l'équipe adverse."
    },
    {
      "hero": "magneto",
      "note": "Sa bulle te laisse arriver au contact."
    },
    {
      "hero": "moon-knight",
      "note": "Tu envoies les ennemis dans ses ankhs et son ult."
    },
    {
      "hero": "phoenix",
      "note": "Tu regroupes les ennemis pour ses explosions."
    },
    {
      "hero": "winter-soldier",
      "note": "Un brawler qui suit tes combos."
    }
  ],
  "sources": [
    {
      "title": "Rogue Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=LGAj_h43m5A"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'rogue'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- scarlet-witch
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Scarlet Witch est une DPS de pression constante : elle use les cibles fragiles depuis des angles décalés pour forcer les cooldowns adverses, protège sa backline des plongeurs et contrôle le fight avec une ult qui oblige l'ennemi à reculer.",
  "patch_note": "Attention : Scarlet Witch a été retravaillée en saison 10, et cette vidéo de Paz date d'avant. Le plan de jeu reste valable, mais le détail des capacités a pu changer. Les chiffres et team-ups ont été retirés : vérifie en jeu.",
  "tldr": [
    "Ne reste pas au centre à tirer sur les tanks : prends des **angles** et force les cooldowns.",
    "Cherche les **2 contre 1** : avec un soigneur derrière toi, tu gagnes presque tous les duels.",
    "Ton ult n'a pas besoin de tuer : elle sert à **contrôler le tempo** du fight."
  ],
  "difficulty": 1,
  "tags": [
    "Pression",
    "Anti-dive",
    "Contrôle",
    "Accessible"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Tu ne gagneras pas tous tes duels, mais tu peux forcer les bulles de Cloak, les poussées d'Invisible Woman, les boules de neige de Luna ou les runes de Loki.",
      "items": [
        "Prends une **hauteur qui donne accès aux deux côtés** du fight : tu peux poker au centre et défendre ta backline.",
        "Joue en **duo** avec un autre DPS sur son angle : ta présence le rend beaucoup plus dur à déloger.",
        "Va chercher les **traînards** isolés de leur équipe.",
        "Sur un angle offensif, empêche les plongeurs d'atteindre **ton tireur** (Hawkeye…)."
      ]
    },
    {
      "title": "Dégâts",
      "kind": "tips",
      "lead": "Avant la refonte, elle combinait un rayon à verrouillage généreux et des projectiles explosifs. L'idée reste la même : rester active en permanence.",
      "items": [
        "Garde **toujours une capacité de dégâts en rechargement** : tes dégâts de base sont faibles, chaque cycle compte.",
        "Ouvre un duel avec tes **projectiles**, puis finis la cible.",
        "Entraîne ta visée sur les **cibles fragiles** plutôt que de te rabattre sur les tanks."
      ]
    },
    {
      "title": "Contrôle",
      "kind": "tips",
      "lead": "Son étourdissement de zone était son outil le plus polyvalent.",
      "items": [
        "Il pouvait **couper les ults** à incantation : Doctor Strange, Storm, Cloak & Dagger.",
        "Pose-le **sur tes supports** contre le dive : les plongeurs hésitent à entrer.",
        "Étourdis le **support qui soigne** ta cible en duel.",
        "Pendant une ult adverse, il **immobilise une cible** pour qu'un allié la tue."
      ]
    },
    {
      "title": "Mobilité",
      "kind": "tips",
      "lead": "Elle pouvait devenir intangible et se déplacer très vite, tout en ramassant les packs de soin et en recevant les soins alliés.",
      "items": [
        "Erreur courante : utiliser sa mobilité **pour monter** en hauteur avant le fight. Marche plutôt.",
        "Joue **près des packs de soin** : frappe, repars te soigner, reviens."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Reality Erasure",
      "key": "Q",
      "lead": "Une ult qu'on incante quelques secondes avant une énorme explosion autour de toi. Tout le monde va te viser.",
      "items": [
        "Ne la garde pas **trop longtemps**, et n'essaie pas d'en faire **trop** : elle sert à forcer l'ennemi à reculer.",
        "Si l'ennemi lance une grosse ult offensive avant vous, utilise la tienne pour **bloquer son avancée** et gagner du temps.",
        "Incante **derrière un mur** et ne sors qu'au dernier moment.",
        "Force les **bulles de Magneto** et méfie-toi d'une **Emma** en diamant.",
        "Ne vole pas **trop haut** : tu couvres moins de terrain au sol."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester **au centre** sur les tanks.",
        "Gâcher sa **mobilité** avant le fight.",
        "Laisser ses capacités **inutilisées**.",
        "Incanter l'ult **à découvert**.",
        "Garder l'ult **plusieurs fights**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "groot",
      "note": "Les compos groupées ne te laissent pas de cible isolée."
    },
    {
      "hero": "magneto",
      "note": "Même chose, et sa bulle protège ses alliés."
    },
    {
      "hero": "emma-frost",
      "note": "Elle peut t'étrangler pendant ton ult."
    },
    {
      "hero": "star-lord",
      "note": "Avec des soins, il fait plus de dégâts que toi."
    },
    {
      "hero": "hela",
      "note": "Même chose."
    }
  ],
  "synergies": [
    {
      "hero": "venom",
      "note": "Tu suis facilement un tank de dive."
    },
    {
      "hero": "captain-america",
      "note": "Même chose."
    },
    {
      "hero": "phoenix",
      "note": "Votre duo sur un angle est très dur à déloger."
    },
    {
      "hero": "hawkeye",
      "note": "Tu protèges son angle des plongeurs."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Son ult te donne assez de vie pour survivre à la tienne."
    }
  ],
  "sources": [
    {
      "title": "Scarlet Witch Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=cPujUz0S7nQ"
    }
  ]
}$json$::jsonb
from public.heroes h where h.slug = 'scarlet-witch'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- squirrel-girl
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Squirrel Girl a un plan de jeu simple : elle arrose le couloir principal de glands explosifs pour mettre la pression sur les tanks et les fragiles, puis lance son ult dès qu'elle l'a. Ses glands étourdissants en font aussi une excellente gardienne contre le dive.",
  "tldr": [
    "**Spamme au centre** : boucliers, tanks, puis backline exposée.",
    "Utilise **Mammal Bond avant** ton gland étourdissant pour ne pas bloquer tes temps de recharge.",
    "Lance ton ult **dès que tu l'as**, en la faisant rebondir sur un mur."
  ],
  "difficulty": 1,
  "tags": [
    "Spam",
    "Anti-dive",
    "Couloirs",
    "Charge d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Reste simple : pression constante, et tu apporteras beaucoup dans la plupart des parties. En faire trop, c'est mourir souvent.",
      "items": [
        "Elle brille sur les cartes à **passages étroits**.",
        "Joue en **gardienne de ta backline** : quand un plongeur entre, il devient ta priorité.",
        "Vise d'abord **le tank à portée**, puis les fragiles bas en vie."
      ]
    },
    {
      "title": "Glands explosifs",
      "ability": "Burst Acorn",
      "key": "Clic G",
      "lead": "Des glands qui explosent au sol. Un tir direct fait plus mal, mais l'explosion compense les ratés.",
      "items": [
        "Ce sont des projectiles qui **retombent** : vise plus haut à longue distance.",
        "Ils **rebondissent sur les murs** et n'explosent qu'en touchant le sol.",
        "Tire **vers le sol en angle** pour les faire rebondir par-dessus un bouclier.",
        "Vise **la moitié basse** des cibles.",
        "Teste des **trajectoires** en partie personnalisée pour toucher les positions habituelles des supports."
      ]
    },
    {
      "title": "Gland étourdissant",
      "ability": "Squirrel Blockade",
      "key": "Clic D",
      "lead": "Un gros gland qu'on charge pour aller plus vite, qui étourdit si il touche directement et rebondit plusieurs fois.",
      "items": [
        "**Étourdis un tank** mal placé pour offrir un pick à ton équipe.",
        "Il **immobilise une ult mobile** (Magik, Scarlet Witch, Spider-Man) sans l'annuler, et fait tomber les volants.",
        "Contre un **plongeur** (Black Panther), garde-en un pour protéger tes supports.",
        "Les bons plongeurs attendent que tu l'aies lancé : **garde-le** quand une plongée ou une ult arrive.",
        "Astuce : un **coup de mêlée** annule la charge sans le lancer."
      ]
    },
    {
      "title": "Saut à la queue",
      "ability": "Tail Bounce",
      "lead": "Un saut vertical, plus haut si tu sautes avant.",
      "items": [
        "Contre des **tireurs** (Hela, Hawkeye, Phoenix, Punisher), ne saute pas devant eux : tu deviens prévisible.",
        "Contre le **dive** (Venom, Captain America, Psylocke), garde-le toujours pour fuir.",
        "Contre un **brawl**, il te permet de reculer et d'esquiver l'ult de The Thing ou de Moon Knight.",
        "Sur un **plafond en pente**, il te propulse à l'horizontale, bien moins prévisible."
      ]
    },
    {
      "title": "Mammal Bond",
      "lead": "Recharge instantanément ton arme et te donne une charge bonus d'une capacité pendant quelques secondes.",
      "items": [
        "Presque toujours pour **un gland étourdissant de plus**.",
        "Active-le **avant** d'utiliser tes capacités de base : pendant l'effet, leurs temps de recharge sont gelés.",
        "Contre le dive, ça te garde **un gland et un saut** en réserve."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Unbeatable Squirrel Tsunami",
      "key": "Q",
      "lead": "Une horde d'écureuils qui fonce, rebondit vers l'ennemi le plus proche à chaque mur et fait mal à chaque passage. Elle peut être détruite.",
      "items": [
        "Elle se charge **très vite** : ne la garde jamais.",
        "Fais-la **rebondir sur un mur** : elle survit bien plus longtemps.",
        "Lance-la **à mi-distance** et ajoute un gland sur un fragile pour l'achever.",
        "Forcer une ult de support, c'est **bien** : tu auras la suivante avant eux.",
        "Le **payload** compte comme un mur."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Sauter **face aux tireurs** en début de fight.",
        "Lancer le gland étourdissant **avant** Mammal Bond.",
        "**Garder l'ult** pour le moment parfait.",
        "Partir en **flanc** au lieu de tenir la backline.",
        "Lancer l'ult **en ligne droite**, facile à détruire."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Son bouclier bloque tes glands importants."
    },
    {
      "hero": "iron-man",
      "note": "Difficile à toucher dans les airs."
    },
    {
      "hero": "ultron",
      "note": "Même problème."
    },
    {
      "hero": "human-torch",
      "note": "Même problème."
    },
    {
      "hero": "hela",
      "note": "Elle te surclasse sur les longues lignes de vue."
    },
    {
      "hero": "hawkeye",
      "note": "Même chose."
    },
    {
      "hero": "black-widow",
      "note": "Avec un bonus de dégâts, elle te tue de loin."
    }
  ],
  "synergies": [
    {
      "hero": "emma-frost",
      "note": "Un front qui te laisse arroser au centre."
    },
    {
      "hero": "doctor-strange",
      "note": "Même chose."
    },
    {
      "hero": "the-punisher",
      "note": "Deux DPS de dégâts constants au centre."
    },
    {
      "hero": "hela",
      "note": "Elle gère les volants et les tireurs."
    },
    {
      "hero": "psylocke",
      "note": "Elle finit les supports que tu as affaiblis."
    },
    {
      "hero": "mantis",
      "note": "Son bonus de dégâts réduit le nombre de glands nécessaires."
    }
  ],
  "sources": [
    {
      "title": "Squirrel Girl Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=hfHY0afkEUg"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'squirrel-girl'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- star-lord
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Star-Lord change de rôle à chaque partie : flanker qui tue les supports, chasseur de volants ou farmeur de tanks qui charge son ult à toute vitesse. Ses roulades le rendent intouchable un instant et rechargent ses pistolets.",
  "tldr": [
    "Au début de chaque partie, **identifie qui tu dois marquer** : flanker, sniper ou volant.",
    "Tes **roulades** servent à esquiver et recharger, jamais à te déplacer.",
    "Garde **tes deux roulades** et place-toi avant de lancer ton ult."
  ],
  "difficulty": 2,
  "tags": [
    "Polyvalent",
    "Anti-volant",
    "Mobilité",
    "Esquive"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Star-Lord s'adapte à ce dont l'équipe a besoin. Il n'a pas besoin de tuer à chaque fight : chasser les ennemis de leurs positions suffit souvent.",
      "items": [
        "Contre un **flanker, un sniper ou un volant** : marque-le en priorité.",
        "Contre une compo **brawl/poke** (Strange, Magneto) : mets la pression sur la backline.",
        "Contre une compo **avec Namor ou sans ult défensive** : farme les tanks pour ton ult, en attendant que les tourelles soient gérées.",
        "Après un fight gagné, utilise ta mobilité pour **te placer** immédiatement pour le suivant."
      ]
    },
    {
      "title": "Pistolets",
      "ability": "Element Guns",
      "key": "Clic G",
      "lead": "Deux pistolets qui crachent une rafale rapide. La dispersion augmente vite pendant le tir.",
      "items": [
        "Commence la rafale **sur la tête**, puis descends vers le **cou** : la dispersion touche plus de la hitbox.",
        "Les dégâts baissent vite avec la distance, mais **poivrer de loin** suffit à chasser un ennemi.",
        "Chasse un Hela ou un Namor d'une **hauteur**, puis prends-la toi-même.",
        "Contre une **Storm**, c'est ta cible numéro un."
      ]
    },
    {
      "title": "Roulade",
      "ability": "Stellar Shift",
      "lead": "Deux charges de roulade qui te rendent intouchable, rechargent tes pistolets et te déplacent un peu.",
      "items": [
        "Elle **esquive les ults** : Doctor Strange, Magneto, The Thing, Groot…",
        "En duel contre **Hela** ou **Namor**, roule au bon moment pour esquiver leurs tirs clés.",
        "Sur un tank isolé, tu peux t'en servir pour **recharger et finir** le kill.",
        "Ne l'utilise **jamais juste pour te déplacer** : tes bottes sont faites pour ça."
      ]
    },
    {
      "title": "Bottes",
      "ability": "Rocket Propulsion",
      "key": "Maj",
      "lead": "Tes bottes te font voler deux fois plus vite, mais tu ne peux pas tirer. La jauge se recharge lentement.",
      "items": [
        "Rejoins ton flanc, attends que la jauge **se recharge**, puis duel : tu auras de quoi fuir.",
        "Pour **gagner du temps** (tenir un point), vole dans tous les sens.",
        "Astuce : démarre le vol et **coupe-le aussitôt** dans la même direction pour un petit élan économique.",
        "Garde du carburant pour **te placer avant ton ult**."
      ]
    },
    {
      "title": "Toupie",
      "ability": "Blaster Barrage",
      "lead": "Tu tournoies quelques secondes en tirant sur tout ce qui est autour de toi.",
      "items": [
        "Elle sert à **finir** une cible ou à faire sortir **Psylocke ou Loki** de l'invisibilité.",
        "Quand deux ults de soin s'affrontent, **tourne au milieu** pour charger ton ult.",
        "Tu n'es pas invulnérable : fais-le **avec ton équipe** ou une bulle de Magneto.",
        "Une cible devant une autre prend **double dégâts**."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Galactic Legend",
      "key": "Q",
      "lead": "Tu t'envoles et vises automatiquement pendant quelques secondes. Tu ne peux plus utiliser tes bottes.",
      "items": [
        "Tu deviens la cible n°1 : place-toi **dans la vue de tes supports** et près d'un couvert.",
        "Contre des plongeurs au sol (**Magik, Black Panther**), tu peux monter haut. Contre **Hela ou Namor**, reste près des couverts.",
        "Si possible, **élimine d'abord ton contre** (la Hela) avec l'ult.",
        "Entre dans l'ult **avec tes deux roulades** : esquive et rechargement.",
        "Face à une ult de soin, tu as souvent **un court moment** pour tuer un traînard."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**Rouler pour se déplacer**.",
        "Brûler tout le **carburant** avant le duel.",
        "Ult **sans roulade** disponible.",
        "Monter **trop haut** en ult et rater les premières balles.",
        "Ignorer la **Storm ou le flanker** adverse."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hela",
      "note": "Un tir à la tête et tu es presque mort."
    },
    {
      "hero": "namor",
      "note": "Ses tourelles t'usent si ton équipe ne les casse pas."
    },
    {
      "hero": "magneto",
      "note": "Son ult gâche la tienne."
    },
    {
      "hero": "iron-fist",
      "note": "Très dur à tuer, il te ramène au sol."
    }
  ],
  "synergies": [
    {
      "hero": "venom",
      "note": "Il plonge avec toi et tu finis la cible."
    },
    {
      "hero": "captain-america",
      "note": "Même idée."
    },
    {
      "hero": "psylocke",
      "note": "Pression combinée sur la backline."
    },
    {
      "hero": "hela",
      "note": "Elle gère l'autre Hela pendant que tu flanques."
    },
    {
      "hero": "adam-warlock",
      "note": "Un support qui joue les angles avec toi."
    },
    {
      "hero": "mantis",
      "note": "Son bonus de dégâts fiabilise ton ult."
    }
  ],
  "sources": [
    {
      "title": "Star-Lord Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=71rolJfkehc"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'star-lord'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- storm
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Storm est une DPS de soutien : elle joue au milieu de son équipe et lui donne une aura de vitesse ou de dégâts, tout en tirant des lames traversantes qui chargent vite son ult. Ce n'est pas une héroïne d'angle décalé.",
  "tldr": [
    "Reste **au milieu de ton équipe**, assez bas pour que ton aura touche tout le monde.",
    "**Aura de vent** pour activer ou ramener tes alliés, **aura de foudre** quand ils sont en position.",
    "Incante ton ult **à l'abri** : l'animation peut être interrompue."
  ],
  "difficulty": 1,
  "tags": [
    "Auras",
    "Soutien offensif",
    "Vol",
    "Charge d'ult"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Storm fait pression de façon constante, à travers ses propres dégâts et ceux qu'elle donne à son équipe. La patience est la clé.",
      "items": [
        "Joue dans un **endroit sûr au milieu de ton équipe**, proche du sol.",
        "Si tu veux jouer les angles décalés, prends **Psylocke ou Hela** à la place.",
        "Elle brille avec et contre les compos **poke et brawl**, beaucoup moins contre le **dive**."
      ]
    },
    {
      "title": "Lames de vent et éclair",
      "ability": "Wind Blade · Bolt Rush",
      "key": "Clic G · Clic D",
      "lead": "Des lames traversantes, et un éclair instantané qui frappe en ligne verticale.",
      "items": [
        "Les lames **traversent les ennemis** : excellente charge d'ult en tirant dans un groupe.",
        "Pas de tir à la tête, et une **perte de dégâts** à distance.",
        "Lance l'éclair **juste après une lame** pour annuler l'animation.",
        "L'éclair sert surtout à **finir une cible**."
      ]
    },
    {
      "title": "Auras",
      "ability": "Weather Control",
      "lead": "Une aura sphérique autour de toi : vent pour la vitesse, foudre pour les dégâts. Monte trop haut et tes alliés en sortent.",
      "items": [
        "**Vent** : active plus vite un allié qui doit se placer (The Thing qui veut le contact, Hela qui rejoint son angle).",
        "**Vent** aussi pour **sauver un allié trop avancé** ou **ramener ton équipe** du spawn après un fight gagné.",
        "**Foudre** dès que tes alliés sont **en position** : un Punisher en ult, une Black Widow sur son angle.",
        "Début de fight typique : **vent pour se placer, puis foudre**."
      ]
    },
    {
      "title": "Boost divin",
      "ability": "Goddess Boost",
      "lead": "Renforce temporairement ton aura active. Son temps de recharge ne démarre qu'à la fin de l'effet.",
      "items": [
        "**Vent renforcé** : ton équipe va plus vite et l'ennemi est ralenti, idéal pour un brawl.",
        "**Foudre renforcée** : gros bonus de dégâts et dégâts de zone sur les ennemis proches.",
        "Combo : **lame, boost, lame, éclair** pour éliminer un fragile sans soins."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Omega Hurricane",
      "key": "Q",
      "lead": "Tu choisis où commencer, puis tu deviens un ouragan qui blesse et aspire les ennemis. Tu gagnes beaucoup de vie bonus.",
      "items": [
        "L'**incantation** peut être interrompue : lance-la depuis ton équipe.",
        "Attends-toi à une **ult de soin** en réponse : cherche le traînard hors de la zone.",
        "À la fin, tu réapparais **au centre de l'ouragan** : ne va pas trop loin dans l'équipe adverse.",
        "Attention à **Iron Man** (son ult te tue) et **Phoenix** (elle retire ta vie bonus).",
        "Astuce : tu peux la lancer **en revenant du spawn** pour retourner un fight encore en cours.",
        "Elle peut **contrer une ult mobile** adverse (Winter Soldier, Magik)."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer **sur un angle isolé** loin de l'équipe.",
        "Voler **trop haut** : l'aura ne touche plus personne.",
        "Rester en **foudre** quand l'équipe doit se placer ou revenir.",
        "Incanter l'ult **à découvert**.",
        "Finir l'ult **au milieu de l'ennemi**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hulk",
      "note": "Il peut t'exiler hors de ton ult."
    },
    {
      "hero": "the-thing",
      "note": "Il te fait tomber du ciel si tu t'avances."
    },
    {
      "hero": "iron-man",
      "note": "Son ult te contre et il te bat en duel."
    },
    {
      "hero": "spider-man",
      "note": "Tu n'as pas de fuite rapide contre lui."
    },
    {
      "hero": "ultron",
      "note": "Il te harcèle par-dessus les boucliers."
    },
    {
      "hero": "luna-snow",
      "note": "Ses dégâts te chassent et son ult résiste à la tienne."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Ses boucliers te gardent en sécurité au centre."
    },
    {
      "hero": "emma-frost",
      "note": "Même chose."
    },
    {
      "hero": "the-punisher",
      "note": "Ton aura de foudre le rend terrifiant."
    },
    {
      "hero": "winter-soldier",
      "note": "Un DPS qui reste avec l'équipe et profite de l'aura."
    },
    {
      "hero": "black-widow",
      "note": "Ton aura rend ses tirs à la tête mortels."
    },
    {
      "hero": "luna-snow",
      "note": "Le support le plus sûr à côté de toi."
    }
  ],
  "sources": [
    {
      "title": "Storm Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=mlewjqlw91c"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'storm'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- the-punisher
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Le Punisher est un DPS de dégâts constants plutôt que de picks rapides. Il met la pression sur les tanks trop avancés, les volants à découvert et les supports trop tranquilles, pour que l'ennemi soit affaibli quand le vrai fight éclate.",
  "tldr": [
    "**Mets la pression** sur les bonnes cibles au lieu de vider ton chargeur sur un tank soigné.",
    "**Change d'arme avant** de te montrer : le changement n'est pas instantané.",
    "Prépare une **tyrolienne de sortie** avant de poser ta tourelle en position risquée."
  ],
  "difficulty": 1,
  "tags": [
    "Dégâts constants",
    "Anti-volant",
    "Tourelle",
    "Accessible"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Le Punisher demande de la patience et une bonne visée en suivi : il use l'ennemi pendant tout le fight.",
      "items": [
        "Attention à ne pas **nourrir les ults de support** adverses en tirant sur un tank que tu ne peux pas tuer.",
        "Avec ton ult déjà prête, prends un **angle en tyrolienne** et vise la backline.",
        "Fais **douter les volants** qui restent à découvert.",
        "Si personne ne te regarde, **ne bouge pas** : tu vises mieux."
      ]
    },
    {
      "title": "Fusil d'assaut",
      "ability": "Adjudication",
      "key": "Clic G",
      "lead": "Un fusil instantané à cadence élevée, qui fait très mal en visant la tête, même de loin.",
      "items": [
        "Tire par **rafales** pour limiter la dispersion.",
        "C'est ton outil pour **mettre la pression** et charger ton ult en début de fight.",
        "Entraîne ta visée en **suivi de cible** (tracking)."
      ]
    },
    {
      "title": "Fusil à pompe",
      "ability": "Deliverance",
      "lead": "Un fusil à pompe qui peut éliminer d'un tir à bout portant, mais qui perd vite ses dégâts avec la distance.",
      "items": [
        "Ne l'utilise **que de près**. Un peu plus loin, vise le torse.",
        "C'est ton outil pour **finir une cible** basse en fin de fight.",
        "Changer d'arme **ne recharge pas** : recharge les deux après chaque fight."
      ]
    },
    {
      "title": "Tourelle",
      "ability": "Culling Turret",
      "key": "E",
      "lead": "Tu t'installes derrière une tourelle protégée de face, qui tire des projectiles explosifs. Elle te rend insensible aux contrôles.",
      "items": [
        "Excellente sur un **groupe** d'ennemis, moins sur une seule cible.",
        "Place-la **hors de vue directe**, au-dessus d'un passage, pour charger ton ult en sécurité.",
        "L'installation est **lente et bruyante** : prépare une sortie en tyrolienne.",
        "Elle peut **protéger un support** derrière toi d'une ult de Magneto."
      ]
    },
    {
      "title": "Tyrolienne et fumigène",
      "ability": "Vantage Connection · Scourge Grenade",
      "key": "Maj · Clic D",
      "lead": "Une tyrolienne très rapide (trois maximum en place) et une grenade fumigène qui te propulse en arrière.",
      "items": [
        "**Pré-place des tyroliennes** pour revenir vite du spawn.",
        "Le fumigène est d'abord un **outil de survie** contre les plongeurs ou un Hela qui te vise.",
        "Combine tyrolienne et fumigène pour **atteindre des hauteurs** et des flancs inattendus.",
        "Ton passif te laisse **voir quelques secondes à travers les murs** les ennemis que tu viens de voir (toi seul)."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Final Judgment",
      "key": "Q",
      "lead": "Deux mitrailleuses et des missiles autoguidés pendant quelques secondes. Assez pour tuer une Luna à travers son ult si tu vises la tête.",
      "items": [
        "Lance-la **derrière un mur** : il y a une animation avant de tirer.",
        "Le **Magneto** adverse t'attend : joue près de ton tank à bouclier, ou demande une bulle ou un bouclier d'Invisible Woman.",
        "Avec deux ults de Luna qui s'échangent, lance la tienne et **cherche le traînard** hors de la zone.",
        "Elle se charge vite en tirant sur les tanks."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Vider ses chargeurs sur un **tank bien soigné**.",
        "Changer d'arme **à découvert**.",
        "Poser la tourelle **sans porte de sortie**.",
        "Ult **à découvert** face à un Magneto prêt.",
        "Utiliser le fumigène **en attaque** et ne plus pouvoir fuir."
      ]
    }
  ],
  "counters": [
    {
      "hero": "magneto",
      "note": "Son bouclier ignore tes dégâts et son ult annule la tienne."
    },
    {
      "hero": "psylocke",
      "note": "Elle te déborde par sa mobilité."
    },
    {
      "hero": "hela",
      "note": "Elle te tue en deux tirs avant que tu sois installé."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Ses soins compliquent tes kills."
    }
  ],
  "synergies": [
    {
      "hero": "emma-frost",
      "note": "Un front solide qui te laisse tirer."
    },
    {
      "hero": "groot",
      "note": "Même chose, et tu brises les fights qu'il découpe."
    },
    {
      "hero": "doctor-strange",
      "note": "Son bouclier et son portail te protègent."
    },
    {
      "hero": "black-widow",
      "note": "Duo redoutable contre les volants."
    },
    {
      "hero": "winter-soldier",
      "note": "Tu achèves au fusil à pompe ce qu'il attrape."
    },
    {
      "hero": "luna-snow",
      "note": "Son bonus de dégâts pendant ton ult détruit l'équipe adverse."
    }
  ],
  "sources": [
    {
      "title": "Punisher Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=T0d2S3gRW-M"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'the-punisher'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- the-thing
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "The Thing est un tank qui excelle dans les espaces étroits où il force l'ennemi au corps à corps. Il protège sa backline des plongeurs grâce à sa charge, saute vers alliés ou ennemis, et son ult étourdit tout ce qui est devant lui.",
  "tldr": [
    "Force les combats **dans les espaces serrés** : en terrain ouvert, tu perds.",
    "Ta **charge** est ta capacité clé : elle coupe les déplacements adverses.",
    "Pendant les échanges d'ults de soin, **frappe sans arrêt** : ton ult se charge très vite."
  ],
  "difficulty": 1,
  "tags": [
    "Brawl",
    "Anti-dive",
    "Contrôle",
    "Couloirs"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Si l'ennemi ne peut pas fuir, il perd contre The Thing. Après un fight gagné, tiens des positions précises où il devra venir à toi.",
      "items": [
        "Place-toi sur des **couverts proches des passages** que l'ennemi doit traverser.",
        "En défense, il est souvent **meilleur qu'une Peni** sur certaines cartes.",
        "Ne t'engage pas **trop loin** : ta grosse hitbox nourrit l'ult des DPS adverses."
      ]
    },
    {
      "title": "Coups et crochet",
      "ability": "Rocky Jabs · Stone Haymaker",
      "key": "Clic G · Clic D",
      "lead": "Des coups de poing en cône qui touchent plusieurs ennemis, et un gros crochet à longue portée qui te donne de la vie bonus.",
      "items": [
        "Les ennemis à portée de coup sont **surlignés** : tu sais exactement quand frapper.",
        "Le **crochet** est ton outil de poke : utilise-le presque en continu.",
        "Combo : **deux coups, crochet** pour éliminer un fragile.",
        "Charge le crochet **avant de sauter** sur un volant pour le faire tomber."
      ]
    },
    {
      "title": "Charge",
      "ability": "Yancy Street Charge",
      "key": "Maj",
      "lead": "Tu fonces, puis frappes le sol : les ennemis sont projetés et une zone les empêche d'utiliser leurs déplacements. Tu gagnes de la vie bonus pendant la charge.",
      "items": [
        "Option recommandée : passe-la en **mode maintenu** pour frapper le sol instantanément.",
        "**Protéger ta backline** : quand Black Panther plonge, frappe le sol sur tes supports.",
        "**Confirmer un pick** : un Magneto qui vient d'utiliser sa bulle, un support qui veut fuir.",
        "La zone peut même empêcher **Phoenix de lancer son ult**.",
        "Pendant la charge, tu es **insensible à la boule de neige** de Luna.",
        "Si tu plonges, garde **un saut** pour revenir."
      ]
    },
    {
      "title": "Sauts",
      "ability": "Embattled Leap · Battle Blitz",
      "lead": "Deux charges partagées pour sauter vers un allié (réduction de dégâts pour vous deux) ou vers un ennemi (réduction pour toi seul).",
      "items": [
        "**Charge dans la backline**, force l'ennemi à se retourner, puis **saute vers ton équipe** (qui doit te voir).",
        "Saute sur un **DPS allié en ult** (Star-Lord, Punisher) pour le protéger.",
        "Saute sur ton **support visé par un Magneto** en ult.",
        "Pour aider un allié en duel, saute **vers l'allié** : même position, plus de protection.",
        "Pour attraper un volant, sois patient : **attaque-le en rotation**, pas en début de fight.",
        "Tu peux **intercepter l'ult de Phoenix**. Par contre, **ne saute jamais** sur un Punisher en ult."
      ]
    },
    {
      "title": "Passif",
      "ability": "Unyielding Will",
      "lead": "Tu ne peux être ni repoussé, ni attiré, ni projeté. Les étourdissements fonctionnent toujours.",
      "items": [
        "Les poussées d'**Invisible Woman** ne te font rien : fonce sur elle.",
        "Le grappin de **Winter Soldier** ne te tire pas, mais t'étourdit."
      ]
    },
    {
      "title": "Ultime",
      "ability": "It's Clobberin' Time!",
      "key": "Q",
      "lead": "Tu frappes le sol et une onde se propage devant toi, étourdissant tous les ennemis touchés. Elle traverse les boucliers.",
      "items": [
        "Elle se charge **très vite** : lance-la souvent, tu peux en avoir deux dans un long fight.",
        "**Contre-attaque** juste après une ult étourdissable adverse (Doctor Strange, Hawkeye).",
        "Sans ult de soin chez vous, cherche à **étourdir la Luna** avant qu'elle lance la sienne.",
        "Avec un **Punisher** en ult, étourdis l'équipe adverse pour qu'il ne tire pas dans un bouclier."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Se battre **en terrain ouvert**.",
        "Garder la charge en mode **par défaut** au lieu de maintenu.",
        "Plonger **sans saut** pour revenir.",
        "Sauter **sur un Punisher en ult**.",
        "Garder son ult au lieu de **l'utiliser en ouverture**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Tu es une batterie à rayon pour elle."
    },
    {
      "hero": "groot",
      "note": "Il t'isole après ton engagement : attends son grand mur."
    },
    {
      "hero": "the-punisher",
      "note": "Il te farme de loin."
    },
    {
      "hero": "squirrel-girl",
      "note": "Même chose."
    },
    {
      "hero": "iron-man",
      "note": "Hors de portée et beaucoup de dégâts."
    },
    {
      "hero": "phoenix",
      "note": "Elle te farme avec ses marques."
    },
    {
      "hero": "moon-knight",
      "note": "Ses ricochets te dévorent."
    }
  ],
  "synergies": [
    {
      "hero": "magneto",
      "note": "Un tank capable de tenir le front avec toi."
    },
    {
      "hero": "emma-frost",
      "note": "Même chose."
    },
    {
      "hero": "magik",
      "note": "Une brawleuse qui aime le contact."
    },
    {
      "hero": "phoenix",
      "note": "Tu regroupes les ennemis pour ses marques."
    },
    {
      "hero": "human-torch",
      "note": "Tu repousses l'ennemi dans ses zones."
    },
    {
      "hero": "invisible-woman",
      "note": "Elle te soutient en brawl."
    },
    {
      "hero": "wolverine",
      "note": "Un brawler qui suit tes engagements."
    }
  ],
  "sources": [
    {
      "title": "The Thing Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=8IJGdtB9s2s"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'the-thing'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- thor
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Thor est un tank très flexible qui joue sur une ressource, la Thorforce : il conteste les positions fortes pour empêcher les DPS adverses d'entrer, puis ouvre les flancs pour ramener des tanks ennemis dans son équipe avec son dash.",
  "tldr": [
    "**Gère ta Thorforce** : frappe entre deux capacités pour la recharger.",
    "**Conteste les hauteurs** tenues par les DPS adverses, puis ramène un tank chez toi.",
    "N'active l'**Éveil** que si tu peux vraiment toucher tes cibles, sans bouclier devant."
  ],
  "difficulty": 2,
  "tags": [
    "Ressource",
    "Déplacement d'ennemis",
    "Flexible",
    "Duels"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Pense en permanence : qui dois-je mettre sous pression, et quand ? Thor peut tout faire, selon le matchup.",
      "items": [
        "Avec un **front fort** (Winter Soldier, Wolverine), brawle au centre.",
        "Si le **front adverse est plus fort**, prends les angles et les duels.",
        "Monte sur les **hauteurs tenues par les DPS** adverses : tu les forces à reculer, et le tank adverse avec.",
        "En défense, reste **un peu en retrait** du front, prêt à ramener un tank trop avancé."
      ]
    },
    {
      "title": "Thorforce",
      "ability": "Thorforce",
      "lead": "La plupart de tes capacités consomment de la Thorforce et te donnent de la vie bonus. Elle se recharge avec le temps ou en touchant un ennemi.",
      "items": [
        "Après chaque capacité, il y a un **court délai** avant la suivante : frappe pendant ce temps pour recharger.",
        "Ton efficacité dépend de **comment tu gères** cette ressource."
      ]
    },
    {
      "title": "Marteau",
      "ability": "Mjolnir Bash · Hammer Throw",
      "key": "Clic G · Clic D",
      "lead": "Des coups de marteau sans série fixe, et un lancer de marteau qui revient comme un boomerang.",
      "items": [
        "Chaque **premier impact** recharge une Thorforce.",
        "Le lancer **revient plus vite** s'il touche une cible proche.",
        "Pendant le lancer, tu ne peux pas dasher, mais tu peux **activer l'Éveil**."
      ]
    },
    {
      "title": "Dash",
      "ability": "Storm Surge",
      "key": "Maj",
      "lead": "Maintiens pour charger le dash, puis fonce. Tu peux emporter un ennemi et tourner pendant le dash pour le ramener chez toi.",
      "items": [
        "**Ramène un tank** derrière son équipe vers la tienne, puis enchaîne.",
        "La charge est **bruyante** : un étourdissement (Hela, Phoenix, Luna) ou une attraction (Invisible Woman) peut t'arrêter.",
        "Pour sortir du spawn, un **dash non chargé** suffit.",
        "Si tu n'as rien d'autre, dash vers un **Iron Man ou Magneto en ult** pour encaisser à la place de tes supports."
      ]
    },
    {
      "title": "Dôme de foudre",
      "ability": "Lightning Realm",
      "lead": "Une sphère autour de toi qui blesse et ralentit les ennemis qui la traversent et bloque leurs déplacements. Elle recharge ta Thorforce selon le nombre d'ennemis dedans.",
      "items": [
        "Après un dash sur une cible, **pose le dôme** pour qu'elle ne s'échappe pas.",
        "Fais **entrer et sortir** l'ennemi du dôme avec ton dash pour multiplier les dégâts.",
        "Contre **Angela**, pose-le sur tes supports pour couper ses attrapes."
      ]
    },
    {
      "title": "Éveil",
      "ability": "Awakening Rune",
      "lead": "Consomme toute ta Thorforce : tes coups deviennent des projectiles puissants en série de quatre et une petite aura blesse autour de toi.",
      "items": [
        "Gros investissement : sois **sûr de toucher** avant de l'activer.",
        "Contre des boucliers (**Magneto, Strange**), bouscule-les d'abord.",
        "Contre **Peni**, active-le directement pour nettoyer ses nids.",
        "Contre **Rogue ou Emma**, garde tes distances ou attends qu'elles aient utilisé leurs attrapes.",
        "Combo : **lancer de marteau, puis Éveil** pendant qu'il vole.",
        "Tu peux le **couper tôt** pour récupérer une Thorforce et dasher."
      ]
    },
    {
      "title": "Ultime",
      "ability": "God of Thunder",
      "key": "Q",
      "lead": "Tu t'élèves, insensible aux contrôles, avec une zone qui blesse au sol, puis tu t'écrases en étourdissant tout le monde.",
      "items": [
        "Avec un **bonus de dégâts** (Luna, Rocket), l'impact tue à travers une ult de soin.",
        "Idéal dans un **passage étroit** que l'ennemi doit traverser.",
        "Pas d'ult face à un **Punisher ou Hawkeye en ult** : tu es une énorme cible.",
        "Dépense de la **Thorforce avant** pour la vie bonus."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Enchaîner les capacités **sans frapper** entre deux.",
        "Charger le dash **en vue d'un étourdissement**.",
        "Activer l'Éveil **dans un bouclier**.",
        "Ult **face à une ult de DPS** adverse.",
        "Duel un **The Thing** au centre."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle charge sur toi et te chasse des positions."
    },
    {
      "hero": "rogue",
      "note": "Elle te plaque au sol et vole ton Éveil."
    },
    {
      "hero": "the-thing",
      "note": "Son impact au sol t'empêche de dasher."
    },
    {
      "hero": "moon-knight",
      "note": "Les DPS à dégâts constants te font fondre."
    },
    {
      "hero": "the-punisher",
      "note": "Même chose."
    },
    {
      "hero": "invisible-woman",
      "note": "Ses poussées et attractions te rendent injouable."
    }
  ],
  "synergies": [
    {
      "hero": "angela",
      "note": "Une autre tank qui joue les flancs avec toi."
    },
    {
      "hero": "hela",
      "note": "Tu la protèges sur son angle et chasses l'autre tireur."
    },
    {
      "hero": "phoenix",
      "note": "Même chose."
    },
    {
      "hero": "luna-snow",
      "note": "Son bonus de dégâts rend ton ult mortelle."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Même chose."
    }
  ],
  "sources": [
    {
      "title": "Thor Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=_F5nOfRLy8A"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'thor'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- ultron
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Ultron ne soutient pas son équipe en soignant beaucoup : il distribue de la vie bonus de n'importe où sur la carte, gagne ses duels grâce à son laser et sa mobilité, et charge très vite une ult polyvalente.",
  "tldr": [
    "Prends des **angles** et cherche des picks : rester derrière à soigner, c'est mal le jouer.",
    "Ton **drone** doit toujours être sur un allié, et changer de cible selon qui est actif.",
    "Après ton **pare-feu**, deviens agressif : la vie bonus disparaît vite."
  ],
  "difficulty": 2,
  "tags": [
    "Vol",
    "Duels",
    "Vie bonus",
    "Anti-dive"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "La plupart des joueurs voient Ultron comme un soigneur. C'est l'erreur : ses forces sont les duels, les picks et la vie bonus au bon moment.",
      "items": [
        "Joue **près des couverts**, même en volant : le ciel ne te protège pas des tireurs.",
        "Pas besoin de flanquer **très loin** : un angle sûr suffit.",
        "Ne tire pas sur les tanks **toute la partie**, sauf s'ils sont les seules cibles visibles.",
        "Le duo **Ultron + Hela sur un angle** est très dur à gérer pour l'adversaire."
      ]
    },
    {
      "title": "Laser",
      "key": "Clic G",
      "lead": "Un rayon instantané suivi d'une petite explosion. Une seule pression suffit, pas besoin de maintenir.",
      "items": [
        "Deux tirs complets tuent un fragile, **trois** à longue distance.",
        "L'explosion ne touche **qu'une seule cible**, mais elle rend le tir plus facile.",
        "Astuce : **commence à charger** contre un mur, puis sors juste avant l'explosion.",
        "Annule l'animation de rechargement avec un **coup de mêlée** à mi-chemin."
      ]
    },
    {
      "title": "Vol rapide",
      "ability": "Dynamic Flight",
      "key": "Maj",
      "lead": "Un dash dans toutes les directions suivi d'un bonus de vitesse, et un peu de vie bonus. Le temps de recharge ne démarre qu'à la fin de l'accélération.",
      "items": [
        "Le haut et le bas se contrôlent avec **ton viseur**.",
        "Utile pour **revenir du spawn**, **fuir** après un pick trop profond, ou **confirmer un duel**.",
        "Combo duel : charge le laser derrière un couvert, **dash et tire** sur un Hela basse."
      ]
    },
    {
      "title": "Drone",
      "ability": "Imperative: Patch",
      "lead": "Un drone qui soigne son porteur et les alliés autour, toi compris. Pas de temps de recharge : il doit toujours être actif.",
      "items": [
        "Il revient si tu es **trop loin** ou **hors de vue** trop longtemps : repasse dans la zone régulièrement.",
        "Début de fight : **sur tes tanks**. Quand un DPS duel : **sur lui**. Si tes supports sont plongés : **sur eux**.",
        "Avec une **Luna** qui marque déjà ton plongeur, mets plutôt le drone sur les tanks."
      ]
    },
    {
      "title": "Pare-feu",
      "ability": "Imperative: Firewall",
      "key": "Clic D",
      "lead": "De la vie bonus pour toi et les alliés proches de toi ou de ton drone. Elle s'estompe vite.",
      "items": [
        "Juste après, **sois agressif** : recule, protège, puis fonce sur la backline.",
        "Elle **empêche un one-shot** : une flèche de Hawkeye ou l'ult de Namor.",
        "La zone est **sphérique** : si ton drone est en l'air, les alliés au sol ne reçoivent rien."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Rage of Ultron",
      "key": "Q",
      "lead": "Quatre drones apparaissent et tirent des salves qui soignent tes alliés et blessent les ennemis. Tu ne peux pas être étourdi et tu peux dasher.",
      "items": [
        "Lance-la **derrière un couvert**, puis sors pendant que les drones tirent.",
        "C'est une ult de **retournement** : quand l'ennemi écrase ton front, soigne tes tanks et blesse les siens.",
        "Elle contre les menaces ciblées : **Magik, Iron Fist, Winter Soldier**.",
        "Elle se charge **vite** : n'hésite pas à la lancer pour tuer un support isolé."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Rester **en retrait à soigner**.",
        "Oublier son **drone** ou le laisser expirer.",
        "Utiliser le pare-feu **sans agresser** ensuite.",
        "Voler **à découvert** face à Hela ou Hawkeye.",
        "Insister quand ton équipe **prend trop de dégâts** : change de support."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hela",
      "note": "Elle te descend du ciel."
    },
    {
      "hero": "hawkeye",
      "note": "Même chose."
    },
    {
      "hero": "star-lord",
      "note": "Il te poursuit dans les airs."
    },
    {
      "hero": "adam-warlock",
      "note": "Ses tirs instantanés te punissent."
    },
    {
      "hero": "black-widow",
      "note": "Elle te tue de loin."
    },
    {
      "hero": "iron-man",
      "note": "Il te sort de ton plan de jeu."
    }
  ],
  "synergies": [
    {
      "hero": "iron-man",
      "note": "Un autre volant à soutenir."
    },
    {
      "hero": "captain-america",
      "note": "Ton drone le garde en vie en plongée."
    },
    {
      "hero": "psylocke",
      "note": "Même chose."
    },
    {
      "hero": "hela",
      "note": "Votre duo sur un angle est presque intouchable."
    },
    {
      "hero": "storm",
      "note": "Son aura booste ton laser et elle joue près de toi."
    },
    {
      "hero": "luna-snow",
      "note": "Elle soigne assez pour te laisser jouer offensif."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Même chose."
    }
  ],
  "sources": [
    {
      "title": "Ultron Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=YKcxUGf25Es"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'ultron'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- venom
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Venom est un tank de plongée qui encercle l'ennemi, force ses cooldowns, puis attend que son équipe soit prête pour l'élimination. Il n'a pas besoin de tuer : sa pression suffit à ouvrir le fight pour ses alliés.",
  "tldr": [
    "**Engage depuis un mur** avec le saut écrasé, et garde le balancement pour **fuir**.",
    "Lance ta **vie bonus vers 150-200 PV**, pas trop tôt, pas trop tard.",
    "Ne saute pas partout : **un simple pas de côté** suffit, ta hitbox est énorme de toute façon."
  ],
  "difficulty": 2,
  "tags": [
    "Plongée",
    "Pression",
    "Vie bonus",
    "Mobilité"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Venom force les cooldowns au plus vite pour garder sa vie bonus pour le moment où son équipe peut suivre.",
      "items": [
        "Après un fight gagné, monte **au-dessus d'un passage**, laisse passer les tanks, puis tombe sur les supports.",
        "Sache **toujours où est ton équipe** pour qu'elle puisse suivre ton engagement.",
        "Pas de kill ? Pas grave : tu **bloques l'ennemi** et tu offres un pick à ton équipe.",
        "Astuce : sortie du spawn rapide en **balancement puis sauts enchaînés** (saut sur la molette)."
      ]
    },
    {
      "title": "Tentacules",
      "key": "Clic G",
      "lead": "Des salves de tentacules à bonne portée qui peuvent toucher la tête. Elles font plus mal que la plupart des tanks.",
      "items": [
        "Ne te colle pas : à **mi-distance**, tu touches plus facilement la tête.",
        "Évite les **sauts inutiles** qui ruinent ta visée.",
        "Glisse des **coups de mêlée** entre les salves sur une cible unique."
      ]
    },
    {
      "title": "Tentacules corrosives",
      "ability": "Cellular Corrosion",
      "key": "Clic D",
      "lead": "Tous les ennemis proches sont attachés et ralentis. S'ils ne s'éloignent pas à temps, ils subissent un gros pic de dégâts.",
      "items": [
        "Utilise-la **à chaque engagement** : elle force les cooldowns et éloigne les cibles de leur équipe.",
        "Déplace-toi pour qu'ils aient **du mal à s'éloigner**.",
        "Elle **suit les cibles invisibles** (Cloak & Dagger, Invisible Woman)."
      ]
    },
    {
      "title": "Balancement et murs",
      "ability": "Venom Swing · Alien Biology",
      "key": "Maj",
      "lead": "Un balancement très rapide accroché au décor, et la capacité de grimper et courir sur les murs et plafonds.",
      "items": [
        "Le balancement sert surtout à **sortir**. Accroche-toi **bas sur un mur** pour partir à l'horizontale, hors de vue des tireurs.",
        "Engage plutôt en **grimpant sur un mur** puis en sautant écrasé.",
        "Courir sur les murs est **bruyant** : les supports t'entendent arriver.",
        "En duel près d'un mur, **monte et écrase-toi** sur la cible pour des dégâts bonus."
      ]
    },
    {
      "title": "Saut écrasé",
      "ability": "Frenzied Arrival",
      "lead": "Tu bondis et t'écrases au sol, projetant les ennemis en l'air. Les dégâts baissent si tu tombes à côté.",
      "items": [
        "Vise **directement** la cible.",
        "Tu ne peux pas être gelé en vol, mais un bon support **attendra ton atterrissage**.",
        "Combo : **mur, saut écrasé, tentacules corrosives, tirs**."
      ]
    },
    {
      "title": "Vie bonus",
      "ability": "Symbiotic Resilience",
      "lead": "Tu gagnes de la vie bonus en fonction de la vie qui te manque. Plus tu es blessé, plus tu en reçois.",
      "items": [
        "Lance-la vers **150-200 PV** : assez tard pour en profiter, assez tôt pour ne pas mourir avant.",
        "Elle **ne charge pas** l'ult adverse : collé à une Luna presque prête, tu la bloques.",
        "**Survis** après l'avoir lancée : mourir avec, c'est offrir de l'ult à l'ennemi.",
        "Attention à **Phoenix** (elle la retire) et **Ultron** (son ult la fait fondre)."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Feast of the Abyss",
      "key": "Q",
      "lead": "Tu t'enfouis et te déplaces très vite, puis tu ressurgis en dévorant un pourcentage de la vie des ennemis autour, converti en vie bonus pour toi.",
      "items": [
        "Elle **prolonge un engagement** sur les supports ou force leurs ults.",
        "Avec un **bonus de dégâts** (Luna, Rocket) : tentacules corrosives, puis ressurgis au moment où leurs dégâts tombent, pour tuer à travers une ult de soin.",
        "Bon timing : **ressurgis sous le Jeff** au moment où il sort pour avaler ton équipe.",
        "Sous terre, ta **tête peut être touchée**, et l'ennemi peut te bloquer le passage."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "**Engager au balancement** et ne plus pouvoir fuir.",
        "Sauter partout et **rater ses tirs**.",
        "Lancer la vie bonus **trop tôt**.",
        "Plonger **sans équipe** prête à suivre.",
        "Écraser **à côté** de la cible."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Elle charge sur toi si ton équipe ne la gère pas."
    },
    {
      "hero": "the-thing",
      "note": "Il t'immobilise à l'entrée ou à la sortie."
    },
    {
      "hero": "thor",
      "note": "Même chose."
    },
    {
      "hero": "the-punisher",
      "note": "Ses dégâts constants te font fondre."
    },
    {
      "hero": "phoenix",
      "note": "Elle retire ta vie bonus."
    },
    {
      "hero": "luna-snow",
      "note": "Elle te gèle à l'atterrissage."
    },
    {
      "hero": "ultron",
      "note": "Intouchable, et son drone casse tes seuils."
    }
  ],
  "synergies": [
    {
      "hero": "captain-america",
      "note": "Il dégage le couloir opposé : un partenaire de plongée idéal."
    },
    {
      "hero": "psylocke",
      "note": "Plongée combinée sur la backline."
    },
    {
      "hero": "black-widow",
      "note": "Elle achève au corps les cibles que tu plonges."
    },
    {
      "hero": "jeff-the-land-shark",
      "note": "Il suit tes plongées et attire l'attention."
    },
    {
      "hero": "luna-snow",
      "note": "Son bonus de dégâts rend ton ult mortelle."
    },
    {
      "hero": "mantis",
      "note": "Elle booste les plongeurs qui t'accompagnent."
    }
  ],
  "sources": [
    {
      "title": "Venom Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=3HMlrN1UxIc"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'venom'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- white-fox
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "White Fox est une support pleine d'utilitaires : elle contrôle le fight avec ses renards spectraux et sa téléportation, puis passe en forme de renard au corps à corps quand c'est le tour de son équipe d'engager. Son ult rend un allié presque imbattable quelques secondes.",
  "tldr": [
    "**Touche directement** tes cibles : un tir raté, c'est beaucoup de soin et de charge d'ult perdus.",
    "Garde des **queues spirituelles** pour contrer les ults et les plongées adverses.",
    "Passe en **forme de renard** quand ton équipe engage ou qu'un plongeur te tombe dessus."
  ],
  "difficulty": 3,
  "tags": [
    "Utilitaire",
    "Anti-ult",
    "Téléportation",
    "Brawl"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Analyse ce que l'ennemi joue et prévoit, puis adapte tes utilitaires. Charger ton ult reste l'objectif, mais la façon de le faire change selon la compo.",
      "items": [
        "En **brawl**, utilise téléportation et bouclier pour couper les soins d'une cible clé.",
        "En **poke**, téléporte-toi vers ta **Hela** quand elle duel ou se fait plonger.",
        "Sois **proactive** : ne reste pas derrière à soigner."
      ]
    },
    {
      "title": "Billes de renard",
      "ability": "Fox Marbles",
      "key": "Clic G",
      "lead": "Des projectiles qui soignent ou blessent, puis rebondissent une seule fois vers une cible proche.",
      "items": [
        "Le premier impact fait l'essentiel : **vise directement** la cible.",
        "Pour une cible lointaine ou très mobile, vise **ses pieds** ou le mur derrière elle pour profiter du rebond.",
        "Elles chargent aussi tes **queues spirituelles**."
      ]
    },
    {
      "title": "Renard spectral",
      "ability": "Spectral Surge",
      "key": "Clic D",
      "lead": "Un renard qui traverse les cibles, soigne et blesse, et coûte une queue. S'il touche directement, il rend un allié invulnérable un instant, ou force un ennemi à marcher vers toi.",
      "items": [
        "L'invulnérabilité est brève mais **contre des ults** (Doctor Strange, The Thing, Groot) ou la plongée d'un **Venom**. Le timing est dur.",
        "Le charme empêche un **Black Panther, Venom ou Hulk** d'utiliser sa mobilité : anticipe, l'animation est longue.",
        "Dans un fight neutre, **aligne un maximum de cibles**.",
        "Contre une ult de **Magneto**, lance-le pendant que le météore arrive, pas avant."
      ]
    },
    {
      "title": "Forme de renard",
      "ability": "Fox Form Awakening",
      "lead": "Consomme toutes tes queues pour passer au corps à corps : tes griffes soignent toi et les alliés autour, et tu gagnes deux capacités.",
      "items": [
        "Contre le **dive**, c'est ton outil de survie : tu peux même gagner un duel contre un Daredevil seul.",
        "Contre le **brawl**, passe en renard quand l'ennemi a utilisé un gros cooldown (le grand mur de Groot) ou que tu as l'avantage.",
        "Le **bond** (Maj) te place derrière la cible, puis te permet de la **pousser vers ton équipe**.",
        "Le **coup de queue** (clic droit) finit une cible ou la repousse.",
        "**Recharge avant** de passer en renard.",
        "Inutile de garder trois queues pour ça : **utilise tes renards spectraux** en neutre."
      ]
    },
    {
      "title": "Téléportation",
      "ability": "Spirit Sanctuary",
      "lead": "Tu te téléportes vers un allié à travers les murs, crées un bouclier autour de vous et vous soignez instantanément.",
      "items": [
        "Rejoins ta **Hela** sur son angle quand elle se fait plonger.",
        "**Feinte** : laisse un plongeur venir sur toi, puis disparais.",
        "Elle peut **couper les soins** d'un plongeur adverse pendant que tu sauves ton allié.",
        "Elle peut protéger un support d'une **ult de Magneto**, s'il prend de la distance.",
        "C'est ta **survie** : ne l'utilise pour attaquer que si le pick est quasi sûr."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Kumiho Unleashed",
      "key": "Q",
      "lead": "Tu deviens un renard à neuf queues avec beaucoup de vie. Tu soignes autour de toi, mais tu ne peux être soignée qu'en frappant les ennemis. Tu peux rendre des alliés imparables et voleurs de vie.",
      "items": [
        "Lance-la **en premier**, pendant une vraie poussée sur le point, pas en réaction.",
        "Reste **derrière tes tanks** : ta hitbox est énorme.",
        "Donne le bonus à **un allié en ult** (Star-Lord) ou à **tes tanks** au front. Tu peux en booster plusieurs.",
        "Chaque bonus **te coûte de la vie**.",
        "Combo : **téléporte-toi** sur ton front qui gagne, puis lance l'ult."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Viser **à côté** et compter sur le rebond.",
        "Gaspiller ses queues quand une **grosse ult** adverse arrive.",
        "Passer en renard **sans que l'équipe suive**.",
        "Utiliser la **téléportation** pour attaquer sans raison.",
        "Lancer l'ult **en réaction** comme une ult de Luna."
      ]
    }
  ],
  "counters": [
    {
      "hero": "hela",
      "note": "Elle te domine sur les longues lignes de vue."
    },
    {
      "hero": "phoenix",
      "note": "Même chose."
    },
    {
      "hero": "the-thing",
      "note": "Il bloque tes déplacements et ta téléportation."
    },
    {
      "hero": "the-punisher",
      "note": "Il te déchire pendant ton ult."
    },
    {
      "hero": "wolverine",
      "note": "Même chose."
    },
    {
      "hero": "angela",
      "note": "Elle peut t'emporter hors de la carte."
    }
  ],
  "synergies": [
    {
      "hero": "luna-snow",
      "note": "Un duo de supports solide."
    },
    {
      "hero": "groot",
      "note": "Un tank de brawl qui lance les fights où ta forme de renard brille."
    },
    {
      "hero": "emma-frost",
      "note": "Même chose."
    },
    {
      "hero": "the-thing",
      "note": "Même chose."
    },
    {
      "hero": "elsa-bloodstone",
      "note": "Une DPS de contact qui profite de tes soins."
    },
    {
      "hero": "star-lord",
      "note": "Ton ult rend la sienne dévastatrice."
    },
    {
      "hero": "invisible-woman",
      "note": "Elle aussi veut des fights groupés."
    }
  ],
  "sources": [
    {
      "title": "White Fox Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=agc2g5G7fwM"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'white-fox'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- winter-soldier
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Winter Soldier est un DPS cogneur qui joue au front avec ses tanks : il attrape les ennemis au grappin, les déplace et les fait exploser avec son canon. Chaque capacité recharge son arme et lui donne de la vie bonus.",
  "tldr": [
    "Joue **avec tes tanks**, pas en flanc : c'est là que ton grappin vaut le plus.",
    "Chaque capacité **recharge ton canon** : enchaîne capacités et tirs.",
    "Ton ult n'a pas besoin de remplir le kill feed : **un pick et tu survis**, c'est déjà gagné."
  ],
  "difficulty": 2,
  "tags": [
    "Brawl",
    "Grappin",
    "Vie bonus",
    "Anti-dive"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Comme Wolverine, il prépare le terrain pour son front en déplaçant les ennemis, surtout les tanks. Il protège aussi très bien sa backline des plongeurs.",
      "items": [
        "Reste **près de ton tank** : un ennemi attrapé peut être coupé de ses soins tout de suite.",
        "Contre un **Black Panther**, ton dash et tes boules le stoppent net.",
        "Les fights sont longs : tu as **le temps** d'attendre la bonne ouverture.",
        "Après un pick, tu peux **attirer un tank** dans un passage serré, comme un Wolverine."
      ]
    },
    {
      "title": "Canon",
      "ability": "Roterstern",
      "key": "Clic G",
      "lead": "Trois tirs explosifs par chargeur. Un tir direct fait mal, et l'explosion touche les ennemis derrière la cible.",
      "items": [
        "Deux tirs à la tête tuent un fragile.",
        "**N'importe quelle capacité** recharge entièrement ton canon, même ratée.",
        "Combo : **tir à la tête, dash, coup de mêlée** pour tuer un fragile.",
        "Avec le grappin : **grappin, tir à la tête, dash**."
      ]
    },
    {
      "title": "Passif",
      "ability": "Ceaseless Charge",
      "lead": "Chaque capacité te donne de la vie bonus, qui s'estompe avec le temps.",
      "items": [
        "Grappin, dash et boule d'énergie enchaînés te rendent **très solide** au front.",
        "Ne lance pas tes capacités **juste pour la vie bonus**, mais sache qu'elle te permet d'être plus agressif."
      ]
    },
    {
      "title": "Grappin",
      "ability": "Bionic Hook",
      "lead": "Un grappin qui va plus loin si tu le charges. Il peut attraper plusieurs ennemis alignés et applique un mini-étourdissement.",
      "items": [
        "Après l'impact, **tourne ton viseur** pour ramener la cible derrière un couvert ou un bouclier, hors de portée de ses soins.",
        "Le mini-étourdissement **coupe des ults** (Doctor Strange, Star-Lord, Loki).",
        "Charge-le quand un **bouclier adverse va tomber**, pour attraper la cible juste après.",
        "Tu peux sortir **Cloak & Dagger** ou un tank d'une ult de soin.",
        "Charger le grappin pendant une **ult de Luna** adverse, c'est ta façon d'être utile pendant que tout le monde est immortel.",
        "Charge maximale = **bruit très reconnaissable** : l'ennemi sait que tu es prêt."
      ]
    },
    {
      "title": "Dash et boule d'énergie",
      "ability": "Trooper's Fist · Tainted Voltage",
      "key": "Maj",
      "lead": "Un dash qui emporte les ennemis devant toi, même à travers les boucliers, et deux charges d'une boule d'énergie qui traverse et ralentit.",
      "items": [
        "Le dash **traverse les boucliers** de Strange et Magneto, mais te laisse exposé de l'autre côté.",
        "Il sert à **prendre une hauteur**, **plaquer une Luna contre un mur** ou **stopper un plongeur**.",
        "La boule **ralentit** et peut faire tomber les volants (Iron Man, Storm).",
        "Ne la lance pas **dans un bouclier** : garde-la pour quand il tombe."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Kraken Impact",
      "key": "Q",
      "lead": "Tu t'envoles puis t'écrases sur une zone, marquant les ennemis touchés. Ceux qui tombent sous un seuil de vie meurent, et chaque élimination te rend l'ult.",
      "items": [
        "Choisis ta **zone d'impact** avant de retomber, sinon l'ult est perdue.",
        "Les **tanks** ont un seuil plus haut, mais il faut que ton équipe suive à temps.",
        "Combo idéal avec l'**ult de Groot**.",
        "Face à des **ults de support** prêtes, ne commence pas avec : force-les d'abord avec ton kit.",
        "Elle peut aussi **protéger ta backline** : écrase-toi sur un plongeur après qu'il a utilisé ses cooldowns.",
        "**Un pick et tu survis** valent mieux qu'une plongée suicide."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Jouer **en flanc** comme un Psylocke.",
        "Lancer grappin et boules **dans un bouclier**.",
        "Dasher **à travers le front** et mourir de l'autre côté.",
        "Plonger trop loin **pendant l'ult**.",
        "Oublier que les capacités **rechargent le canon**."
      ]
    }
  ],
  "counters": [
    {
      "hero": "emma-frost",
      "note": "Bouclier levé dès qu'elle entend ton grappin."
    },
    {
      "hero": "magneto",
      "note": "Sa bulle annule tes grappins."
    },
    {
      "hero": "the-thing",
      "note": "Tu ne peux pas le déplacer."
    },
    {
      "hero": "hela",
      "note": "Elle te domine à longue distance."
    },
    {
      "hero": "iron-man",
      "note": "Les bons volants esquivent tes boules."
    }
  ],
  "synergies": [
    {
      "hero": "groot",
      "note": "Il emmure chaque cible que tu attrapes."
    },
    {
      "hero": "magneto",
      "note": "Coupe les soins de tes cibles derrière son bouclier."
    },
    {
      "hero": "emma-frost",
      "note": "Même chose."
    },
    {
      "hero": "doctor-strange",
      "note": "Même chose."
    },
    {
      "hero": "the-punisher",
      "note": "Ensemble, vous faites fondre le front adverse."
    },
    {
      "hero": "peni-parker",
      "note": "Attire les ennemis dans ses mines."
    }
  ],
  "sources": [
    {
      "title": "Winter Soldier Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=mc--EjMwJgA"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'winter-soldier'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';

-- wolverine
insert into public.guides (kind, hero_id, status, content)
select 'hero', h.id, 'published', $json${
  "summary": "Wolverine est le roi du anti-tank : il attrape les ennemis, surtout les tanks, et les ramène dans son équipe pour les déchiqueter. Sa rage, qui monte au fil du combat, renforce tout son kit.",
  "tldr": [
    "**Ramène** les cibles dans ton équipe au lieu de plonger dans la leur.",
    "**Hurle avant** chaque attrape : tu deviens la cible de tout le monde.",
    "Garde ta **rage** haute sans te sacrifier pour elle."
  ],
  "difficulty": 2,
  "tags": [
    "Anti-tank",
    "Déplacement d'ennemis",
    "Rage",
    "Brawl"
  ],
  "sections": [
    {
      "title": "Philosophie de jeu",
      "kind": "tips",
      "lead": "Wolverine ne flanque presque jamais : il rôde dans l'ombre et ramène les cibles vers son équipe.",
      "items": [
        "Les **tanks** sont ta cible principale, mais un **support prêt à ult** ramené chez toi vaut aussi beaucoup.",
        "Contre une compo **dive**, joue en gardien de ta backline et emporte le Venom qui plonge.",
        "Avec une **ult de Gambit**, tu peux plonger sur les supports et faire beaucoup d'espace.",
        "Quand l'ennemi a son **ult de DPS** clé (Storm), harcèle ce joueur pour qu'il ne puisse jamais la lancer.",
        "Sans tank à attraper (un Captain America seul), **change de DPS**."
      ]
    },
    {
      "title": "Rage et régénération",
      "ability": "Berserker Rage · Regenerative Healing Factor",
      "lead": "Tes attaques et les dégâts que tu prends remplissent ta rage, qui augmente tes dégâts. Ton passif te sauve de la mort une fois de temps en temps, avec plus de vie bonus si ta rage est haute.",
      "items": [
        "La rage **diminue avec le temps** : reste actif.",
        "Chaque élimination ou assistance **réduit le temps de recharge** de ta survie : enchaîne les fights gagnés.",
        "Une fois ta survie déclenchée, tu peux **rester agressif** quelques secondes pour finir ton pick."
      ]
    },
    {
      "title": "Griffes et bond",
      "ability": "Savage Claw · Vicious Rampage",
      "key": "Clic G · Clic D",
      "lead": "Des coups de griffes dont les dégâts dépendent de la vie maximale de la cible (donc très forts sur les tanks), et un bond court qui frappe pareil.",
      "items": [
        "En début de fight, frappe pour **remplir ta rage**, puis passe aux attrapes.",
        "Le bond est surtout ta **sortie de secours**.",
        "Il sert aussi à **rattraper** une cible qui fuit, ou à **passer derrière un tank** avant de l'attraper."
      ]
    },
    {
      "title": "Hurlement",
      "ability": "Undying Animal",
      "lead": "Tu encaisses beaucoup moins de dégâts pendant quelques secondes.",
      "items": [
        "**Avant chaque attrape** : tout le lobby va te tirer dessus.",
        "Joue près des couverts pour **ne pas avoir à l'utiliser trop tôt**.",
        "Astuce : hurle puis bondis dans le **météore de Magneto** pour le bloquer."
      ]
    },
    {
      "title": "Attrape",
      "ability": "Feral Leap",
      "lead": "Tu bondis, saisis une cible et l'écrases au sol en l'étourdissant. Ensuite, tes griffes frappent beaucoup plus vite pendant un moment.",
      "items": [
        "Combo fiable : **bond pour te rapprocher, puis attrape** : presque impossible à rater.",
        "Après l'attrape, tes griffes rapides font **fondre un tank** en quelques secondes.",
        "Sur certaines cartes, emporte la cible **dans le vide**.",
        "Le **Star-Lord** prêt à ult sans contre de ton côté ? Ramène-le chez toi.",
        "Astuce : en sortant du spawn, **bond puis hurlement** pour annuler l'animation et filer plus vite."
      ]
    },
    {
      "title": "Ultime",
      "ability": "Last Stand",
      "key": "Q",
      "lead": "Tu projettes les ennemis devant toi en l'air, puis les écrases au sol en les étourdissant. Les dégâts dépendent de leur vie maximale et de ta rage.",
      "items": [
        "L'ult ne donne **pas les griffes rapides** : fais d'abord une attrape, puis l'ult.",
        "Vise **assez en pente** à l'atterrissage pour ne rater personne.",
        "Elle **sort un support de son ult** : Invisible Woman, Cloak & Dagger sans intangibilité.",
        "Pas besoin de toucher tout le monde : **l'ult la plus utile** vaut mieux que la plus spectaculaire."
      ]
    },
    {
      "title": "Erreurs fréquentes",
      "kind": "mistakes",
      "items": [
        "Plonger **chez l'ennemi** au lieu de ramener la cible.",
        "Attraper **sans hurler** avant.",
        "Gâcher le hurlement **en début de fight**.",
        "Lancer l'ult **sans attrape** préalable.",
        "Insister contre une **Invisible Woman** qui annule tes attrapes."
      ]
    }
  ],
  "counters": [
    {
      "hero": "invisible-woman",
      "note": "Son attraction annule tes attrapes. À bannir."
    },
    {
      "hero": "magneto",
      "note": "Sa bulle protège ta cible."
    },
    {
      "hero": "emma-frost",
      "note": "Force d'abord sa forme de diamant."
    },
    {
      "hero": "captain-america",
      "note": "Il t'esquive toute la partie."
    },
    {
      "hero": "hela",
      "note": "Elle n'a pas besoin de s'approcher."
    },
    {
      "hero": "iron-man",
      "note": "Les volants sont pénibles à attraper."
    }
  ],
  "synergies": [
    {
      "hero": "the-thing",
      "note": "Un brawler qui te fait entrer dans le fight."
    },
    {
      "hero": "hulk",
      "note": "Même chose."
    },
    {
      "hero": "phoenix",
      "note": "Ses explosions finissent tes cibles."
    },
    {
      "hero": "magneto",
      "note": "Sa bulle protège tes attrapes."
    },
    {
      "hero": "winter-soldier",
      "note": "Un DPS qui suit tes attrapes."
    },
    {
      "hero": "jeff-the-land-shark",
      "note": "Ses bulles de vitesse t'aident à rôder."
    },
    {
      "hero": "rocket-raccoon",
      "note": "Son pack de saut emporte tes cibles encore plus loin."
    }
  ],
  "sources": [
    {
      "title": "Wolverine Guide",
      "author": "Paz (padswagger)",
      "url": "https://www.youtube.com/watch?v=J2sqWAV2ubs"
    }
  ],
  "patch_note": "Guide tiré d'une vidéo de Paz (padswagger), reformulé en français. Les chiffres du kit et les team-ups ont été retirés car ils changent à chaque saison : vérifie en jeu."
}$json$::jsonb
from public.heroes h where h.slug = 'wolverine'
on conflict (hero_id) where kind = 'hero'
do update set content = excluded.content, status = 'published';
