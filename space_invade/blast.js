class EnergyBlast extends Drawable {

    constructor(sketch, config, x, y, yVel) {
        super(sketch, config, x, y, 6, 9);
        this.yVel = yVel;

        this.pics = [
            config.getImage(0, 120, 7, 8),
            config.getImage(8, 120, 7, 8),
            config.getImage(16, 120, 7, 8)
        ];
        this.timer = 0;
        this.imageUpdate = 15;
        this.imageIndex = 0;
        this.impacted = false;
    }

    draw(update){
        this.timer++;
        if (this.timer > this.imageUpdate)
        {
            this.timer = 0;
            this.imageIndex = ++this.imageIndex % 3;
        }
        this.sketch.image(this.pics[this.imageIndex],
            this.getX(), this.getY(), this.getWidth(), this.getHeight());
        this.y += (this.yVel * update / 25);
    }
}