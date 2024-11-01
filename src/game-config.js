export default {
  "characters": {
    "types": ["student", "nerd", "athlete", "artist", "rebel"],
    "student": {
      "width": 40,
      "height": 60,
      "jumpStrength": -10,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 60">
        <rect x="10" y="0" width="20" height="20" fill="#FFD700"/>
        <rect x="0" y="20" width="40" height="40" fill="#4169E1"/>
        <rect x="5" y="50" width="10" height="10" fill="#000"/>
        <rect x="25" y="50" width="10" height="10" fill="#000"/>
      </svg>`
    },
    "nerd": {
      "width": 35,
      "height": 55,
      "jumpStrength": -9,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 55">
        <rect x="7.5" y="0" width="20" height="20" fill="#A52A2A"/>
        <rect x="0" y="20" width="35" height="35" fill="#32CD32"/>
        <rect x="5" y="45" width="8" height="10" fill="#000"/>
        <rect x="22" y="45" width="8" height="10" fill="#000"/>
        <rect x="7.5" y="10" width="20" height="5" fill="#000"/>
      </svg>`
    },
    "athlete": {
      "width": 45,
      "height": 65,
      "jumpStrength": -11,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 65">
        <rect x="12.5" y="0" width="20" height="20" fill="#FFA500"/>
        <rect x="0" y="20" width="45" height="45" fill="#FF4500"/>
        <rect x="5" y="55" width="12" height="10" fill="#000"/>
        <rect x="28" y="55" width="12" height="10" fill="#000"/>
      </svg>`
    },
    "artist": {
      "width": 38,
      "height": 58,
      "jumpStrength": -9.5,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 58">
        <rect x="9" y="0" width="20" height="20" fill="#8A2BE2"/>
        <rect x="0" y="20" width="38" height="38" fill="#9370DB"/>
        <rect x="5" y="48" width="10" height="10" fill="#000"/>
        <rect x="23" y="48" width="10" height="10" fill="#000"/>
        <circle cx="19" cy="10" r="5" fill="#FF69B4"/>
      </svg>`
    },
    "rebel": {
      "width": 42,
      "height": 62,
      "jumpStrength": -10.5,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 62">
        <rect x="11" y="0" width="20" height="20" fill="#000"/>
        <rect x="0" y="20" width="42" height="42" fill="#8B0000"/>
        <rect x="5" y="52" width="11" height="10" fill="#000"/>
        <rect x="26" y="52" width="11" height="10" fill="#000"/>
        <path d="M11 15 L21 5 L31 15" fill="none" stroke="#FFF" stroke-width="2"/>
      </svg>`
    }
  },
  "gameOverButtons": {
    "types": ["startAgain", "selectCharacter", "mainMenu"],
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
    },
    "mainMenu": {
      "text": "Main Menu",
      "action": "mainMenu",
      "color": "#2196F3",
      "fontColor": "#FFFFFF"
    }
  },
  "mainMenuButtons": {
    "types": ["startGame", "howToPlay"],
    "startGame": {
      "text": "Start Game",
      "action": "startGame",
      "color": "#4CAF50",
      "fontColor": "#FFFFFF"
    },
    "howToPlay": {
      "text": "How to Play",
      "action": "howToPlay",
      "color": "#2196F3",
      "fontColor": "#FFFFFF"
    }
  },
  "howToButtons": {
    "types": ["backToMenu"],
    "backToMenu": {
      "text": "Back to Menu",
      "action": "backToMenu",
      "color": "#2196F3",
      "fontColor": "#FFFFFF"
    }
  },
  "loginButtons": {
    "types": ["login", "register", "forgotPassword"],
    "login": {
      "text": "Login",
      "action": "postLogin",
      "color": "#2196F3",
      "fontColor": "#FFFFFF"
    },
    "register": {
      "text": "Register",
      "action": "renderRegisterScreen",
      "color": "#4CAF50",
      "fontColor": "#FFFFFF"
    },
    "forgotPassword": {
      "text": "Forgot Password",
      "action": "renderForgotPasswordScreen",
      "color": "#FF9800",
      "fontColor": "#FFFFFF"
    }
  },
  "registerButtons": {
    "types": ["register", "backToLogin"],
    "register": {
      "text": "Register",
      "action": "postRegister",
      "color": "#4CAF50",
      "fontColor": "#FFFFFF"
    },
    "backToLogin": {
      "text": "Back to Login",
      "action": "renderLoginScreen",
      "color": "#2196F3",
      "fontColor": "#FFFFFF"
    }
  },
  "forgotPasswordButtons": {
    "types": ["forgotPassword", "backToLogin"],
    "forgotPassword": {
      "text": "Forgot Password",
      "action": "postForgotPassword",
      "color": "#FF9800",
      "fontColor": "#FFFFFF"
    },
    "backToLogin": {
      "text": "Back to Login",
      "action": "renderLoginScreen",
      "color": "#2196F3",
      "fontColor": "#FFFFFF"
    }
  },
  "game": {
    "groundColor": "#4CAF50",
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
      3000,  // Level 7
      4000,  // Level 8
      5000,  // Level 9
      6000,  // Level 10
      7000,  // Level 11
      8000,  // Level 12
      9000,  // Level 13
      10000,  // Level 14
    ],
    "comboChance": 0.005,
    "comboDuration": 5000,
    "comboInputTimeout": 10000,
    "comboInputStartTime": 0,
    "comboInputThreshold": 200, // milliseconds to differentiate between dot and dash
    "correctComboFeedbackDuration": 1000, // 1 seconds duration for correct combo feedback
    "lastInputTime": 0,
    "comboCooldown": 5000, // 5 seconds cooldown between combos
  },
  "obstacle": {
    "speed": 5,
    "types": ["alarm_clock", "book", "pencil_case"],
    "alarm_clock": {
      "width": 40,
      "height": 40,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#FF4136" stroke="#000" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="8" stroke="#000" stroke-width="2"/>
        <line x1="20" y1="20" x2="28" y2="20" stroke="#000" stroke-width="2"/>
        <circle cx="20" cy="20" r="2" fill="#000"/>
      </svg>`
    },
    "book": {
      "width": 50,
      "height": 30,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
        <rect width="50" height="30" fill="#0074D9"/>
        <rect x="5" y="5" width="40" height="20" fill="#FFF"/>
        <line x1="10" y1="10" x2="40" y2="10" stroke="#000" stroke-width="2"/>
        <line x1="10" y1="15" x2="40" y2="15" stroke="#000" stroke-width="2"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#000" stroke-width="2"/>
      </svg>`
    },
    "pencil_case": {
      "width": 60,
      "height": 20,
      "svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20">
        <rect width="60" height="20" rx="5" ry="5" fill="#2ECC40"/>
        <rect x="5" y="5" width="50" height="10" rx="2" ry="2" fill="#FFF"/>
        <circle cx="15" cy="10" r="3" fill="#FF4136"/>
        <rect x="25" y="7" width="20" height="6" fill="#0074D9"/>
      </svg>`
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
    "gameOver": "public/music/game-over.wav",
    "gameStarts": "public/music/game-starts.wav",
    "lowEnergy": "public/music/low-energy.wav",
    "jump": "public/music/jump.wav",
    "defaultOn": false
  },
  "morse": {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.",
    "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.",
    "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-",
    "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--.."
  }
};