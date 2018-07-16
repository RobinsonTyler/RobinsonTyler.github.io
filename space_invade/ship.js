class Ship extends Drawable {

    constructor(sketch, config)
    {
        super(sketch, config, 50, 85);
        this.lives = 4;
        this.hit = false;
        this.firing = -1;
        this.speed = 0.03;
        this.f_image = config.getImage(0, 128, 16, 16);
        this.r_image = config.getImage(16, 128, 16, 16);
        this.l_image = config.getYFlippedImage(16, 128, 16, 16);
        this.image = this.f_image;
    }

    move(dir, delta)
    {
        let pos = this.x + ((this.speed * dir) * delta);
        if (pos > 0 && pos < 100 /*- (16 / this.config.DEFAULT_DIM.x)*/)
            this.x = pos;
        if (dir < -0.1)
            this.image = this.l_image;
        else if (dir > 0.1)
            this.image = this.r_image;
        else
            this.image = this.f_image;
    }

    draw()
    {
        this.sketch.image(this.image, this.getX(), this.getY(),
            this.getWidth(), this.getHeight());
        if (this.firing >= 0) this.firing--;
    }

}