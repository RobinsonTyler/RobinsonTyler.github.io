class EnergyBlast extends Drawable {

    constructor(sketch, config, x, y, velocity, type=0) {
        super(sketch, config, x, y, 6, 9);

        switch (type)
        {
            case 1:
                this.yVel = velocity / 256;
                break;
            case 2:
                this.yVel = velocity / 32;
                break;
            default:
                this.yVel = velocity / 16;
        }

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
        case 1:
            this.val += (this.yVel * update);
            this.y += this.val;
            break;
        case 2:
            this.val += update;
            this.y += (this.yVel * update);
            this.x += Math.sin(this.val / 400) / 4;
            break;
        default:
            this.y += (this.yVel * update);
            break;

    }
};