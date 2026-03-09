import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // Initial setup for perspective to allow 3D transforms
    gsap.set('.split-heading', { perspective: 400 });

    // Cinematic Entrance & Hero Reveal Master Timeline
    const masterTl = gsap.timeline();

    // Check if entrance exists (it might not be on project.html)
    if (document.getElementById('entrance')) {
        // Prevent scrolling during entrance
        document.body.style.overflow = 'hidden';

        masterTl.to("#brand-name", { opacity: 1, scale: 1.05, duration: 2, ease: "power2.out" })
            .to("#entrance", {
                y: "-100%",
                duration: 1.5,
                ease: "expo.inOut",
                delay: 0.5,
                onComplete: () => {
                    document.body.style.overflow = '';
                    ScrollTrigger.refresh();
                }
            })
            .to(".hero-el", {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=0.5");
    } else {
        // Just fade in hero if no entrance is present
        gsap.to(".hero-el", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // GSAP SplitType reveals
    const headings = document.querySelectorAll('.split-heading');
    headings.forEach((heading) => {
        const split = new SplitType(heading, { types: 'chars, words' });

        gsap.from(split.chars, {
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.02,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
            }
        });
    });

    // Staggered Fade-Ins
    const fadeUps = gsap.utils.toArray('.fade-up');
    fadeUps.forEach((elem) => {
        gsap.from(elem, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
            }
        });
    });

    // GSAP Horizontal Scroll Setup for Services Section
    const horizontalSection = document.querySelector('.horizontal-scroll-container');
    if (horizontalSection) {
        const sections = gsap.utils.toArray('.horizontal-section');
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: '#services',
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => "+=" + horizontalSection.offsetWidth
            }
        });
    }

    // Magnetic Buttons Animation Setup
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // Mobile Menu Logic
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;

            // Animate toggle button
            const spans = menuToggle.querySelectorAll('span');
            if (isMenuOpen) {
                gsap.to(spans[0], { y: 6.5, rotation: 45, duration: 0.3 });
                gsap.to(spans[1], { opacity: 0, duration: 0.3 });
                gsap.to(spans[2], { y: -6.5, rotation: -45, duration: 0.3 });

                // Slide menu in
                gsap.to(mobileMenu, { x: 0, duration: 0.6, ease: "expo.out" });
                document.body.style.overflow = 'hidden';
            } else {
                gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3 });

                // Slide menu out
                gsap.to(mobileMenu, { x: "100%", duration: 0.6, ease: "expo.in" });
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                const spans = menuToggle.querySelectorAll('span');
                gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3 });
                gsap.to(mobileMenu, { x: "100%", duration: 0.6, ease: "expo.in" });
                document.body.style.overflow = '';
            });
        });
    }
}
