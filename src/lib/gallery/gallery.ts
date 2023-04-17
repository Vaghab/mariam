const GalleryClassName = "gallery"
  , GalleryDraggableClassName = "gallery-draggable"
  , GalleryLineClassName = "gallery-line"
  , GalleryLineContainerClassName = "gallery-line-container"
  , GallerySlideClassName = "gallery-slide"
  , GalleryDotsClassName = "gallery-dots"
  , GalleryDotClassName = "gallery-dot"
  , GalleryDotActiveClassName = "gallery-dot-active"
  , GalleryNavClassName = "gallery-nav"
  , GalleryNavLeftClassName = "gallery-nav-left"
  , GalleryNavRightClassName = "gallery-nav-right"
  , GalleryNavDisabledClassName = "gallery-nav-disabled";
  

interface IOptions {
    padding?: number;
    dots?: boolean;
    arrows?: boolean;
    amountVisibles?: number;
}

interface ISettings {
    padding: number;
    dots: boolean;
    arrows: boolean;
    amountVisibles: number;
}

class Gallery {

    containerNode: HTMLElement;
    amountOfSlides: number;
    currentSlide: number;
    currentSlideWasChanged: boolean;
    settings: ISettings;

    lineContainerNode: HTMLElement;
    lineNode: HTMLElement;
    dotNodes: NodeListOf<HTMLElement>;
    slideNodes: HTMLElement[];
    dotsNode: HTMLElement;
    navLeft: HTMLElement;
    navRight: HTMLElement;

    width: number;
    slideWidth: number;
    maximumX: number; 
    x: number;
    clickX: number;
    startX: number;
    dragX: number;
    dotNumber: number;

    debouncedResizeGallery: EventListenerOrEventListenerObject;
    
    constructor(elem, options: IOptions = {}) {
        this.containerNode = elem;
        this.amountOfSlides = elem.childElementCount;
        this.currentSlide = 0;
        this.currentSlideWasChanged = false;
        this.settings = {
            padding: options.padding || 0,
            dots: options.dots || false,
            arrows: options.arrows || false,
            amountVisibles: options.amountVisibles || 1
        };
        this.manageHTML = this.manageHTML.bind(this);
        this.setParameters = this.setParameters.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.resizeGallery = this.resizeGallery.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setStylePosition = this.setStylePosition.bind(this);
        this.clickDots = this.clickDots.bind(this);
        this.moveToLeft = this.moveToLeft.bind(this);
        this.moveToRight = this.moveToRight.bind(this);
        this.changeCurrentSlide = this.changeCurrentSlide.bind(this);
        this.changeActiveDotClass = this.changeActiveDotClass.bind(this);
        this.changeDisabledNav = this.changeDisabledNav.bind(this);
        this.manageHTML();
        this.setParameters();
        this.setEvents();
    }
    manageHTML() {
        this.containerNode.classList.add(GalleryClassName);
        this.containerNode.innerHTML = `
            <div class="${GalleryLineContainerClassName}">
                <div class="${GalleryLineClassName}">
                    ${this.containerNode.innerHTML}
                </div>
            </div>
            ${this.settings.arrows ?
                `<div class="${GalleryNavClassName}">
                    <button class="${GalleryNavLeftClassName}">Left</button>
                    <button class="${GalleryNavRightClassName}">Right</button>
                </div>`
                : ''
            }
            ${this.settings.dots ?
                `<div class="${GalleryDotsClassName}"></div>` : ''
            }
        `;
        this.lineContainerNode = this.containerNode.querySelector(`.${GalleryLineContainerClassName}`) as HTMLElement;
        this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`) as HTMLElement;
        this.slideNodes = Array.from(this.lineNode.children).map( elem => wrapElementByDiv({
            element: elem,
            className: GallerySlideClassName
        }));
        if(this.settings.dots) {
            this.dotsNode = this.containerNode.querySelector(`.${GalleryDotsClassName}`) as HTMLElement,
            this.dotsNode.innerHTML = Array.from(Array(this.amountOfSlides).keys()).map( i =>`<button class="${GalleryDotClassName} ${i === this.currentSlide ? GalleryDotActiveClassName : ""}"></button>`).join(""),
            this.dotNodes = this.dotsNode.querySelectorAll(`.${GalleryDotClassName}`) as NodeListOf<HTMLElement>;
        }
        if(this.settings.arrows) {
            this.navLeft = this.containerNode.querySelector(`.${GalleryNavLeftClassName}`) as HTMLElement;
            this.navRight = this.containerNode.querySelector(`.${GalleryNavRightClassName}`)as HTMLElement;
        }
    }
    setParameters() {
        const elemSettings: DOMRect = this.lineContainerNode.getBoundingClientRect();        
        this.width = elemSettings.width;
        this.slideWidth = this.width / this.settings.amountVisibles;
        this.maximumX = -(this.amountOfSlides - 1) * this.width;
        this.x = -this.currentSlide * this.slideWidth;
        this.resetStyleTransition();
        this.lineNode.style.width = `${this.amountOfSlides * this.width}px`;
        this.setStylePosition();
        if(this.settings.dots) this.changeActiveDotClass();
        if(this.settings.arrows) this.changeDisabledNav();
        Array.from(this.slideNodes).forEach( elem => {
            elem.style.width = `${this.slideWidth}px`
            elem.style.paddingLeft = `${this.settings.padding}px`
            elem.style.paddingRight = `${this.settings.padding}px`
        })
    }
    setEvents() {
        this.debouncedResizeGallery = debounce(this.resizeGallery);
        window.addEventListener("resize", this.debouncedResizeGallery);
        this.lineNode.addEventListener("pointerdown", this.startDrag);
        window.addEventListener("pointerup", this.stopDrag);
        window.addEventListener("pointercancel", this.stopDrag)
        if(this.settings.dots) this.dotsNode.addEventListener("click", this.clickDots);
        if(this.settings.arrows) {
            this.navLeft.addEventListener("click", this.moveToLeft);
            this.navRight.addEventListener("click", this.moveToRight);
        };
    }
    destroyEvents() {
        window.removeEventListener("resize", this.debouncedResizeGallery),
        this.lineNode.removeEventListener("pointerdown", this.startDrag),
        window.removeEventListener("pointerup", this.stopDrag),
        window.removeEventListener("pointercancel", this.stopDrag)
        if(this.settings.dots) this.dotsNode.removeEventListener("click", this.clickDots);
        if(this.settings.arrows) {
            this.navLeft.removeEventListener("click", this.moveToLeft);
            this.navRight.removeEventListener("click", this.moveToRight);
        };
    }
    resizeGallery() {
        this.setParameters()
    }
    startDrag(event) {
        this.currentSlideWasChanged = false,
        this.clickX = event.pageX,
        this.startX = this.x,
        this.resetStyleTransition(),
        this.containerNode.classList.add(GalleryDraggableClassName),
        window.addEventListener("pointermove", this.dragging)
    }
    stopDrag() {
        window.removeEventListener("pointermove", this.dragging),
        this.containerNode.classList.remove(GalleryDraggableClassName),
        this.changeCurrentSlide()
    }
    dragging(event) {
        this.dragX = event.pageX;
        const dragShift = this.dragX - this.clickX;
        const easing = dragShift / 10;
        this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);
        if(20 < dragShift
            && !this.currentSlideWasChanged
            && 0 < this.currentSlide
            ) {
            this.currentSlideWasChanged = true
            this.currentSlide = this.currentSlide - 1;
        }
        if(dragShift < -20 
            && !this.currentSlideWasChanged 
            && this.currentSlide < (this.amountOfSlides - this.settings.amountVisibles) 
            ) {
            this.currentSlideWasChanged = true,
            this.currentSlide = this.currentSlide + 1
        }
        this.setStylePosition();
    }
    clickDots(event) {
        const dotNode = event.target.closest("button");
        if(!dotNode) return; 
        for(let i = 0; i < this.dotNodes.length; i++) {
            if(this.dotNodes[i] === dotNode) {
                this.dotNumber = i;
                break
            }
        }
        if(this.dotNumber === this.currentSlide) return;
        const countSwipes = Math.abs(this.currentSlide - this.dotNumber);
        this.currentSlide = this.dotNumber;
        this.changeCurrentSlide(countSwipes);
    }
    moveToLeft() {
        if(this.currentSlide <= 0) return;
        this.currentSlide = this.currentSlide - 1;
        this.changeCurrentSlide();
    }
    moveToRight() {
        if(this.currentSlide > (this.amountOfSlides - this.settings.amountVisibles)) return;
        this.currentSlide = this.currentSlide + 1;
        this.changeCurrentSlide();
    }
    changeCurrentSlide(countSwipes?: number) {
        if(this.currentSlide > (this.amountOfSlides - this.settings.amountVisibles)) return;
        this.x = -this.currentSlide * (this.slideWidth);
        this.setStyleTransition(countSwipes);
        this.setStylePosition();
        this.changeActiveDotClass();
        this.changeDisabledNav();
    }
    changeActiveDotClass() {
        for(let i = 0; i < this.dotNodes.length; i++) {
            this.dotNodes[i]?.classList.remove(GalleryDotActiveClassName);
        };
        
        this.dotNodes[this.currentSlide]?.classList.add(GalleryDotActiveClassName);
    }
    changeDisabledNav() {
        this.currentSlide <= 0 ? this.navLeft.classList.add(GalleryNavDisabledClassName) : this.navLeft.classList.remove(GalleryNavDisabledClassName),
        this.currentSlide >= this.amountOfSlides - this.settings.amountVisibles ? this.navRight.classList.add(GalleryNavDisabledClassName) : this.navRight.classList.remove(GalleryNavDisabledClassName)
    }
    setStylePosition() {
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`
    }
    setStyleTransition(countSwipes: number = 1) {
        this.lineNode.style.transition = `all ${.25 * countSwipes}s ease 0s`
    }
    resetStyleTransition() {
        this.lineNode.style.transition = "all 0s ease 0s"
    }

    setRandomSlide(): void {
        setInterval(() => {
            this.currentSlide = Math.floor(Math.random() * (this.amountOfSlides - this.settings.amountVisibles));
            const countSwipes = Math.abs(this.currentSlide - this.dotNumber);
            this.changeCurrentSlide(countSwipes);
            this.changeActiveDotClass();
        }, 5000);
    }
      
}

function wrapElementByDiv({element, className}: {element: Element, className: string}) {
    const wrapperNode = document.createElement("div");
    wrapperNode.classList.add(className);

    element.parentNode?.insertBefore(wrapperNode, element);
    wrapperNode.appendChild(element);

    return wrapperNode;
}

function debounce(func, sec = 100) {
    let time;
    return function(event) {
        clearTimeout(time),
        time = setTimeout(func, sec, event)
    }
}