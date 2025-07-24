import { PROGRAM_ADDRESS } from '@/utils/constants';

export const IDL = {
    address: PROGRAM_ADDRESS,
    metadata: {
        name: 'skilldex',
        version: '0.1.0',
        spec: '0.1.0',
        description: 'Created with Anchor',
    },
    instructions: [
        {
            name: 'close_lobby',
            discriminator: [4, 105, 152, 106, 82, 6, 43, 7],
            accounts: [
                {
                    name: 'player',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'lobby',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [108, 111, 98, 98, 121],
                            },
                            {
                                kind: 'arg',
                                path: 'lobby_id',
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
            ],
            args: [
                {
                    name: 'lobby_id',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'close_platform_test',
            discriminator: [20, 164, 191, 240, 38, 107, 147, 37],
            accounts: [
                {
                    name: 'platform_signer',
                    writable: true,
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'system_program',
                    address: '11111111111111111111111111111111',
                },
            ],
            args: [],
        },
        {
            name: 'create_lobby',
            discriminator: [116, 55, 74, 48, 40, 51, 135, 155],
            accounts: [
                {
                    name: 'platform_signer',
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'player',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'lobby',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [108, 111, 98, 98, 121],
                            },
                            {
                                kind: 'account',
                                path: 'platform_account.current_id',
                                account: 'Platform',
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'system_program',
                    address: '11111111111111111111111111111111',
                },
                {
                    name: 'clock',
                    address: 'SysvarC1ock11111111111111111111111111111111',
                },
            ],
            args: [
                {
                    name: 'game_type',
                    type: {
                        defined: {
                            name: 'GameType',
                        },
                    },
                },
                {
                    name: 'bet_amount',
                    type: 'u64',
                },
                {
                    name: 'expire_time',
                    type: 'i64',
                },
            ],
        },
        {
            name: 'declare_tie',
            discriminator: [173, 156, 166, 219, 187, 107, 97, 103],
            accounts: [
                {
                    name: 'platform_signer',
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'player',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'second_player',
                    writable: true,
                },
                {
                    name: 'lobby',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [108, 111, 98, 98, 121],
                            },
                            {
                                kind: 'arg',
                                path: 'lobby_id',
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
            ],
            args: [
                {
                    name: 'lobby_id',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'declare_winner',
            discriminator: [140, 135, 197, 50, 9, 23, 4, 80],
            accounts: [
                {
                    name: 'platform_signer',
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'winner',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'lobby',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [108, 111, 98, 98, 121],
                            },
                            {
                                kind: 'arg',
                                path: 'lobby_id',
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
            ],
            args: [
                {
                    name: 'lobby_id',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'initialize_platform',
            discriminator: [119, 201, 101, 45, 75, 122, 89, 3],
            accounts: [
                {
                    name: 'platform_signer',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'system_program',
                    address: '11111111111111111111111111111111',
                },
            ],
            args: [],
        },
        {
            name: 'join_lobby',
            discriminator: [127, 102, 119, 190, 215, 223, 212, 159],
            accounts: [
                {
                    name: 'platform_signer',
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'player',
                    writable: true,
                    signer: true,
                },
                {
                    name: 'lobby',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [108, 111, 98, 98, 121],
                            },
                            {
                                kind: 'arg',
                                path: 'lobby_id',
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'clock',
                    address: 'SysvarC1ock11111111111111111111111111111111',
                },
                {
                    name: 'system_program',
                    address: '11111111111111111111111111111111',
                },
            ],
            args: [
                {
                    name: 'lobby_id',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'update_platform_signer',
            discriminator: [99, 241, 155, 205, 90, 25, 175, 182],
            accounts: [
                {
                    name: 'platform_signer',
                    writable: true,
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
                {
                    name: 'new_platform_signer',
                },
                {
                    name: 'system_program',
                    address: '11111111111111111111111111111111',
                },
            ],
            args: [],
        },
        {
            name: 'withdraw_commission',
            discriminator: [136, 85, 112, 153, 166, 99, 191, 5],
            accounts: [
                {
                    name: 'platform_signer',
                    writable: true,
                    signer: true,
                    relations: ['platform_account'],
                },
                {
                    name: 'platform_account',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [112, 108, 97, 116, 102, 111, 114, 109],
                            },
                            {
                                kind: 'const',
                                value: [
                                    115, 107, 105, 108, 108, 100, 101, 120, 81, 115, 100, 104, 100,
                                    102, 102, 51,
                                ],
                            },
                        ],
                    },
                },
            ],
            args: [],
        },
    ],
    accounts: [
        {
            name: 'Lobby',
            discriminator: [167, 194, 217, 163, 92, 92, 103, 49],
        },
        {
            name: 'Platform',
            discriminator: [77, 92, 204, 58, 187, 98, 91, 12],
        },
    ],
    events: [
        {
            name: 'LobbyClosure',
            discriminator: [253, 140, 233, 10, 83, 228, 177, 191],
        },
        {
            name: 'LobbyCreation',
            discriminator: [176, 254, 151, 65, 246, 245, 6, 40],
        },
        {
            name: 'PlayerJoined',
            discriminator: [39, 144, 49, 106, 108, 210, 183, 38],
        },
        {
            name: 'TieDeclared',
            discriminator: [139, 124, 104, 146, 101, 17, 50, 233],
        },
        {
            name: 'WinnerSelected',
            discriminator: [245, 110, 152, 173, 193, 48, 133, 5],
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'LowBalance',
            msg: 'Your balance is too low',
        },
        {
            code: 6001,
            name: 'UnauthorizedSigner',
            msg: "Platform didn't approve this transaction",
        },
        {
            code: 6002,
            name: 'ClosedLobby',
            msg: 'Current lobby is closed',
        },
        {
            code: 6003,
            name: 'NotExpired',
            msg: 'Lobby has not expired',
        },
        {
            code: 6004,
            name: 'AlreadyExpired',
            msg: 'Lobby has expired',
        },
        {
            code: 6005,
            name: 'NotOpen',
            msg: 'Lobby is active',
        },
        {
            code: 6006,
            name: 'NotAPlayer',
            msg: 'Signer is not in a lobby',
        },
    ],
    types: [
        {
            name: 'GameState',
            type: {
                kind: 'enum',
                variants: [
                    {
                        name: 'Open',
                    },
                    {
                        name: 'Active',
                    },
                    {
                        name: 'Tie',
                    },
                    {
                        name: 'Won',
                        fields: [
                            {
                                name: 'winner',
                                type: 'pubkey',
                            },
                        ],
                    },
                ],
            },
        },
        {
            name: 'GameType',
            type: {
                kind: 'enum',
                variants: [
                    {
                        name: 'TickTackToe',
                    },
                    {
                        name: 'ConnectFour',
                    },
                    {
                        name: 'Checkers',
                    },
                    {
                        name: 'Reversi',
                    },
                ],
            },
        },
        {
            name: 'Lobby',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'lobby_id',
                        type: 'u64',
                    },
                    {
                        name: 'game_type',
                        type: {
                            defined: {
                                name: 'GameType',
                            },
                        },
                    },
                    {
                        name: 'game_state',
                        type: {
                            defined: {
                                name: 'GameState',
                            },
                        },
                    },
                    {
                        name: 'players',
                        type: {
                            vec: 'pubkey',
                        },
                    },
                    {
                        name: 'pool',
                        type: 'u64',
                    },
                    {
                        name: 'timestamp',
                        type: 'i64',
                    },
                    {
                        name: 'expire_time',
                        type: 'i64',
                    },
                    {
                        name: 'bump',
                        type: 'u8',
                    },
                ],
            },
        },
        {
            name: 'LobbyClosure',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'lobby_id',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'LobbyCreation',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'lobby_id',
                        type: 'u64',
                    },
                    {
                        name: 'game_type',
                        type: {
                            defined: {
                                name: 'GameType',
                            },
                        },
                    },
                    {
                        name: 'creator',
                        type: 'pubkey',
                    },
                    {
                        name: 'pool',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'Platform',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'platform_signer',
                        type: 'pubkey',
                    },
                    {
                        name: 'current_id',
                        type: 'u64',
                    },
                    {
                        name: 'balance',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'PlayerJoined',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'lobby_id',
                        type: 'u64',
                    },
                    {
                        name: 'game_type',
                        type: {
                            defined: {
                                name: 'GameType',
                            },
                        },
                    },
                    {
                        name: 'amount',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'TieDeclared',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'lobby_id',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'WinnerSelected',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'lobby_id',
                        type: 'u64',
                    },
                    {
                        name: 'winner',
                        type: 'pubkey',
                    },
                ],
            },
        },
    ],
};

export type Skilldex = {
    address: typeof PROGRAM_ADDRESS;
    metadata: {
        name: 'skilldex';
        version: '0.1.0';
        spec: '0.1.0';
        description: 'Created with Anchor';
    };
    instructions: [
        {
            name: 'closeLobby';
            discriminator: [4, 105, 152, 106, 82, 6, 43, 7];
            accounts: [
                {
                    name: 'player';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'lobby';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [108, 111, 98, 98, 121];
                            },
                            {
                                kind: 'arg';
                                path: 'lobbyId';
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                }
            ];
            args: [
                {
                    name: 'lobbyId';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'closePlatformTest';
            discriminator: [20, 164, 191, 240, 38, 107, 147, 37];
            accounts: [
                {
                    name: 'platformSigner';
                    writable: true;
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                }
            ];
            args: [];
        },
        {
            name: 'createLobby';
            discriminator: [116, 55, 74, 48, 40, 51, 135, 155];
            accounts: [
                {
                    name: 'platformSigner';
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'player';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'lobby';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [108, 111, 98, 98, 121];
                            },
                            {
                                kind: 'account';
                                path: 'platform_account.current_id';
                                account: 'platform';
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
                {
                    name: 'clock';
                    address: 'SysvarC1ock11111111111111111111111111111111';
                }
            ];
            args: [
                {
                    name: 'gameType';
                    type: {
                        defined: {
                            name: 'gameType';
                        };
                    };
                },
                {
                    name: 'betAmount';
                    type: 'u64';
                },
                {
                    name: 'expireTime';
                    type: 'i64';
                }
            ];
        },
        {
            name: 'declareTie';
            discriminator: [173, 156, 166, 219, 187, 107, 97, 103];
            accounts: [
                {
                    name: 'platformSigner';
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'player';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'secondPlayer';
                    writable: true;
                },
                {
                    name: 'lobby';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [108, 111, 98, 98, 121];
                            },
                            {
                                kind: 'arg';
                                path: 'lobbyId';
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                }
            ];
            args: [
                {
                    name: 'lobbyId';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'declareWinner';
            discriminator: [140, 135, 197, 50, 9, 23, 4, 80];
            accounts: [
                {
                    name: 'platformSigner';
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'winner';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'lobby';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [108, 111, 98, 98, 121];
                            },
                            {
                                kind: 'arg';
                                path: 'lobbyId';
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                }
            ];
            args: [
                {
                    name: 'lobbyId';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'initializePlatform';
            discriminator: [119, 201, 101, 45, 75, 122, 89, 3];
            accounts: [
                {
                    name: 'platformSigner';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                }
            ];
            args: [];
        },
        {
            name: 'joinLobby';
            discriminator: [127, 102, 119, 190, 215, 223, 212, 159];
            accounts: [
                {
                    name: 'platformSigner';
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'player';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'lobby';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [108, 111, 98, 98, 121];
                            },
                            {
                                kind: 'arg';
                                path: 'lobbyId';
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'clock';
                    address: 'SysvarC1ock11111111111111111111111111111111';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                }
            ];
            args: [
                {
                    name: 'lobbyId';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'updatePlatformSigner';
            discriminator: [99, 241, 155, 205, 90, 25, 175, 182];
            accounts: [
                {
                    name: 'platformSigner';
                    writable: true;
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                },
                {
                    name: 'newPlatformSigner';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                }
            ];
            args: [];
        },
        {
            name: 'withdrawCommission';
            discriminator: [136, 85, 112, 153, 166, 99, 191, 5];
            accounts: [
                {
                    name: 'platformSigner';
                    writable: true;
                    signer: true;
                    relations: ['platformAccount'];
                },
                {
                    name: 'platformAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [112, 108, 97, 116, 102, 111, 114, 109];
                            },
                            {
                                kind: 'const';
                                value: [
                                    115,
                                    107,
                                    105,
                                    108,
                                    108,
                                    100,
                                    101,
                                    120,
                                    81,
                                    115,
                                    100,
                                    104,
                                    100,
                                    102,
                                    102,
                                    51
                                ];
                            }
                        ];
                    };
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: 'lobby';
            discriminator: [167, 194, 217, 163, 92, 92, 103, 49];
        },
        {
            name: 'platform';
            discriminator: [77, 92, 204, 58, 187, 98, 91, 12];
        }
    ];
    events: [
        {
            name: 'lobbyClosure';
            discriminator: [253, 140, 233, 10, 83, 228, 177, 191];
        },
        {
            name: 'lobbyCreation';
            discriminator: [176, 254, 151, 65, 246, 245, 6, 40];
        },
        {
            name: 'playerJoined';
            discriminator: [39, 144, 49, 106, 108, 210, 183, 38];
        },
        {
            name: 'tieDeclared';
            discriminator: [139, 124, 104, 146, 101, 17, 50, 233];
        },
        {
            name: 'winnerSelected';
            discriminator: [245, 110, 152, 173, 193, 48, 133, 5];
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'lowBalance';
            msg: 'Your balance is too low';
        },
        {
            code: 6001;
            name: 'unauthorizedSigner';
            msg: "Platform didn't approve this transaction";
        },
        {
            code: 6002;
            name: 'closedLobby';
            msg: 'Current lobby is closed';
        },
        {
            code: 6003;
            name: 'notExpired';
            msg: 'Lobby has not expired';
        },
        {
            code: 6004;
            name: 'alreadyExpired';
            msg: 'Lobby has expired';
        },
        {
            code: 6005;
            name: 'notOpen';
            msg: 'Lobby is active';
        },
        {
            code: 6006;
            name: 'notAPlayer';
            msg: 'Signer is not in a lobby';
        }
    ];
    types: [
        {
            name: 'gameState';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'open';
                    },
                    {
                        name: 'active';
                    },
                    {
                        name: 'tie';
                    },
                    {
                        name: 'won';
                        fields: [
                            {
                                name: 'winner';
                                type: 'pubkey';
                            }
                        ];
                    }
                ];
            };
        },
        {
            name: 'gameType';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'tickTackToe';
                    },
                    {
                        name: 'connectFour';
                    },
                    {
                        name: 'checkers';
                    },
                    {
                        name: 'reversi';
                    }
                ];
            };
        },
        {
            name: 'lobby';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'lobbyId';
                        type: 'u64';
                    },
                    {
                        name: 'gameType';
                        type: {
                            defined: {
                                name: 'gameType';
                            };
                        };
                    },
                    {
                        name: 'gameState';
                        type: {
                            defined: {
                                name: 'gameState';
                            };
                        };
                    },
                    {
                        name: 'players';
                        type: {
                            vec: 'pubkey';
                        };
                    },
                    {
                        name: 'pool';
                        type: 'u64';
                    },
                    {
                        name: 'timestamp';
                        type: 'i64';
                    },
                    {
                        name: 'expireTime';
                        type: 'i64';
                    },
                    {
                        name: 'bump';
                        type: 'u8';
                    }
                ];
            };
        },
        {
            name: 'lobbyClosure';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'lobbyId';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'lobbyCreation';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'lobbyId';
                        type: 'u64';
                    },
                    {
                        name: 'gameType';
                        type: {
                            defined: {
                                name: 'gameType';
                            };
                        };
                    },
                    {
                        name: 'creator';
                        type: 'pubkey';
                    },
                    {
                        name: 'pool';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'platform';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'platformSigner';
                        type: 'pubkey';
                    },
                    {
                        name: 'currentId';
                        type: 'u64';
                    },
                    {
                        name: 'balance';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'playerJoined';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'lobbyId';
                        type: 'u64';
                    },
                    {
                        name: 'gameType';
                        type: {
                            defined: {
                                name: 'gameType';
                            };
                        };
                    },
                    {
                        name: 'amount';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'tieDeclared';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'lobbyId';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'winnerSelected';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'lobbyId';
                        type: 'u64';
                    },
                    {
                        name: 'winner';
                        type: 'pubkey';
                    }
                ];
            };
        }
    ];
};
