var Prefab = (function() {

    function Prefab(game, name, position, properties) {
        "use strict";
        Phaser.Sprite.call(this, game, position.x, position.y, properties.spritesheet);

        this.game = game;

        this.name = name;

        this.game[properties.group] = this.game[properties.group] || this.game.add.group();
        this.game[properties.group].addChild(this);
        this.frame = +properties.frame;
    };
    
    Prefab.prototype = Object.create(Phaser.Sprite.prototype);
    Prefab.prototype.constructor = Prefab;

    return Prefab;
})();