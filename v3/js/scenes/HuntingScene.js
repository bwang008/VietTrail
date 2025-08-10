// js/scenes/HuntingScene.js
import Scene from './Scene.js';
import Animal from '../entities/Animal.js';

export default class HuntingScene extends Scene {
    // ... constructor is the same ...
    constructor(gameManager) {
        super(gameManager);
        this.sceneDuration = 15;
        this.resultsDuration = 3;
    }
    
    // ... enter is the same ...
    enter() {
        this.timer = this.sceneDuration;
        this.animals = [];
        this.spawnTimer = 0;
        this.suppliesGained = 0;
        this.isResultsPhase = false;
        
        this.game.canvas.classList.add('crosshair');
    }

    // ... update is the same ...
    update(deltaTime) {
        if (this.isResultsPhase) {
            this.timer -= deltaTime;
            if (this.timer <= 0) {
                this.game.canvas.classList.remove('crosshair');
                this.game.state.hunger = Math.min(100, this.game.state.hunger + this.suppliesGained);
                this.game.state.supplies -= this.suppliesGained; 
                this.game.changeScene('travel');
            }
            return;
        }

        this.timer -= deltaTime;
        
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.animals.push(new Animal(this.game.canvas.width, this.game.canvas.height));
            this.spawnTimer = Math.random() * 1.5 + 0.5;
        }

        this.animals.forEach(animal => animal.update(deltaTime));
        this.animals = this.animals.filter(animal => !animal.isOffScreen(this.game.canvas.width));
        
        if (this.timer <= 0) {
            this.isResultsPhase = true;
            this.timer = this.resultsDuration;
        }
    }

    // ... draw is the same ...
    draw(ctx) {
        ctx.fillStyle = '#688c4f';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (this.isResultsPhase) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = '#e6d3a8';
            ctx.font = '40px "Courier New", Courier, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`You gathered ${this.suppliesGained} supplies.`, ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.font = '20px "Courier New", Courier, monospace';
            ctx.fillText(`Returning to the trail...`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
        } else {
            this.animals.forEach(animal => animal.draw(ctx));
            
            ctx.fillStyle = '#e6d3a8';
            ctx.font = '30px "Courier New", Courier, monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`Time: ${Math.ceil(this.timer)}`, 20, 40);
            ctx.fillText(`Supplies Gained: ${this.suppliesGained}`, 20, 80);
        }
    }

    handleInput(type, event) {
        if (type === 'click' && !this.isResultsPhase) {
            this.game.audioManager.playSound('shoot'); // Play shoot sound on every click
            
            for (let i = this.animals.length - 1; i >= 0; i--) {
                if (this.animals[i].isHit(event.x, event.y)) {
                    this.suppliesGained += 20;
                    // Note: supplies in the main state are updated when returning to travel scene.
                    this.animals.splice(i, 1);
                    break;
                }
            }
        }
    }
}