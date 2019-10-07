/**
 * 家庭圈层对象
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */

export class UserEntity {
    uid: number;
    name: string;
    sub?: UserEntity[] = [];
}

const hasUser: number[] = [];

export class FamilyMemberPosition extends UserEntity {
    parentUser: FamilyMemberPosition;
    subUser: FamilyMemberPosition[] = [];
    layer: number;
    x: number;
    y: number;
    constructor(user: UserEntity, parentUser, layer, x?, y?) {
        super();
        Object.assign(this, user);
        this.parentUser = parentUser;
        this.layer = layer;
        this.x = x || 0;
        this.y = y || 0;
        if (this.sub && this.sub.length > 0) {
            // tslint:disable-next-line:no-shadowed-variable
            this.sub.forEach((user) => {
                if (hasUser.indexOf(user.uid) === -1) {
                    hasUser.push(user.uid);
                    this.subUser.push(new FamilyMemberPosition(user, this, layer + 1));
                }
            });
        }
    }
}

export default class FamilyMemberLayer {
    layerNum: number = 0;
    radius: number = 0;
    usersPosition: FamilyMemberPosition[] = [];
    constructor(layerNum, radius) {
        this.layerNum = layerNum;
        this.radius = radius;
    }

}
