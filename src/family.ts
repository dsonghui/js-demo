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
        });

        backgroupLayer.draw();

        this.wrap.appendChild(bgStage.getElement());
    }

    // 画用户连接的点;
    buildUserLinkLine() {
        let bgStage = new Stage(this.config.r * 2, this.config.r * 2);
        let userLinkLineLayer = new Layer(bgStage.getElement().getContext("2d"));
        // 用户生成属性结构对象
        this.RootUser = new FamilyMemberPosition(this.Users, null, 0, this.CenterXy.x, this.CenterXy.y);
        this.__buildLayerLinkLine(userLinkLineLayer, this.RootUser, 0, 360);
        userLinkLineLayer.draw();
        this.wrap.appendChild(bgStage.getElement());
    }

    /**
     * 根据父级和子级数量分配位置
     * @param canvasLayer 当前 CanvasLarer
     * @param parentUser  父用户信息
     * @param parentAngle 父级用户所处的角度 根用户为0
     * @param maxAngle 父用户可占用的角度// 用于分配给子级用户
     * @private
     */
    __buildLayerLinkLine(canvasLayer, parentUser: FamilyMemberPosition, parentAngle, maxAngle) {
        if (!parentUser.subUser || parentUser.subUser.length === 0) return;
        let layerNum = parentUser.layer + 1;
        let layer = this.__getMemberLayer(layerNum);
        let UserLinkLine = new Line({
            isStroke: true,
            strokeStyle: layerNum === 1 ? '#fff' : '#D8D8D8'
        });
        // 子级用户数;
        let subUserNumber = parentUser.subUser.length;
        // 子用户的子用户分数 至少占2分 至多占4份;
        let subUserSubUserNumber = 0;
        if (subUserNumber > 0) {
            parentUser.subUser.forEach(user => {
                subUserSubUserNumber += getUsbUserPercent(user);
            });
            let stepAngle = maxAngle / subUserSubUserNumber;
            let startAngle = parentAngle - (maxAngle / 2);
            if (startAngle < 0) startAngle = 360 + startAngle;
            parentUser.subUser.forEach((user, index) => {
                // 分配给此用户的角度
                let hasAngle = getUsbUserPercent(user) * stepAngle;
                // 用户所在的角度 在开始角度加上分配的角度中间
                let userAngle = startAngle + (hasAngle / 2);
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
                this.__buildLayerLinkLine(canvasLayer, user, userAngle, hasAngle);

                // 记录下一个用户的开始角度;
                startAngle += hasAngle;
            });
        }

        function getUsbUserPercent(user) {
            if (user.subUser && user.subUser.length > 6) {
                return 6
            }
            return user.subUser.length || 1
        }

        canvasLayer.push(UserLinkLine);
    }

    buildUserAvatar() {
        let _this = this;
        let bgStage = new Stage(this.config.r * 2, this.config.r * 2);
        let userAvatarLayer = new Layer(bgStage.getElement().getContext("2d"));
        let lastOnAvatar: Avatar | null = null;
        // 用户生成属性结构对象
        buildUserAvatar(this.RootUser);

        function buildUserAvatar(user) {
            userAvatarLayer.push(new Avatar({
                x: user.x,
                y: user.y,
                r: 25,
                fillStyle: '#57DDFF',
                strokeStyle: '#2FB1E3',
                user
            }));
            if (user.subUser) user.subUser.forEach(_user => {
                buildUserAvatar(_user);
            })
        }

        userAvatarLayer.draw();
        this.wrap.appendChild(bgStage.getElement());
        bgStage.getElement().addEventListener('mousemove', function (e) {
            let mouseX = e.layerX;
            let mouseY = e.layerY;
            let OnAvatar: Avatar | null = null;
            userAvatarLayer.shapes.forEach((shape: Avatar) => {
                if (Math.sqrt(Math.pow(mouseX - shape.x, 2) + Math.pow(mouseY - shape.y, 2)) < 25) {
                    OnAvatar = shape;
                }
            });

            if (OnAvatar && lastOnAvatar !== OnAvatar) {
                // 去掉上次的焦点头像;
                if (lastOnAvatar) {
                    userAvatarLayer.shapes.pop();
                }
                lastOnAvatar = OnAvatar;
                // 添加焦点头像到最前
                userAvatarLayer.push(new Avatar({
                    x: OnAvatar.x,
                    y: OnAvatar.y,
                    r: 30,
                    fillStyle: '#57DDFF',
                    strokeStyle: '#2FB1E3',
                    user: OnAvatar.user
                }));
                // 重新绘制头像
                userAvatarLayer.ctx.clearRect(0, 0, _this.config.r * 2, _this.config.r * 2);
                userAvatarLayer.draw();
            }

            if (!OnAvatar && lastOnAvatar) {
                // 去掉上次的焦点头像;
                if (lastOnAvatar) {
                    userAvatarLayer.shapes.pop();
                }
                lastOnAvatar = null;
                // 重新绘制头像
                userAvatarLayer.ctx.clearRect(0, 0, _this.config.r * 2, _this.config.r * 2);
                userAvatarLayer.draw();
            }

        })
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
