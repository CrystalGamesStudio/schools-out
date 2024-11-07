import gameConfig from '../game-config.js';
import { getBasePath } from '../config.js';

export default class GameAudio {
    constructor() {
        const basePath = getBasePath();
        this.sounds = {
            gameOver: new Audio(`${basePath}/music/game-over.wav`),
            gameStarts: new Audio(`${basePath}/music/game-starts.wav`),
            lowEnergy: new Audio(`${basePath}/music/low-energy.wav`),
            jump: new Audio(`${basePath}/music/jump.wav`)
        };
        this.isLowEnergyPlaying = false;
        this.isMuted = !gameConfig.audio.defaultOn;
    }

    play(soundName) {
        if (this.sounds[soundName] && !this.isMuted) {
            this.sounds[soundName].currentTime = 0; // Reset the audio to the beginning
            this.sounds[soundName].play();
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.isLowEnergyPlaying = false;
    }

    playLowEnergy() {
        if (!this.isLowEnergyPlaying) {
            this.play('lowEnergy');
            this.isLowEnergyPlaying = true;
        }
    }

    stopLowEnergy() {
        if (this.isLowEnergyPlaying) {
            this.sounds.lowEnergy.pause();
            this.sounds.lowEnergy.currentTime = 0;
            this.isLowEnergyPlaying = false;
        }
    }

    mute() {
        this.isMuted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = true;
        });
    }

    unmute() {
        this.isMuted = false;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = false;
        });
    }
}