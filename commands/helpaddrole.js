const { addEntry } = require('../utils/helpManager');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { isOwner } = require('../utils/permissions');

const VALID_ROLES = ['public', 'staff', 'owner'];

module.exports = {
  name: 'helpaddrole',
  description: 'Add text to a help role section',

  async execute(message, args, client) {
    // Only owner role can use this
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
        embeds: [errorEmbed('Error', `Invalid role. Valid roles: \`public\`, \`staff\`, \`owner\`.\n**Usage:** \`:helpaddrole <role> <text>\``)],
        allowedMentions: { repliedUser: false },
      });
    }

    if (!text) {
      return message.reply({
        embeds: [errorEmbed('Error', `Missing text argument.\n**Usage:** \`:helpaddrole ${role} <text>\``)],
        allowedMentions: { repliedUser: false },
      });
    }

    addEntry(role, text);

    return message.reply({
      embeds: [successEmbed('Success', `Added \`${text}\` to the **${role}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
