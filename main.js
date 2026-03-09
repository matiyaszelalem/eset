import './style.css';
import { initCanvas, initDustCanvas } from './canvas.js';
import { initAnimations } from './animations.js';
import { initPortfolio } from './portfolio.js';
import { supabase } from './src/lib/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Background Canvas
    initCanvas();
    initDustCanvas();

    // Initialize GSAP and Lenis Animations
    // Wait slightly to ensure font loading doesn't disrupt SplitType calculations
    if (document.fonts) {
        document.fonts.ready.then(() => {
            initAnimations();
            initPortfolio();
        });
    } else {
        setTimeout(() => {
            initAnimations();
            initPortfolio();
        }, 200);
    }

    // Contact Form Integration
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;

            // Loading State
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            const formData = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                budget: contactForm.querySelector('select').value,
                message: contactForm.querySelector('textarea').value,
            };

            try {
                const { error } = await supabase
                    .from('contacts')
                    .insert([formData]);

                if (error) throw error;

                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } catch (err) {
                console.error('Error submitting form:', err);
                alert('Oops! Something went wrong. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});
