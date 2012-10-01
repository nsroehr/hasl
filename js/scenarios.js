var Hasl = ( Hasl || {} );
Hasl.Units =
{
    American:
    {
        fs_7_4_7_e: 0,
        hs_3_7_3_e: 1,
        ld_8_1: 2,
        ld_8_0: 3,
        ld_9_2: 4
    },
    German:
    {
        fs_4_6_7_1: 0,
        fs_4_4_7_2: 1,
        fs_5_4_8_e: 2,
        ld_9_1: 3,
        ld_8_1: 4,
        ld_7_0: 5
    }
};

Hasl.Boards = { Y: 'board_y', Test: 'test' };
Hasl.BoardConfiguration = { Rotate90: 90 };
Hasl.Players = { Ally: 0,  Axis: 1 };
Hasl.Months = { June: 'June' };

Hasl.Scenarios = 
{
    Vierville: 
    {
        name: 'Scenario 1 - Retaking Vierville',
        description: '',
        board: 
        {
            type: Hasl.Boards.Y,
            configuration: 
            {
                north: Hasl.BoardConfiguration.Rotate90,
                playableArea: 
                {
                    topLeft: 'A1',
                    bottomRight: 'V10'
                }
            }
        },
        month: Hasl.Months.June,
        turns: 5,
        players:
        {
            turn0: Hasl.Players.Ally,
            ally: 
            {
                elr: 5,
                // TODO: make this simple!
                turn0: function() {
                    var that = {};
                    var units = [ 
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e,
                        Hasl.Units.American.hs_3_7_3_e,
                        Hasl.Units.American.ld_8_1
                    ];
                    that.action = function()
                    {
                        placement(units, SingleMmcInHexes('N3','N4','M5','L5'));
                    };
                    return that;
                },
                turn1: function() {
                    var that = {};
                    var reinforcements = [
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e,
                        Hasl.Units.American.ld_8_1
                    ];
                    that.action = function()
                    {
                        placement(reinforcements, OnColumn('V'));
                    };
                    return that;
                },
                turn2: function() {
                    var that = {};
                    var reinforcements = [
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e,
                        Hasl.Units.American.ld_8_0
                    ];
                    that.action = function()
                    {
                        placement(reinforcements, OnColumn('V'));
                    };
                    return that;
                },
                turn3: function() {
                    var that = {};
                    var reinforcements = [
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e, 
                        Hasl.Units.American.fs_7_4_7_e,
                        Hasl.Units.American.hs_3_7_3_e,
                        Hasl.Units.American.ld_9_2
                    ];
                    that.action = function()
                    {
                        placement(reinforcements, OnColumn('V'));
                    };
                    return that;
                },
                turn4: function () {},
                turn5: function () {}
            },
            axis: 
            {
                elr: 3,
                turn1: function() {
                    var that = {};
                    var unitsEastEdge = [
                        Hasl.Units.German.fs_4_6_7_1, 
                        Hasl.Units.German.fs_4_6_7_1, 
                        Hasl.Units.German.fs_4_6_7_1, 
                        Hasl.Units.German.ld_8_1
                    ];
                    var unitsWestEdge = [
                        Hasl.Units.German.fs_4_4_7_2, 
                        Hasl.Units.German.fs_4_4_7_2, 
                        Hasl.Units.German.fs_4_4_7_2, 
                        Hasl.Units.German.ld_7_0
                    ];
                    that.action = function()
                    {
                        placement(unitsEastEdge, OnRows(9,10));
                        placement(unitsWestEdge, OnRows(0, 1));
                    };
                    return that;
                },
                turn2: function() {
                    var that = {};
                    var reinforcements = [
                        Hasl.Units.German.fs_5_4_8_e, 
                        Hasl.Units.German.fs_5_4_8_e, 
                        Hasl.Units.German.fs_5_4_8_e, 
                        Hasl.Units.German.ld_9_1
                    ];
                    that.action = function()
                    {
                        placement(reinforcements, OnRows(9,10));
                    };
                    return that;
                },
                turn3: function() {
                    var that = {};
                    var reinforcements = [
                        Hasl.Units.German.fs_5_4_8_e, 
                        Hasl.Units.German.fs_5_4_8_e, 
                        Hasl.Units.German.ld_9_1
                    ];
                    that.action = function()
                    {
                        placement(reinforcements, OnRows(9,10));
                    };
                    return that;
                },
                turn4: function() {},
                turn5: function() {}
            }
        },
        victoryConditions: function() 
        { 
            Hasl.EvaluateBoard(5, NoGermansInHexes(['L3', 'N5', 'N6', 'M4']));
        }
    },
    Test:
    {
        name: 'Test Scenario',
        description: '',
        board: 
        {
            type: Hasl.Boards.Test,
            configuration: 
            {
                north: Hasl.BoardConfiguration.Rotate90,
                playableArea: 
                {
                    topLeft: 'A1',
                    bottomRight: 'F3'
                }
            }
        },
        month: Hasl.Months.June,
        turns: 5,
        players: {},
        victoryConditions: {}
    }
};