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

    const text = args[1];
    if (!text) {
      return message.reply({
        embeds: [errorEmbed('Error', 'Missing text argument.\n**Usage:** `:helpaddrole @role <text>` or `:helpaddrole public <text>`')],
        allowedMentions: { repliedUser: false },
      });
    }

    let roleKey, roleName;

    // Check if it's a @role mention
    const mentionedRole = message.mentions.roles.first();
    if (mentionedRole) {
      roleKey = mentionedRole.id;
      roleName = mentionedRole.name;
    } else {
      // Fall back to plain text role name (public, staff, owner)
      const plain = args[0]?.toLowerCase();
      if (!plain) {
        return message.reply({
          embeds: [errorEmbed('Error', 'Please mention a role or use `public`, `staff`, or `owner`.\n**Usage:** `:helpaddrole @role <text>`')],
          allowedMentions: { repliedUser: false },
        });
      }
      roleKey = plain;
      roleName = plain;
    }

    addEntry(roleKey, text);

    return message.reply({
      embeds: [successEmbed('Success', `Added \`${text}\` to the **${roleName}** help list.`)],
      allowedMentions: { repliedUser: false },
    });
  },
};
