// js/scenes/EndScene.js
import Scene from './Scene.js';

export default class EndScene extends Scene {
    // ... constructor is the same ...
    constructor(gameManager) {
        super(gameManager);
        this.result = 'defeat';
    }

    enter(params) {
        this.result = params.result || 'defeat';
        
        // Play the appropriate sound immediately upon entering the scene
        if (this.result === 'victory') {
            this.game.audioManager.playSound('victory');
        } else {
            this.game.audioManager.playSound('defeat');
        }

        this.canRestart = false;
        setTimeout(() => {
            this.canRestart = true;
        }, 2000);
    }

    draw(ctx) {
        if (this.result === 'victory') {
            this.drawVictoryScreen(ctx);
        } else {
            this.drawDefeatScreen(ctx);
        }

        if (this.canRestart) {
            ctx.fillStyle = '#e6d3a8';
            ctx.font = '24px "Courier New", Courier, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Click to return to the Main Menu', ctx.canvas.width / 2, 550);
        }
    }

    drawVictoryScreen(ctx) {
        // ... visuals are the same, but will be colored by the sepia filter
        ctx.fillStyle = '#3a542f';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = '#e6d3a8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(400, 50);
        ctx.bezierCurveTo(300, 200, 500, 400, 450, 550);
        ctx.stroke();

        ctx.fillStyle = '#b8862e'; // Muted Gold/Yellow
        ctx.font = '80px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', ctx.canvas.width / 2, 250);
        
        ctx.fillStyle = '#e6d3a8'; // Off-white
        ctx.font = '28px "Courier New", Courier, monospace';
        ctx.fillText('Your supplies have reached Saigon.', ctx.canvas.width / 2, 350);
    }

    drawDefeatScreen(ctx) {
        // ... visuals are the same
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = '#8B0000'; 
        ctx.font = '80px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DEFEAT!', ctx.canvas.width / 2, 250);

        ctx.fillStyle = '#ab947e'; // Muted grey
        ctx.font = '28px "Courier New", Courier, monospace';
        ctx.fillText('Your party has succumbed to the trail.', ctx.canvas.width / 2, 350);
    }
    
    // ... handleInput is the same
    handleInput(type, event) {
        if (type === 'click' && this.canRestart) {
            this.game.audioManager.playSound('click');
            this.game.changeScene('mainMenu');
        }
    }
}