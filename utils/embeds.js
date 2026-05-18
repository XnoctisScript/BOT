const { EmbedBuilder } = require('discord.js');

const COLORS = {
  help:    0x5865F2, // Discord blurple
  success: 0x57F287, // green
  error:   0xED4245, // red
  info:    0xFEE75C, // yellow
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

  for (const [label, entries] of Object.entries(sections)) {
    if (!entries || entries.length === 0) continue;

    const icon = label === 'public' ? '🌐' : label === 'staff' ? '🛡️' : '👑';
    const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

    embed.addFields({
      name: `${icon}  ${capitalized}`,
      value: entries.map(e => `• \`${e}\``).join('\n') || '*No entries yet.*',
      inline: false,
    });
  }

  if (Object.values(sections).every(v => !v || v.length === 0)) {
    embed.setDescription('*No help entries have been added yet.*\nUse `:helpaddrole <role> <text>` to add some.');
  }

  return embed;
}

module.exports = { successEmbed, errorEmbed, helpEmbed };
