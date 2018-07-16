class Explosion extends Drawable
{
    constructor(sketch, config, x, y)
    {
        super(sketch, config, x, y, 16, 16);
        this.images = [
            config.getImage(0, 74, 8, 8),
            config.getImage(8, 74, 8, 8),
            config.getImage(16, 74, 8, 8),
            config.getImage(24, 74, 8, 8),
            config.getImage(0, 82, 8, 8),
            config.getImage(8, 82, 8, 8),
            config.getImage(16, 82, 8, 8),
            config.getImage(24, 82, 8, 8)
        ];
        this.imageIndex = 0;
        this.frameSpeed = 4;
        this.frameCount = this.frameSpeed;
        this.done = false;
    }
}

Explosion.prototype.draw = function()
{
    let {images, imageIndex, frameSpeed, frameCount, done} = this;
    if (!done)
    {
        if (frameCount <= 0){
            this.imageIndex++;
            this.frameCount = frameSpeed;
        } else this.frameCount--;
        if (imageIndex >= images.length)
        {
            this.done = true;
            return
        }
        this.sketch.image(images[imageIndex], this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }
}