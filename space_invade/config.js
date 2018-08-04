const TEXT_PER_ROW = 15;
const TEXT = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

let Config = function (p5Instance)
{
    this.DEFAULT_DIM = {x: 320, y: 256};
    this.ASPECT_RATIO = this.DEFAULT_DIM.x / this.DEFAULT_DIM.y;
    this.MAX_STARS = 100;
    this.USE_DEFAULT_SCREEN = false;
    this.FIRE_COOLDOWN_TIME = 50;
    this.SCALE = 1;
    this.DEFAULT_ENEMY_SPEED = 0.2;
    this.DEFAULT_ENEMY_DROP_SPEED = 0.08;
    this.DIMENSIONS = {x: this.DEFAULT_DIM.x, y: this.DEFAULT_DIM.y};
    this.spritesheet;
    this.font;
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

    this.cacheText = function()
    {
        const DIM = 20;
        for (var i = 0; i < TEXT.length; i++) {
            let x = i % TEXT_PER_ROW;
            let y = Math.floor(i / TEXT_PER_ROW);
            let img = this.font.get(x * DIM, y * DIM, DIM, DIM);
            this.image_cache["char_"+TEXT[i]] = img;
        }
    }

    this.createNewText = function(text)
    {
        let width = text.length * 20;
        let img = p5Instance.createImage(width, 20);
        let char;
        let lastWidth = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] == " ")
            {
                lastWidth += 16;
                continue;
            }
            char = this.image_cache["char_"+text[i]];
            img.blend(char, 0, 0, 20, 20, lastWidth, 0, 20, 20, p5Instance.OVERLAY);
            lastWidth += 16;
            if ("WMwm".indexOf(text[i]) >= 0) lastWidth += 4;
        }
        // img.updatePixels();
        return img;
    }

    this.loadText = function(text)
    {
        if (Object.keys(this.image_cache).length == 0) return;
        let cached = this.image_cache["text_"+text];
        if (cached)
            return cached;
        cached = this.createNewText(text);
        this.image_cache["text_"+text] = cached;
        return cached;
    };

    this.drawText = function(text, x, y, scale = 1, rightAligned = true)
    {
        if (!rightAligned) p5Instance.imageMode(p5Instance.CENTER);
        x = (x / 100) * this.DIMENSIONS.x;
        y = (y / 100) * this.DIMENSIONS.y;
        scale *= this.SCALE;
        p5Instance.image(text, x, y, text.width * scale, text.height * scale);
        p5Instance.imageMode(p5Instance.CORNER);
    }
};