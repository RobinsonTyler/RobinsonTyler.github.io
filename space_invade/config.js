
let Config = function (p5Instance)
{
    this.DEFAULT_DIM = {x: 320, y: 256};
    this.ASPECT_RATIO = this.DEFAULT_DIM.x / this.DEFAULT_DIM.y;
    this.MAX_STARS = 100;
    this.USE_DEFAULT_SCREEN = false;
    this.FIRE_COOLDOWN_TIME = 50;
    this.SCALE = 1;
    this.DEFAULT_ENEMY_SPEED = .2;
    this.DIMENSIONS = {x: this.DEFAULT_DIM.x, y: this.DEFAULT_DIM.y};
    this.spritesheet;
    this.shoot;
    this.explosion;

    this.image_cache = [];

    this.windowResized = function()
    {
        let wid = window.innerWidth;
        let hei = window.innerHeight;
        let screenAspect = wid / hei;
        if (screenAspect > this.ASPECT_RATIO)
            wid = hei * this.ASPECT_RATIO;
        else
            hei = wid / this.ASPECT_RATIO;
        this.SCALE = hei / this.DEFAULT_DIM.y;
        this.DIMENSIONS = {x:wid, y:hei};
        p5Instance.resizeCanvas(wid, hei);
    };

    this.getYFlippedImage = function(x, y, w, h)
    {
        let cached = this.image_cache["-"+x+"_"+y];
        if (cached)
            return cached;
        let oldImg = this.getImage(x, y, w, h);
        let img = p5Instance.createImage(oldImg.width, oldImg.height);
        img.loadPixels();
        oldImg.loadPixels();
        for (let y = 0; y < oldImg.height; y++)
            for (let x = 0; x < oldImg.width; x++)
                img.set(x, y, oldImg.get(oldImg.width - (x + 1), y));
        img.updatePixels();
        this.image_cache["-"+x+"_"+y] = img;
        return img;
    };

    this.getImage = function(x, y, w, h)
    {
        let cached = this.image_cache[x+"_"+y];
        if (cached)
            return cached;

        let img = this.spritesheet.get(x, y, w, h);
        this.image_cache[x+"_"+y] = img;
        return img;
    };
};