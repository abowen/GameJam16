var World = (function() {
    function World() {
        this.init_condition = {

        };
        
        this.humansKilled = 0;

        this.win_conditions = {
            rituals_performed: 3
        };

        this.player = {
            souls_collected: 0,
            rituals_performed: 0
        };

        this.enemy = {
            humans_devoured: 0,
            rituals_performed: 0,
            difficulty: 5
        };
    };    

    World.prototype.devourHuman = function(human) {
        this.player.humans_devoured += 1;
        this.killHuman(human);
    };

    World.prototype.sacrificeHuman = function(human) {
        this.player.souls_collected += 1;
        this.killHuman(human);
    };

    World.prototype.updateScore = function() {

    };
    
    World.prototype.killHuman = function (human){
        // Tint the world
        if (this.humansKilled < 16) {
            this.humansKilled++;

            var tintValue = 16 - this.humansKilled;
            var hexString = tintValue.toString(16);
            hexString = hexString + hexString;
            var tintColour = '0xff' + hexString + 'ff';
            //console.log(this.humansKilled + " " + tintColour);
          //  human.groundLayer.tint = tintColour;
          //  human.backgroundLayer.tint = tintColour;
        }
    }

    return World;
})();