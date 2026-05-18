const { EmbedBuilder } = require('discord.js');

function helpEmbed(sections) {
  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTimestamp()
    .setFooter({ text: 'Prefix: :  •  Use :help to view this menu' });

  const keys = Object.keys(sections);

  // If only one section, use role name as title
  if (keys.length === 1) {
    const section = sections[keys[0]];
    embed.setTitle(section.name);
    embed.setDescription(section.entries.join('\n'));
    return embed;
  }

  // Multiple sections — no global title, each section is a field
  embed.setTitle('\u200b'); // invisible title
  let hasAny = false;

  for (const [key, section] of Object.entries(sections)) {
    if (!section.entries || section.entries.length === 0) continue;
    hasAny = true;
    embed.addFields({
      name: section.name,
      value: section.entries.join('\n'),
      inline: false,
    });
  }

  if (!hasAny) {
    embed.setTitle('Commands');
    embed.setDescription('No help entries added yet.\nUse `:helpaddrole @role <text>` to add some.');
  }

  return embed;
}

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

module.exports = { successEmbed, errorEmbed, helpEmbed };
