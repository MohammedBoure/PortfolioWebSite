let projectsData = [];
let activeCard = null;

// Create a single image overlay for all project cards
const imageOverlay = document.createElement('div');
imageOverlay.className = 'image-overlay';
imageOverlay.style.display = 'none';
document.body.appendChild(imageOverlay);

// Close overlay on click
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
        // Fallback: Display placeholder message
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Unable to load projects. Please try again later.</p>';
        }
    }
}

function renderProjects(lang) {
    const projectsGrid = document.querySelector('.projects-grid');
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
        lang = 'en'; // Fallback to English
    }

    projectsGrid.innerHTML = ''; // Clear existing content
    projectsData.forEach(project => {
        // Validate project data
        if (!project.title || !project.description || !project.images || !project.technologies) {
            console.warn('Invalid project data:', project);
            return;
        }

        // Select title and description based on language
        const title = project.title[lang] || project.title.en || 'Untitled Project';
        const description = project.description[lang] || project.description.en || 'No description available';

        // Create project card
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        // Create project image container
        const projectImage = document.createElement('div');
        projectImage.className = 'project-image';
        projectImage.style.backgroundImage = `url(${project.images[0] || ''})`;

        // Store current image index and images array
        projectCard.dataset.currentImageIndex = 0;
        projectCard.dataset.images = JSON.stringify(project.images || []);

        // Auto-rotate images every 3-7 seconds
        if (project.images && project.images.length > 1) {
            setInterval(() => {
                const currentIndex = parseInt(projectCard.dataset.currentImageIndex);
                const images = JSON.parse(projectCard.dataset.images);
                const nextIndex = (currentIndex + 1) % images.length;
                projectImage.style.backgroundImage = `url(${images[nextIndex]})`;
                projectCard.dataset.currentImageIndex = nextIndex;
                // Update overlay if this card is active
                if (activeCard === projectCard) {
                    imageOverlay.style.backgroundImage = `url(${images[nextIndex]})`;
                }
            }, random(3000, 7000));
        }

        // Toggle overlay on click
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

        // Create project content
        const projectContent = document.createElement('div');
        projectContent.className = 'project-content';

        // Project title
        const projectTitle = document.createElement('h3');
        projectTitle.className = 'project-title';
        projectTitle.textContent = title;

        // Project description
        const projectDescription = document.createElement('p');
        projectDescription.className = 'project-description';
        projectDescription.textContent = description;

        // Project technologies
        const projectTech = document.createElement('div');
        projectTech.className = 'project-tech';
        (project.technologies || []).forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'tech-tag';
            techTag.textContent = tech;
            projectTech.appendChild(techTag);
        });

        // Project links
        const projectLinks = document.createElement('div');
        projectLinks.className = 'project-links';
        const viewProjectLink = document.createElement('a');
        viewProjectLink.href = project.projectLink || '#';
        viewProjectLink.className = 'project-link';
        viewProjectLink.textContent = translations[lang]?.view_project || 'View Project';
        viewProjectLink.addEventListener('click', (e) => e.stopPropagation());
        const sourceCodeLink = document.createElement('a');
        sourceCodeLink.href = project.sourceLink || '#';
        sourceCodeLink.className = 'project-link';
        sourceCodeLink.textContent = translations[lang]?.source_code || 'Source Code';
        sourceCodeLink.addEventListener('click', (e) => e.stopPropagation());
        projectLinks.appendChild(viewProjectLink);
        projectLinks.appendChild(sourceCodeLink);

        // Assemble project content
        projectContent.appendChild(projectTitle);
        projectContent.appendChild(projectDescription);
        projectContent.appendChild(projectTech);
        projectContent.appendChild(projectLinks);

        // Assemble project card
        projectCard.appendChild(projectImage);
        projectCard.appendChild(projectContent);

        // Append to projects grid
        projectsGrid.appendChild(projectCard);
    });
}

// Load projects when DOM is ready
document.addEventListener('DOMContentLoaded', loadProjects);