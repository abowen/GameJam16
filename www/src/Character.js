var Character = (function() {
    function Character(game_state, x, y, sprite) {
        //BasicGame.Prefab.call(this, game, 'Player', {x:x, y:y}, properties);
        Phaser.Sprite.call(this, game_state.game, x, y, sprite);
        this.speed = 7;
        this.speed = 200;
        this.game_state = game_state;
        game_state.game.physics.arcade.enable(this);
        this.anchor.set(0.5);

        this.framesPerSecond = 10;
        this.body.collideWorldBounds = true;

        this.speed = 200;
        this.followers = []
        this.setAnimation();

        this.boostSpeed = 10;
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    Character.prototype.reset = function(){
        this.speed = 200;
        this.followers = [];
    };

    Character.prototype.addFollower = function(follower) {
        //console.log("Slaughter the lamb.");
        this.speed -= this.boostSpeed;
        follower.follow(this);
        this.followers.push(follower);
    };

    Character.prototype.sacrificeFollower = function(follower) {
        this.game_state.world_state.sacrificeFollower(follower);
        this.speed += this.boostSpeed;
        follower.spawnAngel(this);
        follower.kill();
    };

    Character.prototype.runRitual = function(character, offeringStone) {
        // Run ritual only if have min number of ghosts following
        if (this.game_state.world_state.init_conditions.souls_per_ritual > this.followers.length) {
            return;
        }

        //  Run ritual only when close to the stone
        var distToStone = this.game.math.distance(this.body.position.x,
            this.body.position.y,
            this.game_state.offeringStone.body.position.x,
            this.game_state.offeringStone.body.position.y);

        if (distToStone > this.game_state.world_state.init_conditions.distance_to_stone) {
            return;
        }
        
        // Sarcifice all followers (ghosts)
        this.followers.forEach(function(follower) {
            this.sacrificeFollower(follower);
            setTimeout(function() {

            }.bind(this), 500);
        }, this);
        this.followers = [];
        this.game_state.world_state.runRitual();
        // Print something nice for Andrew
        //console.log("88888ooooo--- TUUUUUUURRRRRBOOOOOOOOOOO))))>");
    };

    Character.prototype.setAnimation = function() {
        this.animations.add('down', [0, 1, 2], this.framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], this.framesPerSecond, true);
        this.animations.add('left', [9, 10, 11], this.framesPerSecond, true);
    };

    Character.prototype.setVelocity = function(x, y) {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
    };

    Character.prototype.moveUp = function() {
        this.setVelocity(0, -this.speed);
        this.animations.play('up');
    };

    Character.prototype.moveDown = function() {
        this.setVelocity(0, this.speed);
        this.animations.play('down');
    };

    Character.prototype.moveLeft = function() {
        this.setVelocity(-this.speed, 0);
        this.animations.play('left');
    };

    Character.prototype.moveRight = function() {
        this.setVelocity(this.speed, 0);
        this.animations.play('right');
    };

    Character.prototype.kill = function() {
        this.destroy();
    };

    Character.prototype.stop = function() {
        this.setVelocity(0, 0);
        this.animations.stop();
    };
    
    Character.prototype.mobCollision = function(mob, character) {
        if(mob.name === 'slime'){
            
            if(character.followers.length > 0){
                var follower = character.followers.pop();
                follower.kill();
            }
            
            character.speed -= character.boostSpeed;            
            setTimeout(function() {
                character.speed += character.boostSpeed;
            }.bind(this), 2000);
            mob.kill();
            this.game_state.world_state.followerLost(this);
        }
    };


    Character.prototype.update = function() {
        this.game_state.game.physics.arcade.collide(this, this.game_state.offeringStone, this.performRitual, null, this);
    };

    return Character;
})();