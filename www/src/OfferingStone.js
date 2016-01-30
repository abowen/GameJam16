var OfferingStone = (function() {
    function OfferingStone(game_state, name, x, y, properties) {
        "use strict";
        
        properties = {
            group: 'offering_stones',
            spritesheet: 'offering_stone'
        };
        
        Prefab.call(this, game_state, name, {
            x: x,
            y: y
        }, properties);
        
        this.anchor.setTo(0.5);
        game_state.game.physics.arcade.enable(this);
        this.body.immovable = true;
  
    };
    
    OfferingStone.prototype = Object.create(Phaser.Sprite.prototype);
    OfferingStone.prototype.constructor = OfferingStone;
    
    return OfferingStone;
})();