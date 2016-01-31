var World = (function() {
    function World(game_state, game_settings) {
        this.game_state = game_state;
        this.createMap();
        if (!game_settings) {
            this.player = {
                souls_following: 0,
                angels_collected: 0,
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
            
            this.current_level = {
                level: "L1"
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
        var isItTimeToScreenShakePartyYet = this.screenShake.counter.indexOf(this.player.souls_following) == 0;

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
        this.player.souls_following += 1;
        this.calculateScreenShake();
        this.refresh();
    };

    World.prototype.runRitual = function(character) {
        // Happens when you sarcifice ghosts on the stone
        this.player.angels_collected += this.player.souls_following;
        this.player.souls_following = 0;
        this.player.rituals_performed += 1;
        this.calculateScreenShake();

        if (this.win_conditions.player.angels_collected <= this.player.angels_collected) {
            if(this.win_conditions.is_last_level){
                this.game_state.gameOver(true);
                return;
            }
            
            this.createMap("L2");
            this.reset();
        } else {
            this.game_state.powerUp.addPower();
        }

        this.refresh();
    };

    World.prototype.setLevelsProperties = function(backgroundLayer){
        var layer = this.game_state.map.layers.find(function(l){ return l.name === backgroundLayer });;
        var gameSettings = JSON.parse(layer.properties.game_settings);

        for (var i in gameSettings) {
                this[i] = layer.properties[i];
        }
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
        console.log(this.player);
        console.log(this.enemy);
        
        this.updateScore();
        this.makeWorldScarierOrCooler();
    };

    World.prototype.reset = function() {        
       
        
        this.refreshGroup("humans");
        this.refreshGroup("ghosts");
        this.refreshGroup("enemies");
        this.refreshGroup("scoreLayer");
        this.refreshGroup("bodyParts");     

        this.game_state.enemies.addChild(new Enemy(this.game_state, 'Enemy', this.game_state.world.centerX + (this.game_state.world.centerX / 2), this.game_state.world.centerY, 'enemy'));

        this.player = {
            angels_collected: 0,
            souls_following: 0,
            rituals_performed: 0
        };

        this.enemy = {
            humans_devoured: 0,
            difficulty: 5,
            isEatingHuman: false,
            scale: 0.5
        };
        
        this.current_level = {
            level: "L2"
        }

        this.updateScore();
    };

    World.prototype.refreshGroup = function(groupName) {
        this.game_state[groupName] && this.game_state[groupName].destroy();
        this.game_state[groupName] = this.game_state.game.add.group();
    };

    World.prototype.updateScore = function() {
        var width = 16;
        var padding = 4;
        var xPosition = 16 + (width + padding) * this.player.souls_following + 1;

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
    };

    World.prototype.createMap = function(level) {
        level = level || 'L1';
        this.game_state.map = this.game_state.add.tilemap('tileset');
        this.game_state.map.addTilesetImage('tiles', 'tiles');
        this.game_state.map.addTilesetImage('tilesdarkgreen', 'tilesdarkgreen');

        this.game_state.map.setCollisionBetween(15, 16);
        //create layer
        this.game_state.groundLayer && this.game_state.groundLayer.destroy();
        this.game_state.groundLayer = this.game_state.map.createLayer('groundLayer_' + level);

        this.game_state.backgroundLayer && this.game_state.backgroundLayer.destroy();
        var backgroundLayerName = 'backgroundLayer_' + level;
        this.game_state.backgroundLayer = this.game_state.map.createLayer(backgroundLayerName);
        this.game_state.backgroundLayer.sendToBack();
        this.game_state.groundLayer.sendToBack();

        this.setLevelsProperties(backgroundLayerName);

        var tiles = this.game_state.backgroundLayer.getTiles(0, 0, this.game_state.world.width, this.game_state.world.height);
        this.game_state.game.houseTiles = tiles.filter(function(f){return f.index === 2 || f.index === 3 || f.index === 155 || f.index === 156;});

        this.game_state.map.setCollision([5,6,7,8,9,10,13, 22,23, 24, 25, 26, 27, 39,40,41,42, 108,109, 110,113,114,115,116,117,118,119,125,126,127,130,131,133,134,136,144,142,143,148,149,150,151,152,153], true, this.game_state.backgroundLayer);
    };

    return World;
})();