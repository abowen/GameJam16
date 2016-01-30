/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function(game) {};
BasicGame.YouWin = function(game) {};
BasicGame.YouLose = function(game) {};

var cursors;

// set Game function prototype
BasicGame.Game.prototype = {


    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

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
        this.scale.setUserScale(2, 2, 0, 0);
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

        // TODO: Move this into game state once Dom has finished
        this.humansKilled = 0;
    },

    preload: function() {
        this.load.tilemap('level1', 'asset/tileset.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'asset/tiles.png');

        //http://phaser.io/examples/v2/sprites/spritesheet        
        this.load.spritesheet('character', 'asset/images/character_spritesheet_32.png', 32, 32, 12);
        this.load.spritesheet('enemy', 'asset/images/enemy_spritesheet_32.png', 32, 32, 10);
        this.load.spritesheet('offering_stone', 'asset/images/offering_stone_32.png', 32, 32, 1);

        this.load.spritesheet('human', 'asset/human.png', 16, 16, 30);
        this.load.spritesheet('ghost', 'asset/images/ghost_spritesheet_16.png', 16, 16, 10);

        this.load.image('summon', 'asset/summonRed.png');
        
        this.load.image('characterSingle', 'asset/images/character_16.png');
        this.load.image('keyboardLeft', 'asset/images/keyboardLeft.png');
        this.load.image('keyboardUp', 'asset/images/keyboardUp.png');
        this.load.image('keyboardDown', 'asset/images/keyboardDown.png');
        this.load.image('keyboardRight', 'asset/images/keyboardRight.png');
        this.load.image('keyboardCtrl', 'asset/images/keyboardCtrl.png');
        this.load.image('keyboardSpacebar', 'asset/images/keyboardSpacebar.png');

        //http://phaser.io/examples/v2/audio/sound-complete
        this.load.audio('crashSound', 'asset/sfx/summon.wav');
        this.load.audio('explosionSound', 'asset/sfx/explosion.mp3');
        this.load.audio('screamWilhelm', 'asset/sfx/screamWilhelm.mp3');
        this.load.audio('screamCalzon', 'asset/sfx/screamCalzon.mp3');
        this.load.audio('scream_1', 'asset/sfx/scream_1.mp3');
        this.load.audio('scream_2', 'asset/sfx/scream_2.mp3');
        this.load.audio('scream_3', 'asset/sfx/scream_3.mp3');
        this.load.audio('scream_4', 'asset/sfx/scream_4.mp3');
        this.load.audio('scream_5', 'asset/sfx/scream_5.mp3');
        this.load.audio('scream_6', 'asset/sfx/scream_6.mp3');
        this.load.audio('scream_7', 'asset/sfx/scream_7.mp3');
        this.load.audio('scream_8', 'asset/sfx/scream_8.mp3');
        this.load.audio('scream_9', 'asset/sfx/scream_9.mp3');
        this.load.audio('scream_10', 'asset/sfx/scream_10.mp3');
        this.load.audio('darkExploration', 'asset/music/DarkExploration.mp3');
    },

    create: function() {
        // TODO: Clearly remove before publishing
        this.game.add.plugin(Phaser.Plugin.Debug);

        this.createMap();
        this.initialiseGameState();

        this.summonLayer = this.game.add.physicsGroup();

        // Keyboard controls
        this.instructionLayer = this.game.add.group();
        this.instructionLayer.z = 5;
        this.instructionLayer.destroyChildren = true;

        // People killed rating      
        this.scoreLayer = this.game.add.group();
        this.scoreLayer.z = 4;

        // Moving objects that are blocked by mountains
        this.characters = this.game.add.group();
        this.characters.enableBody = true;
        this.characters.z = 3;


       
        //http://phaser.io/examples/v2/input/cursor-key-movement
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.ai = new Ai();
        
        //this.humans = this.game.add.group();

  //      this.game.offering_stone = this.offering_stone = new OfferingStone(this.game, this.world.centerX, this.world.centerY, 'offering_stone');
        this.character = new Character(this, this.world.centerX / 2, this.world.centerY, 'character');
        this.enemy = new Enemy(this, 'Enemy', this.world.centerX + (this.world.centerX / 2), this.world.centerY, 'enemy');

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

        ////// SOUND EFFECTS
        this.summonSound = this.game.add.audio('explosionSound');
        this.explosionSound = this.game.add.audio('crashSound');

        var screamNames = ['screamWilhelm',
                            'screamCalzon',
                            'scream_1',
                            'scream_2',
                            'scream_3',
                            'scream_4',
                            'scream_5',
                            'scream_6',
                            'scream_7',
                            'scream_8',
                            'scream_9',
                            'scream_10'];

        this.screams = [];
        for (var i=0;i<screamNames.length;i++)
        {
            var screamSound = this.game.add.audio(screamNames[i]);
            this.screams.push(screamSound);
        }

        setInterval(this.spawnHuman.bind(this), 2000);

        ////// MUSIC
        // http://phaser.io/examples/v2/audio/loop
        this.music = this.game.add.audio('darkExploration');

        // MP3's take time to decode, we can make a call back if required
        this.game.sound.setDecodedCallback([this.music], this.startMusic, this);      
       
        // Instruction information        
        this.instructionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.instructionKey.onDown.add(this.clearInstructions, this);

        var keys = ['keyboardLeft', 'keyboardRight', 'keyboardUp', 'keyboardDown', 'keyboardSpacebar', 'keyboardCtrl'];
        var keyX = 30;        
        
        var keyY = GAME_HEIGHT - 75;
        for (var i = 0; i < keys.length; i++) {
            var keySprite = this.add.sprite(keyX, keyY, keys[i]);
            keySprite.scale.setTo(0.75);
            keySprite.alpha = 0.5;
            keyX += keySprite.width + 10;
            console.log(keyX);

            keySprite.anchor.set(0, 0);

            this.instructionLayer.addChild(keySprite);
        }
    },

    clearInstructions: function() {
        this.instructionLayer.destroy();
    },

    startMusic: function() {
        console.log("MUSIC START PARTY");
        this.music.loopFull(0.6);
    },


    createMap: function() {
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('tiles', 'tiles');

        this.map.setCollisionBetween(15, 16);
        //create layer
        this.groundLayer = this.map.createLayer('groundLayer');
        this.backgroundLayer = this.map.createLayer('backgroundLayer');

        var tiles = this.backgroundLayer.getTiles(0, 0, this.world.width, this.world.height);
        this.game.houseTiles = tiles.filter(function(f){return f.index === 2 || f.index === 3;});

        this.map.setCollision([5,6,7,8,9,10,22,23, 24, 25, 26, 27, 39,40,41,42, 13, 130, 113, 24,108,109, 110, 117,118, 119,125,126,127,134, 144,142,143, 151], true, this.backgroundLayer);
    },

    gameResized: function(width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    },

    initialiseGameState: function() {
       this.world_state = new World(this);
    },

    update: function() {
        this.physics.arcade.collide(this.backgroundLayer, this.characters);
        this.physics.arcade.collide(this.backgroundLayer, this.humans);
        this.physics.arcade.collide(this.backgroundLayer, this.enemy);

        /*  if (this.game.game_state.player.rituals_performed === this.game.game_state.win_conditions.rituals_performed) {
             
          }*/

        if (cursors.up.isDown) {
            this.character.moveUp();
        } else if (cursors.down.isDown) {
            this.character.moveDown();
        } else if (cursors.left.isDown) {
            this.character.moveLeft();
        } else if (cursors.right.isDown) {
            this.character.moveRight();
        } else {
            this.character.stop();
        }    
    },

    summonShit: function() {
        var summon = new Summon(
            this,
            this.character.x, -20,
            this.character.x,
            this.character.y);

        this.emitter.emitX = summon.x;
        this.emitter.emitY = summon.y;

        this.summonSound.play();
    },

    spawnHuman: function() {
        var startTile = this.game.houseTiles[this.game.rnd.between(0, this.game.houseTiles.length - 1)];
        var human = new Human(this, startTile.worldX + 8, startTile.worldY + 8, 'human');
        this.humans.addChild(human);
    }  
};

// create Game function in BasicGame
BasicGame.YouWin.prototype = {
    init: function() {
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
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
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
    preload: function() {
        this.load.image('background', 'asset/images/you_win.png');
    },
    create: function() {
        // Add logo to the center of the stage
        this.background = this.add.sprite(
            this.world.centerX, // (centerX, centerY) is the center coordination
            this.world.centerY,
            'background');
        // Set the anchor to the center of the sprite
        this.background.anchor.setTo(0.5, 0.5);

    }

};


// create Game function in BasicGame
BasicGame.YouLose.prototype = {
    init: function() {
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
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
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
    preload: function() {
        this.load.image('background', 'asset/images/you_lose.png');
    },
    create: function() {
        // Add logo to the center of the stage
        this.background = this.add.sprite(
            this.world.centerX, // (centerX, centerY) is the center coordination
            this.world.centerY,
            'background');
        // Set the anchor to the center of the sprite
        this.background.anchor.setTo(0.5, 0.5);

    }
};