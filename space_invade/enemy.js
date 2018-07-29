
class Enemy extends Drawable
{
    constructor(sketch, config, x, y, type)
    {
        super(sketch, config, x, y);
        this.pictures = [
            config.getImage(0, 16 * type, 16, 16),
            config.getImage(16, 16 * type, 16, 16)];
        this.timer = 0;
        this.imageIndex = 0;
        this.hit = false;
        this.variant = type;
    }

    move(deltaX, deltaY)
    {
        this.x += deltaX;
        this.y += deltaY;
    }

    draw()
    {
        this.timer++;
        if (this.timer > 40)
        {
            this.timer = 0;
            this.imageIndex = ++this.imageIndex % 2;
        }
        this.sketch.image(
            this.pictures[this.imageIndex],
            this.getX(), this.getY(),
            this.getWidth(), this.getHeight());
    }
}