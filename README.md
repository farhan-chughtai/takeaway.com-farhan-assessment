# Game of Three

Welcome to the "Game of Three" project! This is a simple web-based multiplayer game built with Node.js and TypeScript. Players can enjoy an interactive gaming experience through a basic HTML interface.

## Getting Started

To run the application, follow these steps:

1. Install the necessary dependencies by running:

   ```
   npm install
   ```

2. Start the application:
   ```
   npm start
   ```
3. Access the game from two different web browsers by navigating to:
   ```
   http://localhost:3000
   ```

# Game Modes

The game offers two modes of play: "Automatic" and "Manual." You can switch between these modes using the Game Mode dropdown. Here's an overview of each mode:

- Automatic Mode: Players can make moves automatically without any user input.
- Manual Mode: Players need to provide input to make the next move.

You can change the game mode at any point during gameplay.

# Gameplay

- The game starts with an initial random whole number.
- Both players take turns adding either -1, 0, or 1 to get to a number that is divisible by 3. Divide it by three. In the end if the result is 1, that player will be the winner.
- The game continues until there is a winner.

# Communication

Communication between players and the server is facilitated using Socket.io, enabling real-time interaction.

# Testing

We've implemented test cases using the Jest testing framework to ensure the reliability of our code. You can run the tests with the following command:
