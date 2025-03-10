# OpenPokerStack 🎲 🇫🇷 
Un outil simple et open-source pour gérer vos tournois de poker facilement.

Bienvenue sur **OpenPokerStack**, une application web conçue pour vous aider à organiser vos tournois de poker sans effort. Que vous organisiez une soirée jeu entre amis ou un événement plus important, cet outil gère les blinds, le placement des joueurs et les éliminations pour vous—gratuitement et ouvert à tous !

## ✨ Fonctionnalités

### Configuration du Tournoi
- **Liste des Joueurs** ✍️ : Entrez les noms des joueurs (un par ligne) pour créer votre liste de participants.
- **Taille des Tables** 🪑 : Définissez le nombre maximum de joueurs par table (ex. : 8).
- **Configuration des Blinds** ⏱️ : Choisissez comment les blinds augmentent pendant la partie.

### Gestion des Blinds
- **Mode Manuel** ✋ : Ajoutez, modifiez ou supprimez des niveaux de blinds (small blind, big blind, durée). Insérez de nouveaux niveaux entre deux existants avec le bouton "+" !
- **Mode Génération** ⚙️ : Générez automatiquement une structure de blinds basée sur :
  - Le nombre de joueurs.
  - La durée estimée du tournoi (en minutes).
  - La plus petite valeur de jeton.
  - Le stack initial en big blinds (BB).
  - La structure s’ajuste pour terminer avec environ 20 BB en jeu.
- **Changement à Tout Moment** 🔄 : Commencez en mode génération, puis passez en manuel pour ajuster les niveaux.
- **Recalcul Automatique** 🔢 : Supprimez un niveau en mode génération, et les durées s’ajustent automatiquement pour respecter la durée totale.

### Pendant le Tournoi
- **Minuteur** ⏲️ : Suit le niveau actuel des blinds et le temps restant.
- **Placement Aléatoire** 🎰 : Les joueurs sont assignés aux tables aléatoirement au départ.
- **Rééquilibrage Automatique** 🔀 : Quand un joueur est éliminé, les tables se rééquilibrent aléatoirement pour garder le jeu équitable.
- **Éliminations** ❌ : Marquez les joueurs éliminés avec un bouton, et voyez la liste des éliminés se mettre à jour en temps réel.
- **Détection du Vainqueur** 🏆 : Le jeu se termine quand il reste un joueur!

## 🚀 Comment l’Utiliser

1. **Configurer Votre Tournoi** :
   - Ouvrez l’application (par ex., sur `openpokerstack.com` une fois déployé).
   - Entrez les noms des joueurs dans le champ "Joueurs" (ex. : "Alice\nBob\nCharlie").
   - Définissez le nombre max de joueurs par table (par défaut : 8).

2. **Configurer les Blinds** :
   - **Mode Manuel** : Ajoutez des niveaux en entrant small blind, big blind et durée. Utilisez "+" pour insérer entre deux niveaux, "-" pour supprimer.
   - **Mode Génération** : Saisissez la durée totale, le plus petit jeton et le stack initial en BB, puis cliquez sur "Générer Structure". Supprimez des niveaux pour ajuster les durées automatiquement.

3. **Lancer la Partie** :
   - Cliquez sur "Lancer le Tournoi" pour commencer.
   - Les joueurs sont placés aléatoirement sur les tables.

4. **Gérer le Tournoi** :
   - Utilisez "Démarrer" pour lancer le minuteur, "Pause" pour arrêter, et "Reset" pour recommencer.
   - Éliminez des joueurs en cliquant sur "Éliminer" à côté de leur nom.
   - Observez le rééquilibrage des tables et l’augmentation des blinds automatiquement.

5. **Terminer** :
   - Quand il ne reste qu’un joueur, l’application annonce le vainqueur !

## 🌟 Astuces
- Survolez les champs vides pour voir leurs descriptions complètes (ex. : "Durée (min)").
- L’application est légère—pas besoin de serveur, juste un navigateur !

---

# OpenPokerStack 🎲 🇬🇧
A simple, open-source tool to manage your poker tournaments with ease.

Welcome to **OpenPokerStack**, a web app designed to help you run poker tournaments smoothly. Whether you're hosting a casual game night or a bigger event, this tool handles blinds, player seating, and eliminations for you—all for free and open to everyone!

## ✨ Features

### Tournament Setup
- **Player List** ✍️: Enter player names (one per line) to create your tournament roster.
- **Table Size** 🪑: Set the maximum number of players per table (e.g., 8).
- **Blinds Configuration** ⏱️: Choose how blinds increase during the game.

### Blinds Management
- **Manual Mode** ✋: Add, edit, or remove blind levels (small blind, big blind, duration). Insert new levels between existing ones with the "+" button!
- **Generation Mode** ⚙️: Automatically generate a blinds structure based on:
  - Number of players.
  - Estimated tournament duration (in minutes).
  - Smallest chip value.
  - Starting stack in big blinds (BB).
  - The structure adjusts to end with ~20 BB in play.
- **Switch Anytime** 🔄: Start in generation mode, then switch to manual to tweak levels.
- **Auto-Recalculation** 🔢: Remove a level in generation mode, and durations adjust automatically to fit the total time.

### During the Tournament
- **Timer** ⏲️: Tracks the current blind level and time remaining.
- **Random Seating** 🎰: Players are assigned to tables randomly at the start.
- **Automatic Rebalancing** 🔀: When a player is eliminated, tables are rebalanced randomly to keep the game fair.
- **Eliminations** ❌: Mark players out with a button, and see the eliminated list update in real-time.
- **Winner Detection** 🏆: The game ends when one player remains!

## 🚀 How to Use It

1. **Set Up Your Tournament**:
   - Open the app (e.g., at `openpokerstack.com` once deployed).
   - Enter player names in the "Players" field (e.g., "Alice\nBob\nCharlie").
   - Set the max players per table (default: 8).

2. **Configure Blinds**:
   - **Manual Mode**: Add levels by entering small blind, big blind, and duration. Use "+" to insert levels between others, "-" to remove.
   - **Generation Mode**: Input total duration, smallest chip, and starting BB, then click "Generate Structure". Remove levels to auto-adjust durations.

3. **Start the Game**:
   - Click "Launch Tournament" to begin.
   - Players are seated randomly across tables.

4. **Run the Tournament**:
   - Use "Start" to run the timer, "Pause" to stop, and "Reset" to restart.
   - Eliminate players by clicking "Eliminate" next to their name.
   - Watch tables rebalance and blinds increase automatically.

5. **Finish**:
   - When one player’s left, the app declares the winner!

## 🌟 Tips
- Hover over empty input fields to see full descriptions (e.g., "Duration (min)").
- The app is lightweight—no server needed, just a browser!

## ❤️ Credits
Made with love by @jkintzinger and Grok 3 from xAI.