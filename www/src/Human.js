var Human = (function() {
	function Human(game, x, y, sprite) {
		Character.call(this, game, x, y, sprite);
		this.speed = 1;
		this.body.acceleration = {x: 0, y: this.game.rnd.between(0, 50)};
	};

	Human.prototype = Object.create(Character.prototype);
	Human.prototype.constructor = Human;

	Human.prototype.update = function() {
		this.moveDown();        
	};

	return Human;
})();