const { loadHelp } = require('../utils/helpManager');
const { helpEmbed } = require('../utils/embeds');
const { isOwner } = require('../utils/permissions');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Show help text',

  async execute(message, args, client) {
    const member = message.member;
    const data = loadHelp();
    const sections = {};

    for (const [key, entries] of Object.entries(data)) {
      if (!entries || entries.length === 0) continue;

      if (key === 'public') {
        sections['public'] = { name: 'Public', entries };
        continue;
      }
      if (key === 'staff') {
        if (member.permissions.has('ManageMessages') || isOwner(member)) {
          sections['staff'] = { name: 'Staff', entries };
        }
        continue;
      }
      if (key === 'owner') {
        if (isOwner(member)) {
          sections['owner'] = { name: 'Owner', entries };
        }
        continue;
      }

      // Dynamic role by ID — resolve actual role name from guild
      const role = message.guild.roles.cache.get(key);
      if (!role) continue;

      const roleName = role.name; // e.g. "Moderator", "Admin", "Owner"

      if (member.roles.cache.has(key) || isOwner(member)) {
        sections[key] = { name: `${roleName} Commands`, entries };
      }
    }

    return message.reply({
      embeds: [helpEmbed(sections)],
      allowedMentions: { repliedUser: false },
    });
  },
};
