var Ghost = (function(){
    function Ghost(game, x, y){
        MovingSprite.call(this, game, x, y, 'ghost', 'ghosts');

        this.speed = 0.5;
        this.game = game;
        this.timer = 1000;
        this.framesPerSecond = 3;

        this.game.physics.enable(this);
        this.anchor.set(0.5);
        this.alpha = 0.5;

        this.setAnimation();

        this.moves = ['moveUp','moveDown','moveLeft','moveRight'];
        this.lastMove = null;
    };

    Ghost.prototype = Object.create(MovingSprite.prototype);
    Ghost.prototype.constructor = Ghost;

    Ghost.prototype.setAnimation = function() {
        this.animations.add('down', [0, 1, 2], this.framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], this.framesPerSecond, true);
        this.animations.add('left', [3, 4, 5], this.framesPerSecond, true);
    };

    Ghost.prototype.update = function(){
        Phaser.Sprite.prototype.update.call(this);
        var moveIn = this.lastMove;
        if (!this.lastMove || Math.random() > 0.98) {
            moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
        }
        this[moveIn]();
        this.lastMove = moveIn;
    };


    return Ghost;
})();