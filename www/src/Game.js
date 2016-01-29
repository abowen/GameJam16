/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {
};

var cursors;

// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        // TODO: Clearly emove before publishing
        //this.game.add.plugin(Phaser.Plugin.Debug);

        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();
    },

    preload: function () {

        this.load.tilemap('level1', 'asset/tileset.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'asset/tiles.png');

        //http://phaser.io/examples/v2/sprites/spritesheet
        this.load.spritesheet('characterOrange', 'asset/characterOrangeLine.png', 16, 16, 12);
        this.load.spritesheet('enemy', 'asset/images/enemy_spritesheet.png', 16, 16, 12);
        this.load.image('summon', 'asset/summonRed.png');
        this.load.image('characterSingle', 'asset/characterSingle.png');

        //http://phaser.io/examples/v2/audio/sound-complete
        this.load.audio('summonSound', 'asset/sfx/summon.wav');
        this.load.audio('darkExploration', 'asset/music/DarkExploration.mp3');
    },

    create: function () {
        this.createMap();

        // Summon graphics
        this.summonLayer = this.game.add.group();
        this.summonLayer.z = 4;
        // Moving objects that are blocked by mountains
        this.characters = this.game.add.group();
        this.characters.z = 3;
        // Mountains, walls, rivers that are static and objects collide into
        this.collisionLayer = this.game.add.group();
        this.collisionLayer.z = 2;
        // Create the cloud layer, just below the text
        this.cloudLayer = this.game.add.group();
        this.cloudLayer.z = 1;
        // http://phaser.io/examples/v2/groups/group-as-layer
        // Summon graphics
        this.summonLayer = this.game.add.group();
        this.summonLayer.z = 4;

        // Moving objects that are blocked by mountains        
        this.characters = this.game.add.group();
        this.characters.z = 3;
        //http://phaser.io/examples/v2/input/cursor-key-movement
        cursors = this.game.input.keyboard.createCursorKeys();

        this.humans = this.game.add.group();

        this.character = new Character(this.game, this.world.centerX / 2, this.world.centerY, 'characterOrange');
                       
        this.enemy = new Enemy(this.game, 'Enemy', this.world.centerX + (this.world.centerX / 2), this.world.centerY, 'enemy');


        this.characters.addChild(this.character);
        this.characters.enableBody = true;
        this.game.physics.arcade.enable(this.characters);

        // Summon those fools from dark earth                
        this.summonKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.summonKey.onDown.add(this.summonShit, this);

        // http://phaser.io/examples/v2/particles/emitter-width
        // http://phaser.io/examples/v2/particles/firestarter
        this.summonParticles = this.make.bitmapData(2, 2);
        this.summonParticles.rect(0, 0, 4, 4, '#ffffff');
        this.summonParticles.update();

        this.emitter = this.add.emitter(0, 0, 128);
        this.emitter.makeParticles(this.summonParticles);
        this.emitter.gravity = 0;
        this.emitter.setXSpeed(250, -250);
        this.emitter.setYSpeed(-100, 100);
        this.emitter.setAlpha(1, 0.2, 500);
        this.emitter.flow(1000, 30, 2, -1, true);

        // Sound Effects
        this.summonSound = this.game.add.audio('summonSound');


        setInterval(this.spawnHuman.bind(this), 2000);

        // Music        
        // http://phaser.io/examples/v2/audio/loop
        this.music = this.game.add.audio('darkExploration');        

        // MP3's take time to decode, we can make a call back if required
         this.game.sound.setDecodedCallback([ this.music ], this.startMusic, this);

        for (var i=0;i<TOTAL_PLAYER_LIVES;i++)
        {
            var width = 16;
            var padding = 4;
            var xPosition = 16 + (width + padding) * i;

            var characterLife = new Phaser.Sprite(
                        this.game, 
                        xPosition,
                        20, 
                        'characterSingle');
            characterLife.anchor.setTo(0.5, 0.5);

            this.textLayer.add(characterLife);
        }
    },

    startMusic: function(){
        this.music.loopFull(0.6);
    },


    createMap: function(){
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('tiles', 'tiles');

        //create layer
        this.groundLayer = this.map.createLayer('groundLayer');        
        this.backgroundLayer = this.map.createLayer('backgroundLayer');

        this.map.setCollision([37, 38, 53, 54, 69, 70], true, this.backgroundLayer);
        console.log('is this getting called')
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    },

    update : function () {
        this.physics.arcade.collide(this.characters, this.backgroundLayer);

        if (cursors.up.isDown)
        {
            this.character.moveUp();
        }
        else if (cursors.down.isDown)
        {
            this.character.moveDown();
        }
        else if (cursors.left.isDown)
        {
            this.character.moveLeft();
        }
        else if (cursors.right.isDown)
        {
            this.character.moveRight();
        }
        else {
            this.character.animations.stop();
        }

        this.updateHumans();
    },

    summonShit : function () {
        var summon = new Phaser.Sprite(
                        this.game, 
                        this.character.x,
                        -20, 
                        'summon');
        summon.anchor.setTo(0.5, 0.5);

        this.emitter.emitX = summon.x;
        this.emitter.emitY = summon.y;

        this.summonLayer.add(summon);

        var summonSpeed = 500;

        var tween = this.game.add.tween(summon);
        tween.to({
            x: this.character.x,
            y: this.character.y
        }, summonSpeed, Phaser.Easing.Quadratic.Out);
        
        tween.start();

        var tweenRotate = this.game.add.tween(summon);
        tweenRotate.to({
            angle: 200
        }, summonSpeed, Phaser.Easing.Linear.None);
        tweenRotate.start();

        this.summonSound.play();
    },

    spawnHuman: function() {
        var human = new Character(this.game, this.game.rnd.between(0, this.world.width), this.game.rnd.between(-16, 0), 'characterOrange');
        this.humans.addChild(human);
    },

    updateHumans: function() {
        this.humans.forEach(function(human) {
            human.y++;
            human.animations.play('down');
            human.body.acceleration = {x: 0, y: this.game.rnd.between(0, 50)};
            if(human.y > this.world.height) human.destroy();
        }.bind(this));
    }
};