let projectsData = [];
let activeCard = null;
let currentPage = 1;
const projectsPerPage = 6; // Increased to 6 projects per page (2 per row, up to 3 rows)

const imageOverlay = document.createElement('div');
imageOverlay.className = 'image-overlay';
imageOverlay.style.display = 'none';
document.body.appendChild(imageOverlay);

imageOverlay.addEventListener('click', () => {
    imageOverlay.style.display = 'none';
    imageOverlay.classList.remove('active');
    activeCard = null;
});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) {
            throw new Error(`Failed to load projects.json: ${response.status}`);
        }
        projectsData = await response.json();
        if (!Array.isArray(projectsData)) {
            throw new Error('projects.json does not contain a valid array');
        }
        renderProjects(document.documentElement.lang || 'en');
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Unable to load projects. Please try again later.</p>';
        }
    }
}

function renderProjects(lang) {
    const projectsGrid = document.querySelector('.projects-grid');
    const paginationContainer = document.querySelector('.pagination');
    if (!projectsGrid) {
        console.error('Projects grid element (.projects-grid) not found');
        return;
    }
    if (!projectsData.length) {
        console.warn('No project data available');
        projectsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No projects available.</p>';
        return;
    }
    if (typeof translations !== 'object' || !translations[lang]) {
        console.warn(`Translations for language "${lang}" not loaded`);
        lang = 'en';
    }

    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const projectsToDisplay = projectsData.slice(startIndex, endIndex);

    projectsGrid.innerHTML = '';

    projectsToDisplay.forEach(project => {
        if (!project.title || !project.description || !project.images || !project.technologies) {
            console.warn('Invalid project data:', project);
            return;
        }

        const title = project.title[lang] || project.title.en || 'Untitled Project';
        const description = project.description[lang] || project.description.en || 'No description available';
        const youtubeLink = lang === 'ar' ? project['projectLink-youtube-ar'] : project['projectLink-youtube-en'];

        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const projectImage = document.createElement('div');
        projectImage.className = 'project-image';
        projectImage.style.backgroundImage = `url(${project.images[0] || ''})`;

        projectCard.dataset.currentImageIndex = 0;
        projectCard.dataset.images = JSON.stringify(project.images || []);

        if (project.images && project.images.length > 1) {
            setInterval(() => {
                const currentIndex = parseInt(projectCard.dataset.currentImageIndex);
                const images = JSON.parse(projectCard.dataset.images);
                const nextIndex = (currentIndex + 1) % images.length;
                projectImage.style.backgroundImage = `url(${images[nextIndex]})`;
                projectCard.dataset.currentImageIndex = nextIndex;
                if (activeCard === projectCard) {
                    imageOverlay.style.backgroundImage = `url(${images[nextIndex]})`;
                }
            }, random(3000, 7000));
        }

        projectCard.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentIndex = parseInt(projectCard.dataset.currentImageIndex);
            const images = JSON.parse(projectCard.dataset.images);
            if (activeCard === projectCard) {
                imageOverlay.style.display = 'none';
                imageOverlay.classList.remove('active');
                activeCard = null;
            } else if (images.length > 0) {
                imageOverlay.style.backgroundImage = `url(${images[currentIndex]})`;
                imageOverlay.style.display = 'block';
                imageOverlay.classList.add('active');
                activeCard = projectCard;
            }
        });

        const projectContent = document.createElement('div');
        projectContent.className = 'project-content';

        const projectTitle = document.createElement('h3');
        projectTitle.className = 'project-title';
        projectTitle.textContent = title;

        const projectDescription = document.createElement('p');
        projectDescription.className = 'project-description';
        projectDescription.textContent = description;

        const projectStatus = document.createElement('p');
        projectStatus.className = 'project-status';
        projectStatus.textContent = `${translations[lang]?.status || 'Status'}: ${project.status || 'Unknown'}`;

        const projectTech = document.createElement('div');
        projectTech.className = 'project-tech';
        (project.technologies || []).forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'tech-tag';
            techTag.textContent = tech;
            projectTech.appendChild(techTag);
        });

        const projectLinks = document.createElement('div');
        projectLinks.className = 'project-links';

        const linkConfig = [
            { key: 'projectLink', label: translations[lang]?.view_project || 'View Project' },
            { key: 'projectLink-dashboard', label: translations[lang]?.view_dashboard || 'View Dashboard' },
            { key: 'sourceLink-backend', label: translations[lang]?.source_backend || 'Backend Source' },
            { key: 'sourceLink-frontend', label: translations[lang]?.source_frontend || 'Frontend Source' },
            { key: 'sourceLink-database', label: translations[lang]?.source_database || 'Database Source' },
            { key: 'sourceLink-documentation', label: translations[lang]?.source_documentation || 'Documentation' },
            { key: youtubeLink ? (lang === 'ar' ? 'projectLink-youtube-ar' : 'projectLink-youtube-en') : null, label: translations[lang]?.view_youtube || 'Watch Demo' }
        ];

        linkConfig.forEach(({ key, label }) => {
            if (key && project[key] && project[key] !== '') {
                const link = document.createElement('a');
                link.href = project[key];
                link.className = 'project-link';
                link.textContent = label;
                link.addEventListener('click', (e) => e.stopPropagation());
                projectLinks.appendChild(link);
            }
        });

        projectContent.appendChild(projectTitle);
        projectContent.appendChild(projectDescription);
        projectContent.appendChild(projectStatus);
        projectContent.appendChild(projectTech);
        projectContent.appendChild(projectLinks);

        projectCard.appendChild(projectImage);
        projectCard.appendChild(projectContent);

        projectsGrid.appendChild(projectCard);
    });

    if (paginationContainer) {
        renderPagination(lang);
    }
}

function renderPagination(lang) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) {
        console.error('Pagination container (.pagination) not found');
        return;
    }

    const totalPages = Math.ceil(projectsData.length / projectsPerPage);
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button';
    prevButton.textContent = translations[lang]?.previous || 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects(lang);
        }
    });

    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderProjects(lang);
        });
        pageNumbers.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button';
    nextButton.textContent = translations[lang]?.next || 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProjects(lang);
        }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(nextButton);
}