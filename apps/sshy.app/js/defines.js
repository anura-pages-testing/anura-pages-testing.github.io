SSHyClient = {
    // Global Defines
    MSG_DISCONNECT: 1,
    MSG_IGNORE: 2,
    MSG_UNIMPLEMENTED: 3,
    MSG_DEBUG: 4,
    MSG_SERVICE_REQUEST: 5,
    MSG_SERVICE_ACCEPT: 6,

    MSG_KEX_INIT: 20,
    MSG_NEW_KEYS: 21,
    MSG_KEXDH_INIT: 30,
    MSG_KEXDH_GEX_GROUP: 31,
    MSG_KEXDH_GEX_INIT: 32,
    MSG_KEXDH_GEX_REPLY: 33,
    MSG_KEXDH_GEX_REQUEST: 34,

    MSG_USERAUTH_REQUEST: 50,
    MSG_USERAUTH_FAILURE: 51,
    MSG_USERAUTH_SUCCESS: 52,
    MSG_USERAUTH_BANNER: 53,

    MSG_GLOBAL_REQUEST: 80,
    MSG_REQUEST_SUCCESS: 81,
    MSG_REQUEST_FAILURE: 82,

    MSG_CHANNEL_OPEN: 90,
    MSG_CHANNEL_OPEN_SUCCESS: 91,
    MSG_CHANNEL_OPEN_FAILURE: 92,
    MSG_CHANNEL_WINDOW_ADJUST: 93,
    MSG_CHANNEL_DATA: 94,
    MSG_CHANNEL_EXTENDED_DATA: 95,
    MSG_CHANNEL_EOF: 96,
    MSG_CHANNEL_CLOSE: 97,
    MSG_CHANNEL_REQUEST: 98,
    MSG_CHANNEL_SUCCESS: 99,
    MSG_CHANNEL_FAILURE: 100,

    WINDOW_SIZE: 40674, // Coppied from Putty
    MAX_PACKET_SIZE: 16384,

    AES_CBC: 2,
    AES_CTR: 6,

	/* Fish Binding */
	fishFsHintLeave: "\x1b\x5b\x33\x32",
	/* Bash Binding */
	bashFsHintLeave: "\x1b\x5d\x30\x3b"
};
