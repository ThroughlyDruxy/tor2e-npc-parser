import { tor1eParser } from './parser.js';

console.log(`TOR 1E NPC Parser initialized`);

class TOR1eParser {
  static parserButtonVisible() {
    let parserBtn = document.getElementById('tor1e-btn');
    const actorPanel = document.getElementById('actors');
    const footer = actorPanel.getElementsByClassName('directory-footer')[0];
    console.log('Creating parser button');

    parserBtn = document.createElement('button');
    parserBtn.innerHTML = `<i id="tor1e-button" class="fas fa-list"></i>Parse Statblock`;

    // Do stuff here
    parserBtn.addEventListener('click', textInputDialog);

    const createEntityButton =
      footer.getElementsByClassName('create-entity')[0];
    footer.insertBefore(parserBtn, createEntityButton);
  }
}

///// Creates dialog and takes data to send to tor1eParser /////
async function textInputDialog() {
  console.log('textInputDialog() called');

  const html = await renderTemplate(
    'modules/tor1e-npc-parser/templates/tor1e-npc-parser.hbs',
    {}
  );

  const dialog = new Dialog({
    title: 'TOR 1E NPC Parser',
    content: html,
    buttons: {
      go: {
        icon: '<i class="fas fa-check"></i>',
        label: 'Go',
        callback: html => tor1eParser(html),
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: () => console.log('Chose cancel'),
      },
    },
  });
  dialog.render(true);

  // replace "enter" key with carriage return instead of submitting ducment
  document.addEventListener('keydown', function (e) {
    if (e.key == 13) {
      if (this.classList.contains('multiline')) {
        this.textContent += '\n';
      } else {
        // Prevent enter key doing its weird <div><br></div> and instead blur the input
        e.preventDefault();
        e.target.blur();
      }
      return false;
    }
  });
}

///// HOOKS /////
Hooks.on('renderSidebarTab', (app, html) => {
  if (app.options.id == 'actors') {
    TOR1eParser.parserButtonVisible();
  }
});
