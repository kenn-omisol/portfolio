// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const themeToggle = document.querySelector('.theme-toggle');
const scrollProgress = document.querySelector('.scroll-progress');
const skillCards = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close-modal');
const filterBtns = document.querySelectorAll('.filter-btn');
const currentYear = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const downloadButton = document.getElementById('download-resume');
const sections = document.querySelectorAll('section');
const heroText = document.querySelector('.hero-text h2');
const contactTabs = document.querySelectorAll('.contact-tab');
const tabPanes = document.querySelectorAll('.tab-pane');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');

// Set current year
currentYear.textContent = new Date().getFullYear();

// Typing animation for hero section
if (heroText) {
    const text = heroText.textContent;
    heroText.textContent = '';
    
    let charIndex = 0;
    function typeText() {
        if (charIndex < text.length) {
            heroText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        } else {
            // Add blinking cursor after typing is complete
            heroText.classList.add('typing');
            
            // Initialize the rotating text animation after the main heading is typed
            setTimeout(initRotatingText, 1000);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);
}

// Rotating text animation
function initRotatingText() {
    const txtRotate = document.querySelector('.txt-rotate');
    if (txtRotate) {
        const toRotate = JSON.parse(txtRotate.getAttribute('data-rotate'));
        const period = parseInt(txtRotate.getAttribute('data-period'), 10) || 2000;
        let loopNum = 0;
        let txt = '';
        let isDeleting = false;
        
        function tick() {
            const i = loopNum % toRotate.length;
            const fullTxt = toRotate[i];
            
            if (isDeleting) {
                txt = fullTxt.substring(0, txt.length - 1);
            } else {
                txt = fullTxt.substring(0, txt.length + 1);
            }
            
            txtRotate.textContent = txt;
            
            let delta = 200 - Math.random() * 100;
            
            if (isDeleting) {
                delta /= 2;
            }
            
            if (!isDeleting && txt === fullTxt) {
                delta = period;
                isDeleting = true;
            } else if (isDeleting && txt === '') {
                isDeleting = false;
                loopNum++;
                delta = 500;
            }
            
            setTimeout(tick, delta);
        }
        
        tick();
    }
}

// Testimonial carousel functionality
let currentSlide = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function showSlide(index) {
    // Wrap around for infinite carousel
    if (index >= testimonialCards.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = testimonialCards.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides and show only the current one
    testimonialCards.forEach((card, i) => {
        card.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
        card.style.opacity = i === currentSlide ? '1' : '0';
    });
    
    // Update dots
    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Initialize testimonial carousel
if (testimonialCards.length > 0) {
    // Set initial positions
    showSlide(0);
    
    // Set up event listeners
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
    
    if (testimonialNext) {
        testimonialNext.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    // Dot navigation
    testimonialDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
        });
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Contact form tabs
contactTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and panes
        contactTabs.forEach(t => t.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding pane
        const targetTab = tab.getAttribute('data-tab');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// Initialize smooth scroll behavior with offsets
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate offset to account for fixed navbar
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - navHeight - 20, // Extra 20px padding
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll progress indicator
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // Calculate scroll percentage
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = `${scrollPercentage}%`;
    
    // Add scrolled class to navbar with transition
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Highlight active section in navigation
    highlightActiveSection();
    
    // Animate elements as they come into view
    animateOnScroll();
});

// Mobile Navigation Toggle with improved animation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (hamburger.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Enhanced theme toggle with transition effects
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    
    // Update icon with animation
    const icon = themeToggle.querySelector('i');
    icon.style.transform = 'rotate(180deg)';
    
    setTimeout(() => {
        if (document.documentElement.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
        
        // Reset transform for next animation
        setTimeout(() => {
            icon.style.transform = 'rotate(0)';
        }, 50);
    }, 150);
});

// Check for saved theme preference with system preference detection
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    themeToggle.querySelector('i').className = 'fas fa-sun';
} else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark-theme');
    themeToggle.querySelector('i').className = 'fas fa-moon';
} else {
    // Check for system preference if no saved preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark-theme');
                themeToggle.querySelector('i').className = 'fas fa-sun';
            } else {
                document.documentElement.classList.remove('dark-theme');
                themeToggle.querySelector('i').className = 'fas fa-moon';
            }
        }
    });
}

// Enhanced highlight active section in navigation
function highlightActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    let currentSection = '';
    let maxVisibility = 0;
    
    // Find section with most visibility in the viewport
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Calculate how much of the section is visible in viewport
        const sectionBottom = sectionTop + sectionHeight;
        const visibleTop = Math.max(sectionTop, window.scrollY);
        const visibleBottom = Math.min(sectionBottom, window.scrollY + window.innerHeight);
        const visibleHeight = visibleBottom - visibleTop;
        
        if (visibleHeight > maxVisibility && visibleHeight > 100) { // Minimum visibility threshold
            maxVisibility = visibleHeight;
            currentSection = sectionId;
        }
    });
    
    // Update navigation highlight
    if (currentSection) {
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            
            // Remove any existing after element animation
            link.style.setProperty('--progress', '0%');
        });
        
        const activeLink = document.querySelector(`.nav-links a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // Animate progress indicator for active link
            activeLink.style.setProperty('--progress', '100%');
        }
    }
}

// Scroll animation function
function animateOnScroll() {
    const triggerPoint = window.innerHeight * 0.85;
    
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerPoint) {
            element.classList.add('animated');
            
            // Add staggered animation for child elements
            if (element.classList.contains('staggered')) {
                Array.from(element.children).forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                });
            }
        }
    });
    
    // Add .animate-on-scroll class to elements that should animate
    document.querySelectorAll('.skill-card:not(.animate-on-scroll)').forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    document.querySelectorAll('.project-card:not(.animate-on-scroll)').forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    document.querySelectorAll('.timeline-item:not(.animate-on-scroll)').forEach(item => {
        item.classList.add('animate-on-scroll');
    });
}

// Initialize highlight and animations on page load
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveSection();
    animateOnScroll();
    
    // Add flipping functionality to skill cards
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});

// Enhanced Project Modal with animations
const projectDetails = {
    'transmittal-system': {
        title: 'Document Transmittal Tracking System',
        description: `
            <div class="modal-content-wrapper">
                <p class="modal-description">Web-based system for partnered stores to submit delivery receipts to the admin office, with real-time status tracking and notifications. Built using Google Sheets as a database with HTML front-end, providing transparency on document acknowledgment and flagging late submissions.</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li>Real-time delivery receipt submission tracking</li>
                            <li>Status notification system for stores</li>
                            <li>Automated flagging of late submissions</li>
                            <li>Document verification workflow</li>
                            <li>Centralized visibility dashboard</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-chart-line"></i> Business Impact</h4>
                        <ul>
                            <li><span class="highlight">85%</span> reduction in lost delivery receipts</li>
                            <li><span class="highlight">100%</span> visibility of document submission status</li>
                            <li><span class="highlight">2 hour</span> average response time</li>
                            <li>Eliminated disputes over document submissions</li>
                            <li>Improved accountability between stores and admin office</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-code"></i> Technical Details</h4>
                        <ul>
                            <li>Google Sheets as database backend</li>
                            <li>HTML/CSS front-end interface</li>
                            <li>Custom status tracking algorithms</li>
                            <li>Automated email notifications</li>
                            <li>Mobile-responsive design for field access</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'ai-outreach': {
        title: 'AI Outreach Assistant',
        description: `
            <div class="modal-content-wrapper">
                <p class="modal-description">AI-powered tool built for appointment setters that analyzes Instagram business profiles and generates tailored outreach messages. By pasting an Instagram link, the system performs background research, identifies industry type, and creates customized conversation frameworks with potential responses.</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li>Instagram profile analysis via API</li>
                            <li>Industry detection and classification</li>
                            <li>Customized outreach message generation</li>
                            <li>Response simulation and framework</li>
                            <li>Template library for various business types</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-chart-line"></i> Business Impact</h4>
                        <ul>
                            <li><span class="highlight">68%</span> increase in positive response rates</li>
                            <li><span class="highlight">5x</span> faster outreach message creation</li>
                            <li><span class="highlight">12+</span> industry-specific templates</li>
                            <li>Reduced research time for appointment setters</li>
                            <li>More personalized and effective initial contact</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-code"></i> Technical Details</h4>
                        <ul>
                            <li>HTML/CSS/JavaScript implementation</li>
                            <li>Integration with AI language model APIs</li>
                            <li>Instagram data scraping capabilities</li>
                            <li>Industry classification algorithms</li>
                            <li>Template rendering engine</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'sales-report': {
        title: 'Automated Daily Sales Report',
        description: `
            <div class="modal-content-wrapper">
                <p class="modal-description">Automated reporting system that pulls data from multiple sources, processes it through Google Sheets, and generates visual daily sales reports with email distribution.</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li>Multi-source data integration</li>
                            <li>Automated data refresh and processing</li>
                            <li>Visual dashboard generation</li>
                            <li>Scheduled email distribution</li>
                            <li>Exception highlighting and alerting</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-chart-line"></i> Business Impact</h4>
                        <ul>
                            <li><span class="highlight">90%</span> faster reporting process</li>
                            <li>Consolidation of <span class="highlight">3</span> separate data sources</li>
                            <li><span class="highlight">100%</span> automated workflow</li>
                            <li>Improved decision-making with timely data</li>
                            <li>Reduced manual errors in reporting</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-code"></i> Technical Details</h4>
                        <ul>
                            <li>Google Sheets formulas and functions</li>
                            <li>Apps Script automation</li>
                            <li>Data visualization techniques</li>
                            <li>API connections to data sources</li>
                            <li>Scheduled triggers and workflows</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'financial-tracker': {
        title: 'Financial Data Tracking Tool',
        description: `
            <div class="modal-content-wrapper">
                <p class="modal-description">An advanced Excel system with VBA macros designed to automate the data reconciliation process for financial transactions. This tool integrates with existing accounting systems to pull transaction data, match it against bank statements, and highlight discrepancies.</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li>Automated data import from multiple sources</li>
                            <li>Smart matching algorithm to pair transactions</li>
                            <li>Customizable filtering and sorting options</li>
                            <li>Detailed variance analysis and reporting</li>
                            <li>Audit trail functionality</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-chart-line"></i> Business Impact</h4>
                        <ul>
                            <li><span class="highlight">40%</span> reduction in manual reconciliation time</li>
                            <li><span class="highlight">15+</span> hours of staff time saved weekly</li>
                            <li><span class="highlight">99.8%</span> data accuracy improvement</li>
                            <li>Enabled real-time financial position insights</li>
                            <li>Enhanced audit compliance</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-code"></i> Technical Details</h4>
                        <ul>
                            <li>Built with Excel and VBA Macros</li>
                            <li>Incorporates advanced Excel formulas (VLOOKUP, INDEX-MATCH, SUMIFS)</li>
                            <li>Custom-designed user interface</li>
                            <li>Error handling and data validation</li>
                            <li>Password-protected modules for security</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'document-processor': {
        title: 'AI-Assisted Document Processor',
        description: `
            <div class="modal-content-wrapper">
                <p class="modal-description">A sophisticated data extraction solution that leverages OCR technology and template matching to convert unstructured business documents (invoices, receipts, purchase orders) into organized, structured data entries.</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li>Intelligent text recognition and extraction</li>
                            <li>Template learning for common document formats</li>
                            <li>Data validation against existing databases</li>
                            <li>Integration with accounting software</li>
                            <li>Bulk processing capability</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-chart-line"></i> Business Impact</h4>
                        <ul>
                            <li><span class="highlight">80%</span> faster document processing</li>
                            <li>Reduced processing time from <span class="highlight">4 minutes</span> to <span class="highlight">45 seconds</span> per document</li>
                            <li><span class="highlight">3.25</span> hours of manual work saved daily</li>
                            <li>Eliminated data entry errors</li>
                            <li>Improved traceability of documentation</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-code"></i> Technical Details</h4>
                        <ul>
                            <li>OCR Technology</li>
                            <li>Document API Integration</li>
                            <li>Template Matching Algorithms</li>
                            <li>Custom validation rules</li>
                            <li>Export functionality to various formats</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    'database-system': {
        title: 'Operations Database System',
        description: `
            <div class="modal-content-wrapper">
                <p class="modal-description">An integrated SQL database application with a .NET frontend that tracks business requests, approvals, and operational status. This system consolidated five separate spreadsheets into a single, efficient database solution.</p>
                
                <div class="modal-sections">
                    <div class="modal-section">
                        <h4><i class="fas fa-star"></i> Key Features</h4>
                        <ul>
                            <li>Centralized data repository</li>
                            <li>Role-based access control</li>
                            <li>Approval workflow automation</li>
                            <li>Real-time status tracking</li>
                            <li>Custom reporting and dashboards</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-chart-line"></i> Business Impact</h4>
                        <ul>
                            <li><span class="highlight">90%</span> faster data retrieval</li>
                            <li>Consolidated <span class="highlight">5</span> separate tracking spreadsheets</li>
                            <li>Eliminated data duplication issues</li>
                            <li>Standardized request processes</li>
                            <li>Improved cross-departmental visibility</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-code"></i> Technical Details</h4>
                        <ul>
                            <li>SQL Server database</li>
                            <li>.NET Framework</li>
                            <li>C# programming</li>
                            <li>Stored procedures for complex operations</li>
                            <li>Responsive user interface design</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    }
};

// Enhanced Project Modal with animations
document.querySelectorAll('.btn-more').forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        const project = projectDetails[projectId];
        
        if (project) {
            modalContent.innerHTML = `
                <h2 class="modal-title">${project.title}</h2>
                ${project.description}
            `;
            
            // Add animation classes
            projectModal.classList.add('modal-opening');
            projectModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Stagger animations for modal sections
            setTimeout(() => {
                const modalSections = document.querySelectorAll('.modal-section');
                modalSections.forEach((section, index) => {
                    section.style.animationDelay = `${0.1 + (index * 0.1)}s`;
                    section.classList.add('fade-in');
                });
            }, 100);
        }
    });
});

// Improved Modal Close with animation
closeModal.addEventListener('click', closeModalWithAnimation);

// Close Modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeModalWithAnimation();
    }
});

// Modal close with animation function
function closeModalWithAnimation() {
    projectModal.classList.add('modal-closing');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling again
        projectModal.classList.remove('modal-opening', 'modal-closing');
    }, 300);
}

// Enhanced Skills & Projects Filtering with animations
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Determine if we're filtering skills or projects
        const isSkills = btn.closest('.skills-filter') !== null;
        const items = isSkills ? skillCards : projectCards;
        
        // Add staggered fade animations
        items.forEach((item, index) => {
            // First hide all items with fade out
            item.classList.add('filtering');
            
            // Then show/hide based on filter after a short delay
            setTimeout(() => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.animationDelay = `${index * 0.05}s`;
                    setTimeout(() => {
                        item.classList.add('show');
                        item.classList.remove('filtering');
                    }, 10);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.remove('filtering');
                    }, 300);
                }
            }, 100);
        });
    });
});

// Enhanced Contact Form with validation feedback
if (contactForm) {
    // Real-time validation feedback
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Add validation classes on blur
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        // Remove error styling on focus
        input.addEventListener('focus', function() {
            this.classList.remove('input-error');
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
    
    // Form submission with enhanced feedback
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        let missingFields = [];
        
        // Clear any existing form-wide error messages
        const existingFormErrors = contactForm.parentElement.querySelectorAll('.form-error');
        existingFormErrors.forEach(error => error.remove());
        
        // Validate all inputs and collect missing field names
        formInputs.forEach(input => {
            if (input.type !== 'hidden' && !validateInput(input)) {
                isValid = false;
                if (input.value.trim() === '') {
                    const fieldName = input.placeholder || input.name;
                    missingFields.push(fieldName);
                }
            }
        });
        
        if (!isValid) {
            // Display form-wide error message with specific missing fields
            if (missingFields.length > 0) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message form-error';
                errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please fill in the following required fields: ${missingFields.join(', ')}`;
                contactForm.parentElement.insertBefore(errorMessage, contactForm);
            }
            return;
        }
        
        // Show sending status with animation
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Prepare template parameters
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            position: document.getElementById('position').value,
            message: document.getElementById('message').value,
            subject: `I want to hire you for the position of ${document.getElementById('position').value}`
        };
        
        // Check if emailjs is defined
        if (typeof emailjs !== 'undefined') {
            // Send email using EmailJS - updated format for v3
            emailjs.send('portfolio_contact', 'portfolio_contact', templateParams)
                .then(function(response) {
                    // Create success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
                    
                    // Insert before form
                    contactForm.parentElement.insertBefore(successMessage, contactForm);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Restore button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Remove success message after delay
                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        setTimeout(() => successMessage.remove(), 500);
                    }, 3000);
                }, function(error) {
                    // Create error message with more details
                    let errorDetails = '';
                    if (error.text) {
                        errorDetails = `: ${error.text}`;
                        if (error.text.includes("service_id")) {
                            errorDetails += ". Check if your service ID is correct.";
                        } else if (error.text.includes("template_id")) {
                            errorDetails += ". Check if your template ID is correct.";
                        } else if (error.text.includes("user_id")) {
                            errorDetails += ". Check if your public key is correct.";
                        }
                    }
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message form-error';
                    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Failed to send message${errorDetails}`;
                    
                    // Insert before form
                    contactForm.parentElement.insertBefore(errorMessage, contactForm);
                    
                    // Restore button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Remove error message after delay
                    setTimeout(() => {
                        errorMessage.style.opacity = '0';
                        setTimeout(() => errorMessage.remove(), 500);
                    }, 5000);
                });
        } else {
            // EmailJS not loaded - display error
            console.error('EmailJS library not loaded');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message form-error';
            errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Email service is not available. Please try again later or contact directly via email.';
            
            // Insert before form
            contactForm.parentElement.insertBefore(errorMessage, contactForm);
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Remove error message after delay
            setTimeout(() => {
                errorMessage.style.opacity = '0';
                setTimeout(() => errorMessage.remove(), 500);
            }, 4000);
        }
    });
}

// Input validation function
function validateInput(input) {
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Skip hidden fields
    if (input.type === 'hidden') {
        return true;
    }
    
    // Get field name for error message
    const fieldName = input.placeholder || input.name || 'Field';
    
    if (input.value.trim() === '') {
        showError(input, `${fieldName} is required`);
        return false;
    }
    
    // Email validation
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            showError(input, `Please enter a valid email address`);
            return false;
        }
    }
    
    return true;
}

// Show error message function
function showError(input, message) {
    input.classList.add('input-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Add to parent element
    input.parentElement.appendChild(errorDiv);
    
    // Scroll to the input with error
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Load HTML2PDF library
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Enhanced Resume Download with direct PDF generation
if (downloadButton) {
    downloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'pdf-loading';
        loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generating PDF...</p>';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '100%';
        loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.flexDirection = 'column';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.style.zIndex = '9999';
        loadingIndicator.style.color = 'white';
        
        const spinner = loadingIndicator.querySelector('.spinner');
        spinner.style.width = '40px';
        spinner.style.height = '40px';
        spinner.style.border = '4px solid rgba(255,255,255,0.3)';
        spinner.style.borderTop = '4px solid white';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
        
        document.body.appendChild(loadingIndicator);
        
        // Load html2pdf.js library dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = function() {
            // Fetch the resume.html content
            fetch('resume.html')
                .then(response => response.text())
                .then(html => {
                    // Create a temporary container
                    const container = document.createElement('div');
                    container.style.position = 'absolute';
                    container.style.left = '-9999px';
                    container.style.top = '-9999px';
                    container.innerHTML = html;
                    document.body.appendChild(container);
                    
                    // Remove elements that shouldn't be in the PDF
                    const notification = container.querySelector('.notification');
                    const printButton = container.querySelector('.print-button');
                    if (notification) notification.remove();
                    if (printButton) printButton.remove();
                    
                    // Get the resume content from the fetched HTML
                    const resumeContent = container.querySelector('.container') || container;
                    
                    // Configure pdf options
                    const opt = {
                        margin: [10, 10, 10, 10],
                        filename: 'Kenn_Excel_Omisol_Resume.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { 
                            scale: 2,
                            useCORS: true,
                            letterRendering: true,
                            allowTaint: true,
                            scrollX: 0,
                            scrollY: 0
                        },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                    };
                    
                    // Generate PDF
                    html2pdf().from(resumeContent).set(opt).save()
                        .then(() => {
                            // Remove the loading indicator and temporary container
                            document.body.removeChild(loadingIndicator);
                            document.body.removeChild(container);
                        })
                        .catch(err => {
                            console.error('PDF generation error:', err);
                            // If there's an error, redirect to the resume page instead
                            document.body.removeChild(loadingIndicator);
                            document.body.removeChild(container);
                            window.open('resume.html', '_blank');
                        });
                })
                .catch(err => {
                    console.error('Error fetching resume:', err);
                    // If fetching fails, redirect to the resume page
                    document.body.removeChild(loadingIndicator);
                    window.open('resume.html', '_blank');
                });
        };
        
        script.onerror = function() {
            // If script loading fails, redirect to resume.html
            document.body.removeChild(loadingIndicator);
            window.open('resume.html', '_blank');
        };
        
        document.head.appendChild(script);
    });
}

// Add counter animations to statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value, .metric-value');
    
    counters.forEach(counter => {
        // Only animate if not already animated
        if (!counter.classList.contains('counted')) {
            const target = parseFloat(counter.innerText);
            let isPercentage = counter.innerText.includes('%');
            let hasPlus = counter.innerText.includes('+');
            let startValue = 0;
            let suffix = isPercentage ? '%' : hasPlus ? '+' : '';
            let decimalPlaces = counter.innerText.includes('.') ? 
                counter.innerText.split('.')[1].length : 0;
            
            // Store original text to handle non-numeric values
            const originalText = counter.innerText;
            
            // Check if it's actually a number we can animate
            if (!isNaN(target)) {
                // Set initial value
                counter.innerText = '0' + suffix;
                
                // Increment counter effect
                const duration = 1500; // ms
                const interval = 16; // ms (60fps)
                const steps = duration / interval;
                const increment = target / steps;
                
                let currentValue = startValue;
                const timer = setInterval(() => {
                    currentValue += increment;
                    
                    // Ensure we don't exceed the target
                    if (currentValue >= target) {
                        counter.innerText = originalText;
                        clearInterval(timer);
                    } else {
                        if (decimalPlaces > 0) {
                            counter.innerText = currentValue.toFixed(decimalPlaces) + suffix;
                        } else {
                            counter.innerText = Math.floor(currentValue) + suffix;
                        }
                    }
                }, interval);
                
                counter.classList.add('counted');
            }
        }
    });
}

// Intersection Observer for statistics sections
if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe stats sections
    document.querySelectorAll('.about-stats, .project-metrics').forEach(
        section => statsObserver.observe(section)
    );
}

// Add CSS class for animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    // Add classes to elements for scroll animations
    document.querySelectorAll('.section-header').forEach(header => {
        header.classList.add('animate-on-scroll');
    });
    
    document.querySelectorAll('.education-card').forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    document.querySelectorAll('.about-content').forEach(content => {
        content.classList.add('animate-on-scroll', 'staggered');
    });
    
    // Initialize scroll animations
    animateOnScroll();
});

// Refresh animations on resize
window.addEventListener('resize', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// PDF Direct Download functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if download resume button exists
    const downloadResumeBtn = document.getElementById('download-resume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'pdf-loading';
            loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generating PDF...</p>';
            loadingIndicator.style.position = 'fixed';
            loadingIndicator.style.top = '0';
            loadingIndicator.style.left = '0';
            loadingIndicator.style.width = '100%';
            loadingIndicator.style.height = '100%';
            loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
            loadingIndicator.style.display = 'flex';
            loadingIndicator.style.flexDirection = 'column';
            loadingIndicator.style.justifyContent = 'center';
            loadingIndicator.style.alignItems = 'center';
            loadingIndicator.style.zIndex = '9999';
            loadingIndicator.style.color = 'white';
            
            const spinner = loadingIndicator.querySelector('.spinner');
            spinner.style.width = '40px';
            spinner.style.height = '40px';
            spinner.style.border = '4px solid rgba(255,255,255,0.3)';
            spinner.style.borderTop = '4px solid white';
            spinner.style.borderRadius = '50%';
            spinner.style.animation = 'spin 1s linear infinite';
            
            const style = document.createElement('style');
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
            
            document.body.appendChild(loadingIndicator);
            
            // Load html2pdf.js library dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = function() {
                // Fetch the resume.html content
                fetch('resume.html')
                    .then(response => response.text())
                    .then(html => {
                        // Create a temporary container
                        const container = document.createElement('div');
                        container.style.position = 'absolute';
                        container.style.left = '-9999px';
                        container.style.top = '-9999px';
                        container.innerHTML = html;
                        document.body.appendChild(container);
                        
                        // Remove elements that shouldn't be in the PDF
                        const notification = container.querySelector('.notification');
                        const printButton = container.querySelector('.print-button');
                        if (notification) notification.remove();
                        if (printButton) printButton.remove();
                        
                        // Get the resume content from the fetched HTML
                        const resumeContent = container.querySelector('.container') || container;
                        
                        // Configure pdf options
                        const opt = {
                            margin: [10, 10, 10, 10],
                            filename: 'Kenn_Excel_Omisol_Resume.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { 
                                scale: 2,
                                useCORS: true,
                                letterRendering: true,
                                allowTaint: true,
                                scrollX: 0,
                                scrollY: 0
                            },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                        };
                        
                        // Generate PDF
                        html2pdf().from(resumeContent).set(opt).save()
                            .then(() => {
                                // Remove the loading indicator and temporary container
                                document.body.removeChild(loadingIndicator);
                                document.body.removeChild(container);
                            })
                            .catch(err => {
                                console.error('PDF generation error:', err);
                                // If there's an error, redirect to the resume page instead
                                document.body.removeChild(loadingIndicator);
                                document.body.removeChild(container);
                                window.open('resume.html', '_blank');
                            });
                    })
                    .catch(err => {
                        console.error('Error fetching resume:', err);
                        // If fetching fails, redirect to the resume page
                        document.body.removeChild(loadingIndicator);
                        window.open('resume.html', '_blank');
                    });
            };
            
            script.onerror = function() {
                // If script loading fails, redirect to resume.html
                document.body.removeChild(loadingIndicator);
                window.open('resume.html', '_blank');
            };
            
            document.head.appendChild(script);
        });
    }
}); 