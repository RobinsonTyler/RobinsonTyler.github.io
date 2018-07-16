class Drawable
{
    constructor(sketch, config, x, y, width, height)
    {
        this.sketch = sketch;
        this.config = config;
        this.x = x;
        this.y = y;
        if (!width) width = 16;
        if (!height) height = 16;
        this.wid = width;
        this.hei = height;
    }

}
Drawable.prototype.getX = function()
{
    if (!this.config.USE_DEFAULT_SCREEN)
        return (this.x / 100) * this.config.DIMENSIONS.x;
    else
        return (this.x / 100) * this.config.DEFAULT_DIM.x;
}

Drawable.prototype.getY = function()
{
    if (!this.config.USE_DEFAULT_SCREEN)
        return (this.y / 100) * this.config.DIMENSIONS.y;
    else
        return (this.y / 100) * this.config.DEFAULT_DIM.y;
}

Drawable.prototype.getWidth = function()
{
    return this.wid * this.config.SCALE;
}

Drawable.prototype.getHeight = function()
{
    return this.hei * this.config.SCALE;
}