const OWNER_ROLE_ID = '1503591897615302748';

// Staff: has MANAGE_MESSAGES or a role named "Staff" (customise as needed)
function isStaff(member) {
  if (isOwner(member)) return true;
  return member.permissions.has('ManageMessages');
}

function isOwner(member) {
  return member.roles.cache.has(OWNER_ROLE_ID);
}

module.exports = { isStaff, isOwner, OWNER_ROLE_ID };
