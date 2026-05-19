const { EmbedBuilder } = require('discord.js');
const helpData = require('../help.json');

// Role priority order — highest first
// Add your role IDs for each tier in the arrays below
const ROLE_HIERARCHY = [
  { key: 'owner',         ids: [] },                      // add owner role ID if needed
  { key: 'staff_manager', ids: ['1503781011648151733'] },
  { key: 'staff',         ids: ['1503591897598529671'] },
  { key: 'trial',         ids: ['1503591897598529669'] },
  { key: 'support',       ids: ['1503591897598529670'] },
  { key: 'verified',      ids: ['1503796042410491967'] },
];

function getTierForMember(member) {
  const memberRoleIds = [...member.roles.cache.keys()];

  for (const tier of ROLE_HIERARCHY) {
    if (tier.ids.some(id => memberRoleIds.includes(id))) {
      return tier.key;
    }
  }

  return 'public'; // fallback
}

module.exports = {
  name: 'help',
  description: 'Show available commands based on your role',

  async execute(message, args, client) {
    // Fetch full member so roles are populated
    const member = message.member ?? await message.guild.members.fetch(message.author.id);

    const tier = getTierForMember(member);
    const commands = helpData[tier] ?? helpData['public'] ?? [];

    const embed = new EmbedBuilder()
      .setTitle('📋 Available Commands')
      .setDescription(
        commands.length
          ? commands.join('\n')
          : 'No commands available for your role.'
      )
      .setColor(0x5865f2)
      .setFooter({ text: `Showing commands for: ${tier}` });

    await message.reply({ embeds: [embed] });
  },
};
