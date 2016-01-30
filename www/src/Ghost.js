var Ghost = (function() {
    function Ghost(game, x, y) {
        MovingSprite.call(this, game, x, y, 'ghost', 'ghosts');

        this.speed = 0.5;
        this.game = game;
        this.timer = 1000;
        this.framesPerSecond = 3;

        this.game.physics.enable(this);
        this.anchor.set(0.5);
        this.alpha = 0.5;


        this.setAnimation();

        this.moves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight'];
        this.lastMove = null;
        this.isGraveStone = true;

        setTimeout(function() {
            this.isGraveStone = false;
        }.bind(this), 4000);
    };

    Ghost.prototype = Object.create(MovingSprite.prototype);
    Ghost.prototype.constructor = Ghost;

    Ghost.prototype.follow = function(human) {
        this.human = human;
    };

    Ghost.prototype.stop = function() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    Ghost.prototype.setAnimation = function() {
        this.animations.add('down', [1, 2, 3], this.framesPerSecond, true);
        this.animations.add('right', [4, 5, 6], this.framesPerSecond, true);
        this.animations.add('up', [7, 8, 9], this.framesPerSecond, true);
        this.animations.add('left', [4, 5, 6], this.framesPerSecond, true);
    };

    Ghost.prototype.update = function() {
        if (!this.isGraveStone) {
            Phaser.Sprite.prototype.update.call(this);

            if (this.human != undefined) {
                var dist = this.game.math.distance(this.body.position.x,
                    this.body.position.y,
                    this.human.position.x,
                    this.human.position.y);

                var vel_factor = 1.0;

                if (dist > 20.0) {
                    this.game.ai.follow(this, this.human, 30.0 * vel_factor, 30.0 * vel_factor);
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
        } else {
            this.stop();
        }
    };
    return Ghost;
})();