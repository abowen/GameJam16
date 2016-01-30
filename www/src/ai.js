var Ai = (function() {
    function Ai() {
        "use strict";      
        
        //this.graph = new Graph(nodes);  
    };
    
    Ai.prototype.follow = function(characterA, characterB, speedX, speedY) {
        
        if(!characterA.body || !characterB.body){
            var i = 0;
        }
        
        var directionX = Math.sign(characterB.body.position.x - characterA.body.position.x);
        var directionY = Math.sign(characterB.body.position.y - characterA.body.position.y);
        
        characterA.body.velocity.x = speedX * directionX;
        characterA.body.velocity.y = speedY * directionY;
    };
    
    return Ai;

})();
