class PopUp {
    public popup: HTMLElement = document.createElement('div');
    public templateInner: HTMLElement = document.createElement('div');
    public popDesc: HTMLElement = document.createElement('div');
    public popPrice: HTMLElement = document.createElement('div');
    public popTitle: HTMLElement = document.createElement('div');

    info: IService;

    constructor(product: IService){
        this.info = product;

        this.setSelector();
        this.setInfo();
        this.setElements();
        this.render();
        this.setEvent();
    }

    setSelector() {
        this.popup.classList.add('popup');
        this.templateInner.classList.add('popup__box');
        this.popDesc.classList.add('popup__desc');
        this.popPrice.classList.add('popup__price');
        this.popTitle.classList.add('popup__title');
        document.body.style.overflow = 'hidden';
    }

    setInfo(){
        this.popTitle.innerHTML = this.info.name;
        this.popDesc.innerHTML = this.info.fullDescription;
        this.popPrice.innerHTML = `${this.info.price}rub`;
    }

    setElements(){
        this.templateInner.append(this.popTitle, this.popDesc, this.popPrice);
        this.popup.append(this.templateInner);
    }

    setEvent() {
        this.popup.addEventListener("click", (event: any) => {
            console.log("Work Pop");
            
            if(event.target.className === 'popup') {
                this.destroy();
                document.body.style.overflow = 'visible';
            }
        })
    }

    public destroy() {        
        this.popup.remove();
    }

    public render() {
        document.body.append(this.popup);
    }

}