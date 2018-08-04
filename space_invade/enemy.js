
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
        this.firingTime = Math.random() * 2000;
    }

    move(deltaX, deltaY)
    {
        this.x += deltaX;
        this.y += deltaY;
    }
}

Enemy.prototype.draw = function(update)
{
    this.firingTime -= update;
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

Enemy.prototype.resetFiringTimer = function()
{
    this.firingTime = 2000 + (Math.random() * 3000);
}