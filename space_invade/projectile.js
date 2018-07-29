class Projectile extends Drawable {

    constructor(sketch, config, x, y, yVel) {
        super(sketch, config, x, y, 6, 9);
        this.yVel = yVel;

        this.pics = [
            config.getImage(26, 119, 6, 9)
        ];
        this.timer = 0;
        this.imageUpdate = 15;
        this.imageIndex = 0;
        this.pics.push(config.getYFlippedImage(26, 119, 6, 9));
        this.impacted = false;
    }
}

Projectile.prototype.draw = function(update){
    this.timer++;
    if (this.timer > this.imageUpdate)
    {
        this.timer = 0;
        this.imageIndex = ++this.imageIndex % 2;
    }
    this.sketch.image(this.pics[this.imageIndex],
        this.getX(), this.getY(), this.getWidth(), this.getHeight());
    this.y += (this.yVel * update / 25);
};