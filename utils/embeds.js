const { EmbedBuilder } = require('discord.js');

const COLORS = {
  help:    0x5865F2,
  success: 0x57F287,
  error:   0xED4245,
};

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`✅  ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle(`❌  ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function helpEmbed(sections) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.help)
    .setTitle('📖  Staff Commands')
    .setTimestamp()
    .setFooter({ text: 'Prefix: :  •  Use :help to view this menu' });

  const icons = { public: '🌐', staff: '🛡️', owner: '👑' };

  let hasAny = false;

  for (const [key, section] of Object.entries(sections)) {
    if (!section.entries || section.entries.length === 0) continue;
    hasAny = true;
    const icon = icons[key] || '🔰';
    embed.addFields({
      name: `${icon}  ${section.name}`,
      value: section.entries.map(e => `• \`${e}\``).join('\n'),
      inline: false,
    });
  }

  if (!hasAny) {
    embed.setDescription('*No help entries have been added yet.*\nUse `:helpaddrole @role <text>` to add some.');
  }

  return embed;
}

module.exports = { successEmbed, errorEmbed, helpEmbed };
