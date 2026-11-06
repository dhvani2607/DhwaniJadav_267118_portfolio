/**
 * Dhwani Jadav - Personal Portfolio JavaScript
 * Handles interactive features, animations, navigation, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Navbar & Scroll Styling
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Toggle navbar glass styling
    if (scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Toggle Back to Top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click handler
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    const isOpen = navMenu?.classList.toggle('open');
    navToggle?.classList.toggle('open');
    navToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking on any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Smooth Scrolling with Offset for Anchor Links
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Active Navigation Link on Scroll (ScrollSpy)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const matchingNavLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        matchingNavLink?.classList.add('active');
      } else {
        matchingNavLink?.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  highlightNavOnScroll();

  // --------------------------------------------------------------------------
  // 6. Interactive Hero Background Canvas (Cyber Particle Grid)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];
    const particleCount = 45;
    const maxDistance = 140;

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    const resizeCanvas = () => {
      const hero = document.getElementById('home');
      width = canvas.width = hero ? hero.clientWidth : window.innerWidth;
      height = canvas.height = hero ? hero.clientHeight : window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, ' : 'rgba(56, 189, 248, ';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from canvas edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction (gentle attraction / hover push)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= forceDirectionX * force * 1.5;
            this.y -= forceDirectionY * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '0.7)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = width < 768 ? 25 : particleCount;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    // Track mouse for canvas interactivity
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      resizeCanvas();
      animateParticles();
    }
  }

  // --------------------------------------------------------------------------
  // 7. 3D Tilt Effect on Terminal Visual Card
  // --------------------------------------------------------------------------
  const tiltCard = document.querySelector('.tech-terminal-card');
  if (tiltCard && window.innerWidth > 992) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  // --------------------------------------------------------------------------
  // 8. Contact Form Frontend Validation & Feedback
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const feedbackBanner = document.getElementById('form-feedback');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Email validation regex (standard pattern)
    const isValidEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };

    // Helper to validate single field
    const validateField = (input, isValid, errorMsg) => {
      const errorElement = input.nextElementSibling;
      if (!isValid) {
        input.classList.add('invalid');
        if (errorElement && errorElement.classList.contains('form-error-msg')) {
          errorElement.textContent = errorMsg;
        }
        return false;
      } else {
        input.classList.remove('invalid');
        return true;
      }
    };

    // Real-time input validation on blur / input
    nameInput?.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        nameInput.classList.remove('invalid');
      }
    });

    emailInput?.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) {
        emailInput.classList.remove('invalid');
      }
    });

    subjectInput?.addEventListener('input', () => {
      if (subjectInput.value.trim().length >= 3) {
        subjectInput.classList.remove('invalid');
      }
    });

    messageInput?.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        messageInput.classList.remove('invalid');
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput?.value.trim() || '';
      const emailVal = emailInput?.value.trim() || '';
      const subjectVal = subjectInput?.value.trim() || '';
      const messageVal = messageInput?.value.trim() || '';

      const isNameValid = validateField(nameInput, nameVal.length >= 2, 'Please enter your name (at least 2 characters).');
      const isEmailValid = validateField(emailInput, isValidEmail(emailVal), 'Please enter a valid email address.');
      const isSubjectValid = validateField(subjectInput, subjectVal.length >= 3, 'Please enter a subject (at least 3 characters).');
      const isMessageValid = validateField(messageInput, messageVal.length >= 10, 'Please write a message (at least 10 characters).');

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Success: Show honest feedback banner
        if (feedbackBanner) {
          feedbackBanner.className = 'form-feedback-banner success';
          feedbackBanner.innerHTML = `
            <strong>✓ Message details validated successfully!</strong>
            <span>Thank you, <b>${escapeHtml(nameVal)}</b>. Your message inputs passed all frontend validation rules.</span>
            <small>💡 <i>Notice: This portfolio is running client-side. To deliver actual emails to your inbox, connect this form to an email delivery service such as EmailJS, Formspree, or a custom backend endpoint.</i></small>
          `;
          feedbackBanner.style.display = 'flex';
          feedbackBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form inputs
        contactForm.reset();

        // Optional auto-clear after 12 seconds
        setTimeout(() => {
          if (feedbackBanner) {
            feedbackBanner.style.display = 'none';
          }
        }, 12000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Add New Project Modal & Dynamic Card Creation
  // --------------------------------------------------------------------------
  const openModalBtn = document.getElementById('open-add-project-modal');
  const projectModal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const addProjectForm = document.getElementById('add-project-form');
  const projectsGrid = document.querySelector('.projects-grid');

  const titleInput = document.getElementById('project-modal-title');
  const categoryInput = document.getElementById('project-modal-category');
  const descInput = document.getElementById('project-modal-desc');
  const techInput = document.getElementById('project-modal-tech');
  const repoInput = document.getElementById('project-modal-repo');
  const liveInput = document.getElementById('project-modal-live');

  // Open modal
  const openModal = () => {
    if (!projectModal) return;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    titleInput?.focus();
  };

  // Close modal
  const closeModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    addProjectForm?.reset();
    document.querySelectorAll('#add-project-form .form-control.invalid').forEach(el => el.classList.remove('invalid'));
  };

  openModalBtn?.addEventListener('click', openModal);
  openModalBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });

  closeModalBtn?.addEventListener('click', closeModal);
  cancelModalBtn?.addEventListener('click', closeModal);

  // Close on outside click
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('active')) {
      closeModal();
    }
  });

  // Storage Key
  const CUSTOM_PROJECTS_KEY = 'dhwani_custom_portfolio_projects';

  const loadCustomProjects = () => {
    try {
      const data = localStorage.getItem(CUSTOM_PROJECTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage unavailable for custom projects:', e);
      return [];
    }
  };

  const saveCustomProjects = (projects) => {
    try {
      localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed saving custom projects:', e);
    }
  };

  // Create Project Card Element
  const createProjectCardElement = (project, isNew = false) => {
    const article = document.createElement('article');
    article.className = `project-card ${isNew ? 'newly-added' : ''}`;
    article.setAttribute('data-custom-id', project.id);

    const tagsArray = project.technologies 
      ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : ['Web Tech'];

    const tagsHtml = tagsArray.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('');

    const repoLink = project.repoUrl || 'https://github.com/dhvani2607';
    const liveHtml = project.liveUrl 
      ? `<a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="Live Demo">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
             <polyline points="15 3 21 3 21 9"></polyline>
             <line x1="10" y1="14" x2="21" y2="3"></line>
           </svg>
           <span>Live Demo</span>
         </a>`
      : '';

    article.innerHTML = `
      <div>
        <div class="project-top">
          <div class="project-folder-icon" title="Project">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span class="project-type-badge">${escapeHtml(project.category || 'Custom Project')}</span>
        </div>

        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <p class="project-desc">${escapeHtml(project.description)}</p>

        <div class="project-tech-tags">
          ${tagsHtml}
        </div>
      </div>

      <div class="project-links">
        ${liveHtml}
        <a href="${escapeHtml(repoLink)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="Source Code">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>Source Code</span>
        </a>
        <button type="button" class="btn-delete-project" title="Delete custom project" style="margin-left: auto; background: none; border: none; color: #ef4444; opacity: 0.6; cursor: pointer; padding: 4px;" aria-label="Delete project">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    // Delete handler
    const deleteBtn = article.querySelector('.btn-delete-project');
    deleteBtn?.addEventListener('click', () => {
      if (confirm(`Remove custom project "${project.title}"?`)) {
        article.remove();
        const currentProjects = loadCustomProjects().filter(p => p.id !== project.id);
        saveCustomProjects(currentProjects);
      }
    });

    return article;
  };

  // Render stored custom projects on load
  const initialCustomProjects = loadCustomProjects();
  initialCustomProjects.forEach(project => {
    const card = createProjectCardElement(project, false);
    if (openModalBtn) {
      projectsGrid?.insertBefore(card, openModalBtn);
    }
  });

  // Handle Form Submit
  addProjectForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleVal = titleInput?.value.trim() || '';
    const descVal = descInput?.value.trim() || '';
    const catVal = categoryInput?.value || 'Custom Project';
    const techVal = techInput?.value.trim() || '';
    const repoVal = repoInput?.value.trim() || '';
    const liveVal = liveInput?.value.trim() || '';

    let isValid = true;

    if (titleVal.length < 2) {
      titleInput?.classList.add('invalid');
      isValid = false;
    } else {
      titleInput?.classList.remove('invalid');
    }

    if (descVal.length < 10) {
      descInput?.classList.add('invalid');
      isValid = false;
    } else {
      descInput?.classList.remove('invalid');
    }

    if (!isValid) return;

    const newProject = {
      id: Date.now(),
      title: titleVal,
      category: catVal,
      description: descVal,
      technologies: techVal,
      repoUrl: repoVal,
      liveUrl: liveVal
    };

    // Save
    const stored = loadCustomProjects();
    stored.push(newProject);
    saveCustomProjects(stored);

    // Insert to DOM
    const cardEl = createProjectCardElement(newProject, true);
    if (openModalBtn) {
      projectsGrid?.insertBefore(cardEl, openModalBtn);
    }

    closeModal();

    // Scroll to newly added card
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Clear modal errors on input
  titleInput?.addEventListener('input', () => {
    if (titleInput.value.trim().length >= 2) {
      titleInput.classList.remove('invalid');
    }
  });

  descInput?.addEventListener('input', () => {
    if (descInput.value.trim().length >= 10) {
      descInput.classList.remove('invalid');
    }
  });

  // Utility to prevent XSS in feedback rendering
  function escapeHtml(string) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return String(string).replace(/[&<>"'/]/g, (s) => entityMap[s]);
  }
});

