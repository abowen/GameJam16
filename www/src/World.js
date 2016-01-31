var World = (function() {
    function World(game_state, game_settings) {

        if (!game_settings) {
            this.init_conditions = {
                souls_per_ritual: 5,
                distance_to_stone: 64 //2 big game frames
            };

            this.win_conditions = {
                player: {
                    rituals_performed: 3
                }
            };

            this.lose_conditions = {
                enemy: {
                    humans_devoured: 15
                }
            };

            this.player = {
                angels_collected: 0,
                souls_collected: 0,
                rituals_performed: 0
            };

            this.enemy = {
                humans_devoured: 0,
                difficulty: 5,
                // TODO: Refactor back into Enemy.js
                // TODO: Can turn off anti-aliasing but couldnt work it out http://phaser.io/examples/v2/display/render-crisp
                isEatingHuman: false,
                // TODO: Move scale as a function of humans_devoured
                scale: 0.5
            };

            this.screenShake = {
                effect: 0,
                counter: [5, 10]
            }
        } else {
            for (var i in game_settings) {
                if (obj.hasOwnProperty(i)) {
                    this[i] = obj[i];
                }
            }
        }

        this.game_state = game_state;

        var max = this.screenShake.counter.max();
        this.game_state.game.world.setBounds(-max, -max, this.game_state.game.width + max, this.game_state.game.height + 2);
    };

    World.prototype.cameraShake = function(effect) {
        var min = -effect;
        var max = effect;
        this.game_state.game.camera.x += Math.floor(Math.random() * (max - min + 1)) + min;
        this.game_state.game.camera.y += Math.floor(Math.random() * (max - min + 1)) + min;
    };

    World.prototype.calculateScreenShake = function() {
        var isItTimeToScreenShakePartyYet = this.screenShake.counter.indexOf(this.player.souls_collected) == 0;

        var effect = isItTimeToScreenShakePartyYet ? this.screenShake.counter.shift() : 1;
        var timer = isItTimeToScreenShakePartyYet ? 2000 : 250;

        this.addScreenShake(effect, timer)
    };

    World.prototype.addScreenShake = function(effect, timer) {
        if (this.screenShake.effect < effect) {
            this.screenShake.effect = effect;

            setTimeout(function() {
                this.screenShake.effect = 0;
            }.bind(this), timer);
        }
    };

    World.prototype.devourHuman = function(human) {
        // Happens when the orge eats a human
        console.log("started eating");

        this.enemy.humans_devoured += 1;
        // TODO: Tween him into scale.
        this.enemy.scale += 0.05;
        this.enemy.isEatingHuman = true;

        setTimeout(function() {
            console.log("stopped eating");
            this.enemy.isEatingHuman = false;
        }.bind(this), 1000);

        this.refresh();
        this.updateScore();
    };

    World.prototype.sacrificeHuman = function(human) {
        // Happens when you turn a human to a ghost
        this.player.souls_collected += 1;
        this.calculateScreenShake();
        this.refresh();
    };

    World.prototype.runRitual = function(character) {
        // Happens when you sarcifice ghosts on the stone
        this.player.souls_collected = 0;
        this.player.rituals_performed += 1;
        this.calculateScreenShake();
        this.game_state.powerUp.addPower();
        this.createMap("L2");
        this.world_state.reset();
        this.refresh();
    };

    World.prototype.sacrificeFollower = function() {
        if (this.enemy.humans_devoured > 0) {
            this.enemy.humans_devoured--;
        } else {
            this.player.angels_collected++;
        }

        this.refresh();
    };

    World.prototype.devourSlime = function(slime) {
        console.log("started eating");
            
        this.enemy.isEatingSlime = true;
        
        setTimeout(function() {
            console.log("stopped eating");
            this.enemy.isEatingSlime = false;
        }.bind(this), 500);
        
        this.refresh();        
    };

    World.prototype.refresh = function() {
        this.updateScore();
        this.makeWorldScarierOrCooler();
    };

    World.prototype.reset = function(){
        this.refreshGroup("humans");
        this.refreshGroup("ghosts");
        this.refreshGroup("enemies");
        this.refreshGroup("scoreLayer");
        this.refreshGroup("bodyParts");

        this.game_state.enemies.addChild(new Enemy(this.game_state, 'Enemy', this.game_state.world.centerX + (this.game_state.world.centerX / 2), this.game_state.world.centerY, 'enemy'));


        this.player = {
            angels_collected: 0,
            souls_collected: 0,
            rituals_performed: 0
        };

        this.enemy = {
            humans_devoured: 0,
            difficulty: 5,
            isEatingHuman : false,
            scale : 0.5
        };

        this.updateScore();
    };

    World.prototype.refreshGroup = function(groupName){
        this.game_state[groupName] && this.game_state[groupName].destroy();
        this.game_state[groupName] = this.game_state.game.add.group();
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


        if (this.lose_conditions.enemy.humans_devoured == this.enemy.humans_devoured) {
            this.game_state.gameOver(false);
        }
    };

    World.prototype.makeWorldScarierOrCooler = function() {
        var tintColour = '0xffffff';

        // Red = Enemy eating people
        // Green = Slimes being eaten (?)
        // Blue = Sending angels to heaven

        var scoreDifference = this.player.angels_collected - this.enemy.humans_devoured;
        if (scoreDifference > 0) {
            var tintValue = 16 - this.player.angels_collected;
            var hexString = tintValue.toString(16);
            hexString = hexString + hexString;
            tintColour = '0xffff' + hexString;

        } else if (scoreDifference < 0) {
            var tintValue = 16 - this.enemy.humans_devoured;
            var hexString = tintValue.toString(16);
            hexString = hexString + hexString;
            tintColour = '0xff' + hexString + 'ff';
        }

        //console.log('tint : ' + tintColour)
        this.game_state.groundLayer.tint = tintColour;
        this.game_state.backgroundLayer.tint = tintColour;
    }

    return World;
})();