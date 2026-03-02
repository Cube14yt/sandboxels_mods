/// <reference path="../library_types/nousersthings.d.ts"/>
(() => {
    function addCss() {
        const CSS = `
#promptTextarea {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.4;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 10px;
  border: none;
  resize: none;
  width: 100%;
  overflow: auto;
  tab-size: 2; /* makes tabs look like 2 spaces */
  white-space: pre; /* keeps formatting */
  border: 2px solid white;
}
    `
        const style_div = document.createElement("style")
        style_div.innerHTML = CSS

        document.head.appendChild(style_div)
    }
    dependOn("nousersthings.js", () => {
        addCss()
        elements.run_some_code.onSelect = () => {
            promptState = {
                type: "confirm",
                title: "Enter code to run",
                text: "You can write multiple lines below:",
                html: "<textarea id='promptTextarea' rows='5' spellcheck='false'></textarea>",
                handler: () => {
                    /** @type {HTMLTextAreaElement} */
                    const textarea = /** @type {any} */ (document.getElementById("promptTextarea"));
                    if (textarea) {
                        eval(textarea.value)
                    }
                }
            };

            showPromptScreen();
            const textarea = /** @type {any} */ (document.getElementById("promptTextarea"));
            textarea.addEventListener('keydown', (e) => {
                if (e.key === "Enter") {
                    e.stopPropagation();
                    e.preventDefault();
                    textarea.value += "\n"
                }
            })
        }
    }, true)
})()
