const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

const helpData = require('../help.json');

// ── Role IDs — fill these in with your actual Discord role IDs ────────────────
const ROLE_IDS = {
  owner:         null,                           // server owner, no role needed
  staff_manager: '1503781011648151733',
  staff:         'STAFF_ROLE_ID_HERE',
  trial:         'TRIAL_ROLE_ID_HERE',
  support:       'SUPPORT_MOD_ROLE_ID_HERE',
  verified:      'VERIFIED_ROLE_ID_HERE',
};

// ── Tier hierarchy (highest → lowest) ────────────────────────────────────────
const TIERS = ['owner', 'staff_manager', 'staff', 'trial', 'support', 'verified', 'public'];

// ── Work out which tier the member belongs to ─────────────────────────────────
function getMemberTier(message) {
  if (message.guild.ownerId === message.author.id) return 'owner';

  const roleIds = message.member.roles.cache.map(r => r.id);

  for (const tier of TIERS) {
    if (tier === 'owner' || tier === 'public') continue;
    if (ROLE_IDS[tier] && roleIds.includes(ROLE_IDS[tier])) return tier;
  }

  return 'public';
}

// ── Config ────────────────────────────────────────────────────────────────────
const CMDS_PER_PAGE = 10;
const BLACK = 0x111111;

// Category groupings — commands are pulled from help.json for the user's tier
const CATEGORY_KEYWORDS = {
  'Fun': ['rps', 'flip', 'flipcoin', 'space', 'dadjoke', 'github', 'cat', 'pug',
          'itunes', 'dog', 'pokemon', 'norris', 'roll', 'randomcolor', 'dynoavatar', 'covid'],
  'Utility': ['info', 'stats', 'uptime', 'ping', 'premium', 'whois', 'avatar',
              'serverinfo', 'membercount', 'roles', 'roleinfo', 'members', 'inviteinfo',
              'remindme', 'afk', 'highlights', 'emotes', 'discrim', 'color', 'distance', 'help'],
  'Moderation': ['mute', 'unmute', 'ban', 'unban', 'kick', 'softban', 'warn', 'warnings',
                 'clearwarn', 'delwarn', 'purge', 'lock', 'unlock', 'lockdown', 'slowmode',
                 'deafen', 'undeafen', 'modlogs', 'modstats', 'moderations', 'case', 'reason',
                 'duration', 'note', 'notes', 'delnote', 'editnote', 'clearnotes', 'clean',
                 'rolepersist', 'temprole', 'ignored'],
  'Admin': ['addmod', 'delmod', 'listmods', 'addrole', 'delrole', 'rolecolor', 'rolename',
            'mentionable', 'role', 'module', 'modules', 'command', 'customs', 'prefix',
            'ignorechannel', 'ignoreuser', 'ignorerole', 'nick', 'setnick', 'announce',
            'giveaway', 'addemote', 'addrank', 'delrank', 'rank', 'ranks', 'star',
            'modstats', 'lockdown'],
  'Staff Tools': ['getstafftag', 'switchstafftag', 'checkproof', 'checkblacklist',
                  'steal', 'adduser', 'removeuser', 'finduser', 'robloxavatar',
                  'mute+', 'muteinfo', 'mutelist', 'banid', 'delmsgs'],
};

// ── Build paged categories for a given tier ───────────────────────────────────
function buildPagesForTier(tier) {
  const cmds = helpData[tier] || [];

  // Sort commands into categories
  const buckets = {};
  for (const catName of Object.keys(CATEGORY_KEYWORDS)) buckets[catName] = [];

  for (const cmdStr of cmds) {
    const match = cmdStr.match(/`\?(\S+)/);
    const name = match ? match[1].toLowerCase().replace('+', '+') : '';

    let placed = false;
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(k => name.startsWith(k.toLowerCase()))) {
        buckets[cat].push(cmdStr);
        placed = true;
        break;
      }
    }
    if (!placed) buckets['Utility'].push(cmdStr); // fallback
  }

  // Build pages per non-empty category
  return Object.entries(buckets)
    .filter(([, v]) => v.length > 0)
    .map(([name, commands]) => {
      const pages = [];
      for (let i = 0; i < commands.length; i += CMDS_PER_PAGE) {
        pages.push(commands.slice(i, i + CMDS_PER_PAGE));
      }
      return { name, pages };
    });
}

// ── Embed ─────────────────────────────────────────────────────────────────────
function makeEmbed(cats, catIndex, pageIndex, tier) {
  const cat = cats[catIndex];
  const page = cat.pages[pageIndex];
  const totalPages = cat.pages.length;

  return new EmbedBuilder()
    .setTitle(`Commands — ${cat.name}`)
    .setColor(BLACK)
    .setDescription(page.join('\n\n'))
    .setFooter({
      text: `Page ${pageIndex + 1}/${totalPages}  |  Category ${catIndex + 1}/${cats.length}  |  Tier: ${tier}`,
    });
}

// ── Rows ──────────────────────────────────────────────────────────────────────
function makeNavRow(cats, catIndex, pageIndex) {
  const cat = cats[catIndex];
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('prev_page')
      .setLabel('< Prev')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0),
    new ButtonBuilder()
      .setCustomId('next_page')
      .setLabel('Next >')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === cat.pages.length - 1),
  );
}

function makeCatRow(cats, catIndex) {
  const row = new ActionRowBuilder();
  for (let i = 0; i < Math.min(cats.length, 5); i++) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`cat_${i}`)
        .setLabel(cats[i].name)
        .setStyle(i === catIndex ? ButtonStyle.Primary : ButtonStyle.Secondary),
    );
  }
  return row;
}

// ── Command ───────────────────────────────────────────────────────────────────
module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'cmds'],
  description: 'Shows commands available to you based on your role',

  async execute(message) {
    const tier = getMemberTier(message);
    const cats = buildPagesForTier(tier);

    if (!cats.length) {
      return message.reply('No commands available for your role.');
    }

    let catIndex = 0;
    let pageIndex = 0;

    const reply = await message.reply({
      embeds: [makeEmbed(cats, catIndex, pageIndex, tier)],
      components: [makeCatRow(cats, catIndex), makeNavRow(cats, catIndex, pageIndex)],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 5 * 60 * 1000,
      filter: i => i.user.id === message.author.id,
    });

    collector.on('collect', async interaction => {
      const id = interaction.customId;

      if (id === 'prev_page') {
        pageIndex = Math.max(0, pageIndex - 1);
      } else if (id === 'next_page') {
        pageIndex = Math.min(cats[catIndex].pages.length - 1, pageIndex + 1);
      } else if (id.startsWith('cat_')) {
        catIndex = parseInt(id.split('_')[1]);
        pageIndex = 0;
      }

      await interaction.update({
        embeds: [makeEmbed(cats, catIndex, pageIndex, tier)],
        components: [makeCatRow(cats, catIndex), makeNavRow(cats, catIndex, pageIndex)],
      });
    });

    collector.on('end', async () => {
      const disabledNav = makeNavRow(cats, catIndex, pageIndex);
      const disabledCat = makeCatRow(cats, catIndex);
      for (const row of [disabledNav, disabledCat]) {
        for (const btn of row.components) btn.setDisabled(true);
      }
      await reply.edit({ components: [disabledCat, disabledNav] }).catch(() => {});
    });
  },
};
