/* ==========================================================================
   NEXTDEV.AI - Main Application Logic & AI Matching Engine
   ========================================================================== */

// Initial Sample Job Listings Database
const INITIAL_JOBS = [
    {
        id: "job-1",
        title: "Software Developer - Full Stack (AI & Web)",
        company: "Globalco Dev Tech",
        companyLogo: "GC",
        logoBg: "linear-gradient(135deg, #10b981, #06b6d4)",
        category: "Full Stack",
        location: "Hyderabad",
        jobType: "Full-time",
        salary: "₹14 - ₹22 LPA",
        salaryVal: 22,
        posted: "2 hours ago",
        tags: ["React", "Python", "Node.js", "TypeScript", "Docker", "Git"],
        description: "Globalco is seeking a passionate Software Developer to build high-scale web applications and AI tools. You will participate in architecture, CI/CD pipelines, and modern frontend/backend development in our Hyderabad office.",
        requirements: [
            "Proficiency in JavaScript (React/Next.js) and Python or Node.js backend services.",
            "Experience writing CI/CD workflows (GitHub Actions or GitLab CI) and Docker containerization.",
            "Strong understanding of REST APIs, database design (PostgreSQL/MongoDB), and version control.",
            "Bachelor's degree in CS, IT, or equivalent practical developer experience."
        ]
    },
    {
        id: "job-2",
        title: "Senior AI / Machine Learning Engineer",
        company: "NeuralVibe AI",
        companyLogo: "NV",
        logoBg: "linear-gradient(135deg, #8b5cf6, #ec4899)",
        category: "AI/ML",
        location: "Remote",
        jobType: "Full-time",
        salary: "₹25 - ₹40 LPA",
        salaryVal: 40,
        posted: "5 hours ago",
        tags: ["PyTorch", "Python", "LLMs", "FastAPI", "Transformers", "AWS"],
        description: "Join NeuralVibe to build domain-specific Large Language Model applications, RAG pipelines, and high-throughput inference APIs for enterprise clients worldwide.",
        requirements: [
            "3+ years experience with PyTorch, Hugging Face Transformers, and OpenAI APIs.",
            "Experience deploying machine learning models via FastAPI / Docker on cloud infrastructure.",
            "Deep understanding of vector databases (ChromaDB, Pinecone, Qdrant)."
        ]
    },
    {
        id: "job-3",
        title: "Frontend Architect (React & Web Performance)",
        company: "CloudStack Inc",
        companyLogo: "CS",
        logoBg: "linear-gradient(135deg, #3b82f6, #6366f1)",
        category: "Frontend",
        location: "Hyderabad",
        jobType: "Full-time",
        salary: "₹18 - ₹28 LPA",
        salaryVal: 28,
        posted: "1 day ago",
        tags: ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux"],
        description: "Lead our frontend engineering team in crafting lightning-fast, accessible dashboard applications with dynamic animations and modern glassmorphism design systems.",
        requirements: [
            "Expert-level knowledge of React 18, HTML5, CSS3, and TypeScript.",
            "Proven track record of optimizing Web Vitals and frontend bundle sizes.",
            "Strong design intuition and experience collaborating closely with UI/UX designers."
        ]
    },
    {
        id: "job-4",
        title: "Backend Platform Engineer (Go & Microservices)",
        company: "Apex Systems",
        companyLogo: "AS",
        logoBg: "linear-gradient(135deg, #f59e0b, #ef4444)",
        category: "Backend",
        location: "Bengaluru",
        jobType: "Full-time",
        salary: "₹20 - ₹32 LPA",
        salaryVal: 32,
        posted: "1 day ago",
        tags: ["Golang", "PostgreSQL", "Kafka", "gRPC", "Kubernetes"],
        description: "Scale core backend infrastructure handling over 50,000 requests per second. Build resilient microservices and distributed database pipelines.",
        requirements: [
            "Solid experience writing concurrent services in Go or Java.",
            "Hands-on experience with Kafka messaging queues and SQL query optimization.",
            "Familiarity with Kubernetes orchestration and Prometheus monitoring."
        ]
    },
    {
        id: "job-5",
        title: "DevOps & Cloud Automation Engineer",
        company: "DataSphere Global",
        companyLogo: "DS",
        logoBg: "linear-gradient(135deg, #06b6d4, #10b981)",
        category: "DevOps",
        location: "Remote",
        jobType: "Contract",
        salary: "$70 - $90 / hr",
        salaryVal: 35,
        posted: "2 days ago",
        tags: ["AWS", "Terraform", "GitHub Actions", "Docker", "Kubernetes"],
        description: "Design automated CI/CD pipelines, infrastructure-as-code scripts with Terraform, and zero-downtime deployment strategies on AWS & Vercel.",
        requirements: [
            "Deep expertise with AWS services (EKS, Lambda, S3, CloudFront).",
            "Proficiency writing Terraform modules and CI/CD pipelines.",
            "Strong scripting skills in Bash / Python."
        ]
    },
    {
        id: "job-6",
        title: "Junior Python & Data Engineer",
        company: "Vanguard Tech",
        companyLogo: "VT",
        logoBg: "linear-gradient(135deg, #6366f1, #a855f7)",
        category: "AI/ML",
        location: "Pune",
        jobType: "Full-time",
        salary: "₹8 - ₹12 LPA",
        salaryVal: 12,
        posted: "3 days ago",
        tags: ["Python", "Pandas", "SQL", "Airflow", "FastAPI"],
        description: "Great entry-level opportunity for data enthusiasts to build ETL pipelines, clean dataset feeds, and expose data analytics endpoints.",
        requirements: [
            "Strong Python fundamentals (Pandas, NumPy, Scikit-learn).",
            "Good knowledge of SQL queries and relational databases.",
            "Eagerness to learn cloud data warehousing (Snowflake/BigQuery)."
        ]
    }
];

// App State Management
class AppState {
    constructor() {
        this.jobs = JSON.parse(localStorage.getItem('nextdev_jobs')) || INITIAL_JOBS;
        this.savedJobIds = new Set(JSON.parse(localStorage.getItem('nextdev_saved_ids')) || []);
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.locationFilter = 'all';
        this.jobTypeFilter = 'all';
        this.sortBy = 'newest';
        this.theme = localStorage.getItem('nextdev_theme') || 'dark';
    }

    saveJobs() {
        localStorage.setItem('nextdev_jobs', JSON.stringify(this.jobs));
    }

    saveSavedIds() {
        localStorage.setItem('nextdev_saved_ids', JSON.stringify(Array.from(this.savedJobIds)));
    }

    toggleSaveJob(jobId) {
        if (this.savedJobIds.has(jobId)) {
            this.savedJobIds.delete(jobId);
        } else {
            this.savedJobIds.add(jobId);
        }
        this.saveSavedIds();
        return this.savedJobIds.has(jobId);
    }
}

const state = new AppState();

// DOM Elements Selection
const DOM = {
    jobsContainer: document.getElementById('jobs-list-container'),
    visibleCount: document.getElementById('visible-job-count'),
    savedCount: document.getElementById('saved-count'),
    categoryTabs: document.querySelectorAll('.tab-btn'),
    searchQuery: document.getElementById('search-query'),
    locationFilter: document.getElementById('location-filter'),
    jobtypeFilter: document.getElementById('jobtype-filter'),
    sortSelect: document.getElementById('sort-select'),
    btnSearchTrigger: document.getElementById('btn-search-trigger'),
    
    // Theme Toggle
    themeBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),

    // AI Matcher Modal Elements
    btnOpenAiModal: document.getElementById('btn-open-ai-modal'),
    btnHeroAiMatch: document.getElementById('btn-hero-ai-match'),
    navAiMatcher: document.getElementById('nav-ai-matcher'),
    aiModalBackdrop: document.getElementById('ai-modal-backdrop'),
    closeAiModal: document.getElementById('close-ai-modal'),
    aiSelectJob: document.getElementById('ai-select-job'),
    aiResumeText: document.getElementById('ai-resume-text'),
    btnRunAiMatch: document.getElementById('btn-run-ai-match'),
    aiResultsWrapper: document.getElementById('ai-results-wrapper'),
    scoreMeter: document.getElementById('score-meter'),
    scoreText: document.getElementById('score-text'),
    scoreHeadline: document.getElementById('score-headline'),
    scoreFeedback: document.getElementById('score-feedback'),
    matchedTags: document.getElementById('matched-tags'),
    missingTags: document.getElementById('missing-tags'),

    // Job Details Modal
    jobDetailsBackdrop: document.getElementById('job-details-backdrop'),
    closeJobDetails: document.getElementById('close-job-details'),
    detailTitle: document.getElementById('detail-job-title'),
    detailCompany: document.getElementById('detail-company-name'),
    detailCompanyLogo: document.getElementById('detail-company-logo'),
    detailLocation: document.getElementById('detail-location'),
    detailJobtype: document.getElementById('detail-jobtype'),
    detailSalary: document.getElementById('detail-salary'),
    detailCategory: document.getElementById('detail-category'),
    detailDescription: document.getElementById('detail-description'),
    detailSkillsList: document.getElementById('detail-skills-list'),
    quickApplyForm: document.getElementById('quick-apply-form'),
    btnCancelApply: document.getElementById('btn-cancel-apply'),

    // Post Job Modal
    btnOpenPostJob: document.getElementById('btn-open-post-job'),
    navPostJob: document.getElementById('nav-post-job'),
    postJobBackdrop: document.getElementById('post-job-backdrop'),
    closePostJob: document.getElementById('close-post-job'),
    createJobForm: document.getElementById('create-job-form'),
    btnCancelPost: document.getElementById('btn-cancel-post'),

    // Saved Jobs Nav
    navSavedJobs: document.getElementById('nav-saved-jobs'),
    
    // Toast Container
    toastContainer: document.getElementById('toast-container')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderJobs();
    populateAiJobDropdown();
    setupEventListeners();
    updateSavedCounter();
});

// Theme Management
function initTheme() {
    if (state.theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        DOM.themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.removeAttribute('data-theme');
        DOM.themeIcon.className = 'fa-solid fa-moon';
    }
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nextdev_theme', state.theme);
    initTheme();
    showToast(`Switched to ${state.theme.toUpperCase()} theme mode.`, 'info');
}

// Filter and Render Jobs
function getFilteredJobs() {
    let result = [...state.jobs];

    // Filter by Category
    if (state.currentCategory !== 'all') {
        if (state.currentCategory === 'saved') {
            result = result.filter(j => state.savedJobIds.has(j.id));
        } else {
            result = result.filter(j => j.category === state.currentCategory);
        }
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(j => 
            j.title.toLowerCase().includes(query) ||
            j.company.toLowerCase().includes(query) ||
            j.tags.some(t => t.toLowerCase().includes(query)) ||
            j.description.toLowerCase().includes(query)
        );
    }

    // Filter by Location
    if (state.locationFilter !== 'all') {
        result = result.filter(j => j.location.toLowerCase().includes(state.locationFilter.toLowerCase()));
    }

    // Filter by Job Type
    if (state.jobTypeFilter !== 'all') {
        result = result.filter(j => j.jobType === state.jobTypeFilter);
    }

    // Sorting
    if (state.sortBy === 'salary') {
        result.sort((a, b) => b.salaryVal - a.salaryVal);
    } else if (state.sortBy === 'newest') {
        // Keeps list order as newest
    }

    return result;
}

function renderJobs() {
    const jobs = getFilteredJobs();
    DOM.visibleCount.textContent = jobs.length;
    DOM.jobsContainer.innerHTML = '';

    if (jobs.length === 0) {
        DOM.jobsContainer.innerHTML = `
            <div class="glass-card" style="padding: 40px; text-align: center;">
                <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
                <h3>No Job Opportunities Found</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        const isSaved = state.savedJobIds.has(job.id);
        const card = document.createElement('div');
        card.className = 'job-card glass-card';
        card.innerHTML = `
            <div class="job-card-header">
                <div class="company-info">
                    <div class="company-logo-avatar" style="background: ${job.logoBg}">${job.companyLogo}</div>
                    <div class="job-title-group">
                        <h3 onclick="openJobDetails('${job.id}')">${job.title}</h3>
                        <span class="company-name">${job.company}</span>
                    </div>
                </div>
                <div class="job-card-actions">
                    <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="handleToggleSave('${job.id}', event)" title="Save Job">
                        <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                    </button>
                </div>
            </div>

            <p style="font-size: 0.9rem; color: var(--text-secondary); line-clamp: 2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                ${job.description}
            </p>

            <div class="job-tags-row">
                <span class="tag-badge badge-location"><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                <span class="tag-badge badge-salary"><i class="fa-solid fa-money-bill-wave"></i> ${job.salary}</span>
                <span class="tag-badge"><i class="fa-solid fa-clock"></i> ${job.jobType}</span>
                ${job.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
            </div>

            <div class="job-card-footer">
                <span class="posted-time"><i class="fa-regular fa-clock"></i> Posted ${job.posted}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="quickAiTest('${job.id}')">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> AI Score
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="openJobDetails('${job.id}')">
                        View & Apply <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        DOM.jobsContainer.appendChild(card);
    });
}

function updateSavedCounter() {
    DOM.savedCount.textContent = state.savedJobIds.size;
}

function handleToggleSave(jobId, e) {
    e.stopPropagation();
    const isNowSaved = state.toggleSaveJob(jobId);
    updateSavedCounter();
    renderJobs();
    showToast(isNowSaved ? 'Job saved to your bookmarks!' : 'Job removed from bookmarks.', 'info');
}

// AI Resume Engine Logic
function populateAiJobDropdown() {
    DOM.aiSelectJob.innerHTML = state.jobs.map(j => `<option value="${j.id}">${j.title} (${j.company})</option>`).join('');
}

function runAiMatchAnalysis() {
    const jobId = DOM.aiSelectJob.value;
    const resumeText = DOM.aiResumeText.value.trim();

    if (!resumeText) {
        showToast('Please paste your resume content or skill list first.', 'warning');
        return;
    }

    const targetJob = state.jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    // Skill & Keyword Matcher Engine
    const targetKeywords = [...targetJob.tags, "Git", "REST", "Database", "Agile", "Testing", "CI/CD", "Problem Solving"];
    const resumeLower = resumeText.toLowerCase();

    const matched = [];
    const missing = [];

    targetKeywords.forEach(kw => {
        if (resumeLower.includes(kw.toLowerCase())) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    });

    // Compute Compatibility Percentage Score
    let baseScore = Math.round((matched.length / targetKeywords.length) * 100);
    // Add realistic length & experience heuristic boost
    if (resumeText.length > 200) baseScore = Math.min(98, baseScore + 15);
    if (baseScore < 35) baseScore = 48; // minimum heuristic floor for candidate encouragement

    // Render AI Results UI
    DOM.aiResultsWrapper.classList.remove('hidden');
    DOM.scoreMeter.style.setProperty('--percentage', `${baseScore}%`);
    DOM.scoreText.textContent = `${baseScore}%`;

    if (baseScore >= 80) {
        DOM.scoreHeadline.textContent = "🔥 Outstanding Match!";
        DOM.scoreFeedback.textContent = `Your profile aligns exceptionally well with ${targetJob.company}'s core requirements. High probability of interview shortlisting!`;
    } else if (baseScore >= 60) {
        DOM.scoreHeadline.textContent = "⚡ Strong Candidate Profile";
        DOM.scoreFeedback.textContent = `You match key requirements for ${targetJob.title}. Consider adding missing keywords like ${missing.slice(0,2).join(', ')} to boost score.`;
    } else {
        DOM.scoreHeadline.textContent = "💡 Good Potential with Gap Area";
        DOM.scoreFeedback.textContent = `You have foundational skills, but highlighting experience in ${missing.slice(0,3).join(', ')} will make your application stand out.`;
    }

    // Render Tags
    DOM.matchedTags.innerHTML = matched.length ? matched.map(m => `<span class="tag-matched">✓ ${m}</span>`).join('') : '<span style="color:var(--text-muted); font-size:0.8rem;">No direct keyword matches found.</span>';
    DOM.missingTags.innerHTML = missing.length ? missing.map(m => `<span class="tag-missing">+ ${m}</span>`).join('') : '<span style="color:var(--text-muted); font-size:0.8rem;">All key requirements matched!</span>';

    showToast(`AI Match Analysis complete! Score: ${baseScore}%`, 'success');
}

function quickAiTest(jobId) {
    DOM.aiSelectJob.value = jobId;
    DOM.aiModalBackdrop.classList.add('active');
    DOM.aiResumeText.value = "Experienced Software Developer proficient in React, JavaScript, Python, Node.js, REST APIs, Git, and Docker. Passionate about building robust web apps and CI/CD pipelines.";
    runAiMatchAnalysis();
}

// Modal Handlers
function openJobDetails(jobId) {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return;

    DOM.detailTitle.textContent = job.title;
    DOM.detailCompany.textContent = `${job.company} • ${job.location}`;
    DOM.detailCompanyLogo.textContent = job.companyLogo;
    DOM.detailCompanyLogo.style.background = job.logoBg;
    DOM.detailLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${job.location}`;
    DOM.detailJobtype.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${job.jobType}`;
    DOM.detailSalary.innerHTML = `<i class="fa-solid fa-money-bill-wave"></i> ${job.salary}`;
    DOM.detailCategory.textContent = job.category;
    DOM.detailDescription.textContent = job.description;

    DOM.detailSkillsList.innerHTML = job.requirements.map(req => `<li><i class="fa-solid fa-check" style="color:var(--accent-emerald);"></i> ${req}</li>`).join('');

    DOM.jobDetailsBackdrop.classList.add('active');
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme toggle
    DOM.themeBtn.addEventListener('click', toggleTheme);

    // Search and Filter Events
    DOM.btnSearchTrigger.addEventListener('click', () => {
        state.searchQuery = DOM.searchQuery.value;
        state.locationFilter = DOM.locationFilter.value;
        state.jobTypeFilter = DOM.jobtypeFilter.value;
        renderJobs();
    });

    DOM.searchQuery.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            state.searchQuery = DOM.searchQuery.value;
            renderJobs();
        }
    });

    DOM.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderJobs();
    });

    // Category Tabs
    DOM.categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            DOM.categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentCategory = tab.dataset.category;
            renderJobs();
        });
    });

    // Nav Saved Jobs
    DOM.navSavedJobs.addEventListener('click', (e) => {
        e.preventDefault();
        DOM.categoryTabs.forEach(t => t.classList.remove('active'));
        state.currentCategory = 'saved';
        renderJobs();
        showToast('Displaying your saved bookmark jobs.', 'info');
    });

    // AI Modal Open/Close
    const openAiModal = () => DOM.aiModalBackdrop.classList.add('active');
    const closeAiModal = () => DOM.aiModalBackdrop.classList.remove('active');

    DOM.btnOpenAiModal.addEventListener('click', openAiModal);
    DOM.btnHeroAiMatch.addEventListener('click', openAiModal);
    DOM.navAiMatcher.addEventListener('click', (e) => { e.preventDefault(); openAiModal(); });
    DOM.closeAiModal.addEventListener('click', closeAiModal);
    DOM.btnRunAiMatch.addEventListener('click', runAiMatchAnalysis);

    // Job Details Modal Close
    const closeDetails = () => DOM.jobDetailsBackdrop.classList.remove('active');
    DOM.closeJobDetails.addEventListener('click', closeDetails);
    DOM.btnCancelApply.addEventListener('click', closeDetails);

    // Quick Apply Form Submit
    DOM.quickApplyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const candidateName = document.getElementById('apply-name').value;
        closeDetails();
        showToast(`🎉 Application successfully submitted! Recruiter team at ${DOM.detailCompany.textContent.split('•')[0]} notified.`, 'success');
        DOM.quickApplyForm.reset();
    });

    // Post Job Modal Open/Close
    const openPostModal = () => DOM.postJobBackdrop.classList.add('active');
    const closePostModal = () => DOM.postJobBackdrop.classList.remove('active');

    DOM.btnOpenPostJob.addEventListener('click', openPostModal);
    DOM.navPostJob.addEventListener('click', (e) => { e.preventDefault(); openPostModal(); });
    DOM.closePostJob.addEventListener('click', closePostModal);
    DOM.btnCancelPost.addEventListener('click', closePostModal);

    // Post Job Form Submit
    DOM.createJobForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('new-job-title').value;
        const company = document.getElementById('new-company-name').value;
        const category = document.getElementById('new-category').value;
        const location = document.getElementById('new-location').value;
        const jobType = document.getElementById('new-jobtype').value;
        const salary = document.getElementById('new-salary').value || '₹12 - ₹20 LPA';
        const tagsInput = document.getElementById('new-tags').value;
        const description = document.getElementById('new-description').value;

        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [category, 'Web'];

        const newJob = {
            id: 'job-' + Date.now(),
            title,
            company,
            companyLogo: company.slice(0, 2).toUpperCase(),
            logoBg: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            category,
            location,
            jobType,
            salary,
            salaryVal: 20,
            posted: 'Just now',
            tags,
            description,
            requirements: [
                `Hands-on experience in ${tags.join(', ')}.`,
                'Strong problem solving and communication skills.',
                'Ability to work collaboratively in a high-growth engineering environment.'
            ]
        };

        state.jobs.unshift(newJob);
        state.saveJobs();
        populateAiJobDropdown();
        renderJobs();
        closePostModal();
        DOM.createJobForm.reset();

        showToast(`✨ Job Listing "${title}" published successfully!`, 'success');
    });
}

// Toast System Helper
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-indigo);"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
