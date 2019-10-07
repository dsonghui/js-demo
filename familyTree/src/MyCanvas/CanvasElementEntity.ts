/**
 * Canvas元素封装
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */

export interface ICanvasElementOption {
    isFill?: boolean;
    /**
     * 是否描边
     */
    isStroke?: boolean;
    /**
     * 填充的颜色
     */
    fillStyle?: string;
    /**
     * 边框颜色
     */
    strokeStyle?: string;
}

export default class CanvasElementEntity {
    ctx: CanvasRenderingContext2D;
    isFill: boolean = false;
    isStroke: boolean = false;
    fillStyle?: string;
    strokeStyle?: string;

    constructor(option) {
        option = option || {};
        this.isFill = option.isFill || false;
        this.isStroke = option.isStroke || false;
        this.fillStyle = option.fillStyle || "";
        this.strokeStyle = option.strokeStyle || "";
    }

    setCtx(ctx) {
        this.ctx = ctx;
        return true;
    }

    draw() {

    }

    /**
     * 设置图像样式
     */
    drawStyle() {
        if (!this.ctx) {
            throw new Error("画布实例为空");
        }
        if (this.isFill) {
            if (this.fillStyle) {
                this.ctx.fillStyle = this.fillStyle;
            }
            this.ctx.fill();
        }
        if (this.isStroke) {
            if (this.strokeStyle) {
                this.ctx.strokeStyle = this.strokeStyle;
            }
            this.ctx.stroke();
        }
    }
}
