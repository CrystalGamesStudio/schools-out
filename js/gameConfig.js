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
      "jumpStrength": -10
    },
    "nerd": {
      "width": 35,
      "height": 55,
      "color": "#4B0082",
      "jumpStrength": -9
    },
    "athlete": {
      "width": 45,
      "height": 65,
      "color": "#FF4500",
      "jumpStrength": -11
    },
    "artist": {
      "width": 38,
      "height": 58,
      "color": "#8A2BE2",
      "jumpStrength": -9.5
    },
    "rebel": {
      "width": 42,
      "height": 62,
      "color": "#000000",
      "jumpStrength": -10.5
    }
  },
  "game": {
    "groundY": 500,
    "jumpCooldown": 150,
    "obstacleSpawnChance": 0.02,
    "gravity": 0.5,
    "startX": 50,
    "maxEnergy": 100,
    "energyConsumptionRate": 0.5,
    "energyRefillRate": 2,
    "obstaclesJumped": 0
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
    "energyBarHeight": 30
  },
  "audio": {
    "gameOver": "music/game-over.wav",
    "gameStarts": "music/game-starts.wav",
    "lowEnergy": "music/low-energy.wav",
    "jump": "music/jump.wav",
    "defaultOn": false
  }
};
