/**
 *
 * Author: david.deng<david.deng@jcinfotech.com>
 * Date: 2018-12-21
 */
import Layer from "@/MyCanvas/Layer";

export default class Stage {
    canvasElement: HTMLCanvasElement;
    Layers: Layer[] = [];

    constructor(w, h) {
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.setAttribute('width', w);
        this.canvasElement.setAttribute('height', h);
        this.canvasElement.setAttribute('class', 'canvasPosition');
    }

    push(layer: Layer) {
        this.Layers.push(layer);
    }

    unshift(layer: Layer) {
        this.Layers.unshift(layer);
    }

    getElement() {
        return this.canvasElement;
    }
}
