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

            this.screenShake {
            	effect = 0,
            	counter = [5,10,15]
            }

            var max = this.screenShake.counter.max();
        	this.world.setBounds(-max, -max, this.game.width+max, this.game.height+2);
        };
        
        World.prototype.constructor = World;

        World.prototype.screenShake: function(effect) {        	
	        var min = -effect;
	        var max = effect;
	        this.game.camera.x += Math.floor(Math.random() * (max - min + 1)) + min;
	        this.game.camera.y += Math.floor(Math.random() * (max - min + 1)) + min;
    	};
        
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