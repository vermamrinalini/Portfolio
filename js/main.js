/* ===================================
   MAIN JAVASCRIPT
   Portfolio Site - Mrinalini Verma
   =================================== */

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ===================================
// MOBILE NAVIGATION TOGGLE
// ===================================
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// SCROLL ANIMATIONS (Intersection Observer)
// ===================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation based on index in current batch
            const delay = index * 0.05;
            entry.target.style.animationDelay = `${delay}s`;
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .glass-card, .timeline-item, .skill-category').forEach((el) => {
    scrollObserver.observe(el);
});

// ===================================
// ACTIVE NAVIGATION HIGHLIGHT
// ===================================
const sections = document.querySelectorAll('section[id]');

const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNavOnScroll);

// ===================================
// FORM SUBMISSION HANDLING
// ===================================
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    const formData = new FormData(contactForm);
    const formAction = contactForm.getAttribute('action');

    // Show loading state
    submitBtn.innerHTML = `
        <svg class="spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;

    // Check if using placeholder ID (Fallback to mailto)
    if (formAction.includes('YOUR_FORMSPREE_ID')) {
        const name = formData.get('name');
        const message = formData.get('message');
        const mailtoLink = `mailto:mrinalinivverma@gmail.com?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message)}`;

        setTimeout(() => {
            window.location.href = mailtoLink;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert("This form is not yet connected to a backend service. Opening your default email client instead.");
        }, 1000);
        return;
    }

    // If configured, try to submit via AJAX to Formspree
    try {
        const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Sent!
            `;
            contactForm.reset();
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.innerHTML = "Error!";
        alert("There was a problem sending your message. Please try again or email directly.");
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
});

// ===================================
// SKILL TAG HOVER EFFECTS
// ===================================
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// TYPING ANIMATION FOR HERO (Optional)
// ===================================
const typingText = document.querySelector('.hero-tagline');
const originalText = typingText?.textContent;

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment to enable typing animation
// if (typingText && originalText) {
//     setTimeout(() => typeWriter(typingText, originalText), 1000);
// }

// ===================================
// PARALLAX EFFECT FOR GRADIENT ORBS
// ===================================
const orbs = document.querySelectorAll('.gradient-orb');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 30;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;

        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===================================
// LOADING STATE
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    document.querySelector('.hero-content')?.classList.add('animate-fade-in');
});

// ===================================
// CONSOLE EASTER EGG
// ===================================
console.log(`
%c👋 Hello, fellow developer!
%cLooking at the code? Nice!
Feel free to connect with me on LinkedIn.

GitHub: github.com/vermamrinalini
LinkedIn: linkedin.com/in/mrinalinivverma
`,
    'color: #0078D4; font-size: 16px; font-weight: bold;',
    'color: #50E6FF; font-size: 12px;'
);
