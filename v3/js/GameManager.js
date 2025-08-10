// js/GameManager.js
import MainMenuScene from './scenes/MainMenuScene.js';
import TravelScene from './scenes/TravelScene.js';
import HuntingScene from './scenes/HuntingScene.js';
import EndScene from './scenes/EndScene.js';
import AudioManager from './AudioManager.js'; // Import the new manager

export default class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Initialize the audio manager
        this.audioManager = new AudioManager();

        this.scenes = {
            mainMenu: new MainMenuScene(this),
            travel: new TravelScene(this),
            hunting: new HuntingScene(this),
            end: new EndScene(this)
        };
        
        // ... rest of the constructor is the same
        this.currentScene = null;
        this.lastTime = 0;
        this.state = {};
        this.resetState();
        this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
    }
    
    // ... resetState, changeScene, gameLoop, start, and handleMouseClick methods are unchanged ...
    
    // Resets the game state to its initial values
    resetState() {
        this.state = {
            progress: 0,
            hunger: 100,
            partyMembers: ['An', 'Binh', 'Chi', 'Dung'],
            supplies: 100,
            gameTime: 0,
        };
    }

    // Changes the active scene
    changeScene(sceneKey, params = {}) {
        this.currentScene = this.scenes[sceneKey];
        this.currentScene.enter(params);
    }
    
    // The main game loop, powered by requestAnimationFrame
    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (this.currentScene) {
            this.currentScene.update(deltaTime);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentScene.draw(this.ctx);
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // Starts the game
    start() {
        this.changeScene('mainMenu');
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Handles all mouse clicks and passes them to the current scene
    handleMouseClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.currentScene) {
            this.currentScene.handleInput('click', { x: mouseX, y: mouseY });
        }
    }
}