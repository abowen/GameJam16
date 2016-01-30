var Human = (function() {
	function Human(game, x, y, sprite) {
		Character.call(this, game, x, y, sprite);
		this.speed = 1;
		this.body.acceleration = {x: 0, y: this.game.rnd.between(0, 50)};

		this.framesPerSecond = 15;
        
        this.setAnimation();
	};

	Human.prototype = Object.create(Character.prototype);
	Human.prototype.constructor = Human;

	Human.prototype.setAnimation = function() {
		this.animations.add('down', [0, 1, 2, 3, 4, 5], this.framesPerSecond, true);
        this.animations.add('right', [18, 19, 20, 21, 22, 23], this.framesPerSecond, true);
        this.animations.add('up', [12, 13, 14, 15, 16, 17], this.framesPerSecond, true);
        this.animations.add('left', [6, 7, 8, 9, 10, 11], this.framesPerSecond, true);
	};

	Human.prototype.update = function() {
		this.moveDown();        
	};

	return Human;
})();