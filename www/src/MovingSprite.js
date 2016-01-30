var MovingSprite = (function(){
    function MovingSprite(game_state, x, y, sprite, group){

        properties = {
            group: group,
            spritesheet: sprite
        };

        Prefab.call(this, game_state, 'Player', {x:x, y:y}, properties);

        this.speed = 2;
        game = game_state.game;

        game.physics.enable(this);
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

    MovingSprite.prototype.moveUp = function(){
        this.y -= this.speed;
        this.animations.play('up');
    };
    MovingSprite.prototype.moveDown = function(){
        this.y += this.speed;
        this.animations.play('down');
    };
    MovingSprite.prototype.moveLeft = function(){
        this.x -= this.speed;
        this.animations.play('left');
    };
    MovingSprite.prototype.moveRight = function(){
        this.x += this.speed;
        this.animations.play('right');
    };

    return MovingSprite;
})();