(() => {
  // === Elements ===
  const grid = document.getElementById('grid');
  const movesB = document.querySelector('#moves b');
  const timerB = document.querySelector('#timer b');
  const pairsB = document.querySelector('#pairs b');
  const toast = document.getElementById('toast');

  const winModal = document.getElementById('winModal');
  const winTitleEl = document.getElementById('winTitle');
  const winStatsEl = document.getElementById('winStats');

  const playAgainBtn = document.getElementById('playAgain');
  const closeModalBtn = document.getElementById('closeModal');

  const difficultySelect = document.getElementById('difficulty');
  const timeLimitSelect = document.getElementById('timeLimit');
  const newGameBtn = document.getElementById('newGame');

  let timeLimit = 0;
  let countdownId = null;
  let gameLost = false;

  // === Card Images ===
  const CARDS = [
    'Cards/1.png',
    'Cards/2.png',
    'Cards/3.png',
    'Cards/4.png',
    'Cards/5.png',
    'Cards/6.png',
    'Cards/7.png',
    'Cards/8.png',
    'Cards/9.png',
    'Cards/10.png',
    'Cards/11.png',
    'Cards/12.png'
  ];

  // === State ===
  let cols = 4;
  let rows = 4;

  let moves = 0;
  let matched = 0;
  let totalPairs = 0;

  let firstCard = null;
  let secondCard = null;

  let lockBoard = false;

  let timerId = null;
  let startTs = 0;

  let toastTimer = null;


  // === Helpers ===

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
  }


  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }


  function showToast(msg, ms = 1200) {
    clearTimeout(toastTimer);

    toast.innerHTML = `<div class="msg">${msg}</div>`;

    toastTimer = setTimeout(() => {
      toast.innerHTML = '';
    }, ms);
  }


  function showModal() {
    winModal.classList.remove('hide');
  }


  function hideModal() {
    winModal.classList.add('hide');
  }


  // === Timer ===

  function startTimer() {
    stopTimer();

    startTs = Date.now();

    if (timeLimit > 0) {

      timerB.textContent = formatTime(timeLimit);

      countdownId = setInterval(() => {

        const elapsed = Math.floor(
          (Date.now() - startTs) / 1000
        );

        const remaining = timeLimit - elapsed;

        if (remaining <= 0) {

          timerB.textContent = '00:00';

          clearInterval(countdownId);
          countdownId = null;

          gameOver();

        } else {

          timerB.textContent = formatTime(remaining);

        }

      }, 250);

    } else {

      timerB.textContent = '00:00';

      timerId = setInterval(() => {

        const elapsed = Math.floor(
          (Date.now() - startTs) / 1000
        );

        timerB.textContent = formatTime(elapsed);

      }, 250);
    }
  }


  function stopTimer() {

    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    if (countdownId) {
      clearInterval(countdownId);
      countdownId = null;
    }
  }


  // === Time Up ===

  function gameOver() {
  lockBoard = true;

  stopTimer();

  gameLost = true;

  winTitleEl.textContent = 'You Lose! 😢';

  winStatsEl.textContent =
    "⏱️ Time's up! Click Close to reveal the cards.";

  showModal();
}


  // === Timer Selection ===

  timeLimitSelect.addEventListener('change', e => {

    if (e.target.value === 'custom') {

      const input = prompt(
        'Enter time in seconds:',
        '60'
      );

      if (
        input === null ||
        input.trim() === ''
      ) {

        timeLimit = 0;
        timeLimitSelect.value = '0';

        newGame(cols, rows);

        return;
      }

      const seconds = parseInt(input, 10);

      if (
        !Number.isFinite(seconds) ||
        seconds < 1
      ) {

        alert(
          'Please enter a valid number of seconds.'
        );

        timeLimit = 0;
        timeLimitSelect.value = '0';

        newGame(cols, rows);

        return;
      }

      timeLimit = seconds;

    } else {

      timeLimit =
        parseInt(e.target.value, 10) || 0;
    }

    newGame(cols, rows);
  });
  
    // === Deck / Rendering ===

  function buildDeck() {

    const totalCards = cols * rows;

    const pairs = Math.floor(totalCards / 2);

    totalPairs = pairs;

    pairsB.textContent = `0/${pairs}`;

    // Pick the required number of images
    const chosen = shuffle([...CARDS]).slice(0, pairs);

    // Duplicate each image to create matching pairs
    return shuffle([
      ...chosen,
      ...chosen
    ]);
  }


  function renderGrid() {

    const deck = buildDeck();

    // Set number of columns
    grid.style.setProperty('--cols', cols);

    // Add difficulty class
    grid.classList.remove(
      'cols-4',
      'cols-5',
      'cols-6'
    );

    grid.classList.add(`cols-${cols}`);


    grid.innerHTML = deck.map(image => `
      <button
        class="card"
        data-icon="${image}"
        aria-pressed="false"
        aria-label="Memory card"
        tabindex="0"
      >

        <div class="inner">

          <!-- Card front -->
          <div class="face front">
            <div class="cover">🎴</div>
          </div>

          <!-- Card image -->
          <div class="face back">

            <img
              class="card-image"
              src="${image}"
              alt=""
              draggable="false"
            >

          </div>

        </div>

      </button>
    `).join('');


    // Click / keyboard events
    grid.querySelectorAll('.card').forEach(card => {

      card.addEventListener(
        'click',
        () => flip(card)
      );


      card.addEventListener(
        'keydown',
        e => {

          if (
            e.key === 'Enter' ||
            e.key === ' '
          ) {

            e.preventDefault();

            flip(card);
          }

        }
      );

    });
  }


  // === Card Flip Logic ===

  function flip(card) {

    // Board is locked
    if (lockBoard) return;

    // Already matched
    if (card.classList.contains('matched')) {
      return;
    }

    // Same card clicked twice
    if (
      card.getAttribute('aria-pressed') === 'true'
    ) {
      return;
    }


    // Flip card
    card.setAttribute(
      'aria-pressed',
      'true'
    );


    // First card
    if (!firstCard) {

      firstCard = card;

      return;
    }


    // Second card
    secondCard = card;

    lockBoard = true;

    moves++;

    movesB.textContent = moves;


    // Compare image paths
    const isMatch =
      firstCard.dataset.icon ===
      secondCard.dataset.icon;


    // === Match ===

    if (isMatch) {

      firstCard.classList.add('matched');

      secondCard.classList.add('matched');

      matched++;

      pairsB.textContent =
        `${matched}/${totalPairs}`;

      showToast('Nice match! ✅');

      resetPicks();


      // === Player Won ===

      if (matched === totalPairs) {

        stopTimer();

        const elapsed =
          Math.floor(
            (Date.now() - startTs) / 1000
          );


        winTitleEl.textContent =
          'You Won! 🎉';


        winStatsEl.textContent =
          `Solved in ${moves} moves and ${formatTime(elapsed)}.`;


        showModal();
      }

    }


    // === Not a Match ===

    else {

      showToast('Try again ❌');


      setTimeout(() => {

        if (firstCard) {

          firstCard.setAttribute(
            'aria-pressed',
            'false'
          );

        }


        if (secondCard) {

          secondCard.setAttribute(
            'aria-pressed',
            'false'
          );

        }


        resetPicks();

      }, 700);
    }
  }


  // === Reset Selected Cards ===

  function resetPicks() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;
  }


  // === New Game ===

  function newGame(newCols = cols, newRows = rows) {
  hideModal();

  stopTimer();

  cols = newCols;
  rows = newRows;

  moves = 0;
  matched = 0;
  gameLost = false;

  resetPicks();

  movesB.textContent = moves;
  timerB.textContent = '00:00';
  pairsB.textContent = '0/0';

  winTitleEl.textContent = 'You Won! 🎉';

  renderGrid();

  requestAnimationFrame(() => {
    startTimer();
  });
}


  // === Controls ===

  function setupControls() {

    // Difficulty
    difficultySelect.addEventListener(
      'change',
      e => {

        const map = {
          '4x4': [4, 4],
          '5x4': [5, 4],
          '6x4': [6, 4]
        };


        const [w, h] =
          map[e.target.value] ||
          [4, 4];


        newGame(w, h);
      }
    );


    // New Game
    newGameBtn.addEventListener(
      'click',
      () => {
        newGame(cols, rows);
      }
    );


    // Play Again
    playAgainBtn.addEventListener(
      'click',
      () => {
        newGame(cols, rows);
      }
    );


    // Close modal
    closeModalBtn.addEventListener('click', () => {
  hideModal();

  if (gameLost) {
    grid.querySelectorAll('.card').forEach(card => {
      card.setAttribute('aria-pressed', 'true');
    });
  }
});


    // Keyboard shortcut: R
    window.addEventListener(
      'keydown',
      e => {

        if (
          e.key.toLowerCase() === 'r'
        ) {

          newGame(cols, rows);
        }

      }
    );
  }


  // === Initialize Game ===

  function init() {

    hideModal();

    setupControls();

    newGame(4, 4);
  }


  if (
    document.readyState ===
    'loading'
  ) {

    window.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }

})();