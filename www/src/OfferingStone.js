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
        
        this.framePerSecond = 7;
        this.anchor.setTo(0.5);
        game_state.game.physics.arcade.enable(this);
        this.body.immovable = true;
        this.setAnimations();
        this.animations.play("wait");
        
        this.performRitual = function(character, offeringStone) {            
            this.animations.play("ritual");            
             setTimeout(function() {
                this.animations.play("wait");
            }.bind(this), 2000);
        }
    };
    
    OfferingStone.prototype = Object.create(Phaser.Sprite.prototype);
    OfferingStone.prototype.constructor = OfferingStone;
    
    OfferingStone.prototype.setAnimations = function(){
        this.animations.add('wait', [0, 1, 2, 3], this.framesPerSecond, true);
        this.animations.add('ritual', [4, 5, 6, 7], this.framesPerSecond, true);
    };
    
    OfferingStone.prototype.update = function(){
        this.game_state.game.physics.arcade.collide(this, this.game_state.character, this.performRitual, null, this);
    };
    
    return OfferingStone;
})();