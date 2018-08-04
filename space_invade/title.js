
class Title
{
    constructor(sketch, config)
    {
        this.sketch = sketch;
        this.config = config;
        this.intialized = false;
    }

    initialize()
    {
        this.title_screen = this.sketch.loadImage("space_invade/res/title.png");
        this.menu_options = {
            PLAY : this.config.loadText("PLAY"),
            BACK : this.config.loadText("EXIT"),
        };
        this.selection = this.menu_options.PLAY;
        this.selection_cursor = this.config.loadText(">");
        this.initialized = true;
    }

    draw(update)
    {
        let {sketch, config} = this;
        if (!this.intialized)
            return;
        sketch.image(this.title_screen, 0, 0, config.DIMENSIONS.x, config.DIMENSIONS.y);

    }
}