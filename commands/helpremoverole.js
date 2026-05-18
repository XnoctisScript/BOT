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
        embeds: [errorEmbed('Error', 'Missing text.\n**Usage:** `:helpremoverole @role your text here`')],
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

    const removed = removeEntry(roleKey, rawText);

    if (!removed) {
      return message.reply({
        embeds: [errorEmbed('Error', `That text was not found in the **${roleName}** help list.`)],
        allowedMentions: { repliedUser: false },
      });
    }

    return message.reply({
      embeds: [successEmbed('Success', `Removed from the **${roleName}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
