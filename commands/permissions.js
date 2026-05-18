const ROLES = {
  owner:    '1503591897615302748',
  staff:    '1503591897598529671',
  trial:    '1503591897598529669',
  support:  '1503591897598529670',
  verified: '1503796042410491967',
};

function hasRole(member, key) {
  return member.roles.cache.has(ROLES[key]);
}

function isOwner(member)    { return hasRole(member, 'owner'); }
function isStaff(member)    { return hasRole(member, 'staff'); }
function isTrial(member)    { return hasRole(member, 'trial'); }
function isSupport(member)  { return hasRole(member, 'support'); }
function isVerified(member) { return hasRole(member, 'verified'); }

module.exports = { ROLES, isOwner, isStaff, isTrial, isSupport, isVerified };
