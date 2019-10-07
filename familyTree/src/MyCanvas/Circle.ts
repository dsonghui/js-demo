/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
import CanvasElementEntity, { ICanvasElementOption } from "@/MyCanvas/CanvasElementEntity";

export interface ICircleOption extends ICanvasElementOption {
    x: number;
    y: number;
    r: number;
}

export default class Circle extends CanvasElementEntity {
    x: number;
    y: number;
    r: number;

    constructor(option: ICircleOption) {
        super(option);
        option = option || {};
        this.x = option.x;
        this.y = option.y;
        this.r = option.r;
    }

    draw() {
        console.log('draw');
        if (!this.ctx) throw new Error('画布实例为空');
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.r, this.y);
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.drawStyle();
    }
}
