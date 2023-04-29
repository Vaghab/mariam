class BlockProducts{
    product: HTMLElement = document.querySelector('.product__inner') as HTMLElement;
    products: IProduct[] = InfoService.getProducts();

    constructor(){
        this.setCards();
    }

    setCards(){
        this.products.forEach((val: IProduct)=>{
            const card = new Card(val, "products");
            this.product.append(card.getMain());
        })
    }
}

new BlockProducts();