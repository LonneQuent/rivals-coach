-- Rivals Coach — données de départ des référentiels (saison 10.5).
-- Modifiables ensuite dans l'app (Admin > Référentiels). À exécuter après 0001_init.sql.

insert into public.game_modes (name, sort) values
  ('Domination', 0),
  ('Convoi', 1),
  ('Convergence', 2),
  ('Conquête', 3),
  ('Doom Match', 4),
  ('Autre', 5)
on conflict (name) do nothing;

insert into public.queues (name, sort) values
  ('Classé', 0),
  ('Partie rapide', 1),
  ('Arcade', 2),
  ('Tournoi / scrim', 3)
on conflict (name) do nothing;

insert into public.ranks (name, tier_order) values
  ('Bronze III', 0),
  ('Bronze II', 1),
  ('Bronze I', 2),
  ('Argent III', 3),
  ('Argent II', 4),
  ('Argent I', 5),
  ('Or III', 6),
  ('Or II', 7),
  ('Or I', 8),
  ('Platine III', 9),
  ('Platine II', 10),
  ('Platine I', 11),
  ('Diamant III', 12),
  ('Diamant II', 13),
  ('Diamant I', 14),
  ('Grand Maître III', 15),
  ('Grand Maître II', 16),
  ('Grand Maître I', 17),
  ('Céleste III', 18),
  ('Céleste II', 19),
  ('Céleste I', 20),
  ('Éternité', 21),
  ('One Above All', 22)
on conflict (name) do nothing;

insert into public.error_tags (name, sort) values
  ('Positionnement', 0),
  ('Ult mal utilisée', 1),
  ('Tilt', 2),
  ('Comms', 3),
  ('Focus', 4),
  ('Mauvais pick', 5),
  ('Cooldowns', 6)
on conflict (name) do nothing;

insert into public.heroes (slug, name, roles) values
  ('angela', 'Angela', array['Vanguard']::public.hero_role[]),
  ('captain-america', 'Captain America', array['Vanguard']::public.hero_role[]),
  ('deadpool', 'Deadpool', array['Vanguard', 'Duelist', 'Strategist']::public.hero_role[]),
  ('devil-dinosaur', 'Devil Dinosaur', array['Vanguard']::public.hero_role[]),
  ('doctor-strange', 'Doctor Strange', array['Vanguard']::public.hero_role[]),
  ('emma-frost', 'Emma Frost', array['Vanguard']::public.hero_role[]),
  ('groot', 'Groot', array['Vanguard']::public.hero_role[]),
  ('the-hood', 'The Hood', array['Vanguard']::public.hero_role[]),
  ('hulk', 'Hulk', array['Vanguard']::public.hero_role[]),
  ('magneto', 'Magneto', array['Vanguard']::public.hero_role[]),
  ('peni-parker', 'Peni Parker', array['Vanguard']::public.hero_role[]),
  ('rogue', 'Rogue', array['Vanguard']::public.hero_role[]),
  ('thor', 'Thor', array['Vanguard']::public.hero_role[]),
  ('the-thing', 'The Thing', array['Vanguard']::public.hero_role[]),
  ('venom', 'Venom', array['Vanguard']::public.hero_role[]),
  ('black-cat', 'Black Cat', array['Duelist']::public.hero_role[]),
  ('black-panther', 'Black Panther', array['Duelist']::public.hero_role[]),
  ('black-widow', 'Black Widow', array['Duelist']::public.hero_role[]),
  ('blade', 'Blade', array['Duelist']::public.hero_role[]),
  ('cyclops', 'Cyclops', array['Duelist']::public.hero_role[]),
  ('daredevil', 'Daredevil', array['Duelist']::public.hero_role[]),
  ('elsa-bloodstone', 'Elsa Bloodstone', array['Duelist']::public.hero_role[]),
  ('gorr-the-god-butcher', 'Gorr the God Butcher', array['Duelist']::public.hero_role[]),
  ('hawkeye', 'Hawkeye', array['Duelist']::public.hero_role[]),
  ('hela', 'Hela', array['Duelist']::public.hero_role[]),
  ('human-torch', 'Human Torch', array['Duelist']::public.hero_role[]),
  ('iron-fist', 'Iron Fist', array['Duelist']::public.hero_role[]),
  ('iron-man', 'Iron Man', array['Duelist']::public.hero_role[]),
  ('magik', 'Magik', array['Duelist']::public.hero_role[]),
  ('mister-fantastic', 'Mister Fantastic', array['Duelist']::public.hero_role[]),
  ('moon-knight', 'Moon Knight', array['Duelist']::public.hero_role[]),
  ('namor', 'Namor', array['Duelist']::public.hero_role[]),
  ('phoenix', 'Phoenix', array['Duelist']::public.hero_role[]),
  ('psylocke', 'Psylocke', array['Duelist']::public.hero_role[]),
  ('the-punisher', 'The Punisher', array['Duelist']::public.hero_role[]),
  ('scarlet-witch', 'Scarlet Witch', array['Duelist']::public.hero_role[]),
  ('spider-man', 'Spider-Man', array['Duelist']::public.hero_role[]),
  ('squirrel-girl', 'Squirrel Girl', array['Duelist']::public.hero_role[]),
  ('star-lord', 'Star-Lord', array['Duelist']::public.hero_role[]),
  ('storm', 'Storm', array['Duelist']::public.hero_role[]),
  ('winter-soldier', 'Winter Soldier', array['Duelist']::public.hero_role[]),
  ('wolverine', 'Wolverine', array['Duelist']::public.hero_role[]),
  ('adam-warlock', 'Adam Warlock', array['Strategist']::public.hero_role[]),
  ('cloak-and-dagger', 'Cloak & Dagger', array['Strategist']::public.hero_role[]),
  ('gambit', 'Gambit', array['Strategist']::public.hero_role[]),
  ('invisible-woman', 'Invisible Woman', array['Strategist']::public.hero_role[]),
  ('jeff-the-land-shark', 'Jeff the Land Shark', array['Strategist']::public.hero_role[]),
  ('jubilee', 'Jubilee', array['Strategist']::public.hero_role[]),
  ('loki', 'Loki', array['Strategist']::public.hero_role[]),
  ('luna-snow', 'Luna Snow', array['Strategist']::public.hero_role[]),
  ('mantis', 'Mantis', array['Strategist']::public.hero_role[]),
  ('rocket-raccoon', 'Rocket Raccoon', array['Strategist']::public.hero_role[]),
  ('ultron', 'Ultron', array['Strategist']::public.hero_role[]),
  ('white-fox', 'White Fox', array['Strategist']::public.hero_role[])
on conflict (slug) do nothing;

insert into public.maps (name, game_mode_id) values
  ('Yggsgard: Royal Palace', (select id from public.game_modes where name = 'Domination')),
  ('Wakanda: Birnin T''Challa', (select id from public.game_modes where name = 'Domination')),
  ('Hydra Charteris Base: Hell''s Heaven', (select id from public.game_modes where name = 'Domination')),
  ('Hellfire Gala: Krakoa', (select id from public.game_modes where name = 'Domination')),
  ('Yggsgard: Yggdrasill Path', (select id from public.game_modes where name = 'Convoi')),
  ('Tokyo 2099: Spider-Islands', (select id from public.game_modes where name = 'Convoi')),
  ('Empire of Eternal Night: Midtown', (select id from public.game_modes where name = 'Convoi')),
  ('Hellfire Gala: Arakko', (select id from public.game_modes where name = 'Convoi')),
  ('Tokyo 2099: Shin-Shibuya', (select id from public.game_modes where name = 'Convergence')),
  ('Wakanda: Hall of Djalia', (select id from public.game_modes where name = 'Convergence')),
  ('Klyntar: Symbiotic Surface', (select id from public.game_modes where name = 'Convergence')),
  ('Empire of Eternal Night: Central Park', (select id from public.game_modes where name = 'Convergence'))
on conflict (name) do nothing;
