class UITemplates {
    constructor() {
        this.templates = {};
    }

    async load() {
        const templates = await import('../templates/ui-templates.html?raw');
        const parser = new DOMParser();
        const doc = parser.parseFromString(templates.default, 'text/html');
        const templateElements = doc.querySelectorAll('template');
        templateElements.forEach(template => {
            this.templates[template.id] = template.content.cloneNode(true);
        });
    }

    get(templateId) {
        return this.templates[templateId];
    }
}

export default new UITemplates(); 