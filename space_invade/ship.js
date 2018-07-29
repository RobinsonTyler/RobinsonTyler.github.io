class Ship extends Drawable {

    constructor(sketch, config)
    {
        super(sketch, config, 50, 85);
        this.lives = 4;
        this.shieldCooldown = 0;
        this.hit = false;
        this.firing = -1;
        this.speed = 0.03;
        this.f_image = config.getImage(0, 144, 16, 16);
        this.r_image = config.getImage(16, 144, 16, 16);
        this.l_image = config.getYFlippedImage(16, 144, 16, 16);
        this.shield = config.getImage(0, 160, 16, 16);
        this.dead_image = config.getImage(16, 160, 16, 16);
        this.extra_life_image = config.getImage(0, 65, 8, 8);
        this.image = this.f_image;
    }

    move(dir, delta)
    {
        if (this.lives <= 0)
        {
            this.image = this.dead_image;
            return;
        }
        let pos = this.x + ((this.speed * dir) * delta);
        if (pos > 0 && pos < 95)
            this.x = pos;
        if (dir < -0.1)
            this.image = this.l_image;
        else if (dir > 0.1)
            this.image = this.r_image;
        else
            this.image = this.f_image;
    }

    draw(update)
    {
        this.sketch.image(this.image, this.getX(), this.getY(),
            this.getWidth(), this.getHeight());
        if (this.hit && this.shieldCooldown <= 0)
        {
            this.hit = false;
            this.shieldCooldown = 60;
            this.lives--;
        }
        if (this.lives <= 0)
        {
            // Disable firing
            this.firing = 10;
            this.shieldCooldown = -1;
            return;
        } else {
            for (var i = 1; i < this.lives; i++) {
                let X = this.config.DIMENSIONS.x;
                let Y = this.config.DIMENSIONS.y;
                this.sketch.image(this.extra_life_image, X * i / 40, 0.94 * Y, 0.025 * X, 0.025 * Y);
            }
        }
        if (this.firing >= 0) this.firing--;
        if (this.shieldCooldown > 0)
        {
            this.shieldCooldown -= 1;
            this.sketch.image(this.shield, this.getX(), this.getY() - 3,
                this.getWidth(), this.getHeight());
            if (this.shieldCooldown == 0)
                this.hit = false;
        }
    }

}