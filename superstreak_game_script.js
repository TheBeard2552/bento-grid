// superstreak_game_script.js

// Immediately Invoked Function Expression (IIFE) to avoid global scope pollution
(function() {
  // Mock data for games
  const games = [
    { id: 1, team1: 'Lakers', team2: 'Warriors', sport: 'NBA' },
    { id: 2, team1: 'Patriots', team2: 'Broncos', sport: 'NFL' },
    { id: 3, team1: 'Yankees', team2: 'Red Sox', sport: 'MLB' },
    { id: 4, team1: 'Manchester United', team2: 'Liverpool', sport: 'EPL' },
    { id: 5, team1: 'Maple Leafs', team2: 'Canadiens', sport: 'NHL' },
    { id: 6, team1: 'Duke', team2: 'North Carolina', sport: 'NCAAB' },
    { id: 7, team1: 'Alabama', team2: 'Clemson', sport: 'NCAAF' },
    // Add more games as needed
  ];

  // Mock data for players
  const players = [
    { name: 'Player1', points: 50 },
    { name: 'Player2', points: 70 },
    { name: 'Player3', points: 30 },
    { name: 'Player4', points: 90 },
    { name: 'Player5', points: 60 },
    { name: 'Player6', points: 40 },
    { name: 'Player7', points: 80 },
    { name: 'Player8', points: 20 },
    { name: 'Player9', points: 100 },
    { name: 'Player10', points: 55 },
  ];

  let selectedGames = [];
  let gameOption = 'singles'; // Default option
  let playerPoints = 0;

  // Mock point values for teams (in 0.5 increments)
  const teamPoints = {
    'Lakers': 1.5,
    'Warriors': 2.0,
    'Patriots': 1.0,
    'Broncos': 2.5,
    'Yankees': 1.5,
    'Red Sox': 2.5,
    'Manchester United': 1.5,
    'Liverpool': 2.0,
    'Maple Leafs': 1.5,
    'Canadiens': 2.0,
    'Duke': 1.5,
    'North Carolina': 2.5,
    'Alabama': 1.5,
    'Clemson': 2.0,
    // Add more teams and their point values
  };

  // Initialize the game
  function init() {
    loadPersistentData();
    populateGamesList();
    assignBackButtonDestinations();
    assignNavigateButtonDestinations();
    // assignGameOptionButtons(); // Commented out if not used
    assignStartGameButton();
    assignViewScoreboardButton();
    assignConfirmSelectionButton(); // Already added
    assignSearchAndFilterListeners(); // Added event listeners for search and filters
  }

  // Assign event listeners to Back buttons based on data-destination
  function assignBackButtonDestinations() {
    const backButtons = document.querySelectorAll('.back-button');

    backButtons.forEach(button => {
      const destination = button.getAttribute('data-destination');
      if (destination) {
        button.addEventListener('click', function() {
          window.location.href = destination;
        });
      } else {
        console.warn('Back button without data-destination attribute found:', button);
      }
    });
  }

  // Assign event listeners to Navigate buttons based on data-target
  function assignNavigateButtonDestinations() {
    const navigateButtons = document.querySelectorAll('.navigate-button');

    navigateButtons.forEach(button => {
      const target = button.getAttribute('data-target');
      if (target) {
        button.addEventListener('click', function() {
          window.location.href = target;
        });
      } else {
        console.warn('Navigate button without data-target attribute found:', button);
      }
    });
  }

  // Assign event listeners to Game Option buttons (if they exist)
  /*
  function assignGameOptionButtons() {
    const playSinglesButton = document.getElementById('play-singles');
    const playSuperSetButton = document.getElementById('play-super-set');

    if (playSinglesButton) {
      playSinglesButton.addEventListener('click', function() {
        gameOption = 'singles';
        showToast('Selected: Play as Singles', 'info');
      });
    }

    if (playSuperSetButton) {
      playSuperSetButton.addEventListener('click', function() {
        gameOption = 'super-set';
        showToast('Selected: Create Super Set', 'info');
      });
    }
  }
  */

  // Assign event listener to Start Game button
  function assignStartGameButton() {
    const startGameButton = document.getElementById('start-game');
    if (startGameButton) {
      startGameButton.addEventListener('click', startGame);
    } else {
      console.error('Start Game button not found in HTML.');
    }
  }

  // Assign event listener to View Scoreboard button
  function assignViewScoreboardButton() {
    const viewScoreboardButton = document.getElementById('view-scoreboard');
    if (viewScoreboardButton) {
      viewScoreboardButton.addEventListener('click', showScoreboard);
    } else {
      console.error('View Scoreboard button not found in HTML.');
    }
  }

  // Assign event listener to Confirm Selection button
  function assignConfirmSelectionButton() {
    const confirmButton = document.getElementById('confirm-selection');
    if (confirmButton) {
      confirmButton.addEventListener('click', confirmSelection);
      console.log('Confirm Selection button event listener attached.');
    } else {
      console.error('Confirm Selection button not found. Please check the HTML.');
    }
  }

  // Assign event listeners to Search Bar and Filters
  function assignSearchAndFilterListeners() {
    const searchBar = document.getElementById('search-bar');
    const filterCheckboxes = document.querySelectorAll('input[name="sport"]');

    if (searchBar) {
      searchBar.addEventListener('input', debounce(function() {
        populateGamesList();
      }, 300)); // 300ms debounce delay
    } else {
      console.error('Search bar element not found in HTML.');
    }

    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        populateGamesList();
      });
    });
  }

  // Debounce function to limit the rate at which a function can fire.
  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Load persistent data from localStorage
  function loadPersistentData() {
    const storedPoints = localStorage.getItem('playerPoints');
    if (storedPoints) {
      playerPoints = parseFloat(storedPoints);
    }

    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      const parsedLeaderboard = JSON.parse(storedLeaderboard);
      players.length = 0; // Clear existing players
      players.push(...parsedLeaderboard);
    }
  }

  // Populate the list of games based on filters and search
  function populateGamesList() {
    const gamesList = document.getElementById('games-list');
    if (!gamesList) {
      console.error('Games list element not found in HTML.');
      return;
    }
    gamesList.innerHTML = '';

    // Get selected sports from filters
    const selectedSports = Array.from(document.querySelectorAll('input[name="sport"]:checked')).map(input => input.value);

    // Get search query
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();

    // Filter and display games
    games.forEach(game => {
      if (!selectedSports.includes(game.sport)) return;
      if (!(`${game.team1} vs ${game.team2}`.toLowerCase().includes(searchQuery))) return;

      const gameLineDiv = document.createElement('div');
      gameLineDiv.classList.add('game-line');
      gameLineDiv.setAttribute('data-game-id', game.id); // For easy reference

      gameLineDiv.innerHTML = `
        <div class="game-info">
          <span class="team-name">${game.team1}</span> 
          (<span class="team-points">${teamPoints[game.team1].toFixed(1)}</span>) 
          vs 
          <span class="team-name">${game.team2}</span> 
          (<span class="team-points">${teamPoints[game.team2].toFixed(1)}</span>) 
          <span class="sport">(${game.sport})</span>
        </div>
        <div class="team-buttons">
          <button class="team-button" data-game-id="${game.id}" data-team="${game.team1}">${game.team1}</button>
          <button class="team-button" data-game-id="${game.id}" data-team="${game.team2}">${game.team2}</button>
        </div>
      `;
      gamesList.appendChild(gameLineDiv);
    });

    // Add event listeners to team buttons
    const teamButtons = document.querySelectorAll('.team-button');
    teamButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from triggering the game-line click event

        const gameId = parseInt(this.getAttribute('data-game-id'));
        const team = this.getAttribute('data-team');

        // Find the corresponding game-line div
        const gameLineDiv = document.querySelector(`.game-line[data-game-id="${gameId}"]`);

        // Check if this game is already selected
        const existingGameIndex = selectedGames.findIndex(g => g.id === gameId);

        if (existingGameIndex === -1 && selectedGames.length >= 3) {
          // Show toast notification instead of modal
          showToast('You can select up to 3 games only. Please deselect one game before selecting the next.', 'warning');
          return;
        }

        if (existingGameIndex === -1) {
          // Add to selectedGames
          selectedGames.push({
            id: gameId,
            selectedTeam: team
          });
          gameLineDiv.classList.add('selected');
        } else {
          if (selectedGames[existingGameIndex].selectedTeam === team) {
            // Deselect the game by clicking the selected team button again
            selectedGames.splice(existingGameIndex, 1);
            gameLineDiv.classList.remove('selected');
            this.classList.remove('selected');
            showToast(`Deselected: ${team} in Game ID ${gameId}`, 'info');
            return;
          } else {
            // Update the selected team
            selectedGames[existingGameIndex].selectedTeam = team;
          }
        }

        // Update button styles
        const relatedButtons = gameLineDiv.querySelectorAll('.team-button');
        relatedButtons.forEach(btn => {
          btn.classList.remove('selected');
        });
        this.classList.add('selected');

        // Show or hide the selection highlight
        if (existingGameIndex === -1) {
          gameLineDiv.classList.add('selected');
        }

        showToast(`Selected: ${team} in Game ID ${gameId}`, 'success');
      });
    });

    // Add event listeners to game-line divs for deselection
    const gameLines = document.querySelectorAll('.game-line');
    gameLines.forEach(gameLine => {
      gameLine.addEventListener('click', function() {
        const gameId = parseInt(this.getAttribute('data-game-id'));

        // Check if this game is selected
        const gameIndex = selectedGames.findIndex(g => g.id === gameId);
        if (gameIndex !== -1) {
          // Remove from selectedGames
          selectedGames.splice(gameIndex, 1);
          this.classList.remove('selected');

          // Deselect buttons
          const relatedButtons = this.querySelectorAll('.team-button');
          relatedButtons.forEach(btn => {
            btn.classList.remove('selected');
          });

          showToast(`Deselected Game ID ${gameId}`, 'info');
        }
      });
    });
  }

  // Confirm the selected games and their teams
  function confirmSelection() {
    if (selectedGames.length > 3) {
      showToast('You can select up to 3 games only. Please deselect an existing game before confirming your selection.', 'warning');
      return;
    }
    if (selectedGames.length === 0) {
      showToast('Please select at least one game before confirming your selection.', 'warning');
      return;
    }

    navigateTo('confirmation-screen');
    displaySelectedGames();
  }

  // Display the selected games and teams on the confirmation screen
  function displaySelectedGames() {
    const displayDiv = document.getElementById('selected-games-display');
    if (!displayDiv) {
      console.error('Selected games display element not found in HTML.');
      return;
    }
    displayDiv.innerHTML = '';
    selectedGames.forEach(gameSelection => {
      const game = games.find(g => g.id === gameSelection.id);
      const gameInfo = document.createElement('p');
      gameInfo.innerText = `${game.team1} vs ${game.team2} (${game.sport}) - Selected: ${gameSelection.selectedTeam} (${teamPoints[gameSelection.selectedTeam].toFixed(1)} points)`;
      displayDiv.appendChild(gameInfo);
    });
  }

  // Start the game by calculating points
  function startGame() {
    calculatePoints();
    updatePlayerInLeaderboard();
    navigateTo('game-execution-screen');
    displayGameResults();
  }

  // Calculate points based on game outcomes and selected teams
  function calculatePoints() {
    let totalPoints = 0;
    let allWins = true;
    let totalOpposingPoints = 0; // To accumulate opposing teams' points in case of a Super Set loss

    // Clear previous game results
    const gameResultsDiv = document.getElementById('game-results');
    if (!gameResultsDiv) {
      console.error('Game results element not found in HTML.');
      return;
    }
    gameResultsDiv.innerHTML = '';

    selectedGames.forEach(gameSelection => {
      const game = games.find(g => g.id === gameSelection.id);
      const result = getGameResult(game.id);
      const selectedTeam = gameSelection.selectedTeam;
      const opposingTeam = (selectedTeam === game.team1) ? game.team2 : game.team1;
      const selectedTeamPoints = getTeamPointValue(selectedTeam);
      const opposingTeamPoints = getTeamPointValue(opposingTeam);

      const gameResultDiv = document.createElement('div');
      gameResultDiv.classList.add('game-result');

      if (result === 'win') {
        totalPoints += selectedTeamPoints;
        gameResultDiv.innerText = `${selectedTeam} won against ${opposingTeam}. +${selectedTeamPoints.toFixed(1)} points`;
      } else {
        allWins = false;
        totalOpposingPoints += opposingTeamPoints;
        gameResultDiv.innerText = `${selectedTeam} lost to ${opposingTeam}. -${opposingTeamPoints.toFixed(1)} points`;
      }

      gameResultsDiv.appendChild(gameResultDiv);
    });

    if (gameOption === 'super-set') {
      if (allWins) {
        totalPoints *= selectedGames.length; // Multiply by number of games
        showToast(`Super Set Win! Points multiplied by ${selectedGames.length}.`, 'success');
      } else {
        // Lose the cumulative total of the opposing teams' points
        totalPoints -= totalOpposingPoints;
        showToast(`Super Set Loss! You lost a total of ${totalOpposingPoints.toFixed(1)} points.`, 'error');
      }
    }

    // Ensure points are in 0.5 increments
    totalPoints = Math.round(totalPoints * 2) / 2;

    playerPoints += totalPoints;

    // Update player points in localStorage
    updatePlayerPoints(playerPoints);

    // Check for winning condition
    if (playerPoints >= 120) {
      showToast('Congratulations! You have reached 120 points and won the cash prize of $250!', 'success');
      resetGame();
    } else {
      showToast(`You now have ${playerPoints.toFixed(1)} points.`, 'info');
    }
  }

  // Get point value based on team odds (mock implementation)
  function getTeamPointValue(team) {
    if (teamPoints.hasOwnProperty(team)) {
      return teamPoints[team];
    } else {
      return 2.5; // Default point value
    }
  }

  // Mock function to simulate game results
  function getGameResult(gameId) {
    // This should be replaced with actual game result logic or API integration
    return Math.random() > 0.5 ? 'win' : 'lose';
  }

  // Update the leaderboard with the player's points
  function updatePlayerInLeaderboard() {
    const playerIndex = players.findIndex(player => player.name === 'You');
    if (playerIndex > -1) {
      players[playerIndex].points = playerPoints;
    } else {
      players.push({ name: 'You', points: playerPoints });
    }

    // Update leaderboard in localStorage
    updateLeaderboard(players);
  }

  // Display game results (additional logic can be added here if needed)
  function displayGameResults() {
    // Currently, game results are already displayed in calculatePoints()
  }

  // Show the scoreboard
  function showScoreboard() {
    navigateTo('scoreboard-screen');
    displayScoreboard();
  }

  // Display the scoreboard
  function displayScoreboard() {
    const scoreboardDiv = document.getElementById('scoreboard');
    if (!scoreboardDiv) {
      console.error('Scoreboard element not found in HTML.');
      return;
    }
    scoreboardDiv.innerHTML = '';
    players.sort((a, b) => b.points - a.points);

    const topPlayers = players.slice(0, 10);
    let yourPosition = players.findIndex(player => player.name === 'You') + 1;

    topPlayers.forEach((player, index) => {
      const playerDiv = document.createElement('div');
      playerDiv.innerText = `${index + 1}. ${player.name} - ${player.points.toFixed(1)} points`;
      if (player.name === 'You') {
        playerDiv.classList.add('you');
      }
      scoreboardDiv.appendChild(playerDiv);
    });

    if (yourPosition > 10) {
      const youDiv = document.createElement('div');
      youDiv.innerText = `${yourPosition}. You - ${playerPoints.toFixed(1)} points`;
      youDiv.classList.add('you');
      scoreboardDiv.appendChild(youDiv);
    }
  }

  // Navigate between game screens
  function navigateTo(screenId) {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => {
      screen.style.display = 'none';
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.style.display = 'block';
    } else {
      console.error(`Screen with ID "${screenId}" not found.`);
    }
  }

  // Show toast notifications
  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) {
      console.error('Toast element not found in HTML.');
      return;
    }
    toast.innerText = message;
    toast.classList.remove('success', 'error', 'warning', 'info');
    toast.classList.add(type, 'show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Reset the game after winning
  function resetGame() {
    playerPoints = 0;
    selectedGames = [];
    navigateTo('game-selection-screen');
    populateGamesList();
    const gameResultsDiv = document.getElementById('game-results');
    if (gameResultsDiv) {
      gameResultsDiv.innerHTML = '';
    }
  }

  // Update player points in localStorage
  function updatePlayerPoints(newPoints) {
    playerPoints = newPoints;
    localStorage.setItem('playerPoints', playerPoints.toFixed(1));
  }

  // Update leaderboard in localStorage
  function updateLeaderboard(updatedPlayers) {
    localStorage.setItem('leaderboard', JSON.stringify(updatedPlayers));
  }

  // Assign event listeners to Search Bar and Filters
  function assignSearchAndFilterListeners() {
    const searchBar = document.getElementById('search-bar');
    const filterCheckboxes = document.querySelectorAll('input[name="sport"]');

    if (searchBar) {
      searchBar.addEventListener('input', debounce(function() {
        populateGamesList();
      }, 300)); // 300ms debounce delay
    } else {
      console.error('Search bar element not found in HTML.');
    }

    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        populateGamesList();
      });
    });
  }

  // Debounce function to limit the rate at which a function can fire.
  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Initialize the game when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
})();
