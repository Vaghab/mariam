
class Card {
    main: HTMLElement = document.createElement('div');
    cardFoto: HTMLElement = document.createElement('div');
    cardImg: HTMLImageElement = document.createElement('img');
    cardInfo: HTMLElement = document.createElement('div');
    cardTitle: HTMLElement = document.createElement('h2');
    cardText: HTMLElement = document.createElement('p');
    cardPrice: HTMLElement = document.createElement('span');
    button: HTMLButtonElement = document.createElement('button');
    button2: HTMLButtonElement | null;

    info: IService;
    
        constructor (arg: IService, category: string){
            this.info = arg;          
    
            this.setSelector();
            this.setInfo();
            this.setElements();
            this.setEvent();
        }

        setSelector() {
            this.main.classList.add('card');
            this.cardFoto.classList.add('card__foto');
            this.cardImg.classList.add('card__foto-img');
            this.cardInfo.classList.add('card__info');
            this.cardTitle.classList.add('card__title');
            this.cardText.classList.add('card__text');
            this.cardPrice.classList.add('card__price');
            this.button.classList.add('card__button');
        }
    
        setElements(){
            this.cardFoto.append(this.cardImg);
            this.cardInfo.append(this.cardTitle, this.cardText, this.cardPrice, this.button);
            if(this.info.img) this.main.append(this.cardFoto);
            this.main.append(this.cardInfo);
        }
    
        setInfo(){
            if(this.info.img) this.cardImg.src = this.info.img;
            this.cardTitle.innerHTML = this.info.name;
            this.cardText.innerHTML = this.info.description;
            this.cardPrice.innerHTML = `${this.info.price}rub`;
            this.button.innerHTML = "Узнать больше";
        }

        setEvent(){
            this.main.addEventListener('click', (event: any) => {
                console.log("work");
                
                new PopUp(this.info);
            })
        }
    
        getMain(){
            return this.main;
        }
    }