const LEVELS = [
    [1, 1, 1]
]

class Level
{
    constructor(sketch, config)
    {
        this.currentLevel = 0;
        this.sketch = sketch;
        this.config = config;

        this.enemies = [];
        this.explosions = [];
        this.blasts = [];
        this.speed = config.DEFAULT_ENEMY_SPEED;
        this.deltaX = this.speed;
        this.previousDirection = this.deltaX;
        this.deltaY = 0;

        this.xLim = 100 - (1600 / config.DEFAULT_DIM.x);
        this.edgeHit = false;
        this.verticalFrames = 0;
        this.updateSpeed = false;
        this.fireChance = 0.007;
    }

    initEnemies()
    {
        let {sketch, config, currentLevel} = this;
        this.enemies = [];
        if (currentLevel < LEVELS.length)
            for (let i = 0; i < LEVELS[currentLevel].length; i++) {
                if (LEVELS[currentLevel][i] > 0)
                    this.enemies.push(
                        new Enemy(sketch, config,
                            i * 20, 0, LEVELS[currentLevel][i] - 1));
            }
        this.deltaX = this.speed;
        this.previousDirection = this.deltaX;
        this.deltaY = 0;
        this.edgeHit = false;
        this.verticalFrames = 0;
        this.fireChance = 0.007;
        this.updateSpeed = false;
        this.speed = config.DEFAULT_ENEMY_SPEED;
    }

    updateDifficulty()
    {
        let numEnemies = LEVELS[this.currentLevel].length - this.enemies.length;
        this.speed += numEnemies * 0.035;
        this.fireChance += numEnemies * 0.005;
        this.previousDirection = ((this.previousDirection > 0)? this.speed : -this.speed);
        this.updateSpeed = false;
    }

    detectCollisions(projectiles)
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

    draw(update)
    {
        if (this.updateSpeed)
            this.updateDifficulty();
        if (this.enemies.length == 0 || this.enemies[0].y > 100)
            this.initEnemies();
        if (this.edgeHit)
        {
            this.deltaX = 0;
            if (this.verticalFrames > 0)
                this.verticalFrames--;
            else
            {
                this.deltaX = -this.previousDirection;
                this.edgeHit = false;
                this.deltaY = 0;
            }
        }
        for (var i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].hit)
            {
                this.enemies.splice(i, 1);
                continue;
            }
            this.enemies[i].move(this.deltaX, this.deltaY);
            if (Math.random() < this.fireChance)
                this.blasts.push(
                    new EnergyBlast(this.sketch, this.config, this.enemies[i].x, this.enemies[i].y, .4))
            if (!this.edgeHit && (this.enemies[i].x <= 0 || this.enemies[i].x >= this.xLim))
            {
                this.edgeHit = true;
                this.verticalFrames = 40;
                this.deltaY = this.speed;
                this.previousDirection = this.deltaX;
            }
            this.enemies[i].draw();
        }
        for (let i = this.explosions.length -1; i >= 0; i--)
        {
            if (this.explosions[i].done)
            {
                this.explosions.splice(i, 1);
                continue;
            } else {
                this.explosions[i].draw();
            }
        }
        for (let i = this.blasts.length -1; i >= 0; i--)
        {
            if (this.blasts[i].y > 100)
            {
                this.blasts.splice(i, 1);
                continue;
            } else {
                this.blasts[i].draw(update);
            }
        }
    }
}