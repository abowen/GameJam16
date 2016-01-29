var Prefab = (function() {

    function Prefab(game_state, name, position, properties) {
        "use strict";
        Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);

        this.game_state = game_state;

        this.name = name;

        this.game_state.groups[properties.group].add(this);
        this.frame = +properties.frame;

        this.game_state.prefabs[name] = this;
    };

    Prefab.prototype = Object.create(Phaser.Sprite.prototype);
    Prefab.prototype.constructor = Prefab;

    return Prefab;
})();