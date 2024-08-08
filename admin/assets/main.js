btnModules = document.querySelectorAll(".card__item");
btnModules.forEach(btnModule => {
    btnModule.addEventListener("click", () => {
        locationModule(btnModule)
    })
});
console.log(idUser)
function locationModule(btnModule) {
    let module = btnModule.getAttribute("id");
    console.log(module);
    switch (module) {
        case "m-user":
            window.location.href = "/admin/modules/users/view/user.html";
            updateUser = true;
            break;
        case "m-users":
            window.location.href = "/admin/modules/users/view/user.html";
            break;
        case "m-drinks":
            window.location.href = "/admin/modules/drinks/view/drink.html";
            break;
        case "m-foods":
            window.location.href = "/admin/modules/foods/view/food.html";
            break;
        case "m-combos":
            window.location.href = "/admin/modules/combos/view/combos2.html";
            break;
        case "m-branchs":
            window.location.href = "/admin/modules/branch-offices/view/branch-office.html";
            break;
    }
}