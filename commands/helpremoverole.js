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

    const text = args[1];
    if (!text) {
      return message.reply({
        embeds: [errorEmbed('Error', 'Missing text argument.\n**Usage:** `:helpremoverole @role <text>` or `:helpremoverole public <text>`')],
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
          embeds: [errorEmbed('Error', 'Please mention a role or use `public`, `staff`, or `owner`.\n**Usage:** `:helpremoverole @role <text>`')],
          allowedMentions: { repliedUser: false },
        });
      }
      roleKey = plain;
      roleName = plain;
    }

    const removed = removeEntry(roleKey, text);

    if (!removed) {
      return message.reply({
        embeds: [errorEmbed('Error', `\`${text}\` was not found in the **${roleName}** help list.`)],
        allowedMentions: { repliedUser: false },
      });
    }

    return message.reply({
      embeds: [successEmbed('Success', `Removed \`${text}\` from the **${roleName}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
