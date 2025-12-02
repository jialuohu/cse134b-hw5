class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const title = this.getAttribute('title') || 'Project Title';
    const img = this.getAttribute('img') || 'res/default-project.jpg';
    const alt = this.getAttribute('alt') || 'Project Image';
    const desc =
      this.getAttribute('desc') || 'Short description of the project.';
    const link = this.getAttribute('link') || '#';
    const linkText = this.getAttribute('link-text') || 'Read More';

    const cssPath = window.location.pathname.includes('/pages/')
      ? '../css/project-card.css'
      : 'css/project-card.css';

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssPath}">
      <article class="card">
        <h2>${title}</h2>
        <picture>
            <img src="${img}" alt="${alt}" class="card-image">
        </picture>
        <p>${desc}</p>
        <div class="card-footer">
            <a href="${link}" target="_blank">${linkText}</a>
        </div>
      </article>
    `;
  }
}

customElements.define('project-card', ProjectCard);
