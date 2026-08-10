# 🧠 Memory Match

A simple and responsive Memory Match card game built with HTML, CSS, and JavaScript.

Flip the cards, find all matching pairs, and try to complete the board before the timer runs out!

# ✨ Features

- 🃏 Image-based memory cards
- 🎯 Three difficulty levels:
  - Easy: 4×4 — 8 pairs
  - Medium: 5×4 — 10 pairs
  - Hard: 6×4 — 12 pairs
- ⏱️ Timer with:
  - No limit
  - 1 minute
  - 2 minutes
  - 5 minutes
  - Custom time in seconds
- 🔀 Randomised cards every game
- 📊 Move counter
- 🏆 Pair counter
- 🎉 Win screen when all pairs are matched
- 😢 Lose screen when the timer reaches zero
- 🃏 Cards are revealed after closing the time-up screen
- 📱 Responsive mobile layout
- ⌨️ Keyboard support
- 🔄 Press R to start a new game
- 🎨 Custom card artwork using PNG images

# 📁 Project Structure

Memory-Match/
│
├── index.html
├── styles.css
├── script.js
├── logo.png
│
└── Cards/
    ├── 1.png
    ├── 2.png
    ├── 3.png
    ├── 4.png
    ├── 5.png
    ├── 6.png
    ├── 7.png
    ├── 8.png
    ├── 9.png
    ├── 10.png
    ├── 11.png
    └── 12.png

# 🎮 How to Play

1. Select a difficulty.
2. Choose a time limit or select No limit.
3. Click two cards to reveal them.
4. If the cards match, they remain revealed.
5. If they don't match, they are flipped back.
6. Continue until all pairs are found.

# ⏱️ Time Limit

When a countdown is enabled, the timer counts down to "00:00".

If the timer reaches zero:

- The game ends.
- A You Lose! message appears.
- The cards remain hidden while the message is displayed.
- Clicking Close reveals all the cards.

# 🖼️ Adding Your Own Cards

The game loads card images from the "Cards" folder.

The current images are:

Cards/1.png
Cards/2.png
...
Cards/12.png

To use your own artwork, simply replace these PNG files while keeping the same filenames.

The images should preferably have a transparent background and a similar visual style.

# 🧩 How the Card System Works

The game uses 12 unique images.

Depending on the selected difficulty, JavaScript randomly chooses the required number of images:

Difficulty| Cards| Pairs| Images Used
Easy| 16| 8| 8
Medium| 20| 10| 10
Hard| 24| 12| 12

Each selected image is duplicated to create its matching pair.

The cards are then shuffled before being displayed.

# ⌨️ Controls

Control| Action
Mouse / Touch| Flip cards
Enter / Space| Flip a focused card
"R"| Start a new game
New Game| Restart the current game
Play Again| Start another round

# 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- CSS Grid
- CSS 3D transforms
- Responsive design

No frameworks or external JavaScript libraries are required.

# [🔴 Live Demo](https://thatonehtmlguy.github.io/Memory-Card-Game/)

# 📱 Mobile Support

The game automatically adjusts the card grid for smaller screens.

The grid uses different CSS classes depending on the selected difficulty:

cols-4
cols-5
cols-6

This allows the card sizes and spacing to be adjusted independently for 4×4, 5×4, and 6×4 layouts.
