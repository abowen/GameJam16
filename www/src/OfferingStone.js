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
        this.setAnimations();
        this.animations.play("wait");
    };
    
    OfferingStone.prototype = Object.create(Phaser.Sprite.prototype);
    OfferingStone.prototype.constructor = OfferingStone;
    
    OfferingStone.prototype.setAnimations = function(){
        this.animations.add('wait', [0, 1, 2, 3], this.framesPerSecond, true);
       // this.animations.add('ritual', [4, 5, 6, 7], this.framesPerSecond, true);
    };
    
    return OfferingStone;
})();