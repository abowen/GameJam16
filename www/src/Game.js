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

        this.load.tilemap('level1', 'asset/tileset4.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'asset/tiles.png');

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)

        //http://phaser.io/examples/v2/sprites/spritesheet
        this.load.spritesheet('characterOrange', 'asset/characterOrangeLine.png', 16, 16, 12);
        this.load.image('summon', 'asset/summonRed.png');
    },

    create: function () {
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('tiles', 'tiles');

        //create layer
        this.backgroundLayer = this.map.createLayer('groundLayer');
        this.backgroundLayer = this.map.createLayer('backgroundLayer');

        // http://phaser.io/examples/v2/groups/group-as-layer
        // Create the sky layer, behind everything and donot move.
        this.textLayer = this.game.add.group();
        this.textLayer.z = 0;

        // Create the cloud layer, just below the text
        this.cloudLayer = this.game.add.group();
        this.cloudLayer.z = 1;

        // Mountains, walls, rivers that are static and objects collide into
        this.collisionLayer = this.game.add.group();
        this.collisionLayer.z = 2;

        // Moving objects that are blocked by mountains
        this.objectLayer = this.game.add.group();
        this.objectLayer.z = 3;

        // Blood splatter, summons, etc.
        this.groundLayer = this.game.add.group();
        this.groundLayer.z = 4;


        //http://phaser.io/examples/v2/input/cursor-key-movement
        cursors = this.game.input.keyboard.createCursorKeys();

        this.character = this.add.sprite(
             this.world.centerX,
             this.world.centerY, 
             'characterOrange');
        this.character.anchor.setTo(0.5, 0.5);

        // Summon those fools from dark earth
        //this.summon = {};
        this.hasSummonAlready = false;
        this.summonKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.summonKey.onDown.add(this.summonShit, this);

        // animation name, frames, FPS, true? (maybe swap)
        var framesPerSecond = 15;
        this.character.animations.add('down', [0, 1, 2], framesPerSecond, true);
        this.character.animations.add('right', [3, 4, 5], framesPerSecond, true);
        this.character.animations.add('up', [6, 7, 8], framesPerSecond, true);
        this.character.animations.add('left', [9, 10, 11], framesPerSecond, true);

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
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    },

    update : function () {
        if (cursors.up.isDown)
        {
            this.character.y--;
            this.character.animations.play('up');
        }
        else if (cursors.down.isDown)
        {
            this.character.y++;
            this.character.animations.play('down');
        }
        else if (cursors.left.isDown)
        {
            this.character.x--;
            this.character.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            this.character.x++;
            this.character.animations.play('right');
        }
        else {
            this.character.animations.stop();
        }
    },

    summonShit : function () {
        //this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'summon');
        // this.summon = this.add.sprite(
        //     this.character.x,
        //     this.character.y,
        //     'summon');

        var summon = new Phaser.Sprite(
                        this.game, 
                        this.character.x,
                        -20, 
                        'summon');
        summon.anchor.setTo(0.5, 0.5);

        this.emitter.emitX = summon.x;
        this.emitter.emitY = summon.y;

        this.groundLayer.add(summon);

        var summonSpeed = 1000;

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
    }
};