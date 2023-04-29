const nav: HTMLElement = document.querySelector('NAV') as HTMLElement;
const btnHamburger: HTMLElement = document.querySelector('.hamburger') as HTMLElement;
const btnLogo: HTMLElement = document.querySelector('.header__logo') as HTMLElement;

nav.addEventListener('click', (event: any) => {
    if(event.target.nodeName === "A"){
        console.dir(btnHamburger);
        btnHamburger.classList.remove('is-active');
        nav.classList.remove('is-active');
    }
    
})

btnLogo.addEventListener('click', (event: any) => {
        console.dir(btnHamburger);
        btnHamburger.classList.remove('is-active');
        nav.classList.remove('is-active');
    
})