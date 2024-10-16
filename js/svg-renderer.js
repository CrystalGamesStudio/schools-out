export default class SvgRenderer {
    constructor(svg, width, height) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.image = null;
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();
        this.image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.svg);
    }

    render(ctx, x, y) {
        if (this.image) {
            ctx.drawImage(this.image, x, y, this.width, this.height);
        }
    }
}
