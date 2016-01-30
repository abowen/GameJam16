var OfferingStone = (function() {
    function OfferingStone(game, name, x, y, properties) {
        "use strict";
        
        // TODO: to be managed by the level state
        properties = {
            group: 'offering_stones',
            spritesheet: 'offering_stone'
        };
        
        var offeringStone = new Phaser.Sprite(
                game,
                x,
                y,
                'offering_stone');
        
        game[properties.group] = game[properties.group] || game.add.group();
        game[properties.group].addChild(offeringStone);
        //this.frame = +properties.frame;
        
        //Prefab.call(this, game, name, {x:x, y:y}, properties);
        
        this.anchor.setTo(0.5);
    };
    
    return OfferingStone;
})();