const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

// ── Categories (only commands from help.json + your custom staff cmds) ────────
const CATEGORIES = [
  {
    name: 'Moderation',
    commands: [
      '`:mute` — Mute a member so they cannot type',
      '`:unmute` — Unmute a member',
      '`:mute+ [member] [duration] [reason]`\n  aliases: `:mplus`',
      '`:muteinfo [member]`\n  aliases: `:mi`',
      '`:mutelist`',
      '`:ban` — Ban a member, optional time limit',
      '`:unban` — Unban a member',
      '`:banid [ban_id]`',
      '`:kick` — Kick a member',
      '`:softban` — Softban a member (ban and immediate unban to delete messages)',
      '`:warn` — Warn a member',
      '`:warnings` — Get warnings for a user',
      '`:clearwarn` — Clear warnings for a user',
      '`:delwarn` — Delete a warning',
      '`:purge` — Delete a number of messages from a channel (limit 1000)',
      '`:delmsgs [member] [amount]`\n  aliases: `:dmsgs`',
      '`:lock` — Lock a channel with optional timer and message',
      '`:unlock` — Unlock a previously locked channel',
      '`:lockdown` — Lock channels defined in moderation settings',
      '`:slowmode` — Enable/disable slowmode',
      '`:deafen` — Deafen a member',
      '`:undeafen` — Undeafen a member',
      '`:modlogs` — Get a list of moderation logs for a user',
      '`:modstats` — Get moderation statistics for a mod/admin',
      '`:moderations` — Get a list of active moderations (timed)',
      '`:case` — Show a single mod log case',
      '`:reason` — Supply a reason for a mod log case',
      '`:duration` — Change the duration of a mute/ban',
      '`:note` — Add note(s) about a member',
      '`:notes` — Get notes for a user',
      '`:delnote` — Delete a note about a member',
      '`:editnote` — Edit a note about a member',
      '`:clearnotes` — Delete all notes for a member',
      '`:clean` — Clean up Dyno responses',
    ],
  },
  {
    name: 'Admin',
    commands: [
      '`:addmod` — Add a moderator role',
      '`:delmod` — Remove a moderator role',
      '`:listmods` — List moderators',
      '`:addrole` — Add a new role with optional color and hoist',
      '`:delrole` — Delete a role',
      '`:rolecolor` — Change the color of a role',
      '`:rolename` — Change the name of a role',
      '`:mentionable` — Toggle making a role mentionable on/off',
      '`:role` — Add/remove a user to a role or roles',
      '`:rolepersist` — Assign/unassign a role that persists if the user leaves and rejoins',
      '`:temprole` — Assign/unassign a role that persists for a limited time',
      '`:module` — Enable/disable a module',
      '`:modules` — List available modules',
      '`:command` — Enable/disable a command',
      '`:customs` — List, enable, disable custom commands',
      '`:prefix` — Get or set the command prefix for this server',
      '`:ignorechannel` — Toggles command usage in a channel',
      '`:ignoreuser` — Toggles command usage for a user',
      '`:ignorerole` — Toggles command usage for a role',
      '`:ignored` — List ignored users, roles, and channels',
      '`:nick` — Change the bot nickname',
      '`:setnick` — Change the nickname of a user',
      '`:announce` — Send an announcement using the bot',
      '`:giveaway` — Create and manage giveaways',
      '`:addemote` — Adds an emote to the server',
      '`:addrank` — Add a new rank for members to join (role must exist)',
      '`:delrank` — Delete an existing rank (does not delete the role)',
      '`:rank` — Join/leave a rank',
      '`:ranks` — Get a list of joinable ranks',
      '`:star` — View starboard stats for a message',
    ],
  },
  {
    name: 'Staff Tools',
    commands: [
      '`:getstafftag [username]`\n  aliases: `:gst`',
      '`:switchstafftag [username]`\n  aliases: `:sstaff`',
      '`:checkproof [username]`\n  aliases: `:cproof`',
      '`:checkblacklist [user_id]`\n  aliases: `:cbl`, `:checkbl`',
      '`:steal`\n  aliases: `:st`',
      '`:adduser`\n  aliases: `:adu`',
      '`:removeuser`\n  aliases: `:ru`',
      '`:finduser [user_id]`\n  aliases: `:find`',
      '`:robloxavatar [identifier]`\n  aliases: `:ravatar`',
    ],
  },
  {
    name: 'Utility',
    commands: [
      '`:help`\n  aliases: `:h`',
      '`:ping` — Ping the bot',
      '`:info` — Get bot info',
      '`:stats` — Get bot stats',
      '`:uptime` — Get bot uptime',
      '`:whois` — Get user information',
      '`:avatar` — Get a users avatar',
      '`:serverinfo` — Get server info/stats',
      '`:membercount` — Get the server member count',
      '`:roles` — Get a list of server roles',
      '`:roleinfo` — Get information about a role',
      '`:members` — List members in a role(s) (max 90)',
      '`:inviteinfo` — Get information about an invite',
      '`:remindme` — Set a reminder',
      '`:afk` — Set an AFK status to display when you are mentioned',
      '`:highlights` — Get notified when a specific phrase is said in a server',
      '`:emotes` — Gets a list of server emojis',
      '`:discrim` — Shows users with a certain discriminator',
      '`:color` — Show a color using hex',
      '`:distance` — Get the distance between two sets of coordinates',
      '`:premium` — Dyno premium information (Responds in DM)',
    ],
  },
  {
    name: 'Fun',
    commands: [
      '`:rps` — Play Rock Paper Scissors with the bot',
      '`:flip` — Flip a coin',
      '`:flipcoin` — Flip a coin',
      '`:roll` — Roll the dice (d4, d6, d8, d10, d12, d20, d100)',
      '`:poll [question] [choices]` — Start a poll (max 10 choices)',
      '`:dadjoke` — Get a random Dad joke',
      '`:norris` — Get a random Chuck Norris fact',
      '`:space` — Get info about the space station',
      '`:itunes [song]` — Get info on a song',
      '`:pokemon [pokemon]` — Get info on Pokemon',
      '`:cat` — Find some cute cat pictures',
      '`:dog` — Find some cute dog pictures',
      '`:pug` — Find some cute pug pictures',
      '`:randomcolor` — Generates a random hex color with preview',
      '`:dynoavatar` — Generates a Dyno-like avatar',
      '`:github [repository]` — Get info on a GitHub repository',
      '`:covid` — Get COVID-19 stats',
    ],
  },
];

// ── Config ────────────────────────────────────────────────────────────────────
const CMDS_PER_PAGE = 10;
const BLACK = 0x111111;

const PAGED_CATS = CATEGORIES.map(cat => {
  const pages = [];
  for (let i = 0; i < cat.commands.length; i += CMDS_PER_PAGE) {
    pages.push(cat.commands.slice(i, i + CMDS_PER_PAGE));
  }
  return { name: cat.name, pages };
});

// ── Embed builder ─────────────────────────────────────────────────────────────
function makeEmbed(catIndex, pageIndex) {
  const cat = PAGED_CATS[catIndex];
  const page = cat.pages[pageIndex];
  const totalPages = cat.pages.length;

  return new EmbedBuilder()
    .setTitle(`Commands — ${cat.name}`)
    .setColor(BLACK)
    .setDescription(page.join('\n\n'))
    .setFooter({
      text: `Page ${pageIndex + 1}/${totalPages}  |  Category ${catIndex + 1}/${PAGED_CATS.length}`,
    });
}

// ── Row builders ──────────────────────────────────────────────────────────────
function makeNavRow(catIndex, pageIndex) {
  const cat = PAGED_CATS[catIndex];
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

function makeCatRow(catIndex) {
  const row = new ActionRowBuilder();
  for (let i = 0; i < Math.min(PAGED_CATS.length, 5); i++) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`cat_${i}`)
        .setLabel(PAGED_CATS[i].name)
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
        pageIndex = Math.min(PAGED_CATS[catIndex].pages.length - 1, pageIndex + 1);
      } else if (id.startsWith('cat_')) {
        catIndex = parseInt(id.split('_')[1]);
        pageIndex = 0;
      }

      await interaction.update({
        embeds: [makeEmbed(catIndex, pageIndex)],
        components: [makeCatRow(catIndex), makeNavRow(catIndex, pageIndex)],
      });
    });

    collector.on('end', async () => {
      const disabledNav = makeNavRow(catIndex, pageIndex);
      const disabledCat = makeCatRow(catIndex);
      for (const row of [disabledNav, disabledCat]) {
        for (const btn of row.components) btn.setDisabled(true);
      }
      await reply.edit({ components: [disabledCat, disabledNav] }).catch(() => {});
    });
  },
};
