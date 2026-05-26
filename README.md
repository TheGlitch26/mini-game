# Pixel Hunter

Pixel Hunter is a fast-paced, minimalist 2D arcade game built from scratch using pure HTML5 Canvas, CSS3, and Vanilla JavaScript. Designed with an emphasis on clean mechanics and scaling difficulty, the game challenges players to navigate a responsive character square to collect randomly spawning gold coins. The twist? Every single coin collected increases your score but instantly spawns a new, static red enemy on the game grid. As the playable arena grows tighter and more dangerous with every point earned, players must rely on precise movement and quick reflexes to dodge the multiplying hazards. 

The game is played with W A S D or Arrow keys with keyboard.

HOW THE GAME WORKS

 Player moves with arrow or WASD keys, while avoiding to contact with red pixels, players collects yellow coin. Each successfull coin collection adds 10 points to the score. And everytime the coin is collected, it teleports to another random location. And everytime a coin is collected, a red pixel appears in a random location. The number of red pixels increase by 1 everytime a coin is collected. Touching a red pixel will end the game.

![alt text](<Screenshot 2026-05-25 203716.png>)

TECH DECISION AND DESIGN

As structure and entites, i have 1 player (as the main square) and 1 coin objects. And red (evil) pixels are generated randomly upon coin collection. Since there is only one player and one coin entity, class definition would be unnecessary. And red pixels are created in a random location everytime a coin is collected. 


## Here is the walkthrough of game creation with Gemini:
[AI Diary](./AI_DIARY.md)
