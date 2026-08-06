class CustomNavbar extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '';
        const activePage = this.getAttribute('active-page') || 'home';

        const homePath = basePath + 'index.html';
        const contributingPath = basePath + 'pages/contributing/index.html';
        const presencePath = basePath + 'pages/presence/index.html';

        this.innerHTML = `
            <nav class="glass-nav fade-in-up mt-5">
                <div class="nav-container relative" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    
                    <div style="display: flex; align-items: center;">
                        <!-- Mobile Hamburger Button -->
                        <button id="mobileMenuBtn" class="mobile-menu-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>

                        <a href="${homePath}" class="logo">
                            <div class="logo-dot"></div>
                            NaufalRizqullah
                        </a>
                    </div>
                    
                    <!-- Desktop Links -->
                    <div class="nav-links desktop-nav">
                        <a href="${homePath}" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                        <a href="${contributingPath}" class="nav-link ${activePage === 'contributing' ? 'active' : ''}">Contributing</a>
                    </div>

                    <!-- Mobile Menu Dropdown -->
                    <div id="mobileMenu" class="mobile-menu">
                        <a href="${homePath}" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                        <a href="${contributingPath}" class="nav-link ${activePage === 'contributing' ? 'active' : ''}">Contributing</a>
                    </div>
                </div>
            </nav>
        `;

        // Attach event listener for mobile menu
        const btn = this.querySelector('#mobileMenuBtn');
        const menu = this.querySelector('#mobileMenu');
        
        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        }
    }
}

customElements.define('custom-navbar', CustomNavbar);
