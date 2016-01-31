var Slime = (function() {
    function Slime(game_state, x, y) {
        MovingSprite.call(this, game_state, x, y, 'slime', 'slimes');
        this.speed = 10;
        this.body.allowGravity = false;
		this.game = game_state.game;
        this.isSummoned = false;

        this.game.physics.arcade.enable(this);

        this.framesPerSecond = 3;

        this.moves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight'];

		this.lastMove = null;

        this.devourSlime = function(slime, enemy) {            
            enemy.devourSlime(slime);                    
            slime.kill();
        };

        this.summonShit = function(slime, character) {            
            this.game_state.summonShit(slime);
            slime.isSummoned = true;
        };

        this.slimeHitsSummon = function(slime, summon) {
            console.log('SlimeHitsSummon');
            if (!summon.fallTween.isRunning && slime.alive) {                
                slime.kill();
                summon.kill();            
            }
        };

		this.terrainHit = function(Slime){
			Slime.forceDirectionChange = true;
		};
        
        this.animations.add('down', [0, 1, 2], this.framesPerSecond, true);
        this.animations.add('right', [3, 4, 5], this.framesPerSecond, true);
        this.animations.add('up', [6, 7, 8], this.framesPerSecond, true);
        this.animations.add('left', [9, 10, 11], this.framesPerSecond, true);

    };

    Slime.prototype = Object.create(MovingSprite.prototype);
    Slime.prototype.constructor = Slime; 

    Slime.prototype.update = function() {
         "use strict";
		this.game.physics.arcade.collide(this.game_state.Slimes, this.game_state.backgroundLayer, this.terrainHit);
		if (this.alive && !this.isSummoned) {
			this.game_state.game.physics.arcade.overlap(this, this.game_state.character, this.summonShit, null, this);
            this.game_state.game.physics.arcade.overlap(this, this.game_state.enemy, this.devourSlime, null, this);
			

			var moveIn = this.lastMove;

			if (this.forceDirectionChange || !this.lastMove || Math.random() > 0.98) {
				this.forceDirectionChange = false;
				moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
			}
			this[moveIn]();
			this.lastMove = moveIn;
			if (this.y > this.game_state.game.height || this.y < 0 || this.x > this.game_state.game.height || this.x < 0) this.destroy();

            // Trying to work out why this one is here
			this.game_state.emitter.emitX = this.game_state.enemy.x;
	        this.game_state.emitter.emitY = this.game_state.enemy.y;
		} else if (this.isSummoned) {
            this.game_state.game.physics.arcade.overlap(this, this.game_state.summonLayer, this.slimeHitsSummon, null, this);
            this.setVelocity(0,0);
        }
    };

    return Slime;
})();