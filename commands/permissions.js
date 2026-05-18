const OWNER_ROLE_ID   = '1503591897615302748';
const STAFF_ROLE_ID   = '1503591897598529671';
const TRIAL_ROLE_ID   = '1503591897598529669';
const SUPPORT_ROLE_ID = '1503591897598529670';
const VERIFIED_ROLE_ID = '1503796042410491967';

function isOwner(member)    { return member.roles.cache.has(OWNER_ROLE_ID); }
function isStaff(member)    { return member.roles.cache.has(STAFF_ROLE_ID); }
function isTrial(member)    { return member.roles.cache.has(TRIAL_ROLE_ID); }
function isSupport(member)  { return member.roles.cache.has(SUPPORT_ROLE_ID); }
function isVerified(member) { return member.roles.cache.has(VERIFIED_ROLE_ID); }

module.exports = { isOwner, isStaff, isTrial, isSupport, isVerified };
