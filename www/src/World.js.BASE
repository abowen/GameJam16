var World = (function() {
        function World() {
            this.init_condition = {

            };
            
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
        
        World.prototype.constructor = World;
        
        World.prototype.devourHuman = function (){
            this.player.humans_devoured += 1;
        };
        
        World.prototype.sacrificeHuman = function (){
            this.player.souls_collected += 1;
        };
        
        World.prototype.updateScore = function(){
            
        };

        return World;
    }
}