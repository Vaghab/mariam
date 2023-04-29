
class BlockService {
    service: HTMLElement = document.querySelector('.service__inner') as HTMLElement;
    services: IService[] = InfoService.getServices();

    constructor (){
        this.setCards();
    }

    setCards() {
        this.services.forEach((val: IService)=>{
            const card = new Card(val, "services");
            this.service.append(card.getMain());
        })
    }
}

new BlockService;