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





  	 const canvas = document.getElementById('neural-bg');
        const ctx = canvas.getContext('2d');
        let nodes = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Node {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#00ffff';
                ctx.fill();
            }
        }

        function init() {
            nodes = [];
            for (let i = 0; i < 100; i++) {
                nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        }

        function connectNodes() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach(node => { node.update(); node.draw(); });
            connectNodes();
            requestAnimationFrame(animate);
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });		function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            connectNodes();
            requestAnimationFrame(animate);
        }

        // Initialize and start animation
        init();
        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        // Mouse move effect
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

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
    const imgSrc = card.dataset.image || '';
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

      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
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
