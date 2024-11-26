let input
const darkThemeId = "darkTheme"

let darkTheme = Cookies.get("darkTheme") == "true" ? true : false
setDarkTheme(darkTheme)

function setDarkTheme(isEnabled) {
    if (isEnabled) {
        if (!document.getElementById(darkThemeId)) {
            var head  = document.getElementsByTagName('head')[0];
            var link  = document.createElement('link');
            link.id   = darkThemeId;
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            link.href = './themes/dark.css';
            link.media = 'all';
            head.appendChild(link);
        }
    } else {
        if (document.getElementById(darkThemeId)) {
            document.getElementsByTagName('head')[0].removeChild(document.getElementById(darkThemeId));
        }
    }
    Cookies.set("darkTheme", isEnabled ? "true" : "false", {
        expires: 1826
    });
}

window.onload = () => {
    const themeDiv = document.createElement("div");
    themeDiv.setAttribute("class", "theme-chooser");

    const text = document.createElement("span");
    text.textContent = "dark theme";
    text.setAttribute("class", "text");
    themeDiv.appendChild(text);

    const toggle = document.createElement("label");
    toggle.setAttribute("class", "switch");
    themeDiv.appendChild(toggle);

    input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = darkTheme
    input.addEventListener("input", () => {
        setDarkTheme(input.checked)
    })
    toggle.appendChild(input);
    const span = document.createElement("span");
    span.setAttribute("class", "slider round");
    toggle.appendChild(span);

    document.body.appendChild(themeDiv);
}