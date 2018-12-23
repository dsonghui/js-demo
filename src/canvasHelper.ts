/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
export default class CanvasHelper {
    static getXyByAngleAndRadius(angle, radius) {

        let x = Math.cos(Math.PI / 180 * angle) * radius;
        let y = Math.sin(Math.PI / 180 * angle) * radius;
        if (y > 0 && y < 0.01) {
            y = 0
        }
        if (x > 0 && x < 0.01) {
            x = 0
        }

        // console.log('=====angle' + angle);
        // console.log('=====radius' + radius);
        // console.log({x,y});
        return {
            x, y
        }
    }

    static drawDashRound(ctx, x, y, radius, partNum = 20) {
        ctx.setLineDash([5, 2]);
        ctx.lineDashOffset = partNum;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
