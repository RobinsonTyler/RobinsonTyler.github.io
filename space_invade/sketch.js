//
let game = function(sketch)
{
    let config;

    let leftKeyDown = false;
    let rightKeyDown = false;
    let fireKeyDown = false;
    let stars = Array();
    let projectiles = Array();
    let ship;
    let level;
    let title_card;

    let lastDelta;
    let titleScreenTime;

    sketch.setup = function () {
        leftKeyDown = false;
        rightKeyDown = false;
        fireKeyDown = false;
        titleScreenTime = 6000;
        stars = Array();
        projectiles = Array();
        sketch.createCanvas(config.DIMENSIONS.x, config.DIMENSIONS.y);
        sketch.windowResized();
        sketch.background(0);

        for (let i = 0; i < config.MAX_STARS; i++)
            stars.push(new Star(sketch, config, true));

        sketch.fill(255);
        sketch.rectMode(sketch.CENTER);
        sketch.noSmooth();

        ship = new Ship(sketch, config);
        lastDelta = sketch.millis();
    };

    sketch.preload = function()
    {
        config = new Config(sketch);
        level = new Level(sketch, config);
        config.spritesheet = sketch.loadImage("space_invade/res/spritesheet.png");
        config.explosion = sketch.loadSound("space_invade/res/sfx/enemy_explosion.ogg");
        config.shoot = sketch.loadSound("space_invade/res/sfx/laser.ogg");
        config.font = sketch.loadImage("space_invade/res/font.png",
            function(){
                config.cacheText();
                level.initialize();
                createMessages();
            }
        );
        title_card = sketch.loadImage("space_invade/res/title.png");
    };

    function createMessages()
    {
        this.messages = {
            version : config.loadText("~ BETA ~"),
            author  : config.loadText("Tyler Robinson"),
            year    : config.loadText("2018"),
            left    : config.loadText("[A] or [<] = Left"),
            right   : config.loadText("[D] or [>] = Right"),
            fire    : config.loadText("[W] or [^] = Fire"),
            control_header : config.loadText("Controls:"),
        };
    }

    sketch.windowResized = function() {
        config.windowResized();
        sketch.resizeCanvas(config.DIMENSIONS.x, config.DIMENSIONS.y);
    };

    function detectCollisions()
    {
        level.detectCollisions(projectiles, ship);
    }

    function handleMovement(update)
    {
        let direction = 0;
        if (leftKeyDown)
            direction -= 1;
        if (rightKeyDown)
            direction += 1;
        if (ship)
            ship.move(direction, update);
        if (fireKeyDown && ship.firing < 0)
        {
            ship.firing = config.FIRE_COOLDOWN_TIME;
            config.shoot.play();
            projectiles.push(new Projectile(sketch, config, ship.x + 1.4, ship.y, -.6));
        }
    }

    function drawLabels()
    {
        config.drawText(messages.version, 20, 10, 0.5, false);
        config.drawText(messages.author, 94, 96, 0.15, false);
        config.drawText(messages.year, 94, 98, 0.15, false);
    }

    function drawControls()
    {
        config.drawText(messages.control_header, 45, 58, .8);
        config.drawText(messages.right, 50, 64, .5);
        config.drawText(messages.left , 50, 68, .5);
        config.drawText(messages.fire , 50, 72, .5);
    }
    sketch.draw = function() {
        sketch.background(0);
        let update = sketch.millis();
        let delta = (update - lastDelta);
        if (!delta || isNaN(delta))
            delta = 1 / 60;
        if (titleScreenTime > 0)
        {
            titleScreenTime -= delta;
            sketch.image(title_card, 0, 0, config.DIMENSIONS.x, config.DIMENSIONS.y);
            drawControls();
        } else {
            handleMovement(delta);
            detectCollisions();
            sketch.smooth();
            for (let i = stars.length - 1; i >= 0; --i)
            {
                if (stars[i].y > 100)
                    stars[i] = new Star(sketch, config);
                else
                {
                    stars[i].update(delta);
                    stars[i].draw();
                }
            }
            sketch.noSmooth();
            for (let i = projectiles.length - 1; i >= 0; --i)
            {
                if (projectiles[i].y < -0.1 || projectiles[i].impacted)
                    projectiles.splice(i, 1);
                else
                    projectiles[i].draw(delta);
            }
            level.draw(delta);
            if (ship)
                ship.draw();
        }
        drawLabels();
        lastDelta = update;
    };

    updatePress = function(x, y, pressed)
    {
        if (y > config.DIMENSIONS.y / 3)
        {

            if (x < config.DIMENSIONS.x / 2)
                leftKeyDown = pressed;
            else
                rightKeyDown = pressed;
        } else fireKeyDown = pressed;
    }

    updateKeys = function(pressed)
    {
        if (sketch.keyCode === sketch.LEFT_ARROW ||
            sketch.key == 'a' ||
            sketch.key == 'A') {
            leftKeyDown = pressed;
        } else if (sketch.keyCode === sketch.RIGHT_ARROW ||
            sketch.key == 'd' ||
            sketch.key == 'D') {
            rightKeyDown = pressed;
        } else if (sketch.key == ' '
            || sketch.keyCode === sketch.UP_ARROW
            || sketch.key == 'w'
            || sketch.key == 'W'
            ) {
            fireKeyDown = pressed;
        }
    }

    sketch.keyPressed = function()
    {
        updateKeys(true);
    }

    sketch.keyReleased = function()
    {
        updateKeys(false);
    }

    sketch.mousePressed = function()
    {
        updatePress(sketch.mouseX, sketch.mouseY, true);
    }

    sketch.mouseReleased = function()
    {
        updatePress(sketch.mouseX, sketch.mouseY, false);
    }
}

try {
    new p5(game, "gameContainer");
} catch (error) {
    alert("Error ocurred, cannot continue..");
}