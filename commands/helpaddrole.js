const { addEntry } = require('../utils/helpManager');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { isOwner } = require('../utils/permissions');

module.exports = {
  name: 'helpaddrole',
  description: 'Add text to a help role section',

  async execute(message, args, client) {
    if (!isOwner(message.member)) {
      return message.reply({
        embeds: [errorEmbed('Error', 'You do not have permission to use this command.')],
        allowedMentions: { repliedUser: false },
      });
    }

    const rawText = args.slice(1).join(' ');
    if (!rawText) {
      return message.reply({
        embeds: [errorEmbed('Error', 'Missing text.\n**Usage:** `:helpaddrole @role line 1 | line 2 | line 3`')],
        allowedMentions: { repliedUser: false },
      });
    }

    let roleKey, roleName;

    const mentionedRole = message.mentions.roles.first();
    if (mentionedRole) {
      roleKey = mentionedRole.id;
      roleName = mentionedRole.name;
    } else {
      const plain = args[0]?.toLowerCase();
      roleKey = plain;
      roleName = plain;
    }

    // Split by | so you can add multiple lines at once
    const entries = rawText.split('|').map(e => e.trim()).filter(Boolean);

    for (const entry of entries) {
      addEntry(roleKey, entry);
    }

    return message.reply({
      embeds: [successEmbed('Success', `Added ${entries.length} line(s) to the **${roleName}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
