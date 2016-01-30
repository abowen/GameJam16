var Ghost = (function(){
    function Ghost(game, x, y){
        properties = {
            group: 'ghosts',
            spritesheet: 'ghost'
        };

        Prefab.call(this, game, name, {x:x, y:y}, properties);

        this.speed = 5;
        this.game = game;
        this.timer = 1000;

        this.game.physics.enable(this);
        this.anchor.set(0.5);

        this.setAnimation();

        this.moves = ['moveUp','moveDown','moveLeft','moveRight'];
        this.lastMove = null;
    };

    Ghost.prototype = Object.create(Phaser.Sprite.prototype);
    Ghost.prototype.constructor = Ghost;

    Ghost.prototype.setAnimation = function() {
        this.animations.add('down', [0, 1, 2, 3, 4, 5], this.framesPerSecond, true);
        this.animations.add('right', [18, 19, 20, 21, 22, 23], this.framesPerSecond, true);
        this.animations.add('up', [12, 13, 14, 15, 16, 17], this.framesPerSecond, true);
        this.animations.add('left', [6, 7, 8, 9, 10, 11], this.framesPerSecond, true);
    };

    Ghost.prototype.update = function(){
        Phaser.Sprite.prototype.update.call(this);
        var moveIn = this.lastMove;
        if (!this.lastMove || Math.random() > 0.9) {
            moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
        }
        this[moveIn]();
    };

    Ghost.prototype.moveUp = function(){
        this.y -= this.speed;
        this.animations.play('up');
    };
    Ghost.prototype.moveDown = function(){
        this.y += this.speed;
        this.animations.play('down');
    };
    Ghost.prototype.moveLeft = function(){
        this.x -= this.speed;
        this.animations.play('left');
    };
    Ghost.prototype.moveRight = function(){
        this.x += this.speed;
        this.animations.play('right');
    };


    return Ghost;
})();