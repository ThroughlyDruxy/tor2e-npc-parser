import { tor2eParser } from './parser.js';

console.log(`TOR 2e NPC Parser initialized`);

class ParserButtonVisible {
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
Hooks.on('renderActorDirectory', async (app, html) => {
  if (app.id == 'actors') {
    ParserButtonVisible.parserButtonVisible();
  }
});
