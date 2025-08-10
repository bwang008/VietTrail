// js/scenes/TravelScene.js
import Scene from './Scene.js';
import Button from '../ui/Button.js';

export default class TravelScene extends Scene {
    // ... constructor is the same ...
    constructor(gameManager) {
        super(gameManager);
        this.uiPanelHeight = gameManager.canvas.height * 0.4;
        this.viewportHeight = gameManager.canvas.height - this.uiPanelHeight;
        
        this.huntButton = new Button('Stop to Hunt', 580, this.viewportHeight + 150, 200, 50);

        this.caravanFrame = 0;
        this.caravanAnimTimer = 0;
        this.backgroundX = 0;
    }
    
    // ... update method is the same ...
    update(deltaTime) {
        const state = this.game.state;

        state.progress += (100 / 300) * deltaTime;
        state.hunger -= (100 / 60) * deltaTime;
        
        this.backgroundX -= 20 * deltaTime;
        if (this.backgroundX < -this.game.canvas.width) {
            this.backgroundX = 0;
        }

        this.caravanAnimTimer += deltaTime;
        if (this.caravanAnimTimer > 0.5) {
            this.caravanFrame = (this.caravanFrame + 1) % 2;
            this.caravanAnimTimer = 0;
        }

        if (state.progress >= 100) {
            state.progress = 100;
            this.game.changeScene('end', { result: 'victory' });
        }
        if (state.hunger <= 0) {
            state.hunger = 0;
            this.game.changeScene('end', { result: 'defeat' });
        }
    }
    
    draw(ctx) {
        const state = this.game.state;
        const canvasWidth = ctx.canvas.width;
        this.drawViewport(ctx);
        this.drawUIPanel(ctx, state, canvasWidth);
    }
    
    // ... drawViewport is the same ...
    drawViewport(ctx) {
        ctx.fillStyle = '#1a3b1a';
        ctx.fillRect(this.backgroundX, 0, ctx.canvas.width, this.viewportHeight);
        ctx.fillRect(this.backgroundX + ctx.canvas.width, 0, ctx.canvas.width, this.viewportHeight);
        
        const caravanY = this.viewportHeight - 100;
        if (this.caravanFrame === 0) {
            ctx.fillStyle = '#6b4f3a';
            ctx.fillRect(100, caravanY, 80, 50);
            ctx.fillStyle = '#ab947e';
            ctx.fillRect(110, caravanY - 20, 20, 20);
            ctx.fillRect(150, caravanY - 20, 20, 20);
        } else {
            ctx.fillStyle = '#6b4f3a';
            ctx.fillRect(100, caravanY + 5, 80, 50);
            ctx.fillStyle = '#ab947e';
            ctx.fillRect(110, caravanY - 15, 20, 20);
            ctx.fillRect(150, caravanY - 15, 20, 20);
        }
    }

    drawUIPanel(ctx, state, canvasWidth) {
        // UI Panel Background (Dark Brown)
        ctx.fillStyle = '#4a3f30';
        ctx.fillRect(0, this.viewportHeight, canvasWidth, this.uiPanelHeight);

        // UI Text Style (Off-white)
        ctx.fillStyle = '#e6d3a8';
        ctx.font = '20px "Courier New", Courier, monospace';
        ctx.textAlign = 'left';

        // Progress Bar
        ctx.fillText('Journey to Saigon:', 20, this.viewportHeight + 40);
        this.drawBar(ctx, state.progress, 100, 250, this.viewportHeight + 25, 300, 25, '#6a823a');
        
        // Hunger Bar with muted colors
        ctx.fillText('Stamina/Food:', 20, this.viewportHeight + 90);
        let hungerColor = state.hunger > 50 ? '#6a823a' : (state.hunger > 20 ? '#b8862e' : '#a64a4a'); // Muted Green, Yellow, Red
        this.drawBar(ctx, state.hunger, 100, 250, this.viewportHeight + 75, 300, 25, hungerColor);
        
        // ... rest of the method is the same ...
        ctx.fillText('Party: ' + state.partyMembers.join(', '), 20, this.viewportHeight + 140);
        ctx.fillText(`Supplies: ${Math.floor(state.supplies)}`, 20, this.viewportHeight + 170);
        this.huntButton.draw(ctx);
    }
    
    // ... drawBar is the same ...
    drawBar(ctx, value, maxValue, x, y, width, height, color) {
        const percent = value / maxValue;
        ctx.fillStyle = '#2a211a';
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * percent, height);
        ctx.strokeStyle = '#e6d3a8';
        ctx.strokeRect(x, y, width, height);
    }

    handleInput(type, event) {
        if (type === 'click') {
            if (this.huntButton.isClicked(event.x, event.y)) {
                this.game.audioManager.playSound('click'); // Play sound
                this.game.changeScene('hunting');
            }
        }
    }
}