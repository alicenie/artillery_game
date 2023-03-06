# Artillery Game

This project contains a browser game mimicking the classic two-player, turn-based artillery game.

## GitHub Repository

The code for this project is hosted on [GitHub](https://github.com/alicenie/artillery_game.git).

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository `git clone https://github.com/alicenie/artillery_game.git`
2. Install the dependencies for the client and the server

- Client: `cd client && npm install`
- Server: `cd server && npm install`

3. Start the client and the server

- Client: `cd client && npm start`, the client is running on [http://localhost:3000](http://localhost:3000)
- Server: `cd server && npm start`, the client is running on [http://localhost:8080](http://localhost:8080)

4. Open your web browser and go to [http://localhost:3000](http://localhost:3000) to view the application

## Client

The client side is implemented using React. The client includes the following features:

- Input: Players can adjust the speed and angle on the interface and fire the projectile by clicking the Fire button. The Fire button is disabled when it is not the player's turn or when there is only one player in the game.
- Feedback:
  - The projectile movement is implemented using canvas animation. Both players can see each other's movements.
  - The angle of the cannon aligns with the angle specified by the slider.
  - The distance to the opposing cannon is displayed once the projectile hits the ground.
  - The player can also see if this is their turn on the interface.
  - When the game ends, the player will be informed by a pop up card with a message showing whether they win or not.
- Projectile movement: The projectile movement is calculated in the Projectile component. Both the projectile factors (weight, diameter, speed, angle) and the environment factors (air density, wind, gravity) are considered.

## Server

The server side is implemented using Node.js and Socket.io. The server allocates every two players into one instance of game, synchronize game status with players within the same game, and kick players out of the game when it ends.
