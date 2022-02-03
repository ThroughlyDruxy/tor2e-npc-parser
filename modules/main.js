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

///// HOOKS /////

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(TOR2eParser.ID);
});

Hooks.on('renderSidebarTab', (app, html) => {
  if (app.options.id == 'actors') {
    TOR2eParser.parserButtonVisible();
  }
});
