// configuration
const LOCAL_STORAGE_KEY = 'projectCardsData';
const JSONBIN_BIN_ID = '692e2805d0ea881f400c8db8';
const JSONBIN_API_KEY =
  '$2a$10$NX48S.xIMBthvl87eXBKcuy4u/MaFENMSuzWTbwJWbrAjMcxNFwnC';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

let currentProjects = [];
let currentDataSource = 'local';

// util
function getDataSource() {
  return document.querySelector('input[name="dataSource"]:checked').value;
}

function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('status-message');
  statusDiv.textContent = message;
  statusDiv.className = `status-message ${type}`;
  statusDiv.style.display = 'block';

  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}

function showLoading(button) {
  button.disabled = true;
  button.dataset.originalHTML = button.innerHTML;
  const icon = button.querySelector('i');
  if (icon) {
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;
  } else {
    button.textContent = 'Loading...';
  }
}

function hideLoading(button) {
  button.disabled = false;
  button.innerHTML = button.dataset.originalHTML;
}

// Local
function loadFromLocalStorage() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function saveToLocalStorage(projects) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

// Remote
async function loadFromRemote() {
  const response = await fetch(JSONBIN_URL, {
    method: 'GET',
    headers: {
      'X-Access-Key': JSONBIN_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.record || data;
}

async function saveToRemote(projects) {
  const response = await fetch(JSONBIN_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': JSONBIN_API_KEY,
    },
    body: JSON.stringify(projects),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Load projects
async function loadProjects() {
  const button = document.getElementById('load-btn');
  showLoading(button);

  try {
    currentDataSource = getDataSource();

    if (currentDataSource === 'local') {
      currentProjects = loadFromLocalStorage();
      showStatus(
        `Loaded ${currentProjects.length} projects from Local Storage`,
        'success'
      );
    } else {
      currentProjects = await loadFromRemote();
      showStatus(
        `Loaded ${currentProjects.length} projects from Remote Server`,
        'success'
      );
    }

    displayProjects();
    populateSelectors();
  } catch (error) {
    console.error('Error loading projects:', error);
    showStatus(`Error loading projects: ${error.message}`, 'error');
  } finally {
    hideLoading(button);
  }
}

function displayProjects() {
  const listDiv = document.getElementById('projects-list');
  if (currentProjects.length === 0) {
    listDiv.innerHTML =
      '<p class="no-data">No projects found. Create one below!</p>';
    return;
  }

  listDiv.innerHTML = currentProjects
    .map(
      (project, index) => `
        <div class="project-item">
            <div class="project-info">
                <h3>${index + 1}. ${project.title}</h3>
                <p>${project.desc}</p>
                <small>Image: ${project.img} | Link: ${project.link}</small>
            </div>
        </div>
    `
    )
    .join('');
}

function populateSelectors() {
  const updateSelect = document.getElementById('update-select');
  const deleteSelect = document.getElementById('delete-select');

  const options = currentProjects
    .map(
      (project, index) =>
        `<option value="${index}">${index + 1}. ${project.title}</option>`
    )
    .join('');

  updateSelect.innerHTML =
    '<option value="">-- Select a project --</option>' + options;
  deleteSelect.innerHTML =
    '<option value="">-- Select a project --</option>' + options;
}

// create
async function createProject(event) {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  showLoading(button);

  try {
    const newProject = {
      title: document.getElementById('create-title').value,
      img: document.getElementById('create-img').value,
      alt: document.getElementById('create-alt').value,
      desc: document.getElementById('create-desc').value,
      link: document.getElementById('create-link').value,
      linkText: document.getElementById('create-linkText').value || 'Read More',
    };

    currentProjects.push(newProject);

    if (currentDataSource === 'local') {
      saveToLocalStorage(currentProjects);
      showStatus('Project created successfully in Local Storage!', 'success');
    } else {
      await saveToRemote(currentProjects);
      showStatus('Project created successfully on Remote Server!', 'success');
    }

    event.target.reset();
    displayProjects();
    populateSelectors();
  } catch (error) {
    console.error('Error creating project:', error);
    showStatus(`Error creating project: ${error.message}`, 'error');
  } finally {
    hideLoading(button);
  }
}

// update
function selectProjectForUpdate() {
  const select = document.getElementById('update-select');
  const form = document.getElementById('update-form');
  const index = select.value;

  if (index === '') {
    form.style.display = 'none';
    return;
  }

  const project = currentProjects[parseInt(index)];
  document.getElementById('update-index').value = index;
  document.getElementById('update-title').value = project.title;
  document.getElementById('update-img').value = project.img;
  document.getElementById('update-alt').value = project.alt;
  document.getElementById('update-desc').value = project.desc;
  document.getElementById('update-link').value = project.link;
  document.getElementById('update-linkText').value = project.linkText || '';

  form.style.display = 'block';
}

async function updateProject(event) {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  showLoading(button);

  try {
    const index = parseInt(document.getElementById('update-index').value);

    const updatedProject = {
      title: document.getElementById('update-title').value,
      img: document.getElementById('update-img').value,
      alt: document.getElementById('update-alt').value,
      desc: document.getElementById('update-desc').value,
      link: document.getElementById('update-link').value,
      linkText: document.getElementById('update-linkText').value || 'Read More',
    };

    currentProjects[index] = updatedProject;

    if (currentDataSource === 'local') {
      saveToLocalStorage(currentProjects);
      showStatus('Project updated successfully in Local Storage!', 'success');
    } else {
      await saveToRemote(currentProjects);
      showStatus('Project updated successfully on Remote Server!', 'success');
    }

    displayProjects();
    populateSelectors();
    document.getElementById('update-select').value = '';
    document.getElementById('update-form').style.display = 'none';
  } catch (error) {
    console.error('Error updating project:', error);
    showStatus(`Error updating project: ${error.message}`, 'error');
  } finally {
    hideLoading(button);
  }
}

// delete
function selectProjectForDelete() {
  const select = document.getElementById('delete-select');
  const button = document.getElementById('delete-btn');
  button.disabled = select.value === '';
}

async function deleteProject() {
  const select = document.getElementById('delete-select');
  const button = document.getElementById('delete-btn');
  const index = parseInt(select.value);

  if (isNaN(index)) {
    return;
  }

  const project = currentProjects[index];
  if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
    return;
  }

  showLoading(button);

  try {
    currentProjects.splice(index, 1);

    if (currentDataSource === 'local') {
      saveToLocalStorage(currentProjects);
      showStatus('Project deleted successfully from Local Storage!', 'success');
    } else {
      await saveToRemote(currentProjects);
      showStatus('Project deleted successfully from Remote Server!', 'success');
    }

    displayProjects();
    populateSelectors();
    select.value = '';
    button.disabled = true;
  } catch (error) {
    console.error('Error deleting project:', error);
    showStatus(`Error deleting project: ${error.message}`, 'error');
  } finally {
    hideLoading(button);
  }
}

// event Listeners
document.addEventListener('DOMContentLoaded', function () {
  // source change
  document.querySelectorAll('input[name="dataSource"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      currentProjects = [];
      document.getElementById('projects-list').innerHTML = '';
      document.getElementById('update-select').innerHTML =
        '<option value="">-- Select a project --</option>';
      document.getElementById('delete-select').innerHTML =
        '<option value="">-- Select a project --</option>';
      document.getElementById('update-form').style.display = 'none';
      showStatus('Data source changed. Please load projects.', 'info');
    });
  });

  document.getElementById('load-btn').addEventListener('click', loadProjects);

  document
    .getElementById('create-form')
    .addEventListener('submit', createProject);

  document
    .getElementById('update-select')
    .addEventListener('change', selectProjectForUpdate);
  document
    .getElementById('update-form')
    .addEventListener('submit', updateProject);

  document
    .getElementById('delete-select')
    .addEventListener('change', selectProjectForDelete);
  document
    .getElementById('delete-btn')
    .addEventListener('click', deleteProject);

  console.log('CRUD operations initialized');
});
