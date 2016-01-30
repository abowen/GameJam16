var Human = (function() {
    function Human(game_state, x, y) {
        MovingSprite.call(this, game_state, x, y, 'human', 'humans');
        this.speed = 100;
        this.body.allowGravity = false;
		this.game = game_state.game;

        this.game.physics.arcade.enable(this);

        this.framesPerSecond = 10;

        this.moves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight'];

		this.lastMove = null;

        this.devourHuman = function(human, enemy) {         
            // TODO: Would rather this in a collision controller
            this.game_state.world_state.devourHuman(human, enemy);            
            enemy.devourHuman(human);

            this.makeNastyScreams();            
            this.makeNastyMess(human, enemy);

            human.kill();
        };

        this.humanHitsSummon = function(human, summon) {
            if (!summon.fallTween.isRunning && human.alive) {
                var cloneH = this.game_state.game.add.sprite(summon.x, summon.y, 'summon');
                cloneH.anchor.set(0.5);

                var cloneV = this.game_state.game.add.sprite(summon.x, summon.y, 'summon');
                cloneV.anchor.set(0.5);

                this.makeNastyScreams();
                
                var explosionSpeed = 250;

                this.game_state.game.add.tween(cloneV.scale).to({
                    x: 0.10,
                    y: 10
                }, explosionSpeed, "Expo.easeOut", true, 0);
                this.game_state.game.add.tween(cloneH.scale).to({
                    x: 10,
                    y: 0.10
                }, explosionSpeed, "Expo.easeOut", true, 0);
                this.game.add.tween(cloneH).to({
                    alpha: 0
                }, 250, "Linear", true, 250);
                this.game.add.tween(cloneV).to({
                    alpha: 0
                }, 250, "Linear", true, 250);
                
                this.game_state.character.addFollower(new Ghost(this.game_state, human.x, human.y));                
                this.game_state.world_state.sacrificeHuman(this);    

                human.kill();
                summon.kill();            
            }
        };

		this.terrainHit = function(human){
			human.forceDirectionChange = true;
		};
        
        this.animations.add('down', [0, 1, 2, 3, 4, 5], this.framesPerSecond, true);
        this.animations.add('right', [18, 19, 20, 21, 22, 23], this.framesPerSecond, true);
        this.animations.add('up', [12, 13, 14, 15, 16, 17], this.framesPerSecond, true);
        this.animations.add('left', [6, 7, 8, 9, 10, 11], this.framesPerSecond, true);

    };

    Human.prototype = Object.create(MovingSprite.prototype);
    Human.prototype.constructor = Human; 

    Human.prototype.update = function() {
         "use strict";
		this.game.physics.arcade.collide(this.game_state.humans, this.game_state.backgroundLayer, this.terrainHit);
		if (this.alive) {
			this.game_state.game.physics.arcade.overlap(this, this.game_state.summonLayer, this.humanHitsSummon, null, this);
			this.game_state.game.physics.arcade.overlap(this, this.game_state.enemy, this.devourHuman, null, this);
			var moveIn = this.lastMove;

			if (this.forceDirectionChange || !this.lastMove || Math.random() > 0.98) {
				this.forceDirectionChange = false;
				moveIn = this.moves[Math.floor(Math.random() * 10) % 4];
			}
			this[moveIn]();
			this.lastMove = moveIn;
			if (this.y > this.game_state.game.height || this.y < 0 || this.x > this.game_state.game.height || this.x < 0) this.destroy();

			this.game_state.emitter.emitX = this.game_state.enemy.x;
	        this.game_state.emitter.emitY = this.game_state.enemy.y;
		}
    };

    Human.prototype.makeNastyScreams = function() {
        this.game_state.screams[this.game.rnd.between(0, this.game_state.screams.length - 1)].play();        
    };

    Human.prototype.makeNastyMess = function(human, enemy) {            
        var bodyPartOneFrame = Math.floor(Math.random() * 2);
        var bodyPartTwoFrame = Math.floor(Math.random() * 2) + 2;

        // TODO: Refactor when not tired
        var bodyPartOneX = Math.floor(Math.random() * 20);
        var bodyPartOneY = Math.floor(Math.random() * 5);

        var bodyPartTwoX = Math.floor(Math.random() * 20);
        var bodyPartTwoY = Math.floor(Math.random() * 5);

        // TODO: Tween these bad girls
        var bodyPartOne = this.game_state.game.add.sprite(enemy.x, enemy.y, 'humanparts');
        bodyPartOne.frame = bodyPartOneFrame;
        bodyPartOne.visible = false;
        var bodyPartTwo = this.game_state.game.add.sprite(enemy.x, enemy.y, 'humanparts');
        bodyPartTwo.frame = bodyPartTwoFrame;
        bodyPartTwo.visible = false;

        var bodyPartOneTween = this.game.add.tween(bodyPartOne);
        var bodyPartTwoTween = this.game.add.tween(bodyPartTwo);
        bodyPartOne.visible = bodyPartTwo.visible = true;
        bodyPartOneTween.to({
            x: enemy.x - bodyPartOneX,
            y: enemy.y - bodyPartOneY
        }, 500, Phaser.Easing.Bounce.Out);
        bodyPartTwoTween.to({
            x: enemy.x + bodyPartTwoX,
            y: enemy.y + bodyPartTwoX
        }, 500, Phaser.Easing.Bounce.Out);

        bodyPartOneTween.start();
        bodyPartTwoTween.start();
    };

    return Human;
})();