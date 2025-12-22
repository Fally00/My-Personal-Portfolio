document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '🌑' : '☀️';
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all sections for animation
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Project viewer modal
  const viewer = document.getElementById('projectViewer');
  const viewerImgContainer = document.getElementById('viewerImgContainer');
  const viewerTitle = document.getElementById('viewerTitle');
  const viewerDesc = document.getElementById('viewerDesc');
  const viewerGithub = document.getElementById('viewerGithub');
  const viewerClose = document.getElementById('viewerClose');

  function openViewer(card) {
    const title = card.querySelector('h3')?.textContent || 'Project';
    const desc = card.querySelector('p')?.textContent || '';
    const imgElement = card.querySelector('.project-image');
    const imgSrc = imgElement ? imgElement.src : (card.dataset.image || '');
    const githubUrl = card.dataset.github || '#';

    viewerImgContainer.innerHTML = imgSrc ?
      `<img src="${imgSrc}" alt="${title} screenshot" loading="lazy">` :
      '<div style="padding:2rem;color:var(--text-muted);text-align:center;">No image available</div>';

    viewerTitle.textContent = title;
    viewerDesc.textContent = desc;
    viewerGithub.href = githubUrl;

    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    viewerClose.focus();
  }

  function closeViewer() {
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scroll
    viewerImgContainer.innerHTML = '';
  }

  // Open viewer on project card click
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openViewer(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openViewer(card);
      }
    });
  });

  // Close viewer events
  viewerClose && viewerClose.addEventListener('click', closeViewer);
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer || e.target.classList.contains('viewer-overlay')) {
      closeViewer();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && viewer.classList.contains('open')) {
      closeViewer();
    }
  });

  // Contact form enhancements
  const contactForm = document.getElementById('contactForm');
  const msgTextarea = document.getElementById('c_message');
  const msgCount = document.getElementById('msgCount');

  // Character counter for message
  if (msgTextarea && msgCount) {
    msgTextarea.addEventListener('input', () => {
      const count = msgTextarea.value.length;
      msgCount.textContent = count;
      msgCount.style.color = count > 900 ? '#ef4444' : 'var(--text-muted)';
      if (count > 1000) {
        msgTextarea.value = msgTextarea.value.slice(0, 1000);
        msgCount.textContent = 1000;
      }
    });
  }

  // Form validation and submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('c_name').value.trim();
      const email = document.getElementById('c_email').value.trim();
      const message = document.getElementById('c_message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        document.getElementById('c_email').focus();
        return;
      }

      if (message.length < 10) {
        alert('Please write a longer message (at least 10 characters).');
        document.getElementById('c_message').focus();
        return;
      }


      // For now, just showing  a success message
      alert('Thank you for your message! I\'ll get back to you soon.');

      // Reset form
      contactForm.reset();
      msgCount.textContent = '0';
    });
  }

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });

  // Add CSS for scroll animations
  const style = document.createElement('style');
  style.textContent = `
    .section {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .section.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    .navbar.scrolled {
      background: rgba(var(--bg-glass), 0.95);
      backdrop-filter: blur(20px);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 768px) {
      .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
    }
  `;
  document.head.appendChild(style);
});
