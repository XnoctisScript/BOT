const { loadHelp } = require('../utils/helpManager');
const { helpEmbed, errorEmbed } = require('../utils/embeds');
const { isStaff, isOwner } = require('../utils/permissions');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Show help text',

  async execute(message, args, client) {
    const member = message.member;
    const data = loadHelp();

    // Build sections based on role
    const sections = {};

    if (data.public && data.public.length > 0) {
      sections.public = data.public;
    }

    if (isStaff(member) && data.staff && data.staff.length > 0) {
      sections.staff = data.staff;
    }

    if (isOwner(member) && data.owner && data.owner.length > 0) {
      sections.owner = data.owner;
    }

    // Always show public section label even if empty for owners/staff
    if (Object.keys(sections).length === 0) {
      const empty = {};
      empty.public = data.public || [];
      if (isStaff(member)) empty.staff = data.staff || [];
      if (isOwner(member)) empty.owner = data.owner || [];
      return message.reply({ embeds: [helpEmbed(empty)], allowedMentions: { repliedUser: false } });
    }

    return message.reply({ embeds: [helpEmbed(sections)], allowedMentions: { repliedUser: false } });
  },
};
