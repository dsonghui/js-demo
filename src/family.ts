/**
 * 家庭图片
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
import * as Color from "color";
import Layer from "@/MyCanvas/Layer";
import Circle from "@/MyCanvas/Circle";
import Stage from "@/MyCanvas/Stage";
import FamilyMemberLayer, { FamilyMemberPosition, UserEntity } from "@/Family/FamilyMemberLayer";
import CanvasHelper from "@/canvasHelper";
import Line from "@/MyCanvas/Line";
import UserTree from "@/userTree";
import Avatar from "@/MyCanvas/Avatar";

interface IConfig {
    r: number,
    layerNum: number,
}

const defaultConfig = {
    r: 400,
    layerNum: 5
};


export default class FamilyMap {
    // canvas 对象
    wrap: HTMLElement;
    // 数据夸文件共享
    store: any;
    config: IConfig;
    MemberLayer: FamilyMemberLayer[] = [];
    Users: UserEntity = <any>UserTree;
    RootUser: FamilyMemberPosition | null = null;
    constructor(wrap, store, config?) {
        this.wrap = wrap;
        this.store = store;
        this.config = config || defaultConfig;
        let radiusStep = Math.floor(this.config.r / 5) - 1;
        this.MemberLayer = new Array(this.config.layerNum)
            .fill(null)
            .map((v, index) => new FamilyMemberLayer(index + 1, radiusStep * (index + 1)));
        window['FamilyMap'] = this;
        console.log(this);
    }

    // 中心坐标
    get CenterXy() {
        return {
            x: this.config.r,
            y: this.config.r
        }
    }

    __getMemberLayer(layerNum) {
        let l = this.MemberLayer.find(l => l.layerNum === layerNum);
        if (l) return l;
        throw new Error('没有找到对应的层:' + layerNum);
    }

    build() {
        this.buildBackGroupCircle();
        this.buildUserLinkLine();
        this.buildUserAvatar();

        //console.log(UserTree);

        // this.buildZuoBiao();

        // this.buildCircle(ctx, this.CenterXy.x, this.CenterXy.y, 380);
        // ctx.fillStyle = '#f1f1f1';
        // ctx.fill();
        // this.buildCircle(ctx, this.CenterXy.x, this.CenterXy.y, 280);
        // ctx.fillStyle = '#E1e1e1';
        // ctx.fill();
    }

    buildBackGroupCircle() {
        let bgStage = new Stage(this.config.r * 2, this.config.r * 2);
        let backgroupLayer = new Layer(bgStage.getElement().getContext("2d"));
        let color = Color('#f9f9f9');
        this.MemberLayer.forEach((layer, index) => {
            backgroupLayer.unshift(new Circle({
                x: this.CenterXy.x,
                y: this.CenterXy.y,
                r: layer.radius,
                isFill: true,
                isStroke: true,
                fillStyle: index === 0 ? '#57DDFF' : color.darken(0.02 * (this.config.layerNum - index - 1)).rgb().toString(),
                strokeStyle: index === 0 ? '#2FB1E3' : '#D8D8D8'
            }));
        })

        backgroupLayer.draw();

        this.wrap.appendChild(bgStage.getElement());
    }

    // 画用户连接的点;
    buildUserLinkLine() {
        let bgStage = new Stage(this.config.r * 2, this.config.r * 2);
        let userLinkLineLayer = new Layer(bgStage.getElement().getContext("2d"));
        // 用户生成属性结构对象
        this.RootUser = new FamilyMemberPosition(this.Users, null, 0, this.CenterXy.x, this.CenterXy.y);
        this.__buildLayerLinkLine(userLinkLineLayer, this.RootUser, 0, 360)
        userLinkLineLayer.draw();
        this.wrap.appendChild(bgStage.getElement());
    }

    // 根据父级和子级数量分配位置
    __buildLayerLinkLine(canvasLayer, parentUser: FamilyMemberPosition, parentAngle, maxAngle) {
        if (!parentUser.subUser || parentUser.subUser.length === 0) return;
        let layerNum = parentUser.layer + 1;
        let layer = this.__getMemberLayer(layerNum);
        let UserLinkLine = new Line({
            isStroke: true,
            strokeStyle: layerNum === 1 ? '#fff' : '#D8D8D8'
        });
        let userNumber = parentUser.subUser.length;
        if (userNumber > 0) {
            let stepAngle = maxAngle / userNumber;
            parentUser.subUser.forEach((user, index) => {
                let startAngle = parentAngle - (maxAngle / 2) + (stepAngle / 2);
                if (startAngle < 0) startAngle = 360 + startAngle;
                let userAngle = startAngle + (stepAngle * index);
                // console.log('startAngle:' + startAngle);
                // console.log('userAngle:' + userAngle);
                // console.log('stepAngle:' + stepAngle);
                let p = CanvasHelper.getXyByAngleAndRadius(userAngle, layer.radius);
                // console.log(p);
                user.x = this.CenterXy.x + p.x;
                user.y = this.CenterXy.y + p.y;
                UserLinkLine.push({
                    from: {
                        x: user.parentUser.x,
                        y: user.parentUser.y,
                    },
                    to: {
                        x: user.x,
                        y: user.y,
                    }
                });
                this.__buildLayerLinkLine(canvasLayer, user, userAngle, stepAngle);
            });
        }
        canvasLayer.push(UserLinkLine);
    }

    buildUserAvatar() {
        let bgStage = new Stage(this.config.r * 2, this.config.r * 2);
        let userAvatarLayer = new Layer(bgStage.getElement().getContext("2d"));
        // 用户生成属性结构对象
        buildUserAvatar(this.RootUser);

        function buildUserAvatar(user) {
            userAvatarLayer.push(new Avatar({
                x: user.x,
                y: user.y,
                r: 25,
                fillStyle: '#57DDFF',
                strokeStyle: '#2FB1E3'
            }));
            if (user.subUser) user.subUser.forEach(_user => {
                buildUserAvatar(_user);
            })
        }

        userAvatarLayer.draw();
        this.wrap.appendChild(bgStage.getElement());
    }


    buildZuoBiao() {
        let bgStage = new Stage(this.config.r * 2, this.config.r * 2);
        let ctx: CanvasRenderingContext2D = <any>bgStage.getElement().getContext("2d");
        ctx.beginPath();
        ctx.moveTo(this.CenterXy.x, this.CenterXy.y);
        ctx.lineTo(this.CenterXy.x + this.config.r, this.CenterXy.y);
        ctx.moveTo(this.CenterXy.x, this.CenterXy.y);
        ctx.lineTo(this.CenterXy.x - this.config.r, this.CenterXy.y);
        ctx.moveTo(this.CenterXy.x, this.CenterXy.y);
        ctx.lineTo(this.CenterXy.x, this.CenterXy.y + +this.config.r);
        ctx.moveTo(this.CenterXy.x, this.CenterXy.y);
        ctx.lineTo(this.CenterXy.x, this.CenterXy.y - +this.config.r);
        ctx.closePath();
        ctx.stroke();
        this.wrap.appendChild(bgStage.getElement());
    }


}
