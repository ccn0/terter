function init() {
    const el = document.createElement("input")
    el.setAttribute("type", "checkbox")
    document.body.appendChild(el)
    el.addEventListener("click", (event) => {
        console.log(event.target.checked)
    })
}

init()
