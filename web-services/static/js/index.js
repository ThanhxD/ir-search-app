console.log('bullshit');

window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        const scrollTop = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
        const head = document.querySelector('.fixed-header');

        if (screenTop && scrollTop > 250) {
            head.classList.add('fixed-small');
        } else {
            head.classList.remove('fixed-small');
        }
    })
});