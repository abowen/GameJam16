var Character = (function(){
    function Character(game, x, y, sprite){
        Phaser.Sprite.call(this, game, x, y, sprite);

        this.game = game;

        this.game.physics.arcade.enable(this);
        this.enableBody = true;
        this.anchor.set(0.5);

        // animation name, frames, FPS, true? (maybe swap)
        var framesPerSecond = 10;
        this.animations.add('down', [0, 1, 2], framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], framesPerSecond, true);
        this.animations.add('left', [9, 10, 11], framesPerSecond, true);
    };

    Character.prototype = Object.create(Phaser.Sprite.prototype);
    Character.prototype.constructor = Character;

    return Character;
})();