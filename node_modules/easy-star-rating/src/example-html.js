class ExampleHtml extends HTMLElement {
  // Shout out! https://gist.github.com/fernandosavio/5349619
  encode(str) {
    let div = document.createElement("div")
    div[("textContent" in div) ? "textContent" : "innerText"] = str


    return div.innerHTML.replace(/=""/g, '')
  }

  connectedCallback() {
    let codez = this.getAttribute('html')
    let example = this.encode(codez)

    this.innerHTML = `
<dt><code><pre>${example}</pre></code></dt>
<dd>
${codez}
</dd>
`
  }

}