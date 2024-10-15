export default {
  "canvas": {
    "width": 800,
    "height": 600
  },
  "characters": {
    "types": ["student", "nerd", "athlete", "artist", "rebel"],
    "student": {
      "width": 40,
      "height": 60,
      "color": "#FFD700",
      "fontColor": "#000000",
      "jumpStrength": -10
    },
    "nerd": {
      "width": 35,
      "height": 55,
      "color": "#4B0082",
      "fontColor": "#FFFFFF",
      "jumpStrength": -9
    },
    "athlete": {
      "width": 45,
      "height": 65,
      "color": "#FF4500",
      "fontColor": "#FFFFFF",
      "jumpStrength": -11
    },
    "artist": {
      "width": 38,
      "height": 58,
      "color": "#8A2BE2",
      "fontColor": "#FFFFFF",
      "jumpStrength": -9.5
    },
    "rebel": {
      "width": 42,
      "height": 62,
      "color": "#000000",
      "fontColor": "#FFFFFF",
      "jumpStrength": -10.5
    }
  },
  "gameOverButtons": {
    "types": ["startAgain", "selectCharacter"],
    "startAgain": {
      "text": "Start Again",
      "action": "startAgain",
      "color": "#FF4500",
      "fontColor": "#FFFFFF"
    },
    "selectCharacter": {
      "text": "Select Character",
      "action": "selectCharacter",
      "color": "#4B0082",
      "fontColor": "#FFFFFF"
    }
  },
  "game": {
    "groundColor": "#4CAF50",
    "groundY": 500,
    "jumpCooldown": 150,
    "obstacleSpawnChance": 0.02,
    "gravity": 0.5,
    "startX": 50,
    "maxEnergy": 100,
    "energyConsumptionRate": 0.5,
    "energyRefillRate": 2,
    "energyPercentageThreshold": 20,
    "obstaclesJumped": 0,
    "levels": [
      0,     // Level 1
      100,   // Level 2
      250,   // Level 3
      500,   // Level 4
      1000,  // Level 5
      2000,  // Level 6
      // Add more levels as needed
    ],
    "comboChance": 0.005,
    "comboDuration": 5000,
    "comboInputTimeout": 10000,
    "comboInputStartTime": 0,
    "comboInputThreshold": 200, // milliseconds to differentiate between dot and dash
    "lastInputTime": 0
  },
  "obstacle": {
    "speed": 5,
    "types": ["alarm_clock", "book", "pencil_case"],
    "alarm_clock": {
      "width": 40,
      "height": 40,
      "color": "#FF4136"
    },
    "book": {
      "width": 50,
      "height": 30,
      "color": "#0074D9"
    },
    "pencil_case": {
      "width": 60,
      "height": 20,
      "color": "#2ECC40"
    }
  },
  "ui": {
    "scoreBarWidth": 200,
    "scoreBarHeight": 30,
    "energyBarWidth": 200,
    "energyBarHeight": 30,
    "energyBarHighColor": "green",
    "energyBarLowColor": "red"
  },
  "audio": {
    "gameOver": "music/game-over.wav",
    "gameStarts": "music/game-starts.wav",
    "lowEnergy": "music/low-energy.wav",
    "jump": "music/jump.wav",
    "defaultOn": false
  },
  "morse": {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.",
    "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.",
    "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-",
    "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--.."
  }
};
