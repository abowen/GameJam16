var World = (function() {
        function World() {
            this.init_condition = {

            };
            
            this.win_conditions = {
                rituals_performed: 3
            };
            
            this.player: {
                souls_collected: 0,
                rituals_performed: 0
            };
            
            this.enemy: {
                souls_collected: 0,
                rituals_performed: 0,
                difficulty: 5
            };

            this.screenShake {
            	effect = 0,
            	counter = [5,10,15]
            }

        	this.world.setBounds(-20, -20, this.game.width+20, this.game.height+2);
        };

        return World;
    }
}