class CustomNavbar extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '';
        const activePage = this.getAttribute('active-page') || 'home';

        const homePath = basePath + 'index.html';
        const contributingPath = basePath + 'pages/contributing/index.html';
        const presencePath = basePath + 'pages/presence/index.html';

        this.innerHTML = `
            <nav class="glass-nav fade-in-up mt-5">
                <div class="nav-container relative flex items-center justify-between">
                    <a href="${homePath}" class="logo">
                        <div class="logo-dot"></div>
                        NaufalRizqullah
                    </a>
                    
                    <!-- Desktop Links -->
                    <div class="nav-links hidden md:flex">
                        <a href="${homePath}" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                        <a href="${contributingPath}" class="nav-link ${activePage === 'contributing' ? 'active' : ''}">Contributing</a>
                    </div>

                    <!-- Mobile Hamburger Button -->
                    <button id="mobileMenuBtn" class="md:hidden text-gray-300 hover:text-white focus:outline-none p-2 -mr-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    
                    <!-- Mobile Menu Dropdown -->
                    <div id="mobileMenu" class="hidden absolute top-full right-0 mt-4 w-48 bg-[#12121a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-col gap-3 shadow-2xl md:hidden z-50">
                        <a href="${homePath}" class="nav-link block w-full ${activePage === 'home' ? 'active' : ''}">Home</a>
                        <a href="${contributingPath}" class="nav-link block w-full ${activePage === 'contributing' ? 'active' : ''}">Contributing</a>
                    </div>
                </div>
            </nav>
        `;

        // Attach event listener for mobile menu
        const btn = this.querySelector('#mobileMenuBtn');
        const menu = this.querySelector('#mobileMenu');
        
        if (btn && menu) {
            btn.addEventListener('click', () => {
                if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    menu.classList.add('flex');
                } else {
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                }
            });
        }
    }
}

customElements.define('custom-navbar', CustomNavbar);
