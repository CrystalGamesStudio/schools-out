import './styles/styles.css';
import Game from './game.js';
import UITemplates from './components/UITemplates.js';

// Add debugging
console.log('Main.js loaded');

// Initialize UI Templates first
window.uiTemplates = UITemplates;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    try {
        // Load templates
        await UITemplates.load();
        console.log('Templates loaded');
        
        // Initialize game
        const game = new Game();
        await game.init();
        console.log('Game initialized');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});