export class Products {
    constructor({
        id,
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        desc,
        type,
    }) {
        this.id = String(id);
        this.name = name;
        this.price = Number(price);
        this.screen = screen;
        this.backCamera = backCamera;
        this.frontCamera = frontCamera;
        this.img = img;
        this.desc = desc;
        this.type = type;
    }
}
