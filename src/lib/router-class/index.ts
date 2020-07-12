export class RouterClass {

    private _index: number

    constructor (private readonly _proxies_list: string[]) {
        this._index = 0;
    }

    getRoute(): string {
        const proxy_url: string = this._proxies_list[this._index];

        this._index ++;

        if (this._index >= this._proxies_list.length) {
            this._index = 0;
        }

        return proxy_url;
    }

}