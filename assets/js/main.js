// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add custom hover effect for project cards
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set custom properties for a subtle hover glow effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add CSS for the subtle glow effect via JS dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .glass-card {
            position: relative;
            overflow: hidden;
        }
        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
                800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
                rgba(255, 255, 255, 0.06),
                transparent 40%
            );
            z-index: 0;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .glass-card:hover::before {
            opacity: 1;
        }
        .glass-card > * {
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
});
