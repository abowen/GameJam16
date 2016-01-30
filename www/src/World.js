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

        };

        return World;
    }
}