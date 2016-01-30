var Ai = (function() {
    function Ai() {
        "use strict";      
        
        //this.graph = new Graph(nodes);  
    };
    
    Ai.prototype.follow = function(characterA, characterB, speedX, speedY) {
        
        if(characterA.body === undefined || characterB.body === undefined){
            var i = 0;
        }
        
        var directionX = Math.sign(characterB.position.x - characterA.position.x);
        var directionY = Math.sign(characterB.position.y - characterA.position.y);
        
        characterA.body.velocity.x = speedX * directionX;
        characterA.body.velocity.y = speedY * directionY;
    };
    
    return Ai;

})();
