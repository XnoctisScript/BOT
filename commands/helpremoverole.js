const { removeEntry } = require('../utils/helpManager');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { isOwner } = require('../utils/permissions');

const VALID_ROLES = ['public', 'staff', 'owner'];

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

    const role = args[0]?.toLowerCase();
    const text = args[1];

    if (!role || !VALID_ROLES.includes(role)) {
      return message.reply({
        embeds: [errorEmbed('Error', `Invalid role. Valid roles: \`public\`, \`staff\`, \`owner\`.\n**Usage:** \`:helpremoverole <role> <text>\``)],
        allowedMentions: { repliedUser: false },
      });
    }

    if (!text) {
      return message.reply({
        embeds: [errorEmbed('Error', `Missing text argument.\n**Usage:** \`:helpremoverole ${role} <text>\``)],
        allowedMentions: { repliedUser: false },
      });
    }

    const removed = removeEntry(role, text);

    if (!removed) {
      return message.reply({
        embeds: [errorEmbed('Error', `\`${text}\` was not found in the **${role}** help list.`)],
        allowedMentions: { repliedUser: false },
      });
    }

    return message.reply({
      embeds: [successEmbed('Success', `Removed \`${text}\` from the **${role}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
