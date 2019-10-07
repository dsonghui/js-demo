/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
export interface IState {
    MyCanvas?: any;
}

class Store {
    state: IState = {} as any;

    constructor(state) {
        this.state = Object.assign(this.state, state);
    }
}

export default new Proxy<IState>((new Store({})) as any, {
    get(store: any, p, receiver) {
        if (p in store.state) {
            return store.state[p];
        }
        throw new Error("Store 不存在属性:" + String(p));
    },
    set(store: any, p, value) {
        store.state[p] = value;
        return true;
    },
});
