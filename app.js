// Register service worker with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initNavbar();
  initAccessibility();
  initOfflineDetection();
  updateProgress();
  initDashboard();
  startSessionTimer();
  initAnimations();
  initVideoPlayers();
  initModuleCards();
});

// Initialize module card click handlers
function initModuleCards() {
  // Handle module card clicks
  document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking button
      if (e.target.tagName === 'BUTTON') return;
      
      const moduleName = this.dataset.module;
      if (moduleName) {
        startLesson(moduleName);
      }
    });
  });
  
  // Handle button clicks specifically
  document.querySelectorAll('.module-card .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const moduleName = this.dataset.module;
      if (moduleName) {
        startLesson(moduleName);
      }
    });
  });
}

// Theme toggle functionality - Light/Dark mode
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButton(newTheme);
    });
  }
}

function updateThemeButton(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-moon';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    icon.className = 'fas fa-sun';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// Initialize entrance animations
function initAnimations() {
  // Add animation classes to elements as they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.module-card, .dashboard-card').forEach(el => {
    observer.observe(el);
  });
  
  // Initialize video play buttons
  initVideoPlayers();
}

// Video player functionality
function initVideoPlayers() {
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const videoWrapper = this.closest('.video-wrapper');
      const video = videoWrapper.querySelector('video');
      
      if (video.paused) {
        video.play();
        this.style.opacity = '0';
      } else {
        video.pause();
        this.style.opacity = '1';
      }
    });
    
    // Also handle video events
    const videoWrapper = btn.closest('.video-wrapper');
    const video = videoWrapper.querySelector('video');
    
    video.addEventListener('play', () => {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    });
    
    video.addEventListener('pause', () => {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    });
    
    video.addEventListener('ended', () => {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    });
  });
}

// Theme toggle functionality
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButton(currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });
}

function updateThemeButton(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// Navbar functionality
function initNavbar() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }

      // Close mobile menu
      navMenu.classList.remove('active');

      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Update active link on scroll
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;

    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        const offsetBottom = offsetTop + targetElement.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
}

// Lesson step management
let currentLesson = null;
let currentStep = 0;
let lessonSteps = [];
let quizPassed = false;

// Progress tracking storage
let completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
const totalModules = 6; // update when adding/removing modules

function updateProgress() {
  const progressPercent = Math.min((completedModules.length / totalModules) * 100, 100);
  const progressFillEl = document.getElementById('course-progress');
  if (progressFillEl) {
    progressFillEl.style.width = progressPercent + '%';
  }
  document.getElementById('progress-text').textContent = completedModules.length + ' of ' + totalModules + ' modules completed';

  // Hero stats
  const heroProgressEl = document.getElementById('hero-progress');
  const heroPercentageEl = document.getElementById('hero-percentage');
  if (heroProgressEl) heroProgressEl.textContent = completedModules.length;
  if (heroPercentageEl) heroPercentageEl.textContent = Math.round(progressPercent) + '%';

  if (completedModules.length === totalModules) {
    showCompletionCertificate();
  }

  updateModuleStatuses();
  updateDashboard();
}

function updateModuleStatuses() {
  const modules = ['gye-nyame','sankofa','akasa','adwo','nkonsonkonson','mtn-money'];
  modules.forEach(module => {
    const card = document.querySelector(`[onclick*="startLesson('${module}')"]`);
    if (card) {
      if (completedModules.includes(module)) {
        card.classList.add('completed');
        card.querySelector('.module-status').textContent = '✓ Completed';
      } else {
        card.classList.remove('completed');
        card.querySelector('.module-status').textContent = 'Available';
      }
    }
  });
}

// Step-by-step lesson content structure
const lessonContent = {
  'gye-nyame': {
    title: 'Module 1: Cybersecurity & Data Privacy - Gye Nyame (Except God)',
    steps: [
      {
        title: 'Welcome to Cybersecurity',
        content: `
          <div class="step-content">
            <div class="step-icon">🔒</div>
            <p>Welcome to your first module! Just like <strong>Gye Nyame</strong> shows that only God is supreme and protects us, you must protect your digital world.</p>
            <p>This module will teach you the fundamentals of digital security using traditional Ghanaian wisdom.</p>
            <div class="learning-objectives">
              <h4>Learning Objectives:</h4>
              <ul>
                <li>Understand the importance of digital security</li>
                <li>Create strong passwords and PINs</li>
                <li>Protect personal information online</li>
                <li>Recognize and avoid scams</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Creating Strong Passwords',
        content: `
          <div class="step-content">
            <div class="step-icon">🔑</div>
            <h4>Step 1: Create a Strong Password</h4>
            <p>Use at least 8 characters with numbers, letters, and symbols. Example: "Ghana2026!"</p>
            <div class="practical-tips">
              <h5>Practical Tips:</h5>
              <ul>
                <li>Use a mix of uppercase and lowercase letters</li>
                <li>Include numbers and special characters</li>
                <li>Avoid using personal information like birthdays</li>
                <li>Use different passwords for different accounts</li>
              </ul>
            </div>
            <div class="cultural-connection">
              <p><em>"Just as a chief protects his people, protect your digital kingdom with strong passwords."</em></p>
            </div>
          </div>
        `
      },
      {
        title: 'Securing Your Phone',
        content: `
          <div class="step-content">
            <div class="step-icon">📱</div>
            <h4>Step 2: Set a Phone PIN</h4>
            <p>Go to Settings > Security > Screen Lock. Choose a PIN that's not your birthday.</p>
            <div class="step-by-step">
              <ol>
                <li>Open your phone's <strong>Settings</strong> app</li>
                <li>Find <strong>Security</strong> or <strong>Privacy & Security</strong></li>
                <li>Tap <strong>Screen Lock</strong> or <strong>Lock Screen</strong></li>
                <li>Choose <strong>PIN</strong> or <strong>Password</strong></li>
                <li>Create a strong PIN (at least 6 digits)</li>
                <li>Set up fingerprint or face unlock as backup</li>
              </ol>
            </div>
          </div>
        `
      },
      {
        title: 'WhatsApp Security',
        content: `
          <div class="step-content">
            <div class="step-icon">💬</div>
            <h4>Step 3: Secure WhatsApp</h4>
            <p>Enable two-step verification in WhatsApp Settings > Account > Two-step verification.</p>
            <div class="security-features">
              <h5>Essential WhatsApp Security:</h5>
              <ul>
                <li><strong>Two-step verification:</strong> Adds an extra PIN layer</li>
                <li><strong>Privacy settings:</strong> Control who sees your info</li>
                <li><strong>Chat backup:</strong> Secure your conversations</li>
                <li><strong>Report spam:</strong> Help keep the platform safe</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Mobile Money Protection',
        content: `
          <div class="step-content">
            <div class="step-icon">💰</div>
            <h4>Step 4: Protect Mobile Money</h4>
            <p>Never share your PIN. Use it only when alone. Change it regularly.</p>
            <div class="warning-box">
              <h5>⚠️ Critical Safety Rules:</h5>
              <ul>
                <li>Never share your mobile money PIN with anyone</li>
                <li>Only use mobile money in private</li>
                <li>Change your PIN every 3-6 months</li>
                <li>Report lost phones immediately</li>
                <li>Use official apps only</li>
              </ul>
            </div>
          </div>
        `
      }
    ],
    quiz: {
      question: "What should you NEVER share with anyone?",
      options: [
        "Your mobile money PIN",
        "Your email address",
        "Your phone number",
        "Your name"
      ],
      correct: 0,
      explanation: "Your mobile money PIN is like the key to your bank account. Never share it with anyone, including family members or friends."
    }
  },
  'sankofa': {
    title: 'Module 2: Data Backup & Recovery - Sankofa (Go Back and Get It)',
    steps: [
      {
        title: 'Understanding Data Backup',
        content: `
          <div class="step-content">
            <div class="step-icon">💾</div>
            <p><strong>Sankofa</strong> teaches us to look back and retrieve what we've lost. In the digital world, this means backing up your important data!</p>
            <div class="learning-objectives">
              <h4>Why Backup Matters:</h4>
              <ul>
                <li>Phones can be lost or stolen</li>
                <li>Accidents happen - phones get damaged</li>
                <li>Software updates can sometimes cause data loss</li>
                <li>Peace of mind knowing your memories are safe</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Identifying Important Data',
        content: `
          <div class="step-content">
            <div class="step-icon">📋</div>
            <h4>Step 1: What to Back Up</h4>
            <p>Photos, contacts, documents, and messages are most valuable.</p>
            <div class="data-types">
              <h5>Essential Data to Protect:</h5>
              <ul>
                <li><strong>📸 Photos:</strong> Family memories, important events</li>
                <li><strong>👥 Contacts:</strong> Phone numbers, addresses</li>
                <li><strong>📄 Documents:</strong> ID cards, certificates, receipts</li>
                <li><strong>💬 Messages:</strong> Important conversations</li>
                <li><strong>🎵 Music/Files:</strong> Personal collections</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Backup Methods',
        content: `
          <div class="step-content">
            <div class="step-icon">☁️</div>
            <h4>Step 2: Choose Backup Method</h4>
            <p>Use Google Drive, WhatsApp backup, or external storage.</p>
            <div class="backup-options">
              <h5>Popular Backup Solutions:</h5>
              <div class="option-grid">
                <div class="option">
                  <h6>Google Drive</h6>
                  <p>Free cloud storage, automatic photo backup</p>
                </div>
                <div class="option">
                  <h6>WhatsApp Backup</h6>
                  <p>Save chats and media to Google Drive</p>
                </div>
                <div class="option">
                  <h6>External Storage</h6>
                  <p>SD cards, USB drives, external hard drives</p>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: 'Setting Up Automatic Backup',
        content: `
          <div class="step-content">
            <div class="step-icon">🔄</div>
            <h4>Step 3: Enable Auto-Backup</h4>
            <p>Enable auto-backup in your apps to never lose data.</p>
            <div class="setup-guide">
              <h5>Google Photos Auto-Backup:</h5>
              <ol>
                <li>Open Google Photos app</li>
                <li>Tap your profile picture</li>
                <li>Go to "Photos settings"</li>
                <li>Turn on "Backup & sync"</li>
                <li>Choose backup quality and account</li>
              </ol>
            </div>
          </div>
        `
      },
      {
        title: 'Testing Your Backup',
        content: `
          <div class="step-content">
            <div class="step-icon">✅</div>
            <h4>Step 4: Test Your Backup</h4>
            <p>Regularly check that your backups work and are up to date.</p>
            <div class="testing-tips">
              <h5>How to Test Your Backup:</h5>
              <ul>
                <li>Check backup status in app settings</li>
                <li>Try restoring a small file</li>
                <li>Verify important photos are backed up</li>
                <li>Test contact restoration</li>
                <li>Document your backup locations</li>
              </ul>
            </div>
          </div>
        `
      }
    ],
    quiz: {
      question: "What does 'Sankofa' mean in the context of data backup?",
      options: [
        "Go back and get it",
        "Store it safely",
        "Share with others",
        "Delete old files"
      ],
      correct: 0,
      explanation: "Sankofa means 'go back and get it' - reminding us to retrieve and preserve our important data before it's lost."
    }
  },
  'akasa': {
    title: 'Module 3: Internet Connectivity - Akasa (The Hand of God)',
    steps: [
      {
        title: 'What is the Internet?',
        content: `
          <div class="step-content">
            <div class="step-icon">🌐</div>
            <p><strong>Akasa</strong> represents the hand of God guiding us. The internet is like an invisible hand that connects us to the world.</p>
            <div class="learning-objectives">
              <h4>What You Will Learn:</h4>
              <ul>
                <li>Understanding what the internet is</li>
                <li>How to connect your devices</li>
                <li>Managing your data usage</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Connecting to the Internet',
        content: `
          <div class="step-content">
            <div class="step-icon">📶</div>
            <h4>Step 1: WiFi Connection</h4>
            <p>Go to Settings > WiFi and connect to available networks.</p>
            <div class="step-by-step">
              <ol>
                <li>Open <strong>Settings</strong> app</li>
                <li>Tap <strong>WiFi</strong> or <strong>Network & Internet</strong></li>
                <li>Turn on WiFi</li>
                <li>Select your network and enter password</li>
                <li>Choose <strong>Connect</strong></li>
              </ol>
            </div>
            <div class="cultural-connection">
              <p><em>"Like Akasa guides us safely, choose trusted WiFi networks to stay protected."</em></p>
            </div>
          </div>
        `
      },
      {
        title: 'Managing Data Usage',
        content: `
          <div class="step-content">
            <div class="step-icon">📊</div>
            <h4>Step 2: Monitor Your Data</h4>
            <p>Check your data usage in Settings to avoid unexpected charges.</p>
            <div class="practical-tips">
              <h5>Data Saving Tips:</h5>
              <ul>
                <li>Use WiFi when available</li>
                <li>Close unused apps</li>
                <li>Download content on WiFi</li>
                <li>Monitor usage regularly</li>
              </ul>
            </div>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does Akasa symbolize?",
          options: [
            "The internet",
            "The hand of God",
            "WiFi signal",
            "Data usage"
          ],
          correct: 1,
          explanation: "Akasa represents the hand of God, guiding us just as the internet connects us to information."
        },
        {
          question: "What should you do to save mobile data?",
          options: [
            "Use WiFi when available",
            "Keep all apps open",
            "Download large files on mobile data",
            "Ignore data usage"
          ],
          correct: 0,
          explanation: "Using WiFi instead of mobile data helps you avoid extra charges and manage your data better."
        }
      ]
    }
  },
  'adwo': {
    title: 'Module 4: Safe Browsing - Adwo (Peace)',
    steps: [
      {
        title: 'Safe Browsing Principles',
        content: `
          <div class="step-content">
            <div class="step-icon">🛡️</div>
            <p><strong>Adwo</strong> means peace. Safe browsing brings peace of mind online.</p>
            <div class="learning-objectives">
              <h4>What You Will Learn:</h4>
              <ul>
                <li>Recognizing safe websites</li>
                <li>Avoiding online scams</li>
                <li>Online etiquette and safety</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Recognizing Safe Websites',
        content: `
          <div class="step-content">
            <div class="step-icon">🔍</div>
            <h4>Step 1: Check Website Safety</h4>
            <p>Look for 'https://' and padlock icon in the address bar.</p>
            <div class="safety-checks">
              <h5>Safe Website Signs:</h5>
              <ul>
                <li><strong>🔒 HTTPS:</strong> Secure connection</li>
                <li><strong>🏢 Official domains:</strong> .gov.gh, .org, .edu</li>
                <li><strong>✅ Padlock icon:</strong> In address bar</li>
                <li><strong>🚫 Avoid suspicious links:</strong> From unknown sources</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Avoiding Scams',
        content: `
          <div class="step-content">
            <div class="step-icon">⚠️</div>
            <h4>Step 2: Common Scams to Avoid</h4>
            <p>Be wary of emails or messages asking for money or personal information.</p>
            <div class="scam-alerts">
              <h5>Red Flags:</h5>
              <ul>
                <li>Urgent requests for money</li>
                <li>Unknown senders</li>
                <li>Too-good-to-be-true offers</li>
                <li>Requests for personal information</li>
              </ul>
            </div>
            <div class="cultural-connection">
              <p><em>"Adwo teaches us peace comes from wisdom - stay peaceful by avoiding online dangers."</em></p>
            </div>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does Adwo mean?",
          options: [
            "Danger",
            "Peace",
            "Speed",
            "Money"
          ],
          correct: 1,
          explanation: "Adwo symbolizes peace, which we achieve through safe browsing practices."
        },
        {
          question: "Which is a sign of a safe website?",
          options: [
            "HTTP instead of HTTPS",
            "Padlock icon in address bar",
            "Pop-up ads everywhere",
            "Unknown domain"
          ],
          correct: 1,
          explanation: "The padlock icon indicates a secure connection, making the website safer to use."
        }
      ]
    }
  },
  'nkonsonkonson': {
    title: 'Module 5: Social Networking - Nkonsonkonson (Chain Link)',
    steps: [
      {
        title: 'Social Media Basics',
        content: `
          <div class="step-content">
            <div class="step-icon">🔗</div>
            <p><strong>Nkonsonkonson</strong> represents chain links - just as links connect us, social media connects people.</p>
            <div class="learning-objectives">
              <h4>What You Will Learn:</h4>
              <ul>
                <li>Safe use of social media</li>
                <li>Privacy settings</li>
                <li>Building positive connections</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Privacy Settings',
        content: `
          <div class="step-content">
            <div class="step-icon">🔒</div>
            <h4>Step 1: Secure Your Profile</h4>
            <p>Set your posts to 'Friends Only' and review privacy settings regularly.</p>
            <div class="step-by-step">
              <ol>
                <li>Open your social media app</li>
                <li>Go to <strong>Settings & Privacy</strong></li>
                <li>Choose <strong>Privacy</strong></li>
                <li>Set posts to <strong>Friends Only</strong></li>
                <li>Review who can see your information</li>
              </ol>
            </div>
          </div>
        `
      },
      {
        title: 'Safe Social Networking',
        content: `
          <div class="step-content">
            <div class="step-icon">🤝</div>
            <h4>Step 2: Building Safe Connections</h4>
            <p>Connect with people you know and be careful with strangers online.</p>
            <div class="social-tips">
              <h5>Safety Guidelines:</h5>
              <ul>
                <li>Don't share personal information</li>
                <li>Be cautious with friend requests</li>
                <li>Report suspicious accounts</li>
                <li>Use strong privacy settings</li>
              </ul>
            </div>
            <div class="cultural-connection">
              <p><em>"Like chain links strengthen each other, positive social connections strengthen our community."</em></p>
            </div>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does Nkonsonkonson symbolize?",
          options: [
            "Single link",
            "Chain link",
            "Broken chain",
            "Gold chain"
          ],
          correct: 1,
          explanation: "Nkonsonkonson represents chain links, symbolizing the connections we make on social media."
        },
        {
          question: "What should you set your social media posts to for safety?",
          options: [
            "Public",
            "Friends Only",
            "Everyone",
            "Private only"
          ],
          correct: 1,
          explanation: "Setting posts to 'Friends Only' ensures only people you know can see your content."
        }
      ]
    }
  },
  // MTN Mobile Money module
  'mtn-money': {
    title: 'Module 6: MTN Mobile Money - Sika Dwa (Money Pillar)',
    steps: [
      {
        title: 'Introduction to Mobile Money',
        content: `
          <div class="step-content">
            <div class="step-icon">💳</div>
            <p>This lesson explains how MTN Mobile Money works and why it's important to use it safely.</p>
            <div class="learning-objectives">
              <h4>What You Will Learn:</h4>
              <ul>
                <li>Basics of MTN Mobile Money</li>
                <li>How to register and check balance</li>
                <li>Common scams and how to avoid them</li>
                <li>Saving tips and pin security</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Registering and Using the Service',
        content: `
          <div class="step-content">
            <div class="step-icon">📝</div>
            <h4>Step 1: Register</h4>
            <p>Visit an MTN agent or use the menu *170# to register your phone number.</p>
            <div class="step-by-step">
              <ol>
                <li>Dial <strong>*170#</strong> on your phone.</li>
                <li>Select <strong>1 for Register</strong>.</li>
                <li>Enter your full name and national ID.</li>
                <li>Choose a strong 4-digit PIN.</li>
                <li>Confirm your PIN and complete registration.</li>
              </ol>
            </div>
          </div>
        `
      },
      {
        title: 'Protecting Your PIN',
        content: `
          <div class="step-content">
            <div class="step-icon">🔐</div>
            <h4>Step 2: PIN Security</h4>
            <p>Your PIN is the key to your money. Never share it with anyone.</p>
            <div class="warning-box">
              <h5>⚠️ Remember:</h5>
              <ul>
                <li>Do not write your PIN down.</li>
                <li>Never give your PIN to callers or shoppers.</li>
                <li>Change your PIN regularly via the menu.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'Avoiding Common Scams',
        content: `
          <div class="step-content">
            <div class="step-icon">🚫</div>
            <h4>Step 3: Scam Awareness</h4>
            <p>Scammers may ask you to transfer money or reveal your PIN.</p>
            <div class="cultural-connection">
              <p><em>"Sika Dwa" gifts come from trusted friends; treat unknown requests as strangers.</em></p>
            </div>
            <div class="practical-tips">
              <h5>Tips:</h5>
              <ul>
                <li>MTN will never call to ask for your PIN.</li>
                <li>Verify agent transactions before sending money.</li>
                <li>Report suspicious numbers to 100 (MTN helpline).</li>
              </ul>
            </div>
          </div>
        `
      }
    ],
    quiz: {
      question: "What is the safest thing to do with your MTN Mobile Money PIN?",
      options: [
        "Share it with family",
        "Write it on paper",
        "Keep it secret and change regularly",
        "Give it to an agent"
      ],
      correct: 2,
      explanation: "Your PIN should be kept secret and changed regularly; sharing or writing it down increases risk of theft."
    }
  }
};

function startLesson(symbol) {
  console.log('Starting lesson:', symbol);
  currentLesson = symbol;
  currentStep = 0;
  quizPassed = false;

  if (lessonContent && lessonContent[symbol]) {
    lessonSteps = lessonContent[symbol].steps;
    showLessonModal();
    loadStep(0);
  } else {
    // Show a notification instead of freezing
    showNotification('Lesson content loading...', 'info');
    // Try loading lesson content
    setTimeout(() => {
      if (lessonContent && lessonContent[symbol]) {
        lessonSteps = lessonContent[symbol].steps;
        showLessonModal();
        loadStep(0);
      } else {
        showNotification('Lesson not available yet. Check back soon!', 'info');
      }
    }, 500);
  }
}

// Make functions globally accessible for onclick handlers
window.startLesson = startLesson;
window.showQuiz = showQuiz;
window.closeLesson = closeLesson;
window.prevStep = prevStep;
window.nextStep = nextStep;

function showLessonModal() {
  const modal = document.getElementById('lesson-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function loadStep(stepIndex) {
  currentStep = stepIndex;
  const step = lessonSteps[stepIndex];
  const lessonBody = document.getElementById('lesson-body');
  const stepIndicator = document.getElementById('step-indicator');

  // Update progress indicators
  updateProgressIndicators();

  // Update step indicator
  stepIndicator.textContent = `Step ${stepIndex + 1} of ${lessonSteps.length}`;

  // Load step content
  lessonBody.innerHTML = step.content;
  lessonBody.style.display = 'block';

  // Show/hide quiz button
  const takeQuizBtn = document.getElementById('take-quiz-btn');
  if (takeQuizBtn) {
    takeQuizBtn.style.display = 'inline-flex';
  }

  // Update navigation buttons
  updateNavigationButtons();

  // Hide quiz section
  document.getElementById('quiz-section').style.display = 'none';
  document.getElementById('complete-lesson').style.display = 'none';
}

function updateProgressIndicators() {
  for (let i = 1; i <= 5; i++) {
    const indicator = document.getElementById(`step-${i}`);
    if (indicator) {
      indicator.className = 'progress-step';
      if (i - 1 < currentStep) {
        indicator.classList.add('completed');
      } else if (i - 1 === currentStep) {
        indicator.classList.add('active');
      }
    }
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-step');
  const nextBtn = document.getElementById('next-step');

  prevBtn.disabled = currentStep === 0;
  nextBtn.disabled = currentStep === lessonSteps.length - 1;
  prevBtn.onclick = prevStep;

  if (currentStep === lessonSteps.length - 1) {
    nextBtn.innerHTML = '<i class="fas fa-question-circle"></i> Take Quiz';
    nextBtn.onclick = showQuiz;
  } else {
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = nextStep;
  }
}

function prevStep() {
  if (currentStep > 0) {
    loadStep(currentStep - 1);
  }
}

function nextStep() {
  if (currentStep < lessonSteps.length - 1) {
    loadStep(currentStep + 1);
  } else {
    showQuiz();
  }
}

function showQuiz() {
  const quizSection = document.getElementById('quiz-section');
  const lessonBody = document.getElementById('lesson-body');
  const completeBtn = document.getElementById('complete-lesson');
  const takeQuizBtn = document.getElementById('take-quiz-btn');
  
  lessonBody.style.display = 'none';
  quizSection.style.display = 'block';
  completeBtn.style.display = 'none';
  if (takeQuizBtn) {
    takeQuizBtn.style.display = 'none';
  }
  
  setupQuiz(currentLesson);
}

function setupQuiz(symbol) {
  const quiz = lessonContent[symbol].quiz;
  const quizSection = document.getElementById('quiz-section');
  
  // Clear previous content
  const questionsContainer = document.getElementById('quiz-questions');
  if (questionsContainer) {
    questionsContainer.innerHTML = '';
  } else {
    const newContainer = document.createElement('div');
    newContainer.id = 'quiz-questions';
    quizSection.insertBefore(newContainer, document.getElementById('submit-quiz'));
  }
  
  const container = document.getElementById('quiz-questions');
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [quiz];
  
  questions.forEach((question, qIndex) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    questionDiv.id = `question-${qIndex}`;
    
    questionDiv.innerHTML = `
      <h4>${question.question}</h4>
      <div class="quiz-options">
        ${question.options.map((option, oIndex) => `
          <div class="quiz-option">
            <input type="radio" id="q${qIndex}-o${oIndex}" name="question-${qIndex}" value="${oIndex}">
            <label for="q${qIndex}-o${oIndex}">${option}</label>
          </div>
        `).join('')}
      </div>
    `;
    
    container.appendChild(questionDiv);
  });
  
  document.getElementById('submit-quiz').onclick = () => submitQuiz();
}

function submitQuiz() {
  const quiz = lessonContent[currentLesson].quiz;
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [quiz];
  let correctAnswers = 0;
  const totalQuestions = questions.length;
  
  // Clear previous results
  document.querySelectorAll('.quiz-question').forEach(q => {
    q.classList.remove('correct', 'incorrect');
    q.querySelectorAll('.correct-answer').forEach(ca => ca.classList.remove('correct-answer'));
  });
  
  questions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
    const questionDiv = document.getElementById(`question-${index}`);
    
    if (selectedOption) {
      const selectedValue = parseInt(selectedOption.value);
      if (selectedValue === question.correct) {
        correctAnswers++;
        questionDiv.classList.add('correct');
      } else {
        questionDiv.classList.add('incorrect');
        // Show correct answer
        const correctOption = questionDiv.querySelector(`input[value="${question.correct}"]`);
        if (correctOption) {
          correctOption.parentElement.classList.add('correct-answer');
        }
      }
    }
  });
  
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Store quiz result
  const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
  quizResults[currentLesson] = {
    score,
    date: new Date().toISOString(),
    attempts: (quizResults[currentLesson]?.attempts || 0) + 1
  };
  localStorage.setItem('quizResults', JSON.stringify(quizResults));
  
  const quizSection = document.getElementById('quiz-section');
  // Remove any previous results
  const existingResults = quizSection.querySelector('.quiz-results');
  if (existingResults) {
    existingResults.remove();
  }

  // Show results
  const resultsDiv = document.createElement('div');
  resultsDiv.className = 'quiz-results';
  resultsDiv.innerHTML = `
    <h3>Quiz Results</h3>
    <div class="score-display">
      <div class="score-circle">
        <span class="score-number">${score}%</span>
        <span class="score-label">Score</span>
      </div>
      <p>You got ${correctAnswers} out of ${totalQuestions} questions correct.</p>
    </div>
    <div class="quiz-feedback">
      ${score >= 80 ? 
        '<p class="success">🎉 Excellent! You\'ve mastered this module.</p>' :
        score >= 60 ?
        '<p class="warning">👍 Good job! Review the material and try again.</p>' :
        '<p class="error">📚 Keep learning! Review the content and retake the quiz.</p>'
      }
    </div>
  `;
  
  quizSection.appendChild(resultsDiv);
  
  // Update progress if passed
  if (score >= 60) {
    quizPassed = true;
    if (!completedModules.includes(currentLesson)) {
      completedModules.push(currentLesson);
      localStorage.setItem('completedModules', JSON.stringify(completedModules));
      updateModuleStatuses();
      updateProgress();
      updateDashboard();
      updateAchievements();
      updateSkillsRadar();
    }
    
    // Show completion controls and message
    endSessionTimer();
    const completeBtn = document.getElementById('complete-lesson');
    if (completeBtn) {
      completeBtn.style.display = 'inline-flex';
      completeBtn.onclick = completeLesson;
    }

    const feedbackEl = resultsDiv.querySelector('.quiz-feedback');
    if (feedbackEl) {
      const extraMsg = document.createElement('p');
      extraMsg.className = 'success';
      extraMsg.textContent = 'Successfully completed this module.';
      feedbackEl.appendChild(extraMsg);
    }

    showNotification('Module completed successfully!', 'success');
    
    // Add close button to results
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-primary';
    closeBtn.style.marginTop = '16px';
    closeBtn.innerHTML = '<i class="fas fa-check"></i> Close & Continue';
    closeBtn.onclick = () => {
      closeLesson();
    };
    resultsDiv.appendChild(closeBtn);
  } else {
    // Add retry button
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-secondary';
    retryBtn.textContent = 'Retry Quiz';
    retryBtn.onclick = () => {
      setupQuiz(currentLesson);
    };
    resultsDiv.appendChild(retryBtn);
  }
}

function completeLesson() {
  if (quizPassed) {
    // Hide complete button and close lesson
    document.getElementById('complete-lesson').style.display = 'none';
    closeLesson();
  }
}

// Legacy lesson function for modules not yet converted to step-by-step
function startLegacyLesson(symbol) {
  // Fallback simple message for any future modules without structured content
  const modal = document.getElementById('lesson-modal');
  const title = document.getElementById('lesson-title');
  const body = document.getElementById('lesson-body');

  if (!modal || !title || !body) return;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  title.textContent = 'Lesson coming soon';
  body.innerHTML = `
    <p>This module has not been fully implemented yet.</p>
    <p>Please check back later for interactive content and quizzes.</p>
  `;
}

function closeLesson() {
  const modal = document.getElementById('lesson-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
  }
  document.body.style.overflow = 'auto';
  currentLesson = null;
  currentStep = 0;
  quizPassed = false;
  
  // Refresh the page to update progress display
  location.reload();
}

// Completion certificate function
function showCompletionCertificate() {
  const modal = document.getElementById('lesson-modal');
  const modalContent = modal ? modal.querySelector('.lesson-content') : null;

  if (!modal || !modalContent) return;

  const certificateHTML = `
    <div class="certificate">
      <div class="certificate-header">
        <h2>🎉 Congratulations!</h2>
        <p>You have successfully completed the Digital Heritage Learning Platform</p>
      </div>
      
      <div class="certificate-body">
        <div class="certificate-icon">🏆</div>
        <h3>Certificate of Completion</h3>
        <p>This certifies that you have mastered:</p>
        <ul class="certificate-achievements">
          <li>🔒 Cybersecurity & Data Privacy</li>
          <li>💾 Data Backup & Recovery</li>
          <li>🌐 Internet Connectivity</li>
          <li>🛡️ Safe Browsing Practices</li>
          <li>🔗 Social Networking Safety</li>
          <li>💳 MTN Mobile Money Security</li>
        </ul>
        
        <div class="certificate-date">
          Completed on: ${new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div class="certificate-actions">
        <button class="btn btn-primary" id="download-certificate-btn">Download Certificate</button>
        <button class="btn btn-secondary" id="share-certificate-btn">Share Achievement</button>
        <button class="btn btn-secondary" id="close-certificate-btn">Close</button>
      </div>
    </div>
  `;
  
  modalContent.innerHTML = certificateHTML;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  const downloadBtn = document.getElementById('download-certificate-btn');
  const shareBtn = document.getElementById('share-certificate-btn');
  const closeBtn = document.getElementById('close-certificate-btn');

  if (downloadBtn) downloadBtn.onclick = downloadCertificate;
  if (shareBtn) shareBtn.onclick = shareAchievement;
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    };
  }
}

// Download certificate (simple implementation)
function downloadCertificate() {
  const certificateData = {
    name: 'Digital Heritage Graduate',
    completionDate: new Date().toISOString(),
    modules: ['gye-nyame', 'sankofa', 'akasa', 'adwo', 'nkonsonkonson', 'mtn-money']
  };
  
  const dataStr = JSON.stringify(certificateData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'digital-heritage-certificate.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showNotification('Certificate downloaded successfully!', 'success');
}

// Share achievement
function shareAchievement() {
  if (navigator.share) {
    navigator.share({
      title: 'Digital Heritage Certificate',
      text: 'I just completed the Digital Heritage learning platform! 🌟',
      url: window.location.href
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText('I just completed the Digital Heritage learning platform! 🌟 ' + window.location.href);
    showNotification('Achievement copied to clipboard!', 'success');
  }
}

// Dashboard and Analytics Functions
let sessionStartTime = Date.now();
let totalTimeSpent = parseInt(localStorage.getItem('totalTimeSpent') || '0');
let lastSessionDate = localStorage.getItem('lastSessionDate');
let currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');

function initDashboard() {
  updateDashboard();
  updateAchievements();
  updateSkillsRadar();
  updateStreakCalendar();
}

function startSessionTimer() {
  sessionStartTime = Date.now();
}

function endSessionTimer() {
  const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000 / 60); // minutes
  totalTimeSpent += sessionTime;
  localStorage.setItem('totalTimeSpent', totalTimeSpent.toString());
  
  // Update streak
  const today = new Date().toDateString();
  if (lastSessionDate !== today) {
    if (lastSessionDate === new Date(Date.now() - 86400000).toDateString()) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    localStorage.setItem('lastSessionDate', today);
    localStorage.setItem('currentStreak', currentStreak.toString());
  }
  
  updateDashboard();
}

function updateDashboard() {
  // Update progress circle
  const progressPercent = (completedModules.length / totalModules) * 100;
  const circle = document.getElementById('progress-circle');
  if (circle) {
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (progressPercent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
  
  // Update progress text
  const dashboardProgress = document.getElementById('dashboard-progress');
  const dashboardModules = document.getElementById('dashboard-modules');
  if (dashboardProgress) dashboardProgress.textContent = Math.round(progressPercent) + '%';
  if (dashboardModules) dashboardModules.textContent = `${completedModules.length} of ${totalModules} modules completed`;
  
  // Update time
  const totalTime = document.getElementById('total-time');
  const avgSession = document.getElementById('avg-session');
  if (totalTime) totalTime.textContent = totalTimeSpent;
  if (avgSession) {
    const avg = totalTimeSpent > 0 ? Math.round(totalTimeSpent / Math.max(completedModules.length, 1)) : 0;
    avgSession.textContent = avg;
  }
  
  // Update streak
  const currentStreakEl = document.getElementById('current-streak');
  if (currentStreakEl) currentStreakEl.textContent = currentStreak;
}

function updateAchievements() {
  const achievements = document.querySelectorAll('.achievement-item');
  
  if (achievements.length >= 4) {
    // First Steps - Complete first module
    if (completedModules.length >= 1) {
      achievements[0].classList.remove('locked');
      achievements[0].classList.add('unlocked');
      achievements[0].innerHTML = '<i class="fas fa-unlock"></i><span>First Steps</span>';
    }
    
    // Digital Guardian - Complete cybersecurity module
    if (completedModules.includes('gye-nyame')) {
      achievements[1].classList.remove('locked');
      achievements[1].classList.add('unlocked');
      achievements[1].innerHTML = '<i class="fas fa-shield-alt"></i><span>Digital Guardian</span>';
    }
    
    // Cultural Bridge - Complete 3 modules
    if (completedModules.length >= 3) {
      achievements[2].classList.remove('locked');
      achievements[2].classList.add('unlocked');
      achievements[2].innerHTML = '<i class="fas fa-bridge"></i><span>Cultural Bridge</span>';
    }
    
    // Master Learner - Complete all modules
    if (completedModules.length === totalModules) {
      achievements[3].classList.remove('locked');
      achievements[3].classList.add('unlocked');
      achievements[3].innerHTML = '<i class="fas fa-graduation-cap"></i><span>Master Learner</span>';
    }
  }
}

function updateSkillsRadar() {
  const skillLevels = {
    cybersecurity: completedModules.includes('gye-nyame') ? 100 : 0,
    datamgmt: completedModules.includes('sankofa') ? 100 : 0,
    safety: (completedModules.includes('akasa') ? 33 : 0) + 
            (completedModules.includes('adwo') ? 33 : 0) + 
            (completedModules.includes('nkonsonkonson') ? 34 : 0),
    finance: completedModules.includes('mtn-money') ? 100 : 0
  };
  
  Object.keys(skillLevels).forEach(skill => {
    const element = document.getElementById(`skill-${skill}`);
    if (element) {
      element.style.width = skillLevels[skill] + '%';
    }
  });
}

function updateStreakCalendar() {
  const calendar = document.getElementById('streak-calendar');
  if (!calendar) return;
  
  calendar.innerHTML = '';
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = date.getDate();
    
    if (localStorage.getItem('session-' + dateStr)) {
      dayElement.classList.add('active');
    }
    
    calendar.appendChild(dayElement);
  }
}

function exportProgress() {
  const progressData = {
    completedModules,
    totalTimeSpent,
    currentStreak,
    lastSessionDate,
    exportDate: new Date().toISOString(),
    achievements: getUnlockedAchievements(),
    skills: getSkillLevels()
  };
  
  const dataStr = JSON.stringify(progressData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'digital-heritage-progress.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showNotification('Progress exported successfully!', 'success');
}

function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}

function shareProgress() {
  const progressPercent = Math.round((completedModules.length / totalModules) * 100);
  const shareText = `I've completed ${completedModules.length} of ${totalModules} modules (${progressPercent}%) in the Digital Heritage learning platform! 🌟`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Digital Heritage Progress',
      text: shareText,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(shareText + ' ' + window.location.href);
    showNotification('Progress copied to clipboard!', 'success');
  }
}

function getUnlockedAchievements() {
  const achievements = [];
  if (completedModules.length >= 1) achievements.push('First Steps');
  if (completedModules.includes('gye-nyame')) achievements.push('Digital Guardian');
  if (completedModules.length >= 3) achievements.push('Cultural Bridge');
  if (completedModules.length === totalModules) achievements.push('Master Learner');
  return achievements;
}

function getSkillLevels() {
  return {
    cybersecurity: completedModules.includes('gye-nyame') ? 100 : 0,
    dataManagement: completedModules.includes('sankofa') ? 100 : 0,
    onlineSafety: (completedModules.includes('akasa') ? 33 : 0) + 
                  (completedModules.includes('adwo') ? 33 : 0) + 
                  (completedModules.includes('nkonsonkonson') ? 34 : 0),
    digitalFinance: completedModules.includes('mtn-money') ? 100 : 0
  };
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}