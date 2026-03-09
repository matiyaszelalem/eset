import gsap from 'gsap';
import { supabase } from './src/lib/supabase.js';

export function initPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    const filters = document.querySelectorAll('.filter-btn');
    const preview = document.getElementById('hover-preview');
    const previewImg = document.getElementById('hover-preview-img');

    if (!grid) return;

    // Render Projects from Supabase
    async function loadProjects() {
        try {
            const { data: projects, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (projects && projects.length > 0) {
                renderProjects(projects);
                setupFilters(projects);
                setupHoverEffect();
            } else {
                // Fallback to JSON if DB is empty or during migration
                const module = await import('./src/projects.json');
                const fallbackProjects = module.default;
                renderProjects(fallbackProjects);
                setupFilters(fallbackProjects);
                setupHoverEffect();
            }
        } catch (err) {
            console.error('Error loading projects:', err);
            // Fallback to JSON on error
            const module = await import('./src/projects.json');
            renderProjects(module.default);
            setupFilters(module.default);
            setupHoverEffect();
        }
    }

    loadProjects();

    function renderProjects(projects) {
        grid.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = `portfolio-item group bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:border-accent/50 transition-colors relative cursor-default overflow-hidden shadow-sm`;
            card.dataset.category = project.category;
            card.dataset.image = project.heroImage;

            card.innerHTML = `
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <span class="text-accent text-xs font-bold uppercase tracking-widest">${project.subtitle}</span>
          </div>
          <h3 class="text-3xl font-heading font-bold mb-8 project-title text-slate-950">${project.title}</h3>
          
          <div class="space-y-6">
            <div>
              <h4 class="text-slate-500 text-sm font-semibold uppercase mb-2">The Challenge</h4>
              <p class="text-slate-600 text-sm">${project.challenge}</p>
            </div>
            <div>
              <h4 class="text-slate-500 text-sm font-semibold uppercase mb-2">The Solution</h4>
              <p class="text-slate-600 text-sm">${project.solution}</p>
            </div>
            <div>
              <h4 class="text-slate-500 text-sm font-semibold uppercase mb-2">Services</h4>
              <p class="text-slate-400 text-sm italic">${project.services ? project.services.join(', ') : ''}</p>
            </div>
          </div>
          
          <div class="mt-8 pt-8 border-t border-slate-200">
            <span class="block text-xl md:text-2xl font-heading font-bold text-slate-900 group-hover:text-accent transition-colors">${project.stats ? project.stats[0] : project.result}</span>
          </div>
        </div>
      `;

            grid.appendChild(card);
        });

        // Initial reveal animation
        gsap.fromTo('.portfolio-item',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '#portfolio' } }
        );
    }

    function setupFilters(projects) {
        filters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // UI Active State update
                filters.forEach(f => {
                    f.classList.remove('bg-white', 'text-slate-950', 'border-slate-200', 'shadow-sm');
                    f.classList.add('border-slate-100', 'text-slate-500');
                });
                e.target.classList.remove('border-slate-100', 'text-slate-500');
                e.target.classList.add('bg-white', 'text-slate-950', 'border-slate-200', 'shadow-sm');

                const filterValue = e.target.dataset.filter;
                const items = document.querySelectorAll('.portfolio-item');

                // GSAP Filtering Animation
                items.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                        gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
                    } else {
                        gsap.to(item, {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.3,
                            ease: 'power2.inOut',
                            onComplete: () => { item.style.display = 'none'; }
                        });
                    }
                });

                // ScrollTrigger.refresh() might be needed if layout changes push content down
                setTimeout(() => ScrollTrigger.refresh(), 400);
            });
        });
    }

    function setupHoverEffect() {
        grid.addEventListener('mousemove', (e) => {
            const item = e.target.closest('.portfolio-item');
            if (item) {
                const imageUrl = item.dataset.image;
                if (imageUrl !== previewImg.src && imageUrl) {
                    previewImg.src = imageUrl;
                }

                // Move Preview to Cursor
                gsap.to(preview, {
                    x: e.clientX + 20,
                    y: e.clientY + 20,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });

        grid.addEventListener('mouseover', (e) => {
            const item = e.target.closest('.portfolio-item');
            if (item) {
                preview.classList.remove('hidden');
                gsap.to(preview, { opacity: 1, scale: 1, duration: 0.3 });
            }
        });

        grid.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget?.closest('.portfolio-item')) {
                gsap.to(preview, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3,
                    onComplete: () => preview.classList.add('hidden')
                });
            }
        });
    }
}
