# === AI NOTES ===
# Initialization
[25 may] - Code separation and Readme file

== Gemini is used for this project ==

- I asked Gemini for mini game ideas
- It gave me platformer/ping-pong/runner and pixel collector games
- I chose Pixel Collector since the comcept is simple and fun to build. And Gemini gave me a whole HTML file with CSS and All Javascript code written internally
- I seperated the files, linked them, and started to build step by step



## == Essential Steps ==

# Player Movement

[25 may 2026]

- After file separation, I asked Gemini to implement player movement only

- I reviewed the code of AI, and tested if it works without any problems

- And faced no problems in this stage.


# Coin Interaction 

[26 may 2026]

- I asked AI to generate the coin that changes location everytime it is collected

- Gemini gave me things that i should update

- I used the code and tested if it works well

- No problems in this part


# Enemy interaction

[26 may 2026]

- Now the challenging part, implementing the red pixels (enemies). I asked Gemini for this enemy creation.

- Gemini gave me code that generates the enemies in random location. Ensuring that they won't overlap with other enemies and the player

- PROBLEM: Because coin creation is implemented before the enemies, coin was overlapping with enemies

- I told Gemini this problem, and it updated the coin creation, ensuring it wont overlap neighter with player, nor with enemies


