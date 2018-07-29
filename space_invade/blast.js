class EnergyBlast extends Drawable {

    constructor(sketch, config, x, y, yVel, type=0) {
        super(sketch, config, x, y, 6, 9);
        this.yVel = yVel;

        let wid = 7;
        this.pics = [
            config.getImage( 0, (type * 8) + 120, wid, 8),
            config.getImage( 8, (type * 8) + 120, wid, 8),
            config.getImage(16, (type * 8) + 120, wid, 8)
        ];
        if (type == 2)
            this.wid = 8;
        this.timer = 0;
        this.imageUpdate = 11;
        this.imageIndex = 0;
        this.impacted = false;
        this.variant = type;
        this.val = 0;
    }
}

EnergyBlast.prototype.draw = function(update){
    this.timer++;
    if (this.timer > this.imageUpdate)
    {
        this.timer = 0;
        this.imageIndex = ++this.imageIndex % 3;
    }
    this.sketch.image(this.pics[this.imageIndex],
        this.getX(), this.getY(), this.getWidth(), this.getHeight());
    switch (this.variant)
    {
        default:
            this.y += (this.yVel * update / 25);
            break;
        case 1:
            this.val += (this.yVel * update / 500);
            this.y += this.val;
            break;
        case 2:
            this.val += update;
            this.y += (this.yVel * update / 25);
            this.x += Math.sin(this.val / 400) / 5;
            break;

    }
};