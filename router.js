
class Router {

    static switch_elm(elmId, route) {
        const elm = document.getElementById(elmId);
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            elm.innerHTML = this.responseText;
        }

        xhttp.open("GET", route || 'levels.html', true);
        xhttp.send();
    }

}

