class UITemplates {
    constructor() {
        this.templates = {};
    }

    async load() {
        const response = await fetch('ui-templates.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const templates = doc.querySelectorAll('template');
        templates.forEach(template => {
            this.templates[template.id] = template.content.cloneNode(true);
        });
    }

    get(templateId) {
        return this.templates[templateId];
    }
}

window.uiTemplates = new UITemplates();
window.uiTemplates.load();
