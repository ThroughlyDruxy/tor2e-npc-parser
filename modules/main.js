import { tor2eParser } from './parser.js';

console.log(`TOR 2e NPC Parser initialized`);

class TOR2eParser {
  static ID = 'tor2e-npc-parser';
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
    parserBtn.addEventListener('click', textInputDialog);

    const createEntityButton =
      footer.getElementsByClassName('create-entity')[0];
    footer.insertBefore(parserBtn, createEntityButton);
  }
}

///// Creates dialog and takes data to send to tor2eParser /////
async function textInputDialog() {
  console.log('textInputDialog() called');

  const html = await renderTemplate(
    'modules/tor2e-npc-parser/templates/tor2e-npc-parser.hbs',
    {}
  );

  const dialog = new Dialog({
    title: 'TOR 2e NPC Parser',
    content: html,
    buttons: {
      go: {
        icon: '<i class="fas fa-check"></i>',
        label: 'Go',
        callback: html => tor2eParser(html),
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: () => console.log('Chose cancel'),
      },
    },
    default: 'go',
  });
  dialog.render(true);
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
