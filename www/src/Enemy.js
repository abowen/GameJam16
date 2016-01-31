var Enemy = (function() {
    function Enemy(game_state, name, x, y, properties) {
        "use strict";

        // TODO: to be managed by the level state
        properties = {
            group: 'enemies',
            spritesheet: 'enemy'
        };

        Prefab.call(this, game_state, name, {
            x: x,
            y: y
        }, properties);

        this.base_speed = 60.0;
        this.anchor.setTo(0.5);
        this.game = game_state.game;
        this.walking_speed = +properties.walking_speed;
        this.walking_distance = +properties.walking_distance;
        this.direction = +properties.direction;
        this.axis = properties.axis;        

        this.previous_position = (this.axis === "x") ? this.x : this.y;

        this.game.physics.arcade.enable(this);
        if (this.axis === "x") {
            this.body.velocity.x = this.direction * this.walking_speed;
        } else {
            this.body.velocity.y = this.direction * this.walking_speed;
        }

        this.animations.add("down", [1, 2, 3], 10, true);
        this.animations.add("left", [4, 5, 6, 7], 10, true);
        this.animations.add("right", [4, 5, 6, 7], 10, true);
        this.animations.add("up", [0, 8, 9], 10, true);

        this.stopped_frames = [1, 4, 4, 0, 1];
    };

    Enemy.prototype = Object.create(Prefab.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.stop = function() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    };

    Enemy.prototype.devourHuman = function(human) {
        this.makeNastyEatingNoises();
        this.makeNastyMess();
    };    

    Enemy.prototype.makeNastyMess = function() {  
        this.game_state.emitter.flow(500, 30, 2, 100, false);
    };
    
    Enemy.prototype.makeNastyEatingNoises = function() {        
        this.game_state.eatingSoundGroup.playRandomSound();
    };

    Enemy.prototype.giggleWhileEating = function() {        
        // Make him wobble on the spot because he is munching
        var max = 1;
        var min = -1;
        
        var movement = Math.floor(Math.random() * (max - min + 1)) + min;
        //console.log('Got the giggles : ' + movement);

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        
        this.body.x += movement;
        this.body.y += movement;        
    };    

    Enemy.prototype.update = function() {
        "use strict";

        if (this.game_state.world_state.enemy.isEatingHuman){
            this.gotTheGiggles();
        }
        else {

            var new_position;
        }

        if (this.game_state.world_state.enemy.isEatingHuman){
            this.giggleWhileEating();
        }
        else {
            var followed_mob = {};
            var dist = 0.0;
            var scaleX = this.game_state.world_state.enemy.scale;
            var scaleY = this.game_state.world_state.enemy.scale;

            if (this.game_state.humans && this.game_state.humans.children.length > 0) {

                var closest_human = {};
                var dist_min = 99999;
                this.game_state.humans.forEachAlive(function(human) {
                    var current_dist = this.game.math.distance(this.body.position.x,
                        this.body.position.y,
                        human.position.x,
                        human.position.y);
                    
                    if(dist < dist_min){
                        dist = dist_min;
                        current_dist = dist_min;
                        closest_human = human;
                    }
                }, this);

                followed_mob = closest_human;
            } else {
                followed_mob = this.game_state.character;
                dist = this.game.math.distance(this.body.position.x,
                    this.body.position.y,
                    followed_mob.position.x,
                    followed_mob.position.y);
            }

            var vel_factor = 1.0;

            if (dist > 20.0) {
                this.game.ai.follow(this, followed_mob, this.base_speed * vel_factor, this.base_speed * vel_factor);
            } else {
                this.stop();
            }

            if (this.body.velocity.x < 0) {
                // walking left                
                scaleX *= -1;
                this.animations.play("left");
            } else if (this.body.velocity.x > 0) {
                // walking right                
                this.animations.play("right");
            }

            if (this.body.velocity.y < 0) {
                // walking up
                this.animations.play("up");
            } else if (this.body.velocity.y > 0) {
                // walking down
                this.animations.play("down");
            }        

            this.scale.setTo(scaleX, scaleY);
        }    

        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
                // stop current animation                
                this.animations.stop();                
            }

        new_position = (this.axis === "x") ? this.x : this.y;        

        if (Math.abs(new_position - this.previous_position) >= this.walking_distance) {
                this.switch_direction();
        }
    };

    Enemy.prototype.gotTheGiggles = function() {        
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        var max = 2;
        var min = 1;
        // TODO: Make him bigger

        // TODO: Make him wobble

        //var movement = Math.floor(Math.random() * (max - min + 1)) + min;
        //console.log('Got the giggles');
        //this.body.velocity.x        
    };

    Enemy.prototype.switch_direction = function() {
        "use strict";

        if (this.axis === "x") {
            this.previous_position = this.x;
            this.body.velocity.x *= -1;
        } else {
            this.previous_position = this.y;
            this.body.velocity.y *= -1;
        }
    };

    return Enemy;
})();