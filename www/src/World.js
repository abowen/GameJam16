var World = (function() {
    function World(game_state) {
        this.init_condition = {

        };

        this.win_conditions = {
            player: {
                rituals_performed: 3
            }
        };
        
        this.lose_conditions = {
            enemy : {
                humans_devoured: 10                
            }
        };

        this.player = {
            souls_collected: 0,
            rituals_performed: 0
        };

        this.enemy = {
            humans_devoured: 0,
            difficulty: 5,
            // TODO: Refactor back into Enemy.js
            // TODO: Can turn off anti-aliasing but couldnt work it out http://phaser.io/examples/v2/display/render-crisp
            isEatingHuman : false,
            scale : 0.5
        };

        this.screenShake = {
            effect: 0,
            counter: [5, 10, 15]
        }

        this.game_state = game_state;

        var max = this.screenShake.counter.max();        
        this.game_state.game.world.setBounds(-max, -max, this.game_state.game.width + max, this.game_state.game.height + 2);
    };

    World.prototype.devourHuman = function(human) {
        console.log("started eating");

        this.enemy.humans_devoured += 1;
        // TODO: Tween him into scale.
        this.enemy.scale += 0.05;        
        this.enemy.isEatingHuman = true;        
        
		setTimeout(function() {
			console.log("stopped eating");
            this.enemy.isEatingHuman = false;
        }.bind(this), 1000);
        
        this.makeWorldScarier();
        this.updateScore();
    };

    World.prototype.cameraShake = function(effect) {
        var min = -effect;
        var max = effect;
        this.game_state.game.camera.x += Math.floor(Math.random() * (max - min + 1)) + min;
        this.game_state.game.camera.y += Math.floor(Math.random() * (max - min + 1)) + min;
    };

    World.prototype.calculateScreenShake = function() {
        var isItTimeToScreenShakePartyYet = this.screenShake.counter.indexOf(this.player.souls_collected) == 0;

        if (isItTimeToScreenShakePartyYet) {            
            this.screenShake.effect = this.screenShake.counter.shift();
        } else {            
            this.screenShake.effect = 1;
        }

        var screenShakeTimer = isItTimeToScreenShakePartyYet ? 2000 : 250;
        setTimeout(function() {
            this.screenShake.effect = 0;            
        }.bind(this), screenShakeTimer);
    };              

    World.prototype.sacrificeHuman = function(human) {
    	// kill human?
        this.player.souls_collected += 1;
        this.updateScore();
        this.calculateScreenShake();
        this.makeWorldScarier(human);
    };
    
    World.prototype.runRitual = function(human) {
    	// kill human?
        this.player.souls_collected = 0;
        this.player.rituals_performed += 1;
        this.updateScore();
        this.calculateScreenShake();
        this.makeWorldScarier(human);
    };

    World.prototype.updateScore = function() {    	    	          
        var width = 16;
        var padding = 4;
        var xPosition = 16 + (width + padding) * this.player.souls_collected + 1;

        var scoreIcon = new Phaser.Sprite(
            this.game_state.game,
            xPosition,
            20,
            'scoreIcon');
        scoreIcon.anchor.setTo(0.5, 0.5);
     
        this.game_state.scoreLayer.add(scoreIcon);     
        
        
        if(this.lose_conditions.enemy.humans_devoured == this.enemy.humans_devoured) {

            this.game_state.gameOver(false);
        }           
    };

    World.prototype.makeWorldScarier = function() {
        // Tint the world
        if (this.player.souls_collected < 16) {
            this.player.souls_collected++;

            var tintValue = 16 - this.player.souls_collected;
            var hexString = tintValue.toString(16);
            hexString = hexString + hexString;
            var tintColour = '0xff' + hexString + 'ff';            
            this.game_state.groundLayer.tint = tintColour;
            this.game_state.backgroundLayer.tint = tintColour;
        }
    }

    return World;
})();