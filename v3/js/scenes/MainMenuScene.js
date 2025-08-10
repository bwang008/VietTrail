// js/scenes/MainMenuScene.js
import Scene from './Scene.js';
import Button from '../ui/Button.js';

export default class MainMenuScene extends Scene {
    constructor(gameManager) {
        super(gameManager);
        this.startButton = new Button('Start Game', 300, 400, 200, 50);
    }

    draw(ctx) {
        // The sepia filter on the canvas will automatically style these drawings
        ctx.fillStyle = '#3a542f'; 
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.strokeStyle = '#e6d3a8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(400, 50); 
        ctx.bezierCurveTo(300, 200, 500, 400, 450, 550);
        ctx.stroke();

        ctx.fillStyle = '#e6d3a8'; // Off-white/tan text
        ctx.font = '60px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('The Viet Trail', ctx.canvas.width / 2, 150);

        this.startButton.draw(ctx);
    }

    handleInput(type, event) {
        if (type === 'click') {
            if (this.startButton.isClicked(event.x, event.y)) {
                this.game.audioManager.playSound('click'); // Play sound on click
                this.game.resetState();
                this.game.changeScene('travel');
            }
        }
    }
}