/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
import CanvasElementEntity, { ICanvasElementOption } from "@/MyCanvas/CanvasElementEntity";

export interface ILineEntity {
    from: { x: number, y: number };
    to: { x: number, y: number };
}

// tslint:disable-next-line:no-empty-interface
export interface ILineOption extends ICanvasElementOption {
}

export default class Line extends CanvasElementEntity {
    lines: ILineEntity[] = [];

    constructor(option: ILineOption) {
        super(option);
    }

    push(line: ILineEntity) {
        this.lines.push(line);
    }

    draw() {
        console.log("draw");
        if (!this.ctx) {
            throw new Error("画布实例为空");
        }
        this.ctx.beginPath();
        this.lines.forEach((line) => {
            this.ctx.moveTo(line.from.x, line.from.y);
            this.ctx.lineTo(line.to.x, line.to.y);
        });
        this.ctx.closePath();
        this.drawStyle();
    }
}
