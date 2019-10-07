/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
import CanvasElementEntity from "@/MyCanvas/CanvasElementEntity";

export default class Layer {
    ctx: CanvasRenderingContext2D;
    shapes: CanvasElementEntity[] = [];

    constructor(ctx) {
        this.ctx = ctx;
    }

    push(shape: CanvasElementEntity) {
        this.shapes.push(shape);
    }

    unshift(shape: CanvasElementEntity) {
        this.shapes.unshift(shape);
    }

    draw() {
        this.shapes.forEach((shapw) => shapw.setCtx(this.ctx) && shapw.draw());
    }
}
