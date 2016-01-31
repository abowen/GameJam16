var MovingSprite = (function(){
    function MovingSprite(game_state, x, y, properties){
        Prefab.call(this, game_state, properties.name, {x:x, y:y}, properties);

        game = game_state.game;
        game.physics.enable(this);

        this.anchor.set(0.5);        
        this.speed = 80;    
        this.framesPerSecond = 10;
    };

    MovingSprite.prototype = Object.create(Phaser.Sprite.prototype);
    MovingSprite.prototype.constructor = MovingSprite;

    MovingSprite.prototype.setVelocity = function(x, y){
        if (this.body) {
            this.body.velocity.x = x;
            this.body.velocity.y = y;
        }
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