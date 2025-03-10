let players = [];
let numberInitialPlayers = 0;
let blindsStructure = [];
let maxPlayersPerTable = 8;
let isGenerateMode = false;

let tables = [];
let currentLevel = 0;
let timeLeft = 0;
let timerInterval = null;
let isRunning = false;
let eliminatedPlayers = [];

window.onload = () => {
    document.getElementById('setupOverlay').classList.remove('hidden');
    addBlindLevel();
};

function setupTables() {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const totalPlayers = shuffledPlayers.length;
    const numTables = Math.ceil(totalPlayers / maxPlayersPerTable);
    const basePlayersPerTable = Math.floor(totalPlayers / numTables);
    const extraPlayers = totalPlayers % numTables;
    const playersPerTable = Array(numTables).fill(basePlayersPerTable).map((val, idx) =>
        idx < extraPlayers ? val + 1 : val
    );

    tables = [];
    let playerIndex = 0;

    for (let i = 0; i < numTables; i++) {
        const tablePlayers = Array(maxPlayersPerTable).fill(null);
        for (let seat = 0; seat < playersPerTable[i]; seat++) {
            tablePlayers[seat] = { name: shuffledPlayers[playerIndex], eliminated: false };
            playerIndex++;
        }
        tables.push({ number: i + 1, players: tablePlayers });
    }
}

function rebalanceTables() {
    let changes = [];
    const initialState = tables.map(table => ({
        number: table.number,
        players: [...table.players]
    }));

    const playerCounts = tables.map(table =>
        table.players.filter(p => p && !p.eliminated).length
    );
    const totalPlayers = playerCounts.reduce((sum, count) => sum + count, 0);
    const numTablesNeeded = Math.ceil(totalPlayers / maxPlayersPerTable);

    if (totalPlayers % maxPlayersPerTable === 0 && tables.length > numTablesNeeded) {
        const lastTable = tables.pop();
        let playersToMove = lastTable.players.filter(p => p && !p.eliminated);
        playersToMove.sort(() => Math.random() - 0.5);

        tables.forEach((table, tableIndex) => {
            while (playersToMove.length > 0) {
                const emptySeats = table.players
                    .map((p, idx) => p === null ? idx : -1)
                    .filter(idx => idx !== -1);
                if (emptySeats.length > 0) {
                    const randomSeat = emptySeats[Math.floor(Math.random() * emptySeats.length)];
                    const player = playersToMove.shift();
                    table.players[randomSeat] = player;
                    changes.push(`${player.name} passe en Table ${table.number} Siège ${randomSeat + 1}`);
                } else {
                    break;
                }
            }
        });

        if (changes.length > 0) {
            alert("Changements de table :\n" + changes.join("\n"));
        }
        return;
    }

    const maxCount = Math.max(...playerCounts);
    const minCount = Math.min(...playerCounts.filter(c => c > 0));
    if (maxCount - minCount <= 1) {
        return;
    }

    while (maxCount - minCount > 1) {
        const overfilledTableIndex = playerCounts.findIndex(count => count === maxCount);
        const underfilledTableIndex = playerCounts.findIndex(count => count === minCount);

        const overfilledTable = tables[overfilledTableIndex];
        const activePlayers = overfilledTable.players
            .map((p, idx) => p && !p.eliminated ? idx : -1)
            .filter(idx => idx !== -1);
        const randomPlayerSeat = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        const playerToMove = overfilledTable.players[randomPlayerSeat];
        overfilledTable.players[randomPlayerSeat] = null;

        const underfilledTable = tables[underfilledTableIndex];
        const emptySeats = underfilledTable.players
            .map((p, idx) => p === null ? idx : -1)
            .filter(idx => idx !== -1);
        const randomNewSeat = emptySeats[Math.floor(Math.random() * emptySeats.length)];
        underfilledTable.players[randomNewSeat] = playerToMove;

        changes.push(`${playerToMove.name} passe en Table ${underfilledTable.number} Siège ${randomNewSeat + 1}`);

        playerCounts[overfilledTableIndex]--;
        playerCounts[underfilledTableIndex]++;
        const newMaxCount = Math.max(...playerCounts);
        const newMinCount = Math.min(...playerCounts.filter(c => c > 0));
        if (newMaxCount - newMinCount <= 1) break;
    }

    tables = tables.filter(table => table.players.some(p => p && !p.eliminated));

    if (changes.length > 0) {
        alert("Changements de table :\n" + changes.join("\n"));
    }
}

function updateTablesDisplay() {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = '';
    tables.forEach((table, tableIndex) => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';
        tableDiv.innerHTML = `<h3>Table ${table.number}</h3>`;
        
        table.players.forEach((player, seat) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player';
            if (!player) {
                playerDiv.innerHTML = `
                    <span class="seat-number">${seat + 1}</span>
                    <span class="empty-seat">Vide</span>
                `;
            } else if (!player.eliminated) {
                playerDiv.innerHTML = `
                    <span class="seat-number">${seat + 1}</span>
                    <span>${player.name}</span>
                    <button onclick="eliminatePlayer(${tableIndex}, ${seat})">
                        Éliminer
                    </button>
                `;
            }
            tableDiv.appendChild(playerDiv);
        });
        
        container.appendChild(tableDiv);
    });
}

function eliminatePlayer(tableIndex, seat) {
    const eliminatedPlayer = tables[tableIndex].players[seat];
    eliminatedPlayers.push({ ...eliminatedPlayer });
    tables[tableIndex].players[seat] = null;
    
    rebalanceTables();
    updateTablesDisplay();
    updateEliminatedDisplay();

    const remainingPlayers = tables.flatMap(t => t.players)
        .filter(p => p && !p.eliminated).length;
    if (remainingPlayers === 1) {
        pauseTournament();
        const winner = tables.flatMap(t => t.players)
            .find(p => p && !p.eliminated);
        alert(`Tournoi terminé ! Vainqueur : ${winner.name}`);
    }
}

function startTournament() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function pauseTournament() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
    }
}

function resetTournament() {
    isRunning = false;
    clearInterval(timerInterval);
    currentLevel = 0;
    timeLeft = blindsStructure[0].duration * 60;
    eliminatedPlayers = [];
    setupTables();
    updateTablesDisplay();
    updateTournamentDisplay();
    updateEliminatedDisplay();
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTournamentDisplay();
    } else if (currentLevel < blindsStructure.length - 1) {
        currentLevel++;
        timeLeft = blindsStructure[currentLevel].duration * 60;
        updateTournamentDisplay();
    } else {
        pauseTournament();
        alert('Tournoi terminé !');
    }
}

function updateTournamentDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('levelNum').textContent = blindsStructure[currentLevel].level;
    document.getElementById('smallBlind').textContent = blindsStructure[currentLevel].small;
    document.getElementById('bigBlind').textContent = blindsStructure[currentLevel].big;
}

function updateEliminatedDisplay() {
    const list = document.getElementById('eliminatedList');
    list.innerHTML = '';
    
    for (let i = eliminatedPlayers.length - 1; i >= 0; i--) {
        const li = document.createElement('li');
        li.textContent = `${numberInitialPlayers - i}. ${eliminatedPlayers[i].name}`;
        list.appendChild(li);
    }
}

// Form
function addBlindLevel(isGenerated = false) {
    const container = isGenerated ? document.getElementById('generatedBlindsLevels') : document.getElementById('blindsLevels');
    const levelDiv = document.createElement('div');
    levelDiv.className = 'blind-level';
    levelDiv.innerHTML = `
        <div class="input-tooltip">
            <input type="number" class="small-blind" placeholder="Small Blind" min="1" ${isGenerated ? 'disabled' : ''}>
            <span class="tooltip-text">Small Blind</span>
        </div>
        <div class="input-tooltip">
            <input type="number" class="big-blind" placeholder="Big Blind" min="1" ${isGenerated ? 'disabled' : ''}>
            <span class="tooltip-text">Big Blind</span>
        </div>
        <div class="input-tooltip">
            <input type="number" class="duration" placeholder="Durée (min)" min="1" ${isGenerated ? 'disabled' : ''}>
            <span class="tooltip-text">Durée (min)</span>
        </div>
        <button onclick="removeBlindLevel(this, ${isGenerated})">-</button>
        ${isGenerated ? '' : '<button onclick="insertBlindLevel(this)">+</button>'}
    `;
    container.appendChild(levelDiv);
}

function removeBlindLevel(button, isGenerated = false) {
    const levelDiv = button.parentElement;
    const container = isGenerated ? document.getElementById('generatedBlindsLevels') : document.getElementById('blindsLevels');
    if (container.querySelectorAll('.blind-level').length > 1) {
        levelDiv.remove();
        if (isGenerated) {
            recalculateDurations();
        }
    }
}

function insertBlindLevel(button) {
    const currentLevelDiv = button.parentElement;
    const container = document.getElementById('blindsLevels');
    const newLevelDiv = document.createElement('div');
    newLevelDiv.className = 'blind-level';
    newLevelDiv.innerHTML = `
        <div class="input-tooltip">
            <input type="number" class="small-blind" placeholder="Small Blind" min="1">
            <span class="tooltip-text">Small Blind</span>
        </div>
        <div class="input-tooltip">
            <input type="number" class="big-blind" placeholder="Big Blind" min="1">
            <span class="tooltip-text">Big Blind</span>
        </div>
        <div class="input-tooltip">
            <input type="number" class="duration" placeholder="Durée (min)" min="1">
            <span class="tooltip-text">Durée (min)</span>
        </div>
        <button onclick="removeBlindLevel(this)">-</button>
        <button onclick="insertBlindLevel(this)">+</button>
    `;
    container.insertBefore(newLevelDiv, currentLevelDiv.nextSibling);
}

function switchTab(tab) {
    const manualTab = document.getElementById('manualTab');
    const generateTab = document.getElementById('generateTab');
    const manualButton = document.querySelector('.tab-button[onclick="switchTab(\'manual\')"]');
    const generateButton = document.querySelector('.tab-button[onclick="switchTab(\'generate\')"]');

    if (tab === 'manual') {
        manualTab.classList.remove('hidden');
        generateTab.classList.add('hidden');
        manualButton.classList.add('active');
        generateButton.classList.remove('active');
        isGenerateMode = false;
        const generatedLevels = document.getElementById('generatedBlindsLevels').querySelectorAll('.blind-level');
        if (generatedLevels.length > 0) {
            const blindsLevels = document.getElementById('blindsLevels');
            blindsLevels.innerHTML = '';
            generatedLevels.forEach(level => {
                const small = level.querySelector('.small-blind').value;
                const big = level.querySelector('.big-blind').value;
                const duration = level.querySelector('.duration').value;
                const levelDiv = document.createElement('div');
                levelDiv.className = 'blind-level';
                levelDiv.innerHTML = `
                    <div class="input-tooltip">
                        <input type="number" class="small-blind" value="${small}" min="1">
                        <span class="tooltip-text">Small Blind</span>
                    </div>
                    <div class="input-tooltip">
                        <input type="number" class="big-blind" value="${big}" min="1">
                        <span class="tooltip-text">Big Blind</span>
                    </div>
                    <div class="input-tooltip">
                        <input type="number" class="duration" value="${duration}" min="1">
                        <span class="tooltip-text">Durée (min)</span>
                    </div>
                    <button onclick="removeBlindLevel(this)">-</button>
                    <button onclick="insertBlindLevel(this)">+</button>
                `;
                blindsLevels.appendChild(levelDiv);
            });
        }
    } else {
        manualTab.classList.add('hidden');
        generateTab.classList.remove('hidden');
        manualButton.classList.remove('active');
        generateButton.classList.add('active');
        isGenerateMode = true;
    }
}

function generateBlindsStructure() {
    const numPlayers = document.getElementById('playersInput').value.trim().split('\n').filter(name => name).length;
    const duration = parseInt(document.getElementById('tournamentDuration').value) || 0;
    const smallestChip = parseInt(document.getElementById('smallestChip').value) || 0;
    const startingBB = parseInt(document.getElementById('startingBB').value) || 0;

    if (numPlayers < 2 || duration <= 0 || smallestChip <= 0 || startingBB <= 0) {
        alert("Veuillez remplir tous les champs pour générer la structure : joueurs, durée, plus petit jeton, et stack en BB !");
        return;
    }

    const startingStack = startingBB * smallestChip * 2;
    const totalChips = numPlayers * startingStack;

    const baseSmallBlind = [1, 2, 3].concat([4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35]);
    const targetTotalBB = 20;

    blindsStructure = [];
    let i = 0;
    let multiplicativeFactor = 1;
    let sb, bb;
    do {
        sb = baseSmallBlind[i] * smallestChip * multiplicativeFactor;
        bb = baseSmallBlind[i] * 2 * smallestChip * multiplicativeFactor;
        blindsStructure.push({ level: i + 1, small: sb, big: bb, duration: 15 });
        i++;
        if (i === baseSmallBlind.length) {
            i = 3;
            multiplicativeFactor *= 10;
        }
    } while (totalChips / bb > targetTotalBB);

    const numLevels = blindsStructure.length;
    const levelDuration = Math.floor(duration / numLevels);
    blindsStructure.forEach(level => level.duration = levelDuration);

    const blindsLevels = document.getElementById('generatedBlindsLevels');
    blindsLevels.innerHTML = '';
    blindsStructure.forEach(level => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'blind-level';
        levelDiv.innerHTML = `
            <div class="input-tooltip">
                <input type="number" class="small-blind" value="${level.small}" min="1" disabled>
                <span class="tooltip-text">Small Blind</span>
            </div>
            <div class="input-tooltip">
                <input type="number" class="big-blind" value="${level.big}" min="1" disabled>
                <span class="tooltip-text">Big Blind</span>
            </div>
            <div class="input-tooltip">
                <input type="number" class="duration" value="${level.duration}" min="1" disabled>
                <span class="tooltip-text">Durée (min)</span>
            </div>
            <button onclick="removeBlindLevel(this, true)">-</button>
        `;
        blindsLevels.appendChild(levelDiv);
    });
}


function recalculateDurations() {
    const duration = parseInt(document.getElementById('tournamentDuration').value) || 0;
    const levels = document.getElementById('generatedBlindsLevels').querySelectorAll('.blind-level');
    const numLevels = levels.length;
    const levelDuration = Math.floor(duration / numLevels);

    levels.forEach(level => {
        const durationInput = level.querySelector('.duration');
        durationInput.value = levelDuration;
    });

    blindsStructure = [];
    levels.forEach((level, index) => {
        const small = parseInt(level.querySelector('.small-blind').value);
        const big = parseInt(level.querySelector('.big-blind').value);
        blindsStructure.push({ level: index + 1, small, big, duration: levelDuration });
    });
}

function startTournamentFromForm() {
    const playersInput = document.getElementById('playersInput').value.trim();
    players = playersInput.split('\n').map(name => name.trim()).filter(name => name);
    if (players.length < 2) {
        alert("Veuillez entrer au moins 2 joueurs !");
        return;
    }
    numberInitialPlayers = players.length;

    maxPlayersPerTable = parseInt(document.getElementById('maxPlayersInput').value) || 8;
    if (maxPlayersPerTable < 2) {
        alert("Le nombre maximum de joueurs par table doit être au moins 2 !");
        return;
    }

    blindsStructure = [];
    const container = isGenerateMode ? document.getElementById('generatedBlindsLevels') : document.getElementById('blindsLevels');
    const levels = container.querySelectorAll('.blind-level');
    levels.forEach((level, index) => {
        const small = parseInt(level.querySelector('.small-blind').value);
        const big = parseInt(level.querySelector('.big-blind').value);
        const duration = parseInt(level.querySelector('.duration').value);
        if (small > 0 && big > 0 && duration > 0) {
            blindsStructure.push({ level: index + 1, small, big, duration });
        }
    });
    if (blindsStructure.length === 0) {
        alert("Veuillez ajouter au moins un niveau de blinds valide !");
        return;
    }

    timeLeft = blindsStructure[0].duration * 60;
    setupTables();
    updateTablesDisplay();
    updateTournamentDisplay();
    updateEliminatedDisplay();
    document.getElementById('setupOverlay').classList.add('hidden');
}