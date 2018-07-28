
class Star extends Drawable {

    constructor(sketch, config, genY) {
        super(sketch, config, Math.random() * 100,
              ((genY)? Math.random() * 100 : -5),
              Math.pow(0.5 + Math.random() / 4, 2) * 10, 1);
        let type = (Math.floor(Math.random() * 3) * 8) + 92;
        this.pictures = [
            config.getImage(0, type, 8, 8),
            config.getImage(8, type, 8, 8),
            config.getImage(16, type, 8, 8),
            config.getImage(24, type, 8, 8),
        ];
        this.imageIndex = 0;
        this.animCounter = Math.random() * 800;
        this.growing = true;
        this.animating = false;
        this.animTime = 5;
    }

}
Star.prototype.resetCounter = function()
{
    this.animCounter = 500 + (Math.random() * 2000);
}

Star.prototype.update = function(deltaTime)
{
    if (!deltaTime)
        deltaTime = 1;
    this.y += (this.wid) * deltaTime / 1000;
}

Star.prototype.draw = function()
{
    if (this.animating)
    {
        if (this.animCounter <= 0)
        {
            if (this.growing && this.imageIndex < 3)
            {
                this.imageIndex++;
                this.animCounter = this.animTime;
                if (this.imageIndex == 3) this.growing = false;
            } else if (!this.growing && this.imageIndex > 0) {
                this.imageIndex--;
                this.animCounter = this.animTime;
                if (this.imageIndex == 0)
                {
                    this.resetCounter();
                    this.animating = false;
                    this.growing = true;
                }
            }
        }
    } else {
        this.animating = (this.animCounter <= 0);
    }
    this.sketch.image(this.pictures[this.imageIndex], this.getX(), this.getY(), this.getWidth(), this.getWidth());
    this.animCounter--;
}