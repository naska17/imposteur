# 🎭 Imposteur — Jeu Multijoueur

Jeu de l'imposteur en ligne, multijoueur en temps réel avec WebSocket.

## Rôles

- **👤 Civil** : reçoit le mot principal, doit trouver l'imposteur
- **🕵️ Imposteur** : reçoit un mot similaire, doit se fondre dans le groupe
- **🎩 Mr. White** : n'a aucun mot, peut deviner le mot s'il est éliminé

## Lancement rapide

```bash
npm install
npm start
# → http://localhost:3000
```

## Déploiement Docker (homelab)

```bash
docker compose up -d --build
```

## Déploiement gratuit

### Render.com (recommandé)
1. Push le projet sur GitHub
2. Créer un **Web Service** sur render.com
3. Build: `npm install` / Start: `node server.js`
4. Plan gratuit disponible

### Railway.app
1. Connecter le repo GitHub
2. Le déploiement est automatique
3. Plan gratuit avec 500h/mois

### Fly.io
```bash
fly launch
fly deploy
```

## Stack technique

- **Backend** : Node.js + Express + Socket.IO
- **Frontend** : HTML/CSS/JS vanilla (single file)
- **Temps réel** : WebSocket (Socket.IO)
- **Aucune base de données** : tout en mémoire

## Configuration

Les paramètres sont ajustables dans le lobby par l'hôte :
- Nombre d'imposteurs (1-5)
- Nombre de Mr. White (0-3)
- Temps de discussion (30-600 sec)

## Structure

```
imposteur/
├── server.js           # Serveur Node.js + logique de jeu
├── public/
│   └── index.html      # Frontend complet (SPA)
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```
