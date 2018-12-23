/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
import CanvasElementEntity, { ICanvasElementOption } from "@/MyCanvas/CanvasElementEntity";
import CanvasHelper from "@/canvasHelper";

export interface ICircleOption extends ICanvasElementOption {
    x: number;
    y: number;
    r: number;
    user: any;
}

export default class Avatar extends CanvasElementEntity {
    x: number;
    y: number;
    r: number;
    user: any;

    constructor(option: ICircleOption) {
        super(option);
        option = option || {};
        this.x = option.x;
        this.y = option.y;
        this.r = option.r;
        this.user = option.user || {};
    }

    draw() {
        if (!this.ctx) throw new Error('画布实例为空');
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.r, this.y);
        this.ctx.strokeStyle = '#777';
        CanvasHelper.drawDashRound(this.ctx, this.x, this.y, this.r);
        this.ctx.closePath();

        // 背景白圈
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.r, this.y);
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#F3F3F3';
        this.ctx.fill();
        // 填充渐变背景
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.r - 2, this.y);
        this.ctx.arc(this.x, this.y, this.r - 2, 0, 2 * Math.PI);
        var fillStyle = this.ctx.createLinearGradient(this.x - this.r, this.y - this.r, this.x + this.r, this.y + this.r);
        fillStyle.addColorStop(0, '#66Ebff');
        fillStyle.addColorStop(1, '#00ABEB');
        this.ctx.fillStyle = fillStyle;
        this.ctx.fill();

        //填充姓名
        this.ctx.fillStyle = '#666';
        this.ctx.font = "12px serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.user.name, this.x, this.y + this.r + 14);
    }
}
