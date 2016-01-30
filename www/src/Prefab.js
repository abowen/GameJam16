var Prefab = (function() {

    function Prefab(game_state, name, position, properties) {
        "use strict";
        Phaser.Sprite.call(this, game_state, position.x, position.y, properties.spritesheet);

        this.game_state = game_state;

        this.name = name;

        this.game_state[properties.group] = this.game_state[properties.group] || this.game_state.game.add.group();
        this.game_state[properties.group].addChild(this);
        this.frame = +properties.frame;
    };
    
    Prefab.prototype = Object.create(Phaser.Sprite.prototype);
    Prefab.prototype.constructor = Prefab;

    return Prefab;
})();