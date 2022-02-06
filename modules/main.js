import { textInput } from './text-input.js';
import { tor2eParser } from './parser.js';

console.log('Hello! This is from tor2e parser!!!!');

class TOR2eParser {
  static ID = 'tor2e-npc-parser';

  static FLAGS = {
    TOR2ePARSER: 'parser',
  };

  static TEMPLATES = {
    TOR2EPARSER: `modules/${this.ID}/templates/tor2e-npc-parser.hbs`,
  };

  // Add a log helper to ToDoList
  static log(force, ...args) {
    const shouldLog =
      force ||
      game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, '|', ...args);
    }
  }

  static parserButtonVisible() {
    let parserBtn = document.getElementById('tor2e-btn');
    const actorPanel = document.getElementById('actors');
    const footer = actorPanel.getElementsByClassName('directory-footer')[0];
    console.log('Creating parser button');

    parserBtn = document.createElement('button');
    parserBtn.innerHTML = `<i id="tor2e-button" class="fas fa-list"></i>Parse Statblock`;

    // Do stuff here
    parserBtn.addEventListener('click', textInput);

    const createEntityButton =
      footer.getElementsByClassName('create-entity')[0];
    footer.insertBefore(parserBtn, createEntityButton);
  }
}

///// Dialog box for input /////
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

///// Creates dialog and takes data to send to tor2eParser /////
async function textInput() {
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

///// Parser /////
function tor2eParser(strToParse) {
  console.log(`TOR2E || tor2eParser was called`);
  console.log(typeof strToParse);
  console.log(strToParse);
}

///// HOOKS /////
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(TOR2eParser.ID);
});

Hooks.on('renderSidebarTab', (app, html) => {
  if (app.options.id == 'actors') {
    TOR2eParser.parserButtonVisible();
  }
});
