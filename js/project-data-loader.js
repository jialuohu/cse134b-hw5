// local
const LOCAL_STORAGE_KEY = 'projectCardsData';
const localProjectData = [
  {
    title: 'Raft Consensus Core',
    img: 'res/project-cover-raft.webp',
    alt: 'Abstract Blue Tech Background',
    desc: 'Built a durable and fault-tolerant distributed consensus library in Go by implementing the Raft algorithm with gRPC communication.',
    link: 'pages/projects.html#project1',
    linkText: 'View Project',
  },
  {
    title: 'Distributed KV Store',
    img: 'res/project-cover-kv.png',
    alt: 'Rust Logo',
    desc: 'Implemented a fault-tolerant, Rust-based key-value store featuring a gRPC control plane with Lamport-clock convergence.',
    link: 'pages/projects.html#project2',
    linkText: 'View Project',
  },
  {
    title: 'DB Management Kernel',
    img: 'res/project-cover-dbms.webp',
    alt: 'C++ Logo',
    desc: 'Developed a high-performance C++ database kernel from scratch, implementing a paged file manager and B+ tree indexing.',
    link: 'pages/projects.html#project3',
    linkText: 'View Project',
  },
];

function initializeLocalStorage() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProjectData));
    console.log('Local storage initialized with project data');
  }
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      throw new Error('No data found in localStorage');
    }
    const projects = JSON.parse(data);
    console.log('Loaded from localStorage:', projects);
    return projects;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    throw error;
  }
}

// Remote
async function loadFromRemote() {
  const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/692e2805d0ea881f400c8db8';

  try {
    const response = await fetch(JSONBIN_URL, {
      method: 'GET',
      headers: {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const projects = data.record || data;
    console.log('Loaded from remote:', projects);
    return projects;
  } catch (error) {
    console.error('Error loading from remote:', error);
    throw error;
  }
}

// Render project cards to the DOM
function renderProjectCards(projects) {
  const container = document.querySelector('.project-card-grid');
  if (!container) {
    console.error('Project card grid container not found');
    return;
  }
  container.innerHTML = '';

  // create new cards
  projects.forEach((project) => {
    const card = document.createElement('project-card');
    card.setAttribute('title', project.title);
    card.setAttribute('img', project.img);
    card.setAttribute('alt', project.alt);
    card.setAttribute('desc', project.desc);
    card.setAttribute('link', project.link);
    if (project.linkText) {
      card.setAttribute('link-text', project.linkText);
    }

    container.appendChild(card);
  });

  console.log(`Rendered ${projects.length} project cards`);
}

// Show/hide loading indicator
function showLoading(button) {
  button.disabled = true;
  button.dataset.originalHTML = button.innerHTML;
  const icon = button.querySelector('i');
  if (icon) {
    button.innerHTML = `${icon.outerHTML} Loading...`;
  } else {
    button.textContent = 'Loading...';
  }
}
function hideLoading(button) {
  button.disabled = false;
  button.innerHTML = button.dataset.originalHTML;
}

// error msg
function showError(message) {
  const container = document.querySelector('.project-card-grid');
  if (container) {
    container.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #d32f2f; font-size: 1.2rem;">
                <i class="fa-solid fa-circle-exclamation"></i> ${message}
            </div>
        `;
  }
}

// success msg
function showSuccess(message, count) {
  const statusDiv = document.getElementById('load-status');
  if (statusDiv) {
    statusDiv.textContent = `✓ ${message} (${count} projects loaded)`;
    statusDiv.className = 'load-status success';

    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'load-status';
    }, 3000);
  }
}

async function handleLoadLocal(event) {
  const button = event.currentTarget;
  showLoading(button);

  try {
    const projects = loadFromLocalStorage();
    renderProjectCards(projects);
    showSuccess('Loaded from Local Storage', projects.length);
  } catch (error) {
    showError('Failed to load from localStorage: ' + error.message);
  } finally {
    hideLoading(button);
  }
}

async function handleLoadRemote(event) {
  const button = event.currentTarget;
  showLoading(button);

  try {
    const projects = await loadFromRemote();
    renderProjectCards(projects);
    showSuccess('Loaded from Remote Server', projects.length);
  } catch (error) {
    showError('Failed to load from remote server: ' + error.message);
  } finally {
    hideLoading(button);
  }
}

// Init
document.addEventListener('DOMContentLoaded', function () {
  initializeLocalStorage();

  const loadLocalBtn = document.getElementById('load-local-btn');
  const loadRemoteBtn = document.getElementById('load-remote-btn');

  if (loadLocalBtn) {
    loadLocalBtn.addEventListener('click', handleLoadLocal);
  }

  if (loadRemoteBtn) {
    loadRemoteBtn.addEventListener('click', handleLoadRemote);
  }

  console.log('Project data loader initialized');
});
