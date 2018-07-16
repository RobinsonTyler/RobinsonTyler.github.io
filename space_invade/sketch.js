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

    let lastDelta;

    sketch.setup = function () {
        leftKeyDown = false;
        rightKeyDown = false;
        fireKeyDown = false;
        ship;
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
    }

    sketch.preload = function()
    {
        config = new Config(sketch);
        level = new Level(sketch, config);
        config.spritesheet = sketch.loadImage("space_invade/res/spritesheet.png");
        config.explosion = sketch.loadSound("space_invade/res/sfx/enemy_explosion.ogg");
        config.shoot = sketch.loadSound("space_invade/res/sfx/laser.ogg");
    }

    sketch.windowResized = function() {
        config.windowResized();
        sketch.resizeCanvas(config.DIMENSIONS.x, config.DIMENSIONS.y);
    }

    function detectCollisions()
    {
        level.detectCollisions(projectiles);
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

    sketch.draw = function() {
        sketch.background(0);
        let update = sketch.millis();
        let delta = (update - lastDelta);
        handleMovement(delta);
        detectCollisions();
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
        for (let i = projectiles.length - 1; i >= 0; --i)
        {
            if (projectiles[i].y < -0.1 || projectiles[i].impacted)
                projectiles.splice(i, 1);
            else
                projectiles[i].draw(delta);
        }
        level.draw(delta);
        if (ship)
        {
            ship.draw();
        }
        sketch.text("BETA", config.DIMENSIONS.x * 7/ 8, config.DIMENSIONS.y / 8, config.DIMENSIONS.x / 18, config.DIMENSIONS.y / 18);
        lastDelta = update;
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
}

try {
    new p5(game);
} catch (error) {
    alert("Error ocurred, cannot continue..");
}