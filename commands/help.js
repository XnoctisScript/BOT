const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

const helpData = require('../help.json');

// ── Category definitions ──────────────────────────────────────────────────────
// Map every command keyword to a category. Anything unmatched → Utility.
const CATEGORY_RULES = [
  {
    name: '🎮 Fun',
    color: 0x5865f2,
    keywords: ['rps', 'flip', 'dadjoke', 'cat', 'pug', 'dog', 'pokemon', 'norris',
               'roll', 'flipcoin', 'randomcolor', 'dynoavatar', 'itunes', 'poll',
               'covid', 'space'],
  },
  {
    name: '🛡️ Moderation',
    color: 0xed4245,
    keywords: ['ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'warnings', 'clearwarn',
               'delwarn', 'purge', 'lock', 'unlock', 'lockdown', 'softban', 'deafen',
               'undeafen', 'modlogs', 'modstats', 'moderations', 'case', 'reason',
               'note', 'notes', 'delnote', 'editnote', 'clearnotes', 'duration',
               'temprole', 'rolepersist', 'slowmode', 'ignored', 'clean'],
  },
  {
    name: '⚙️ Admin',
    color: 0xfee75c,
    keywords: ['addmod', 'delmod', 'listmods', 'addrole', 'delrole', 'rolecolor',
               'rolename', 'mentionable', 'role', 'module', 'modules', 'command',
               'prefix', 'ignorechannel', 'ignoreuser', 'ignorerole', 'nick',
               'setnick', 'announce', 'customs', 'giveaway', 'addemote',
               'addrank', 'delrank', 'rank', 'ranks', 'star'],
  },
  {
    name: '🔧 Utility',
    color: 0x57f287,
    keywords: [], // catch-all
  },
];

// ── Parse help.json into categorised pages ───────────────────────────────────
const CMDS_PER_PAGE = 10;

function buildCategories() {
  // Collect all commands from every role tier
  const allCmds = Object.values(helpData).flat();
  // Deduplicate
  const unique = [...new Set(allCmds)];

  const cats = CATEGORY_RULES.map(cat => ({ ...cat, commands: [] }));

  for (const cmd of unique) {
    // Extract the bare command name (first backtick-wrapped word)
    const match = cmd.match(/`(\w+)/);
    const name = match ? match[1].toLowerCase() : '';

    let placed = false;
    for (let i = 0; i < cats.length - 1; i++) {
      if (cats[i].keywords.includes(name)) {
        cats[i].commands.push(cmd);
        placed = true;
        break;
      }
    }
    if (!placed) cats[cats.length - 1].commands.push(cmd); // Utility catch-all
  }

  // Build pages per category
  return cats
    .filter(c => c.commands.length > 0)
    .map(c => {
      const pages = [];
      for (let i = 0; i < c.commands.length; i += CMDS_PER_PAGE) {
        pages.push(c.commands.slice(i, i + CMDS_PER_PAGE));
      }
      return { name: c.name, color: c.color, pages };
    });
}

const CATEGORIES = buildCategories();

// ── Embed builder ─────────────────────────────────────────────────────────────
function makeEmbed(catIndex, pageIndex) {
  const cat = CATEGORIES[catIndex];
  const page = cat.pages[pageIndex];
  const totalPages = cat.pages.length;

  return new EmbedBuilder()
    .setTitle(`Help — ${cat.name}`)
    .setColor(cat.color)
    .setDescription(page.join('\n'))
    .setFooter({ text: `Page ${pageIndex + 1} of ${totalPages} • Category ${catIndex + 1}/${CATEGORIES.length}` });
}

// ── Row builders ──────────────────────────────────────────────────────────────
function makeNavRow(catIndex, pageIndex) {
  const cat = CATEGORIES[catIndex];
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('prev_page')
      .setLabel('◀ Prev')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0),
    new ButtonBuilder()
      .setCustomId('next_page')
      .setLabel('Next ▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === cat.pages.length - 1),
  );
}

function makeCatRow(catIndex) {
  // Show up to 5 category buttons (Discord's per-row limit)
  const row = new ActionRowBuilder();
  for (let i = 0; i < Math.min(CATEGORIES.length, 5); i++) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`cat_${i}`)
        .setLabel(CATEGORIES[i].name)
        .setStyle(i === catIndex ? ButtonStyle.Primary : ButtonStyle.Secondary),
    );
  }
  return row;
}

// ── Command export ────────────────────────────────────────────────────────────
module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'cmds'],
  description: 'Shows all bot commands with page navigation',

  async execute(message) {
    let catIndex = 0;
    let pageIndex = 0;

    const reply = await message.reply({
      embeds: [makeEmbed(catIndex, pageIndex)],
      components: [makeCatRow(catIndex), makeNavRow(catIndex, pageIndex)],
    });

    // Only the command author can interact
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 5 * 60 * 1000, // 5 minutes
      filter: i => i.user.id === message.author.id,
    });

    collector.on('collect', async interaction => {
      const id = interaction.customId;

      if (id === 'prev_page') {
        pageIndex = Math.max(0, pageIndex - 1);
      } else if (id === 'next_page') {
        pageIndex = Math.min(CATEGORIES[catIndex].pages.length - 1, pageIndex + 1);
      } else if (id.startsWith('cat_')) {
        catIndex = parseInt(id.split('_')[1]);
        pageIndex = 0; // reset to first page of new category
      }

      await interaction.update({
        embeds: [makeEmbed(catIndex, pageIndex)],
        components: [makeCatRow(catIndex), makeNavRow(catIndex, pageIndex)],
      });
    });

    collector.on('end', async () => {
      // Disable all buttons after timeout
      const disabledNav = makeNavRow(catIndex, pageIndex);
      const disabledCat = makeCatRow(catIndex);
      for (const row of [disabledNav, disabledCat]) {
        for (const btn of row.components) btn.setDisabled(true);
      }
      await reply.edit({ components: [disabledCat, disabledNav] }).catch(() => {});
    });
  },
};
