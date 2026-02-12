const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(express.static(path.join(__dirname, 'public')));

// ─── Word Database ───────────────────────────────────────────────
const WORD_PAIRS = [
  // Animaux
  { category: 'Animaux', word: 'Chat', similar: 'Félin' },
  { category: 'Animaux', word: 'Chien', similar: 'Loup' },
  { category: 'Animaux', word: 'Aigle', similar: 'Faucon' },
  { category: 'Animaux', word: 'Dauphin', similar: 'Baleine' },
  { category: 'Animaux', word: 'Serpent', similar: 'Lézard' },
  { category: 'Animaux', word: 'Tigre', similar: 'Lion' },
  { category: 'Animaux', word: 'Cheval', similar: 'Âne' },
  { category: 'Animaux', word: 'Papillon', similar: 'Libellule' },
  { category: 'Animaux', word: 'Requin', similar: 'Orque' },
  { category: 'Animaux', word: 'Tortue', similar: 'Escargot' },
  { category: 'Animaux', word: 'Poule', similar: 'Canard' },
  { category: 'Animaux', word: 'Ours', similar: 'Panda' },
  { category: 'Animaux', word: 'Singe', similar: 'Gorille' },
  { category: 'Animaux', word: 'Lapin', similar: 'Lièvre' },
  { category: 'Animaux', word: 'Corbeau', similar: 'Pie' },
  { category: 'Animaux', word: 'Abeille', similar: 'Guêpe' },
  { category: 'Animaux', word: 'Grenouille', similar: 'Crapaud' },
  { category: 'Animaux', word: 'Girafe', similar: 'Éléphant' },

  // Nourriture
  { category: 'Nourriture', word: 'Pizza', similar: 'Tarte flambée' },
  { category: 'Nourriture', word: 'Sushi', similar: 'Maki' },
  { category: 'Nourriture', word: 'Croissant', similar: 'Pain au chocolat' },
  { category: 'Nourriture', word: 'Hamburger', similar: 'Sandwich' },
  { category: 'Nourriture', word: 'Chocolat', similar: 'Caramel' },
  { category: 'Nourriture', word: 'Crêpe', similar: 'Gaufre' },
  { category: 'Nourriture', word: 'Fromage', similar: 'Beurre' },
  { category: 'Nourriture', word: 'Pâtes', similar: 'Riz' },
  { category: 'Nourriture', word: 'Glace', similar: 'Sorbet' },
  { category: 'Nourriture', word: 'Baguette', similar: 'Pain de mie' },
  { category: 'Nourriture', word: 'Salade', similar: 'Soupe' },
  { category: 'Nourriture', word: 'Steak', similar: 'Côtelette' },
  { category: 'Nourriture', word: 'Omelette', similar: 'Quiche' },
  { category: 'Nourriture', word: 'Raclette', similar: 'Fondue' },
  { category: 'Nourriture', word: 'Macaron', similar: 'Meringue' },
  { category: 'Nourriture', word: 'Couscous', similar: 'Tajine' },
  { category: 'Nourriture', word: 'Ramen', similar: 'Pho' },
  { category: 'Nourriture', word: 'Tiramisu', similar: 'Panna cotta' },

  // Lieux
  { category: 'Lieux', word: 'Plage', similar: 'Piscine' },
  { category: 'Lieux', word: 'Montagne', similar: 'Colline' },
  { category: 'Lieux', word: 'Forêt', similar: 'Jungle' },
  { category: 'Lieux', word: 'Désert', similar: 'Savane' },
  { category: 'Lieux', word: 'Hôpital', similar: 'Clinique' },
  { category: 'Lieux', word: 'École', similar: 'Université' },
  { category: 'Lieux', word: 'Cinéma', similar: 'Théâtre' },
  { category: 'Lieux', word: 'Restaurant', similar: 'Café' },
  { category: 'Lieux', word: 'Aéroport', similar: 'Gare' },
  { category: 'Lieux', word: 'Musée', similar: 'Galerie' },
  { category: 'Lieux', word: 'Prison', similar: 'Caserne' },
  { category: 'Lieux', word: 'Château', similar: 'Palais' },
  { category: 'Lieux', word: 'Église', similar: 'Mosquée' },
  { category: 'Lieux', word: 'Stade', similar: 'Gymnase' },
  { category: 'Lieux', word: 'Bibliothèque', similar: 'Librairie' },
  { category: 'Lieux', word: 'Zoo', similar: 'Aquarium' },
  { category: 'Lieux', word: 'Grotte', similar: 'Caverne' },
  { category: 'Lieux', word: 'Phare', similar: 'Port' },

  // Sport
  { category: 'Sport', word: 'Football', similar: 'Rugby' },
  { category: 'Sport', word: 'Tennis', similar: 'Badminton' },
  { category: 'Sport', word: 'Natation', similar: 'Plongée' },
  { category: 'Sport', word: 'Basketball', similar: 'Handball' },
  { category: 'Sport', word: 'Ski', similar: 'Snowboard' },
  { category: 'Sport', word: 'Boxe', similar: 'Karaté' },
  { category: 'Sport', word: 'Surf', similar: 'Windsurf' },
  { category: 'Sport', word: 'Escalade', similar: 'Randonnée' },
  { category: 'Sport', word: 'Cyclisme', similar: 'Triathlon' },
  { category: 'Sport', word: 'Golf', similar: 'Croquet' },
  { category: 'Sport', word: 'Escrime', similar: 'Tir à l\'arc' },
  { category: 'Sport', word: 'Judo', similar: 'Lutte' },
  { category: 'Sport', word: 'Patinage', similar: 'Hockey' },
  { category: 'Sport', word: 'Yoga', similar: 'Pilates' },

  // Métiers
  { category: 'Métiers', word: 'Médecin', similar: 'Infirmier' },
  { category: 'Métiers', word: 'Pompier', similar: 'Policier' },
  { category: 'Métiers', word: 'Cuisinier', similar: 'Boulanger' },
  { category: 'Métiers', word: 'Avocat', similar: 'Juge' },
  { category: 'Métiers', word: 'Pilote', similar: 'Astronaute' },
  { category: 'Métiers', word: 'Architecte', similar: 'Ingénieur' },
  { category: 'Métiers', word: 'Acteur', similar: 'Réalisateur' },
  { category: 'Métiers', word: 'Professeur', similar: 'Éducateur' },
  { category: 'Métiers', word: 'Plombier', similar: 'Électricien' },
  { category: 'Métiers', word: 'Journaliste', similar: 'Écrivain' },
  { category: 'Métiers', word: 'Chirurgien', similar: 'Dentiste' },
  { category: 'Métiers', word: 'Photographe', similar: 'Vidéaste' },
  { category: 'Métiers', word: 'Musicien', similar: 'Chanteur' },
  { category: 'Métiers', word: 'Boucher', similar: 'Poissonnier' },

  // Objets
  { category: 'Objets', word: 'Téléphone', similar: 'Tablette' },
  { category: 'Objets', word: 'Voiture', similar: 'Moto' },
  { category: 'Objets', word: 'Guitare', similar: 'Violon' },
  { category: 'Objets', word: 'Livre', similar: 'Journal' },
  { category: 'Objets', word: 'Montre', similar: 'Horloge' },
  { category: 'Objets', word: 'Miroir', similar: 'Fenêtre' },
  { category: 'Objets', word: 'Parapluie', similar: 'Parasol' },
  { category: 'Objets', word: 'Couteau', similar: 'Ciseaux' },
  { category: 'Objets', word: 'Chaise', similar: 'Tabouret' },
  { category: 'Objets', word: 'Lampe', similar: 'Bougie' },
  { category: 'Objets', word: 'Valise', similar: 'Sac à dos' },
  { category: 'Objets', word: 'Clé', similar: 'Cadenas' },
  { category: 'Objets', word: 'Épée', similar: 'Lance' },
  { category: 'Objets', word: 'Télescope', similar: 'Microscope' },
  { category: 'Objets', word: 'Ballon', similar: 'Frisbee' },
  { category: 'Objets', word: 'Stylo', similar: 'Crayon' },

  // Films / Séries / Culture
  { category: 'Culture', word: 'Harry Potter', similar: 'Le Seigneur des Anneaux' },
  { category: 'Culture', word: 'Star Wars', similar: 'Star Trek' },
  { category: 'Culture', word: 'Batman', similar: 'Spider-Man' },
  { category: 'Culture', word: 'Titanic', similar: 'Poséidon' },
  { category: 'Culture', word: 'Mario', similar: 'Sonic' },
  { category: 'Culture', word: 'Minecraft', similar: 'Terraria' },
  { category: 'Culture', word: 'Fortnite', similar: 'PUBG' },
  { category: 'Culture', word: 'Netflix', similar: 'Disney+' },
  { category: 'Culture', word: 'TikTok', similar: 'Instagram' },
  { category: 'Culture', word: 'YouTube', similar: 'Twitch' },
  { category: 'Culture', word: 'Pokémon', similar: 'Digimon' },
  { category: 'Culture', word: 'League of Legends', similar: 'Dota 2' },
  { category: 'Culture', word: 'GTA', similar: 'Saints Row' },
  { category: 'Culture', word: 'Naruto', similar: 'Dragon Ball' },

  // Musique
  { category: 'Musique', word: 'Rap', similar: 'Hip-hop' },
  { category: 'Musique', word: 'Rock', similar: 'Metal' },
  { category: 'Musique', word: 'Jazz', similar: 'Blues' },
  { category: 'Musique', word: 'Piano', similar: 'Orgue' },
  { category: 'Musique', word: 'Batterie', similar: 'Djembé' },
  { category: 'Musique', word: 'Opéra', similar: 'Comédie musicale' },
  { category: 'Musique', word: 'Techno', similar: 'House' },
  { category: 'Musique', word: 'Reggae', similar: 'Dancehall' },
  { category: 'Musique', word: 'Karaoké', similar: 'Concert' },
  { category: 'Musique', word: 'Trompette', similar: 'Saxophone' },

  // Nature
  { category: 'Nature', word: 'Volcan', similar: 'Geyser' },
  { category: 'Nature', word: 'Océan', similar: 'Mer' },
  { category: 'Nature', word: 'Tornade', similar: 'Ouragan' },
  { category: 'Nature', word: 'Éclipse', similar: 'Aurore boréale' },
  { category: 'Nature', word: 'Arc-en-ciel', similar: 'Mirage' },
  { category: 'Nature', word: 'Glacier', similar: 'Iceberg' },
  { category: 'Nature', word: 'Cascade', similar: 'Rapides' },
  { category: 'Nature', word: 'Soleil', similar: 'Lune' },
  { category: 'Nature', word: 'Éclair', similar: 'Tonnerre' },
  { category: 'Nature', word: 'Rose', similar: 'Tulipe' },
  { category: 'Nature', word: 'Champignon', similar: 'Truffe' },
  { category: 'Nature', word: 'Bambou', similar: 'Palmier' },

  // Véhicules / Transport
  { category: 'Transport', word: 'Avion', similar: 'Hélicoptère' },
  { category: 'Transport', word: 'Train', similar: 'Tramway' },
  { category: 'Transport', word: 'Bateau', similar: 'Sous-marin' },
  { category: 'Transport', word: 'Vélo', similar: 'Trottinette' },
  { category: 'Transport', word: 'Fusée', similar: 'Satellite' },
  { category: 'Transport', word: 'Bus', similar: 'Métro' },
  { category: 'Transport', word: 'Taxi', similar: 'Uber' },
  { category: 'Transport', word: 'Camion', similar: 'Fourgon' },

  // Pays / Villes
  { category: 'Géographie', word: 'France', similar: 'Italie' },
  { category: 'Géographie', word: 'Japon', similar: 'Corée' },
  { category: 'Géographie', word: 'Paris', similar: 'Londres' },
  { category: 'Géographie', word: 'New York', similar: 'Los Angeles' },
  { category: 'Géographie', word: 'Pyramides', similar: 'Sphinx' },
  { category: 'Géographie', word: 'Amazonie', similar: 'Congo' },
  { category: 'Géographie', word: 'Sahara', similar: 'Gobi' },
  { category: 'Géographie', word: 'Antarctique', similar: 'Arctique' },
  { category: 'Géographie', word: 'Brésil', similar: 'Argentine' },
  { category: 'Géographie', word: 'Égypte', similar: 'Grèce' },
  { category: 'Géographie', word: 'Australie', similar: 'Nouvelle-Zélande' },
  { category: 'Géographie', word: 'Russie', similar: 'Canada' },

  // Émotions / Concepts
  { category: 'Concepts', word: 'Amour', similar: 'Passion' },
  { category: 'Concepts', word: 'Liberté', similar: 'Indépendance' },
  { category: 'Concepts', word: 'Rêve', similar: 'Cauchemar' },
  { category: 'Concepts', word: 'Courage', similar: 'Bravoure' },
  { category: 'Concepts', word: 'Nostalgie', similar: 'Mélancolie' },
  { category: 'Concepts', word: 'Justice', similar: 'Équité' },
  { category: 'Concepts', word: 'Mystère', similar: 'Énigme' },
  { category: 'Concepts', word: 'Chaos', similar: 'Anarchie' },
  { category: 'Concepts', word: 'Magie', similar: 'Sorcellerie' },
  { category: 'Concepts', word: 'Destin', similar: 'Hasard' },

  // Sciences
  { category: 'Sciences', word: 'ADN', similar: 'ARN' },
  { category: 'Sciences', word: 'Atome', similar: 'Molécule' },
  { category: 'Sciences', word: 'Gravité', similar: 'Magnétisme' },
  { category: 'Sciences', word: 'Robot', similar: 'Intelligence artificielle' },
  { category: 'Sciences', word: 'Dinosaure', similar: 'Mammouth' },
  { category: 'Sciences', word: 'Bactérie', similar: 'Virus' },
  { category: 'Sciences', word: 'Laser', similar: 'Radar' },
  { category: 'Sciences', word: 'Trou noir', similar: 'Supernova' },

  // Vêtements
  { category: 'Vêtements', word: 'Jean', similar: 'Pantalon' },
  { category: 'Vêtements', word: 'Costume', similar: 'Smoking' },
  { category: 'Vêtements', word: 'Baskets', similar: 'Chaussures' },
  { category: 'Vêtements', word: 'Chapeau', similar: 'Casquette' },
  { category: 'Vêtements', word: 'Écharpe', similar: 'Foulard' },
  { category: 'Vêtements', word: 'Pyjama', similar: 'Robe de chambre' },
  { category: 'Vêtements', word: 'Bikini', similar: 'Maillot de bain' },
  { category: 'Vêtements', word: 'Lunettes', similar: 'Monocle' },

  // Fêtes / Événements
  { category: 'Événements', word: 'Noël', similar: 'Nouvel An' },
  { category: 'Événements', word: 'Halloween', similar: 'Carnaval' },
  { category: 'Événements', word: 'Mariage', similar: 'Fiançailles' },
  { category: 'Événements', word: 'Festival', similar: 'Foire' },
  { category: 'Événements', word: 'Anniversaire', similar: 'Baptême' },
  { category: 'Événements', word: 'Concert', similar: 'Spectacle' },
  { category: 'Événements', word: 'Cirque', similar: 'Fête foraine' },
  { category: 'Événements', word: 'Marathon', similar: 'Course' },

  // Personnages / Mythologie
  { category: 'Mythologie', word: 'Vampire', similar: 'Loup-garou' },
  { category: 'Mythologie', word: 'Dragon', similar: 'Phénix' },
  { category: 'Mythologie', word: 'Zombie', similar: 'Momie' },
  { category: 'Mythologie', word: 'Pirate', similar: 'Viking' },
  { category: 'Mythologie', word: 'Sirène', similar: 'Triton' },
  { category: 'Mythologie', word: 'Fantôme', similar: 'Esprit' },
  { category: 'Mythologie', word: 'Ange', similar: 'Démon' },
  { category: 'Mythologie', word: 'Licorne', similar: 'Pégase' },
  { category: 'Mythologie', word: 'Ninja', similar: 'Samouraï' },
  { category: 'Mythologie', word: 'Sorcière', similar: 'Fée' },

  // Technologie
  { category: 'Technologie', word: 'Bluetooth', similar: 'Wi-Fi' },
  { category: 'Technologie', word: 'Imprimante', similar: 'Scanner' },
  { category: 'Technologie', word: 'Drone', similar: 'Télécommande' },
  { category: 'Technologie', word: 'Casque VR', similar: 'Lunettes 3D' },
  { category: 'Technologie', word: 'Clé USB', similar: 'Disque dur' },
  { category: 'Technologie', word: 'Console', similar: 'PC gamer' },
  { category: 'Technologie', word: 'Webcam', similar: 'Caméra' },
  { category: 'Technologie', word: 'Firewall', similar: 'Antivirus' },
];

// ─── Room Management ─────────────────────────────────────────────
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createRoom(hostSocketId) {
  let code;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const room = {
    code,
    hostId: hostSocketId,
    players: new Map(),
    state: 'lobby', // lobby | playing | voting | results
    round: 0,
    settings: {
      impostorCount: 1,
      mrWhiteCount: 0,
      discussionTime: 120,
    },
    currentWord: null,
    currentSimilar: null,
    currentCategory: null,
    votes: new Map(),
    eliminated: [],
    usedWordIndices: new Set(),
  };

  rooms.set(code, room);
  return room;
}

function getRandomWordPair(room) {
  if (room.usedWordIndices.size >= WORD_PAIRS.length) {
    room.usedWordIndices.clear();
  }
  let index;
  do {
    index = Math.floor(Math.random() * WORD_PAIRS.length);
  } while (room.usedWordIndices.has(index));
  room.usedWordIndices.add(index);
  return WORD_PAIRS[index];
}

function assignRoles(room) {
  const playerIds = Array.from(room.players.keys()).filter(
    (id) => !room.eliminated.includes(id)
  );
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);

  const { impostorCount, mrWhiteCount } = room.settings;
  const impostors = shuffled.slice(0, impostorCount);
  const mrWhites = shuffled.slice(impostorCount, impostorCount + mrWhiteCount);
  const civilians = shuffled.slice(impostorCount + mrWhiteCount);

  const wordPair = getRandomWordPair(room);
  room.currentWord = wordPair.word;
  room.currentSimilar = wordPair.similar;
  room.currentCategory = wordPair.category;

  for (const [id, player] of room.players) {
    if (room.eliminated.includes(id)) {
      player.role = 'eliminated';
      player.word = null;
      continue;
    }
    if (impostors.includes(id)) {
      player.role = 'impostor';
      player.word = wordPair.similar;
    } else if (mrWhites.includes(id)) {
      player.role = 'mr_white';
      player.word = null;
    } else {
      player.role = 'civil';
      player.word = wordPair.word;
    }
  }
}

function getRoomPublicState(room) {
  const players = [];
  for (const [id, player] of room.players) {
    players.push({
      id,
      name: player.name,
      avatar: player.avatar,
      isHost: id === room.hostId,
      isEliminated: room.eliminated.includes(id),
      score: player.score || 0,
    });
  }
  return {
    code: room.code,
    state: room.state,
    players,
    round: room.round,
    settings: room.settings,
    hostId: room.hostId,
  };
}

// ─── Socket.IO Events ────────────────────────────────────────────
io.on('connection', (socket) => {
  let currentRoom = null;

  socket.on('create_room', ({ name, avatar }) => {
    const room = createRoom(socket.id);
    room.players.set(socket.id, {
      name,
      avatar,
      role: null,
      word: null,
      score: 0,
    });
    socket.join(room.code);
    currentRoom = room.code;
    socket.emit('room_created', { code: room.code });
    io.to(room.code).emit('room_update', getRoomPublicState(room));
  });

  socket.on('join_room', ({ code, name, avatar }) => {
    const roomCode = code.toUpperCase().trim();
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('error_msg', { message: 'Salon introuvable.' });
      return;
    }
    if (room.state !== 'lobby') {
      socket.emit('error_msg', { message: 'La partie est déjà en cours.' });
      return;
    }
    if (room.players.size >= 20) {
      socket.emit('error_msg', { message: 'Le salon est plein (max 20).' });
      return;
    }

    // Check duplicate name
    for (const [, p] of room.players) {
      if (p.name.toLowerCase() === name.toLowerCase()) {
        socket.emit('error_msg', { message: 'Ce pseudo est déjà pris.' });
        return;
      }
    }

    room.players.set(socket.id, {
      name,
      avatar,
      role: null,
      word: null,
      score: 0,
    });
    socket.join(roomCode);
    currentRoom = roomCode;
    socket.emit('room_joined', { code: roomCode });
    io.to(roomCode).emit('room_update', getRoomPublicState(room));
  });

  socket.on('update_settings', ({ impostorCount, mrWhiteCount, discussionTime }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || socket.id !== room.hostId) return;

    room.settings.impostorCount = Math.max(1, Math.min(impostorCount || 1, 5));
    room.settings.mrWhiteCount = Math.max(0, Math.min(mrWhiteCount || 0, 3));
    room.settings.discussionTime = Math.max(30, Math.min(discussionTime || 120, 600));

    io.to(currentRoom).emit('room_update', getRoomPublicState(room));
  });

  socket.on('start_game', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || socket.id !== room.hostId) return;

    const activePlayers = Array.from(room.players.keys()).filter(
      (id) => !room.eliminated.includes(id)
    );

    const minPlayers = 3;
    if (activePlayers.length < minPlayers) {
      socket.emit('error_msg', {
        message: `Il faut au moins ${minPlayers} joueurs pour commencer.`,
      });
      return;
    }

    const totalSpecial = room.settings.impostorCount + room.settings.mrWhiteCount;
    if (totalSpecial >= activePlayers.length) {
      socket.emit('error_msg', {
        message: 'Il faut au moins un civil ! Réduisez le nombre d\'imposteurs/Mr White.',
      });
      return;
    }

    room.round++;
    room.state = 'playing';
    room.votes.clear();
    room.eliminated = [];

    assignRoles(room);

    // Send each player their personal info
    for (const [id, player] of room.players) {
      io.to(id).emit('game_started', {
        role: player.role,
        word: player.word,
        category: room.currentCategory,
      });
    }

    io.to(currentRoom).emit('room_update', getRoomPublicState(room));
  });

  socket.on('start_vote', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || socket.id !== room.hostId) return;
    if (room.state !== 'playing') return;

    room.state = 'voting';
    room.votes.clear();
    io.to(currentRoom).emit('vote_started');
    io.to(currentRoom).emit('room_update', getRoomPublicState(room));
  });

  socket.on('cast_vote', ({ targetId }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.state !== 'voting') return;
    if (room.eliminated.includes(socket.id)) return;

    room.votes.set(socket.id, targetId);

    // Broadcast vote count
    const activePlayers = Array.from(room.players.keys()).filter(
      (id) => !room.eliminated.includes(id)
    );
    io.to(currentRoom).emit('vote_update', {
      votedCount: room.votes.size,
      totalVoters: activePlayers.length,
    });

    // Check if all voted
    if (room.votes.size >= activePlayers.length) {
      resolveVote(room);
    }
  });

  socket.on('force_end_vote', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || socket.id !== room.hostId) return;
    if (room.state !== 'voting') return;
    resolveVote(room);
  });

  socket.on('mr_white_guess', ({ guess }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player || player.role !== 'mr_white') return;

    const isCorrect =
      guess.trim().toLowerCase() === room.currentWord.trim().toLowerCase();

    io.to(currentRoom).emit('mr_white_guess_result', {
      playerName: player.name,
      guess,
      isCorrect,
      actualWord: room.currentWord,
    });

    if (isCorrect) {
      player.score += 3;
      // Mr. White wins if they guess correctly
      io.to(currentRoom).emit('game_message', {
        type: 'success',
        text: `🎩 ${player.name} (Mr. White) a trouvé le mot "${room.currentWord}" ! Il gagne la partie !`,
      });
    }
  });

  socket.on('next_round', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || socket.id !== room.hostId) return;

    room.state = 'lobby';
    room.votes.clear();
    room.eliminated = [];

    for (const [, player] of room.players) {
      player.role = null;
      player.word = null;
    }

    io.to(currentRoom).emit('room_update', getRoomPublicState(room));
    io.to(currentRoom).emit('back_to_lobby');
  });

  socket.on('kick_player', ({ targetId }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || socket.id !== room.hostId) return;
    if (targetId === socket.id) return;

    room.players.delete(targetId);
    const targetSocket = io.sockets.sockets.get(targetId);
    if (targetSocket) {
      targetSocket.emit('kicked');
      targetSocket.leave(currentRoom);
    }
    io.to(currentRoom).emit('room_update', getRoomPublicState(room));
  });

  function resolveVote(room) {
    const voteCounts = new Map();
    for (const [, targetId] of room.votes) {
      voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
    }

    let maxVotes = 0;
    let eliminated = null;
    let isTie = false;

    for (const [id, count] of voteCounts) {
      if (count > maxVotes) {
        maxVotes = count;
        eliminated = id;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    }

    const voteDetails = {};
    for (const [voterId, targetId] of room.votes) {
      const voter = room.players.get(voterId);
      const target = room.players.get(targetId);
      if (voter && target) {
        voteDetails[voter.name] = target.name;
      }
    }

    if (isTie || !eliminated) {
      room.state = 'playing';
      io.to(room.code).emit('vote_result', {
        tie: true,
        voteDetails,
        message: 'Égalité ! Personne n\'est éliminé. Continuez à discuter.',
      });
      io.to(room.code).emit('room_update', getRoomPublicState(room));
      return;
    }

    const eliminatedPlayer = room.players.get(eliminated);
    room.eliminated.push(eliminated);

    const result = {
      tie: false,
      eliminatedName: eliminatedPlayer.name,
      eliminatedRole: eliminatedPlayer.role,
      eliminatedId: eliminated,
      voteDetails,
    };

    // Check for Mr. White last word
    if (eliminatedPlayer.role === 'mr_white') {
      room.state = 'mr_white_guess';
      io.to(room.code).emit('vote_result', result);
      io.to(eliminated).emit('mr_white_can_guess');
      io.to(room.code).emit('room_update', getRoomPublicState(room));
      return;
    }

    // Check win conditions
    const winResult = checkWinCondition(room);
    if (winResult) {
      room.state = 'results';
      result.gameOver = true;
      result.winResult = winResult;

      // Reveal all roles
      result.allRoles = {};
      for (const [id, player] of room.players) {
        result.allRoles[player.name] = {
          role: player.role,
          word: player.word,
        };
      }
      result.civilWord = room.currentWord;
      result.impostorWord = room.currentSimilar;

      // Update scores
      updateScores(room, winResult);
    } else {
      room.state = 'playing';
    }

    io.to(room.code).emit('vote_result', result);
    io.to(room.code).emit('room_update', getRoomPublicState(room));
  }

  function checkWinCondition(room) {
    const alive = Array.from(room.players.entries()).filter(
      ([id]) => !room.eliminated.includes(id)
    );
    const impostorsAlive = alive.filter(
      ([, p]) => p.role === 'impostor' || p.role === 'mr_white'
    );
    const civiliansAlive = alive.filter(([, p]) => p.role === 'civil');

    if (impostorsAlive.length === 0) {
      return { winner: 'civilians', message: '🎉 Les Civils ont gagné !' };
    }
    if (impostorsAlive.length >= civiliansAlive.length) {
      return {
        winner: 'impostors',
        message: '😈 Les Imposteurs ont gagné !',
      };
    }
    return null;
  }

  function updateScores(room, winResult) {
    for (const [id, player] of room.players) {
      if (winResult.winner === 'civilians' && player.role === 'civil') {
        player.score += 2;
      } else if (
        winResult.winner === 'impostors' &&
        (player.role === 'impostor' || player.role === 'mr_white')
      ) {
        player.score += 3;
      }
    }
  }

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    room.players.delete(socket.id);

    if (room.players.size === 0) {
      rooms.delete(currentRoom);
      return;
    }

    // Transfer host
    if (socket.id === room.hostId) {
      room.hostId = room.players.keys().next().value;
      io.to(currentRoom).emit('game_message', {
        type: 'info',
        text: `${room.players.get(room.hostId)?.name} est maintenant l'hôte.`,
      });
    }

    io.to(currentRoom).emit('room_update', getRoomPublicState(room));

    // If game in progress, check win condition
    if (room.state === 'playing' || room.state === 'voting') {
      const winResult = checkWinCondition(room);
      if (winResult) {
        room.state = 'results';
        const result = {
          gameOver: true,
          winResult,
          allRoles: {},
          civilWord: room.currentWord,
          impostorWord: room.currentSimilar,
        };
        for (const [, player] of room.players) {
          result.allRoles[player.name] = {
            role: player.role,
            word: player.word,
          };
        }
        io.to(currentRoom).emit('vote_result', result);
        io.to(currentRoom).emit('room_update', getRoomPublicState(room));
      }
    }
  });
});

// ─── Cleanup stale rooms ────────────────────────────────────────
setInterval(() => {
  for (const [code, room] of rooms) {
    if (room.players.size === 0) {
      rooms.delete(code);
    }
  }
}, 60000);

// ─── Start Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎭 Serveur Imposteur lancé sur le port ${PORT}`);
  console.log(`   → http://localhost:${PORT}`);
});
