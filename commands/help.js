const { loadHelp } = require('../utils/helpManager');
const { helpEmbed } = require('../utils/embeds');
const { ROLES, isOwner, isStaff, isTrial, isSupport, isVerified } = require('../utils/permissions');

// Map role key name to checker function
const ROLE_CHECKS = {
  owner:    isOwner,
  staff:    isStaff,
  trial:    isTrial,
  support:  isSupport,
  verified: isVerified,
};

const ROLE_NAMES = {
  owner:    'Owner Commands',
  staff:    'Staff Commands',
  trial:    'Trial Commands',
  support:  'Support Commands',
  verified: 'Verified Commands',
  public:   'Public Commands',
};

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

      if (key === 'public') {
        sections['public'] = { name: ROLE_NAMES['public'], entries };
        continue;
      }

      // Built-in named roles
      if (ROLE_CHECKS[key]) {
        if (ROLE_CHECKS[key](member)) {
          sections[key] = { name: ROLE_NAMES[key], entries };
        }
        continue;
      }

      // Dynamic role by ID
      const role = message.guild.roles.cache.get(key);
      if (!role) continue;
      if (member.roles.cache.has(key)) {
        sections[key] = { name: `${role.name} Commands`, entries };
      }
    }

    return message.reply({
      embeds: [helpEmbed(sections)],
      allowedMentions: { repliedUser: false },
    });
  },
};
