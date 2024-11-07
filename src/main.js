import './styles/styles.css';
import Game from './game.js';
import UITemplates from './templates/ui-templates.js';

window.uiTemplates = UITemplates;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await UITemplates.load();
        const game = new Game();
        await game.init();

    } catch (error) {
        console.error('Error initializing game:', error);
    }
});