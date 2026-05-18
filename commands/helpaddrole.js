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

    // Everything after the first arg is the command text
    const rawText = args.slice(1).join(' ');
    if (!rawText) {
      return message.reply({
        embeds: [errorEmbed('Error', 'Missing text.\n**Usage:** `:helpaddrole @role :command`')],
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
      if (!plain) {
        return message.reply({
          embeds: [errorEmbed('Error', 'Please mention a role.\n**Usage:** `:helpaddrole @role :command`')],
          allowedMentions: { repliedUser: false },
        });
      }
      roleKey = plain;
      roleName = plain;
    }

    // Split by comma so ":ban, :kick" becomes two entries
    const entries = rawText.split(',').map(e => e.trim()).filter(Boolean);

    for (const entry of entries) {
      addEntry(roleKey, entry);
    }

    const added = entries.map(e => `\`${e}\``).join(', ');

    return message.reply({
      embeds: [successEmbed('Success', `Added ${added} to the **${roleName}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
