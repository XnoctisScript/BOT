const { removeEntry } = require('../utils/helpManager');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { isOwner } = require('../utils/permissions');

module.exports = {
  name: 'helpremoverole',
  description: 'Remove text from a help role section',

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
        embeds: [errorEmbed('Error', 'Missing text.\n**Usage:** `:helpremoverole @role :command`')],
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
          embeds: [errorEmbed('Error', 'Please mention a role.\n**Usage:** `:helpremoverole @role :command`')],
          allowedMentions: { repliedUser: false },
        });
      }
      roleKey = plain;
      roleName = plain;
    }

    const entries = rawText.split(',').map(e => e.trim()).filter(Boolean);
    const removed = [];
    const notFound = [];

    for (const entry of entries) {
      const success = removeEntry(roleKey, entry);
      if (success) removed.push(entry);
      else notFound.push(entry);
    }

    if (removed.length === 0) {
      return message.reply({
        embeds: [errorEmbed('Error', `None of those entries were found in the **${roleName}** help list.`)],
        allowedMentions: { repliedUser: false },
      });
    }

    let desc = `Removed \`${removed.join('`, `')}\` from the **${roleName}** help list.`;
    if (notFound.length > 0) desc += `\n\nNot found: \`${notFound.join('`, `')}\``;

    return message.reply({
      embeds: [successEmbed('Success', desc)],
      allowedMentions: { repliedUser: false },
    });
  },
};
