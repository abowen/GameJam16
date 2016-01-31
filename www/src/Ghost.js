var Ghost = (function() {
    function Ghost(game_state, x, y) {
        var properties = {
            name: 'ghost',
            spritesheet: 'ghost',
            group: 'ghosts'
        };        
        
        MovingSprite.call(this, game_state, x, y, properties);

        this.speed = 1.5;
        this.game = game_state.game;
        this.timer = 1000;
        this.framesPerSecond = 3;

        this.game.physics.enable(this);
        this.anchor.set(0.5);
        
        this.setAnimation();

        this.moves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight'];
        this.game.physics.arcade.enable(this);
        this.lastMove = null;
        this.isGraveStone = true;
        this.animations.play("grave");
        setTimeout(function() {
            this.isGraveStone = false;
            this.alpha = 0.5;
        }.bind(this), 4000);            
    };

    Ghost.prototype = Object.create(MovingSprite.prototype);
    Ghost.prototype.constructor = Ghost;

    Ghost.prototype.follow = function(character) {
        if (character.followers.length == 0) {
            this.master = character;
        } else {
            this.master = character.followers[character.followers.length-1];            
        }        
    };

    Ghost.prototype.spawnAngel = function(character) {
        this.makeHeavenlyNoises();

        var angel = this.game_state.game.add.sprite(this.x, this.y, 'angel');
        angel.anchor.set(0.5);

        var tween = this.game.add.tween(angel);
        tween.to({
            y: -40
        }, 600, Phaser.Easing.Quadratic.In);
        tween.start();

        tween.onComplete.add(function(){
            this.kill();
        }, this);
    };

    Ghost.prototype.makeHeavenlyNoises = function() {        
        this.game_state.angelSoundGroup.playRandomSound();
    };

    Ghost.prototype.stop = function() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    Ghost.prototype.setAnimation = function() {
        this.animations.add('down', [0, 1, 2], this.framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], this.framesPerSecond, true);
        this.animations.add('left', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('grave', [9], this.framesPerSecond, true);
        this.stopped_frames = [1, 4, 4, 0, 1, 9];
    };

    Ghost.prototype.update = function() {
        if (!this.isGraveStone) {
            Phaser.Sprite.prototype.update.call(this);

            if (this.master != undefined) {
                var dist = this.game.math.distance(this.body.position.x,
                    this.body.position.y,
                    this.master.position.x,
                    this.master.position.y);

                var vel_factor = this.speed;

                if (dist > 20.0) {
                    this.game.ai.follow(this, this.master, 30.0 * vel_factor, 30.0 * vel_factor);
                } else {
                    this.stop();
                }
            } else {
                var moveIn = this.lastMove;
                if (!this.lastMove || Math.random() > 0.98) {
                    moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
                }
                this[moveIn]();
                this.lastMove = moveIn;
            }

            if (this.body.velocity.x < 0) {
                // walking left
                this.scale.setTo(-1, 1);
                this.animations.play("left");
            } else if (this.body.velocity.x > 0) {
                // walking right
                this.scale.setTo(1, 1);
                this.animations.play("right");
            }

            if (this.body.velocity.y < 0) {
                // walking up
                this.animations.play("up");
            } else if (this.body.velocity.y > 0) {
                // walking down
                this.animations.play("down");
            }

            if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
                // stop current animation
                this.animations.stop();
                this.frame = this.stopped_frames[this.body.facing];
            }
        } else {
            this.stop();
        }
    };
    return Ghost;
})();