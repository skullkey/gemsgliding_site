// Load hero image from JSON
async function loadHero() {
    try {
        const response = await fetch('hero.json?v=' + Date.now());
        const data = await response.json();
        const heroSection = document.getElementById('hero');
        
        if (data.image && heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${data.image}')`;
        }
        
        if (data.title) {
            const titleElement = document.querySelector('.hero-content h1');
            if (titleElement) titleElement.textContent = data.title;
        }
        
        if (data.subtitle) {
            const subtitleElement = document.querySelector('.hero-content p');
            if (subtitleElement) subtitleElement.textContent = data.subtitle;
        }
    } catch (error) {
        console.error('Error loading hero:', error);
    }
}

// Modal section handlers
function openModal(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Push state to history so back button works
        history.pushState({ modalOpen: sectionId }, '', `#${sectionId}`);
    }
}

function closeModal(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-section.active').forEach(section => {
        section.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Navigation link handlers for modal sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        openModal(targetId);
    });
});

// Close button handlers
document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', function() {
        const section = this.closest('.modal-section');
        if (section) {
            section.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Go back in history to remove hash
            if (window.location.hash) {
                history.back();
            }
        }
    });
});

// Close modal when clicking outside content
document.querySelectorAll('.modal-section').forEach(section => {
    section.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Go back in history to remove hash
            if (window.location.hash) {
                history.back();
            }
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hasActiveModal = document.querySelector('.modal-section.active');
        if (hasActiveModal) {
            closeAllModals();
            // Go back in history to remove hash
            if (window.location.hash) {
                history.back();
            }
        }
    }
});

// Handle browser back/forward button
window.addEventListener('popstate', function(e) {
    closeAllModals();
    // If there's a hash in the URL after going back, open that modal
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section && section.classList.contains('modal-section')) {
            section.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
});

// Load gallery from JSON
async function loadGallery() {
    try {
        const response = await fetch('gallery.json?v=' + Date.now());
        const data = await response.json();
        const galleryGrid = document.getElementById('gallery-grid');
        
        data.items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            if (item.type === 'image') {
                galleryItem.innerHTML = `
                    <img src="${item.src}" alt="${item.caption || ''}" loading="lazy">
                `;
                galleryItem.addEventListener('click', () => openLightbox(item.src, item.caption));
            } else if (item.type === 'video') {
                galleryItem.classList.add('video');
                const videoId = extractYouTubeID(item.src);
                galleryItem.innerHTML = `
                    <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="${item.caption || ''}" loading="lazy">
                `;
                galleryItem.addEventListener('click', () => openVideoModal(item.src, item.caption));
            }
            
            galleryGrid.appendChild(galleryItem);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        document.getElementById('gallery-grid').innerHTML = '<p>Gallery content coming soon...</p>';
    }
}

// Extract YouTube video ID from URL
function extractYouTubeID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Lightbox for images
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    lightbox.style.display = 'block';
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

// Close lightbox
document.querySelector('.close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ESC key to close lightbox
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Video modal for YouTube embeds
function openVideoModal(videoUrl, caption) {
    const videoId = extractYouTubeID(videoUrl);
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    // Replace img with iframe for video
    const videoEmbed = document.createElement('div');
    videoEmbed.className = 'video-container';
    videoEmbed.style.maxWidth = '90%';
    videoEmbed.style.margin = 'auto';
    videoEmbed.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    lightboxContent.style.display = 'none';
    lightbox.insertBefore(videoEmbed, lightboxCaption);
    lightbox.style.display = 'block';
    lightboxCaption.textContent = caption || '';
    document.body.style.overflow = 'hidden';
    
    // Clean up when closing
    const closeBtn = document.querySelector('.close');
    const originalClose = closeBtn.onclick;
    closeBtn.onclick = function() {
        videoEmbed.remove();
        lightboxContent.style.display = 'block';
        closeLightbox();
        closeBtn.onclick = originalClose;
    };
}

// Contact form submission (placeholder)
document.querySelector('.contact-form form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Load gallery on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHero();
    loadGallery();
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Hero section should be visible immediately
document.querySelector('#hero').style.opacity = '1';
document.querySelector('#hero').style.transform = 'translateY(0)';
