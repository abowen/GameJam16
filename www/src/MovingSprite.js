var MovingSprite = (function(){
    function MovingSprite(game, x, y, sprite, group){
        properties = {
            group: group,
            spritesheet: sprite
        };

        Prefab.call(this, game, 'Player', {x:x, y:y}, properties);

        this.speed = 80;
        this.game = game;

        this.game.physics.enable(this);
        this.anchor.set(0.5);

        // animation name, frames, FPS, true? (maybe swap)
        this.framesPerSecond = 10;

        this.setAnimation();
    };

    MovingSprite.prototype = Object.create(Phaser.Sprite.prototype);
    MovingSprite.prototype.constructor = MovingSprite;

    MovingSprite.prototype.setAnimation = function() {
        this.animations.add('down', [0, 1, 2], this.framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], this.framesPerSecond, true);
        this.animations.add('left', [9, 10, 11], this.framesPerSecond, true);
    };

    MovingSprite.prototype.setVelocity = function(x, y){
        this.body.velocity.x = x;
        this.body.velocity.y = y;
    },

    MovingSprite.prototype.moveUp = function(){
        this.setVelocity(0, -this.speed);
        this.animations.play('up');
    };
    MovingSprite.prototype.moveDown = function(){
        this.setVelocity(0, this.speed);
        this.animations.play('down');
    };
    MovingSprite.prototype.moveLeft = function(){
        this.setVelocity(-this.speed, 0);
        this.animations.play('left');
    };
    MovingSprite.prototype.moveRight = function(){
        this.setVelocity(this.speed, 0);
        this.animations.play('right');
    };

    return MovingSprite;
})();