const LEVELS = [
    [
        [1, 1, 1, 1],
        [1, 1, 1, 1]
    ],
    [
        [1, 1, 2, 1, 1],
        [1, 1, 2, 1, 1],
    ],
    [
        [1, 2, 3, 2, 1],
        [1, 2, 3, 2, 1],
    ],
]

function getEnemyCount(index)
{
    index -= 1;
    if (index >= 0 && index < LEVELS.length)
        return LEVELS[index].length * LEVELS[index][0].length;
    return -1;
}

class Level
{
    constructor(sketch, config)
    {
        this.currentLevel = 0;
        this.sketch = sketch;
        this.config = config;
        this.shouldRenderEnemies = true;

        this.enemies = [];
        this.explosions = [];
        this.blasts = [];
        this.speed = config.DEFAULT_ENEMY_SPEED;
        this.vertSpeed = config.DEFAULT_ENEMY_DROP_SPEED;
        this.deltaX = this.speed;
        this.travellingRight = true;
        this.deltaY = 0;

        this.xLim = 100 - (1600 / config.DEFAULT_DIM.x);
        this.edgeHit = false;
        this.dropTime = 0;
        this.updateSpeed = false;
        this.fireChance = 0.0017;
        this.initialized = false;
        this.levelTitleTimer = 3000;

    }

    initEnemies()
    {
        let {sketch, config, currentLevel} = this;
        if (!this.shouldRenderEnemies)
            return;
        this.enemies = [];
        if (this.currentLevel >= LEVELS.length)
        {
            console.log("You win!");
            this.shouldRenderEnemies = false;
        }
        if (currentLevel < LEVELS.length)
            for (let y = 0; y < LEVELS[currentLevel].length; y++) {
                for (let x = 0; x < LEVELS[currentLevel][y].length; x++) {
                    if (LEVELS[currentLevel][y][x] > 0)
                        this.enemies.push(
                            new Enemy(sketch, config,
                                x * 7, y * 8, LEVELS[currentLevel][y][x] - 1));
            }
        }
        this.currentLevel ++;
        this.travellingRight = true;
        this.deltaY = 0;
        this.edgeHit = false;
        this.lastFrameEdgeHit = false;
        this.dropTime = 0;
        this.fireChance = 0.0017;
        this.updateSpeed = false;
        this.speed = config.DEFAULT_ENEMY_SPEED;
        this.deltaX = this.speed;
        this.updateDifficulty();
        this.levelTitleTimer = 3000;
    }

    updateDifficulty()
    {
        let enemiesDefeated = getEnemyCount(this.currentLevel) - this.enemies.length;
        this.speed += enemiesDefeated * 0.01;
        this.fireChance += enemiesDefeated * 0.0002;
        this.updateSpeed = false;
    }

    initialize()
    {
        this.messages = {
            version : this.config.loadText("~ BETA ~"),
            win     : this.config.loadText("You Win!"),
            lose    : this.config.loadText("Game Over"),
            author  : this.config.loadText("Tyler Robinson"),
            year    : this.config.loadText("2018"),
            left    : this.config.loadText("[A] or [<] = Left"),
            right   : this.config.loadText("[D] or [>] = Right"),
            fire    : this.config.loadText("[W] or [^] = Fire"),
            control_header : this.config.loadText("Controls:"),
        };
        this.levelMessages = [
            this.config.loadText("Level 1"),
            this.config.loadText("Level 2"),
            this.config.loadText("Level 3"),
            this.config.loadText("Level 4"),
            this.config.loadText("Level 5"),
            this.config.loadText("Level 6"),
            this.config.loadText("Level 7"),
            this.config.loadText("Level 8"),
        ]
        this.initialized = true;
    }

    detectCollisions(projectiles, ship)
    {
        if (this.levelTitleTimer <= 0)
        {
            for (let p = 0; p < projectiles.length; p++)
            {
                for (let e = 0; e < this.enemies.length; e++)
                {
                    let projectile = projectiles[p];
                    let enemy = this.enemies[e];
                    if (projectile.getY() <= enemy.getY() + enemy.getHeight() &&
                        projectile.getY() + projectile.getHeight() >= enemy.getY())
                    {
                        if (projectile.getX() < enemy.getX() + enemy.getWidth() &&
                            projectile.getX() + projectile.getWidth() > enemy.getX())
                        {
                            enemy.hit = true;
                            projectile.impacted = true;
                            this.updateSpeed = true;
                            this.explosions.push(new Explosion(this.sketch, this.config, enemy.x, enemy.y));
                            this.config.explosion.play();
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.blasts.length; i++) {
            let projectile = this.blasts[i];
            if (projectile.getY() <= ship.getY() + ship.getHeight() &&
                    projectile.getY() + projectile.getHeight() >= ship.getY())
                {
                if (projectile.getX() < ship.getX() + ship.getWidth() &&
                        projectile.getX() + projectile.getWidth() > ship.getX())
                    {
                        ship.hit = true;
                        projectile.impacted = true;
                    }
                }
        }
    }

    updateEnemies(update)
    {
        let {sketch, config, explosions, blasts, enemies} = this;
        let edgeDetected = false;
        if (this.updateSpeed)
            this.updateDifficulty();
        for (var i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].hit)
            {
                enemies.splice(i, 1);
                continue;
            }
            if (Math.random() < this.fireChance)
                blasts.push(
                    new EnergyBlast(sketch, config, enemies[i].x, enemies[i].y, .4));
            if (this.edgeHit) continue;
            if (this.enemies[i].x < 0 || this.enemies[i].x > this.xLim)
               edgeDetected = true;
        }
        if (this.lastFrameEdgeHit)
            this.lastFrameEdgeHit = edgeDetected;
        else if (edgeDetected)
        {
            this.edgeHit = true;
            this.dropTime = 1000;
            this.deltaY = this.vertSpeed;
            this.deltaX = 0;
        }
        if (this.edgeHit)
        {
            if (this.dropTime > 0)
                this.dropTime = this.dropTime - update;
            else
            {
                this.edgeHit = false;
                this.dropTime = 0;
                this.deltaY = 0;
                this.travellingRight = !this.travellingRight;
                this.deltaX = (this.travellingRight)? this.speed: -this.speed;
                this.lastFrameEdgeHit = true;
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].move(this.deltaX, this.deltaY);
            enemies[i].draw();
        }

    }

    drawText(text, x, y, scale = 1)
    {
        this.sketch.imageMode(this.sketch.CENTER);
        x = (x / 100) * this.config.DIMENSIONS.x;
        y = (y / 100) * this.config.DIMENSIONS.y;
        scale *= this.config.SCALE;
        this.sketch.image(text, x, y, text.width * scale, text.height * scale);
        this.sketch.imageMode(this.sketch.CORNER);
    }

    draw(update)
    {
        let {sketch, config, explosions, blasts, enemies, messages} = this;
        if (!update || isNaN(update))
            update = 1.0 / 60;
        if (enemies.length == 0 || enemies[0].y > 100)
            this.initEnemies();
        if (this.levelTitleTimer > 0)
        {
            this.levelTitleTimer -= update;
            if (this.currentLevel <= LEVELS.length)
                this.drawText(this.levelMessages[this.currentLevel - 1], 50, 50, 1);
            else
                this.drawText(this.messages.win, 50, 50, 1);
        } else {
            if (this.shouldRenderEnemies)
                this.updateEnemies(update);
        }
        for (let i = explosions.length -1; i >= 0; i--)
        {
            if (explosions[i].done)
            {
                explosions.splice(i, 1);
                continue;
            } else {
                explosions[i].draw();
            }
        }
        for (let i = blasts.length -1; i >= 0; i--)
        {
            if (blasts[i].y > 100 || blasts[i].impacted)
            {
                blasts.splice(i, 1);
                continue;
            } else {
                blasts[i].draw(update);
            }
        }
        if (!this.initialized) return;
        this.drawText(messages.version, 20, 10, 0.5);
        this.drawText(messages.author, 94, 96, 0.15);
        this.drawText(messages.year, 94, 98, 0.15);
    }
}