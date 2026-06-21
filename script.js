// Database Mockup Array containing real-world inspired project objects
const initialJobs = [
    {
        id: "job-1",
        title: "Senior React Web Developer",
        company: "PixelPerfect Digital India",
        category: "tech",
        type: "Full-Time",
        location: "india",
        salary: 1400000,
        salaryDisplay: "₹12L - ₹16L",
        experience: "3-5 Yrs",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
        id: "job-2",
        title: "Data Analyst - Looker & SQL",
        company: "Metrics Flow Corp",
        category: "data",
        type: "Full-Time",
        location: "global",
        salary: 1100000,
        salaryDisplay: "₹9L - ₹12L",
        experience: "1-3 Yrs",
        skills: ["SQL Practice", "Looker", "Python", "Dataplex"]
    },
    {
        id: "job-3",
        title: "UI/UX Product Architect",
        company: "Creative Pulse Studios",
        category: "design",
        type: "Part-Time",
        location: "us",
        salary: 850000,
        salaryDisplay: "₹7L - ₹9L",
        experience: "2+ Yrs",
        skills: ["Figma", "Design Systems", "Wireframing"]
    },
    {
        id: "job-4",
        title: "Cloud Infrastructure Engineer",
        company: "CloudScale Tech Sol",
        category: "tech",
        type: "Contract",
        location: "india",
        salary: 2200000,
        salaryDisplay: "₹20L - ₹24L",
        experience: "5+ Yrs",
        skills: ["Terraform", "Google Kubernetes Engine", "Cloud Armor"]
    },
    {
        id: "job-5",
        title: "HR Associate & Operations Specialist",
        company: "Achiever's Innovation",
        category: "hr",
        type: "Full-Time",
        location: "india",
        salary: 450000,
        salaryDisplay: "₹4L - ₹5L",
        experience: "0-2 Yrs",
        skills: ["Onboarding", "Talent Acquisition", "Excel Management"]
    },
    {
        id: "job-6",
        title: "Backend Node.js Architect",
        company: "Alpha Core Systems",
        category: "tech",
        type: "Full-Time",
        location: "global",
        salary: 1800000,
        salaryDisplay: "₹16L - ₹20L",
        experience: "4+ Yrs",
        skills: ["Node.js", "MongoDB", "GitHub CI/CD", "Redis"]
    }
];

// App State management
let savedJobsArray = [];

// DOM Elements Selection
const jobsGrid = document.getElementById('jobsGrid');
const totalJobsCount = document.getElementById('totalJobsCount');
const keywordInput = document.getElementById('keywordInput');
const locationFilter = document.getElementById('locationFilter');
const mainSearchBtn = document.getElementById('mainSearchBtn');
const sortSalary = document.getElementById('sortSalary');

// Modal Elements
const savedJobsToggle = document.getElementById('savedJobsToggle');
const savedSidebar = document.getElementById('savedSidebar');
const closeSavedBtn = document.getElementById('closeSavedBtn');
const overlay = document.getElementById('overlay');
const savedJobsList = document.getElementById('savedJobsList');
const savedCount = document.getElementById('savedCount');

// Engine core for rendering elements
function renderJobs(data) {
    jobsGrid.innerHTML = '';
    totalJobsCount.textContent = `Found ${data.length} position${data.length === 1 ? '' : 's'} available`;

    if(data.length === 0) {
        jobsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #64748b;">
                <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No remote opportunities matched your filters. Try adjusting keywords!</p>
            </div>
        `;
        return;
    }

    data.forEach(job => {
        const isSaved = savedJobsArray.includes(job.id);
        const card = document.createElement('div');
        card.classList.add('job-card');
        
        const skillsHTML = job.skills.map(s => `<span class="pill">${s}</span>`).join('');

        card.innerHTML = `
            <div>
                <div class="card-header-top">
                    <h3 class="job-title">${job.title}</h3>
                    <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveJob('${job.id}')">
                        <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                    </button>
                </div>
                <span class="company-badge">${job.company}</span>
                <div class="metadata-row">
                    <span><i class="fa-solid fa-briefcase"></i> ${job.experience}</span>
                    <span><i class="fa-solid fa-earth-americas"></i> ${job.location.toUpperCase()}</span>
                </div>
                <div class="pill-box">
                    <span class="pill type-pill">${job.type}</span>
                    ${skillsHTML}
                </div>
            </div>
            <div class="card-footer">
                <span class="salary-txt">${job.salaryDisplay}</span>
                <button class="action-apply" onclick="triggerApplyAlert('${job.title}')">Apply Now</button>
            </div>
        `;
        jobsGrid.appendChild(card);
    });
}

// Global Filter Logic Combination
function handleFilterSearch() {
    const searchVal = keywordInput.value.toLowerCase().trim();
    const locVal = locationFilter.value;
    const sortVal = sortSalary.value;
    
    // Checked job types collect karna
    const checkedTypes = Array.from(document.querySelectorAll('.job-type-checkbox:checked')).map(el => el.value);
    
    // Checked category group radio fetch karna
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;

    let processedJobs = [...initialJobs];

    // 1. Keyword search text match logic
    if(searchVal) {
        processedJobs = processedJobs.filter(job => 
            job.title.toLowerCase().includes(searchVal) || 
            job.company.toLowerCase().includes(searchVal) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchVal))
        );
    }

    // 2. Dropdown Location filter logic
    if(locVal !== 'all') {
        processedJobs = processedJobs.filter(job => job.location === locVal);
    }

    // 3. Checkbox job type filter
    processedJobs = processedJobs.filter(job => checkedTypes.includes(job.type));

    // 4. Category radio check filter
    if(selectedCategory !== 'all') {
        processedJobs = processedJobs.filter(job => job.category === selectedCategory);
    }

    // 5. Budget level Sorting configuration
    if(sortVal === 'high') {
        processedJobs.sort((a,b) => b.salary - a.salary);
    } else if (sortVal === 'low') {
        processedJobs.sort((a,b) => a.salary - b.salary);
    }

    renderJobs(processedJobs);
}

// Bookmark / Saved System management
window.toggleSaveJob = function(id) {
    if(savedJobsArray.includes(id)) {
        savedJobsArray = savedJobsArray.filter(item => item !== id);
    } else {
        savedJobsArray.push(id);
    }
    savedCount.textContent = savedJobsArray.length;
    updateSavedSidebarUI();
    handleFilterSearch(); // UI update filter flow sync ke liye
}

function updateSavedSidebarUI() {
    savedJobsList.innerHTML = '';
    if(savedJobsArray.length === 0) {
        savedJobsList.innerHTML = '<p style="color:#64748b; font-size:0.9rem;">No bookmarks saved yet.</p>';
        return;
    }

    savedJobsArray.forEach(id => {
        const target = initialJobs.find(j => j.id === id);
        if(target) {
            const div = document.createElement('div');
            div.classList.add('saved-item-box');
            div.innerHTML = `
                <h5 style="font-weight:700; font-size:1rem;">${target.title}</h5>
                <p style="font-size:0.85rem; color:var(--brand-primary);">${target.company}</p>
                <button style="background:none; border:none; color:red; cursor:pointer; font-size:0.8rem; margin-top:0.5rem;" onclick="toggleSaveJob('${target.id}')"><i class="fa-solid fa-trash"></i> Remove</button>
            `;
            savedJobsList.appendChild(div);
        }
    });
}

window.triggerApplyAlert = function(title) {
    alert(`Success! You have initiated the secure onboarding channel application for: \n"${title}"`);
}

// DOM Event Listeners mapping
mainSearchBtn.addEventListener('click', handleFilterSearch);
keywordInput.addEventListener('input', handleFilterSearch);
locationFilter.addEventListener('change', handleFilterSearch);
sortSalary.addEventListener('change', handleFilterSearch);

document.querySelectorAll('.job-type-checkbox').forEach(box => box.addEventListener('change', handleFilterSearch));
document.querySelectorAll('input[name="category"]').forEach(radio => radio.addEventListener('change', handleFilterSearch));

// Sidebar Open/Close handlers
savedJobsToggle.addEventListener('click', () => {
    savedSidebar.classList.add('active');
    overlay.classList.add('active');
});
const closeElements = [closeSavedBtn, overlay];
closeElements.forEach(el => el.addEventListener('click', () => {
    savedSidebar.classList.remove('active');
    overlay.classList.remove('active');
}));

// App Ignition init sequence
document.addEventListener('DOMContentLoaded', () => {
    renderJobs(initialJobs);
});