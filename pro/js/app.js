// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initNavbar();
  updateProgress();
});

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
let completedModules = JSON.parse(localStorage.getItem('completedModules') || '["gye-nyame"]');
const totalModules = 6; // update when adding/removing modules

function updateProgress() {
  const progressPercent = (completedModules.length / totalModules) * 100;
  document.getElementById('course-progress').style.width = progressPercent + '%';
  document.getElementById('progress-text').textContent = completedModules.length + ' of 5 modules completed';

  // Hero stats
  document.getElementById('hero-progress').textContent = completedModules.length;
  document.getElementById('hero-percentage').textContent = Math.round(progressPercent) + '%';

  if (completedModules.length === 5) {
    showCertificate();
  }

  updateModuleStatuses();
}

function updateModuleStatuses() {
  const modules = ['gye-nyame','sankofa','akasa','adwo','nkonsonkonson'];
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
  }
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
  currentLesson = symbol;
  currentStep = 0;
  quizPassed = false;

  if (lessonContent[symbol]) {
    lessonSteps = lessonContent[symbol].steps;
    showLessonModal();
    loadStep(0);
  } else {
    // Fallback for modules not yet implemented with step-by-step
    startLegacyLesson(symbol);
  }
}

function showLessonModal() {
  const modal = document.getElementById('lesson-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLesson() {
  const modal = document.getElementById('lesson-modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
  currentLesson = null;
  currentStep = 0;
  quizPassed = false;
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

  lessonBody.style.display = 'none';
  quizSection.style.display = 'block';
  completeBtn.style.display = 'none';

  setupQuiz(currentLesson);
}

function setupQuiz(symbol) {
  const quiz = lessonContent[symbol].quiz;
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  const submitBtn = document.getElementById('submit-quiz');

  questionEl.textContent = quiz.question;
  optionsEl.innerHTML = '';
  feedbackEl.innerHTML = '';

  quiz.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'quiz-option';
    optionDiv.innerHTML = `
      <input type="radio" id="option-${index}" name="quiz-option" value="${index}">
      <label for="option-${index}">${option}</label>
    `;
    optionsEl.appendChild(optionDiv);
  });

  submitBtn.onclick = () => checkQuizAnswer(symbol);
}

function checkQuizAnswer(symbol) {
  const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
  const feedbackEl = document.getElementById('quiz-feedback');
  const completeBtn = document.getElementById('complete-lesson');

  if (!selectedOption) {
    feedbackEl.innerHTML = '<p style="color: var(--warning);">Please select an answer first.</p>';
    return;
  }

  const quiz = lessonContent[symbol].quiz;
  const selectedValue = parseInt(selectedOption.value);

  if (selectedValue === quiz.correct) {
    feedbackEl.innerHTML = `
      <div style="color: var(--success); padding: 1rem; background: var(--bg-lighter); border-radius: 8px; border-left: 4px solid var(--success);">
        <p><strong>✅ Correct!</strong></p>
        <p>${quiz.explanation}</p>
      </div>
    `;
    quizPassed = true;
    completeBtn.style.display = 'inline-block';
  } else {
    feedbackEl.innerHTML = `
      <div style="color: var(--danger); padding: 1rem; background: var(--bg-lighter); border-radius: 8px; border-left: 4px solid var(--danger);">
        <p><strong>❌ Not quite right.</strong></p>
        <p>Try again or review the lesson material.</p>
      </div>
    `;
    quizPassed = false;
    completeBtn.style.display = 'none';
  }
}

function completeLesson() {
  if (quizPassed) {
    // Mark module as completed
    if (!completedModules.includes(currentLesson)) {
      completedModules.push(currentLesson);
      localStorage.setItem('completedModules', JSON.stringify(completedModules));
      updateProgress();
    }

    // Show success message
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.innerHTML = `
      <div style="color: var(--success); padding: 1.5rem; background: var(--bg-lighter); border-radius: 8px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
        <h3>Congratulations!</h3>
        <p>You have successfully completed this module!</p>
        <p>Your knowledge of digital literacy grows stronger, just like the mighty baobab tree.</p>
      </div>
    `;

    // Hide complete button and show close after delay
    document.getElementById('complete-lesson').style.display = 'none';
    setTimeout(() => {
      closeLesson();
    }, 3000);
  }
}

// Legacy lesson function for modules not yet converted to step-by-step
function startLegacyLesson(symbol) {
  const modal = document.getElementById('lesson-modal');
  const title = document.getElementById('lesson-title');
  const body = document.getElementById('lesson-body');
  const quizSection = document.getElementById('quiz-section');

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  if (symbol === 'akasa') {
    title.textContent = 'Module 3: Internet Connectivity - Akasa (The Hand of God)';
    body.innerHTML = `
      <p>Akasa represents God's guiding hand. Just as God guides us, the internet connects us to the world - but we must use it wisely!</p>
      <h3>Learning Objectives</h3>
      <ul>
        <li>Understand how the internet works</li>
        <li>Learn to connect devices safely</li>
        <li>Manage data usage effectively</li>
        <li>Choose secure Wi-Fi networks</li>
      </ul>
      <h3>Step-by-Step Guide</h3>
      <ol>
        <li><strong>Understand Internet Basics:</strong> The internet is like roads connecting cities - data travels through cables and air.</li>
        <li><strong>Connect to Wi-Fi:</strong> Look for networks you trust. Avoid public Wi-Fi for sensitive activities.</li>
        <li><strong>Check Data Usage:</strong> Monitor your mobile data in Settings > Network & Internet > Data Usage.</li>
        <li><strong>Use Data Wisely:</strong> Download large files on Wi-Fi, not mobile data.</li>
        <li><strong>Stay Connected Safely:</strong> Use VPN apps when on public networks.</li>
      </ol>
      <p><strong>Remember:</strong> The internet is a powerful tool - use it with wisdom and care!</p>
    `;
    setupQuiz(symbol);
  } else if (symbol === 'adwo') {
    title.textContent = 'Module 4: Safe Browsing - Adwo (Peace)';
    body.innerHTML = `
      <p>Adwo symbolizes peace and harmony. Browse the internet peacefully by avoiding threats and maintaining your digital peace of mind.</p>
      <h3>Learning Objectives</h3>
      <ul>
        <li>Recognize safe websites</li>
        <li>Avoid phishing scams</li>
        <li>Use antivirus software</li>
        <li>Practice safe browsing habits</li>
      </ul>
      <h3>Step-by-Step Guide</h3>
      <ol>
        <li><strong>Check Website URLs:</strong> Look for 'https://' and a lock icon. Avoid suspicious sites.</li>
        <li><strong>Don't Click Unknown Links:</strong> Be wary of emails or messages with suspicious links.</li>
        <li><strong>Use Antivirus:</strong> Install reputable antivirus software on your devices.</li>
        <li><strong>Update Software:</strong> Keep your apps and operating system updated.</li>
        <li><strong>Be Skeptical:</strong> If something seems too good to be true, it probably is.</li>
      </ol>
      <p><strong>Remember:</strong> Peace of mind comes from safe browsing habits!</p>
    `;
    setupQuiz(symbol);
  } else if (symbol === 'nkonsonkonson') {
    title.textContent = 'Module 5: Social Networking - Nkonsonkonson (Chain Link)';
    body.innerHTML = `
      <p>Nkonsonkonson represents the chain link - the interconnectedness of all things. Social media connects us, but we must maintain healthy boundaries.</p>
      <h3>Learning Objectives</h3>
      <ul>
        <li>Understand social media privacy</li>
        <li>Manage your digital footprint</li>
        <li>Recognize online harassment</li>
        <li>Build positive online relationships</li>
      </ul>
      <h3>Step-by-Step Guide</h3>
      <ol>
        <li><strong>Privacy Settings:</strong> Review and adjust privacy settings on all social platforms.</li>
        <li><strong>Think Before Posting:</strong> Consider who might see your posts and how they might be interpreted.</li>
        <li><strong>Limit Personal Information:</strong> Don't share your address, phone number, or financial details.</li>
        <li><strong>Report Harassment:</strong> Use platform reporting tools for inappropriate content.</li>
        <li><strong>Digital Detox:</strong> Take breaks from social media to maintain mental health.</li>
      </ol>
      <p><strong>Remember:</strong> Strong connections are built on trust and respect!</p>
    `;
    setupQuiz(symbol);
  }
}
        <li>Avoid online threats</li>
        <li>Practice safe browsing habits</li>
        <li>Report suspicious content</li>
      </ul>

      <h3>Step-by-Step Guide</h3>
      <ol>
        <li><strong>Check Website Safety:</strong> Look for "https://" and a lock icon in the address bar.</li>
        <li><strong>Avoid Suspicious Links:</strong> Don't click links from unknown senders or pop-ups.</li>
        <li><strong>Use Safe Search:</strong> Enable Google SafeSearch in settings to filter inappropriate content.</li>
        <li><strong>Install Security Apps:</strong> Use antivirus apps to protect against malware.</li>
        <li><strong>Report Problems:</strong> Use browser reporting tools for unsafe websites.</li>
      </ol>

      <p><strong>Remember:</strong> Peace comes from wisdom - browse safely and stay calm online!</p>
    `;
    setupQuiz(symbol);
  } else if (symbol === 'nkonsonkonson') {
    title.textContent = 'Module 5: Social Networking - Nkonsonkonson (Chain Link)';
    body.innerHTML = `
      <p>Nkonsonkonson represents the chain link - the interconnectedness of all things. Social media connects us, but we must build these connections responsibly.</p>

      <h3>Learning Objectives</h3>
      <ul>
        <li>Understand social media safely</li>
        <li>Manage privacy settings</li>
        <li>Build positive online relationships</li>
        <li>Recognize online harassment</li>
      </ul>

      <h3>Step-by-Step Guide</h3>
      <ol>
        <li><strong>Set Privacy Settings:</strong> Make your profiles private and control who sees your posts.</li>
        <li><strong>Think Before Sharing:</strong> Consider if photos or information could harm you or others.</li>
        <li><strong>Connect Wisely:</strong> Only accept friend requests from people you know in real life.</li>
        <li><strong>Report Harassment:</strong> Use platform reporting tools for abusive behavior.</li>
        <li><strong>Balance Online Time:</strong> Spend time with real friends and family too.</li>
      </ol>

      <p><strong>Remember:</strong> Strong chains are built with trust - create positive connections online!</p>
    `;
    setupQuiz(symbol);
  }

  modal.style.display = 'block';
  updateProgress();
}

function setupQuiz(symbol) {
  const question = document.getElementById('quiz-question');
  const options = document.getElementById('quiz-options');
  const submitBtn = document.getElementById('submit-quiz');
  const feedback = document.getElementById('quiz-feedback');

  // Show quiz section
  document.getElementById('quiz-section').style.display = 'block';

  if (symbol === 'gye-nyame') {
    question.textContent = 'What does the Gye Nyame symbol represent in the context of cybersecurity?';
    options.innerHTML = `
      <div class="quiz-option" data-correct="false">God's love and mercy</div>
      <div class="quiz-option" data-correct="true">Supreme protection and security</div>
      <div class="quiz-option" data-correct="false">Wisdom and knowledge</div>
      <div class="quiz-option" data-correct="false">Peace and harmony</div>
    `;
  } else if (symbol === 'sankofa') {
    question.textContent = 'What is the main purpose of data backup according to the Sankofa principle?';
    options.innerHTML = `
      <div class="quiz-option" data-correct="true">To go back and retrieve what you've lost</div>
      <div class="quiz-option" data-correct="false">To store old photos only</div>
      <div class="quiz-option" data-correct="false">To share data with others</div>
      <div class="quiz-option" data-correct="false">To delete unnecessary files</div>
    `;
  } else if (symbol === 'akasa') {
    question.textContent = 'What does Akasa teach us about internet connectivity?';
    options.innerHTML = `
      <div class="quiz-option" data-correct="false">To avoid using the internet</div>
      <div class="quiz-option" data-correct="true">To use the internet wisely like God's guidance</div>
      <div class="quiz-option" data-correct="false">To connect to any Wi-Fi network</div>
      <div class="quiz-option" data-correct="false">To use unlimited data</div>
    `;
  } else if (symbol === 'adwo') {
    question.textContent = 'What should you look for to ensure a website is safe according to Adwo?';
    options.innerHTML = `
      <div class="quiz-option" data-correct="false">Colorful design</div>
      <div class="quiz-option" data-correct="true">"https://" and a lock icon</div>
      <div class="quiz-option" data-correct="false">Many advertisements</div>
      <div class="quiz-option" data-correct="false">Familiar company name</div>
    `;
  } else if (symbol === 'nkonsonkonson') {
    question.textContent = 'What does Nkonsonkonson teach about social networking?';
    options.innerHTML = `
      <div class="quiz-option" data-correct="false">To avoid all social connections</div>
      <div class="quiz-option" data-correct="true">To build strong connections responsibly</div>
      <div class="quiz-option" data-correct="false">To share everything online</div>
      <div class="quiz-option" data-correct="false">To spend all time on social media</div>
    `;
  }

  // Add click handlers
  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  submitBtn.onclick = function() {
    const selected = document.querySelector('.quiz-option.selected');
    if (!selected) {
      feedback.innerHTML = '<p style="color: var(--danger);">Please select an answer.</p>';
      return;
    }

    const isCorrect = selected.getAttribute('data-correct') === 'true';
    if (isCorrect) {
      feedback.innerHTML = '<p style="color: var(--success);">✓ Correct! You\'ve completed this module.</p>';
      if (!completedModules.includes(symbol)) {
        completedModules.push(symbol);
        localStorage.setItem('completedModules', JSON.stringify(completedModules));
      }
      document.getElementById('next-lesson').style.display = 'inline-block';
      updateProgress();
    } else {
      feedback.innerHTML = '<p style="color: var(--danger);">✗ Not quite. Try again or review the lesson.</p>';
    }
  };
}

function closeLesson() {
  document.getElementById('lesson-modal').style.display = 'none';
  document.getElementById('quiz-section').style.display = 'none';
  document.getElementById('next-lesson').style.display = 'none';
  document.getElementById('quiz-feedback').innerHTML = '';
}

// Add event listeners for navigation buttons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize app
  initTheme();
  initNavbar();
  updateProgress();

  // Add step navigation listeners
  document.getElementById('prev-step').addEventListener('click', prevStep);
  document.getElementById('next-step').addEventListener('click', nextStep);
  document.getElementById('complete-lesson').addEventListener('click', completeLesson);

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for reaching out! We will get back to you soon.');
      contactForm.reset();
    });
  }
});