class CustomFooter extends HTMLElement {
  connectedCallback() {
    const currentYear = new Date().getFullYear();
    const marginTop = this.getAttribute('margin-top');
    const styleAttr = marginTop ? `style="margin-top: ${marginTop};"` : '';

    this.innerHTML = `
      <footer class="fade-in-up delay-3" ${styleAttr}>
        <p>© ${currentYear} Muhammad Naufal Rizqullah. AI Engineer & Open Source enthusiast.</p>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);
