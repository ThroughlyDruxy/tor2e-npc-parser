import { tor2eParser } from './parser.js';

class TOR2eDialog extends FormApplication {
  constructor(object, options) {
    super(object, options);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'modules/tor2e-npc-parser/templates/tor2e-npc-parser.hbs',
    });
  }

  getData(options = {}) {
    return super.getData();
  }

  activateListeners(html) {
    super.activateListeners(html);

    let textArea = html.getElementbyId('text-input');
    textArea.change(this._onTextChanged.bind(this));
  }

  async _updateObject(event, formData) {
    return;
  }
}

export async function textInput() {
  console.log('textInput() called');

  const html = await renderTemplate(
    'modules/tor2e-npc-parser/templates/tor2e-npc-parser.hbs',
    { originalText: '' }
  );

  const dialog = new Dialog({
    title: 'TOR2e NPC Parser',
    content: html,
    buttons: {
      go: {
        icon: '<i class="fas fa-check"></i>',
        label: 'Go',
        callback: () => tor2eParser(originalText), // undefined here
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: () => console.log('Chose cancel'),
      },
    },
    default: 'cancel',
    render: html => console.log('TOR2E | Dialog rendered'),
    close: html => console.log(`TOR2E | Dialog closed.`),
  });

  dialog.render(true);
}
