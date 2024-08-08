const btnMenu = document.querySelector(".ctr-m-nav-element");
const containerMenu = document.querySelector(".container-menu");
const iconBars = document.querySelector(".ctr-m-icon");
btnMenu.addEventListener("click", () => {
    if(btnMenu.classList.toggle("open-menu")) {
        containerMenu.style.top = "140px";
        iconBars.classList.remove("fa-bars");
        iconBars.classList.add("fa-xmark");
    } else {
        containerMenu.style.top = "-100%";
        iconBars.classList.add("fa-bars");
        iconBars.classList.remove("fa-xmark");
    }
});

window.addEventListener("resize", checkWindowSize);
checkWindowSize();

function checkWindowSize() {
    if (window.innerWidth <= 1024) {
    } else {
        btnMenu.classList.remove("open-menu");
        iconBars.classList.add("fa-bars");
        iconBars.classList.remove("fa-xmark");
        containerMenu.style.top = "-100%";
    }
}

