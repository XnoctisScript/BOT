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

      // Built-in keys: public always visible, staff/owner gated
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

      // Dynamic role keys (role IDs)
      if (member.roles.cache.has(key) || isOwner(member)) {
        // Get the role name from the guild
        const role = message.guild.roles.cache.get(key);
        const roleName = role ? role.name : key;
        sections[key] = { name: roleName, entries };
      }
    }

    return message.reply({
      embeds: [helpEmbed(sections)],
      allowedMentions: { repliedUser: false },
    });
  },
};
