var FollowingMob = (function() {
    function FollowingMob(game_state, x, y, properties) {
        MovingSprite.call(this, game_state, x, y, properties.spriteSheet, properties.group);

        this.master = game_state[properties.master];
        this.speed = properties.speed || 10;
        this.body.allowGravity = false;
        this.game = game_state.game;
        this.followingSpeed = properties.followingSpeed || 20;

        this.game.physics.arcade.enable(this);
        this.isSummoned = false;
        this.framesPerSecond = 3;

        this.moves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight'];
        this.lastMove = null;

        this.devourSlime = function(slime, enemy) {
            enemy.devourSlime(slime);
            slime.kill();
        };

        this.summonCollision = function() {
            this.isSummoned = true;
        };

        this.slimeHitsSummon = function(slime, summon) {
            if (!summon.fallTween.isRunning && slime.alive) {
                slime.kill();
                summon.kill();
            }
        };

        this.terrainHit = function(slime) {
            slime.forceDirectionChange = true;
        };
        
        console.log("New following mob spawned");
        console.debug(this);

        this.setAnimations();
    };

    FollowingMob.prototype = Object.create(MovingSprite.prototype);
    FollowingMob.prototype.constructor = FollowingMob;

    FollowingMob.prototype.setAnimations = function() {
        this.animations.add('down', [0, 1, 2], this.framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], this.framesPerSecond, true);
        this.animations.add('left', [9, 10, 11], this.framesPerSecond, true);
    };

    FollowingMob.prototype.wanderAroundLikeAStupid = function() {
        var moveIn = this.lastMove;
        if (!this.lastMove || Math.random() > 0.98) {
            moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
        }

        this[moveIn]();
        this.lastMove = moveIn;
    };

    FollowingMob.prototype.update = function() {
        "use strict";
        this.game.physics.arcade.collide(this.game_state[properties.group], this.game_state.backgroundLayer, this.terrainHit);
        if (this.alive && !this.isSummoned) {
            this.game_state.game.physics.arcade.overlap(this, this.game_state.character, this.game_state.summonCollisionHandler, null, this);
            this.game_state.game.physics.arcade.overlap(this, this.game_state.enemy, this.devourSlime, null, this);

            if (!this.master) {
                this.wanderAroundLikeAStupid();
            } else {
                var dist = this.game.math.distance(this.body.position.x,
                    this.body.position.y,
                    this.master.body.position.x,
                    this.master.body.position.y);

                var vel_factor = this.speed;

                if (dist < 200.0) {
                    this.game.ai.follow(this, this.master, this.speed * vel_factor, this.speed * vel_factor);
                } else {
                    this.wanderAroundLikeAStupid();
                }
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

            if (this.y > this.game_state.game.height || this.y < 0 || this.x > this.game_state.game.height || this.x < 0) this.destroy();

        } else if (this.isSummoned) {
            this.game_state.game.physics.arcade.overlap(this, this.game_state.summonLayer, this.slimeHitsSummon, null, this);
            this.setVelocity(0, 0);
        }
    };

    return FollowingMob;
})();