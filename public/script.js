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
    // Check if lightbox is open
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'block') {
        closeLightbox();
        return;
    }
    
    // Handle modal sections
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

// Load gallery from JSON with pagination
let galleryData = [];
let currentPage = 1;
const itemsPerPage = 12;

async function loadGallery() {
    try {
        const response = await fetch('gallery.json?v=' + Date.now());
        const data = await response.json();
        
        // Sort items: dated items first (newest to oldest), then undated items (by filename)
        galleryData = data.items.sort((a, b) => {
            const hasDateA = !!a.date;
            const hasDateB = !!b.date;
            
            // Both have dates: sort by date descending (newest first)
            if (hasDateA && hasDateB) {
                return new Date(b.date) - new Date(a.date);
            }
            
            // Only A has date: A comes first
            if (hasDateA && !hasDateB) return -1;
            
            // Only B has date: B comes first
            if (!hasDateA && hasDateB) return 1;
            
            // Neither has date: sort by filename
            const filenameA = a.src.split('/').pop().toLowerCase();
            const filenameB = b.src.split('/').pop().toLowerCase();
            return filenameA.localeCompare(filenameB);
        });
        
        displayGalleryPage(1);
        setupPagination();
    } catch (error) {
        console.error('Error loading gallery:', error);
        document.getElementById('gallery-grid').innerHTML = '<p>Gallery content coming soon...</p>';
    }
}

function displayGalleryPage(page) {
    currentPage = page;
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = galleryData.slice(startIndex, endIndex);
    
    pageItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // Truncate caption for display (max 80 characters)
        const displayCaption = item.caption ? 
            (item.caption.length > 80 ? item.caption.substring(0, 80) + '...' : item.caption) : '';
        
        // Format date only if date exists
        const formattedDate = item.date ? formatGalleryDate(item.date) : '';
        
        if (item.type === 'image') {
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.caption || ''}" loading="lazy">
                ${formattedDate ? `<div class="gallery-date">${formattedDate}</div>` : ''}
                ${displayCaption ? `<div class="gallery-caption">${displayCaption}</div>` : ''}
            `;
            galleryItem.addEventListener('click', () => openLightbox(item.src, item.caption, item.date));
        } else if (item.type === 'video') {
            galleryItem.classList.add('video');
            const videoId = extractYouTubeID(item.src);
            // Use hqdefault.jpg which is available for all videos (SD and HD)
            galleryItem.innerHTML = `
                <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${item.caption || ''}" loading="lazy">
                ${formattedDate ? `<div class="gallery-date">${formattedDate}</div>` : ''}
                ${displayCaption ? `<div class="gallery-caption">${displayCaption}</div>` : ''}
            `;
            galleryItem.addEventListener('click', () => openVideoModal(item.src, item.caption, item.date));
        }
        
        galleryGrid.appendChild(galleryItem);
    });
    
    updatePaginationButtons();
}

function formatGalleryDate(dateString) {
    if (!dateString) return '';
    
    const itemDate = new Date(dateString);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    const options = { month: 'short', day: 'numeric' };
    
    // If older than a year, include the year
    if (itemDate < oneYearAgo) {
        options.year = 'numeric';
    }
    
    return itemDate.toLocaleDateString('en-US', options);
}

function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            displayGalleryPage(currentPage - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(galleryData.length / itemsPerPage);
        if (currentPage < totalPages) {
            displayGalleryPage(currentPage + 1);
        }
    });
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    const totalPages = Math.ceil(galleryData.length / itemsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : 'No items';
}

// Extract YouTube video ID from URL
function extractYouTubeID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Lightbox for images
function openLightbox(src, caption, date) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    lightbox.style.display = 'block';
    lightboxImg.src = src;
    
    // Format caption with date
    let captionText = '';
    if (date) {
        const fullDate = formatLightboxDate(date);
        captionText = fullDate;
        if (caption) {
            captionText += ' • ' + caption;
        }
    } else if (caption) {
        captionText = caption;
    }
    
    lightboxCaption.textContent = captionText;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Add to browser history so back button works
    history.pushState({ lightboxOpen: true }, '', window.location.href);
}

function formatLightboxDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Close lightbox
document.querySelector('.close')?.addEventListener('click', () => {
    closeLightbox();
    // Remove from history if lightbox was opened via pushState
    if (window.history.state && window.history.state.lightboxOpen) {
        history.back();
    }
});

document.getElementById('lightbox')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
        // Remove from history if lightbox was opened via pushState
        if (window.history.state && window.history.state.lightboxOpen) {
            history.back();
        }
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
        const lightbox = document.getElementById('lightbox');
        if (lightbox.style.display === 'block') {
            closeLightbox();
            // Remove from history if lightbox was opened via pushState
            if (window.history.state && window.history.state.lightboxOpen) {
                history.back();
            }
        }
    }
});

// Video modal for YouTube embeds
function openVideoModal(videoUrl, caption, date) {
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
    
    // Format caption with date
    let captionText = '';
    if (date) {
        const fullDate = formatLightboxDate(date);
        captionText = fullDate;
        if (caption) {
            captionText += ' • ' + caption;
        }
    } else if (caption) {
        captionText = caption;
    }
    
    lightboxCaption.textContent = captionText;
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
