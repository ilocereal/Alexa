// for some reason checking for errors doesn't actually work with d.js
export const APIErrors = {
    "UNKNOWN_ACCOUNT": "Unknown Account",
    "UNKNOWN_APPLICATION": "Unknown Application",
    "UNKNOWN_CHANNEL": "Unknown Channel",
    "UNKNOWN_GUILD": "Unknown Guild",
    "UNKNOWN_INTEGRATION": "Unknown Integration",
    "MISSING_PERMISSIONS": "Missing Permissions",
    "CANNOT_MESSAGE_USER": "Cannot Message User",
    "CANNOT_SEND_EMPTY_MESSAGE": "Cannot send an empty message",
    "MESSAGE_TOO_LONG": "Invalid Form Body\ncontent: Must be 2000 or fewer in length.",
    "INVALID_THUMBNAIL": "Invalid Form Body\nembed.thumbnail.url: Not a well formed URL."
};

export const PSQLErrors = {
    "DATABASE_DOES_NOT_EXIST":"42P01"
};
