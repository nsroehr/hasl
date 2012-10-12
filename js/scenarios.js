var Hasl = ( Hasl || {} );


Hasl.Boards = { Y: 'board_y', Test: 'test' };
Hasl.BoardConfiguration = { Rotate90: 90 };
Hasl.Players = { Allied: {value: 0, scenarioName: 'allied'}, Axis: {value: 1, scenarioName: 'axis'} };
Hasl.Months = { June: 'June' };

Hasl.BoardEvaluators = {}; // TODO: move me!
Hasl.BoardEvaluators.singleMmcInHexes = function()
{
    // TODO: use arguments, will be applicable Hex IDs
    return true;
}
Hasl.BoardEvaluators.onColumns = function(/*arguments are hex ids*/)
{
    // TODO: use arguments, will be applicable Hex IDs
    return true;
}
Hasl.BoardEvaluators.onRows = function(/*arguments are hex ids*/)
{
    // TODO: use arguments, will be applicable Hex IDs
    return true;
}
Hasl.BoardEvaluators.noGermansInHexes = function(/*arguments are hex ids*/)
{
    // TODO: use arguments, will be applicable Hex IDs
    return true;
}
Hasl.EndConditions = {};
Hasl.EndConditions.Victory = function(/*Hasl.Player*/ player, /*Hasl.BoardEvaluator*/ condition)
{
    // TODO: link this back to victorious player...somehow
    return condition;
}

var addTurnInfo = function(unitArray, validationFunction)
{
    var that = {};
    that.getUnits = function() { return unitArray; }
    that.getValidator = function() { return validationFunction; }
    return that;
}

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
            turn0: Hasl.Players.Allied,
            allied: 
            {
                name: 'Americans',
                elr: 5,
                // TODO: simplify units? (do we need to restate that they are American units, when we have to already know?!)
                turn0: addTurnInfo(
                    [Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e,
                     Hasl.Units.American.hs_3_7_3_e, Hasl.Units.American.ld_8_1], Hasl.BoardEvaluators.singleMmcInHexes('N3','N4','M5','L5') ),
                
                turn1: addTurnInfo(
                    [Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.ld_8_1],
                     Hasl.BoardEvaluators.onColumns('V') ),
                
                turn2: addTurnInfo(
                    [Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.ld_8_0], Hasl.BoardEvaluators.onColumns('V') ),
                     
                turn3: addTurnInfo(
                    [Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e, Hasl.Units.American.fs_7_4_7_e,
                     Hasl.Units.American.hs_3_7_3_e, Hasl.Units.American.ld_9_2], Hasl.BoardEvaluators.onColumns('V') ),

                turn4: addTurnInfo(),
                
                turn5: addTurnInfo()
            },
            axis: 
            {
                name: 'Germans',
                elr: 3,
                turn1: addTurnInfo(
                    [Hasl.Units.German.fs_4_6_7_1, Hasl.Units.German.fs_4_6_7_1, Hasl.Units.German.fs_4_6_7_1, 
                     Hasl.Units.German.ld_8_1], Hasl.BoardEvaluators.onRows(0,1,9,10) ),
                
                turn2: addTurnInfo(
                    [Hasl.Units.German.fs_5_4_8_e, Hasl.Units.German.fs_5_4_8_e, Hasl.Units.German.fs_5_4_8_e, Hasl.Units.German.ld_9_1],
                    Hasl.BoardEvaluators.onRows(9,10) ),

                turn3: addTurnInfo(
                    [Hasl.Units.German.fs_5_4_8_e, Hasl.Units.German.fs_5_4_8_e, Hasl.Units.German.ld_9_1], Hasl.BoardEvaluators.onRows(9,10) ),

                turn4: addTurnInfo(),
                
                turn5: addTurnInfo()
            }
        },
        victoryConditions: function() 
        { 
            Hasl.EndConditions.Victory(Hasl.Players.Allied, Hasl.BoardEvaluators.noGermansInHexes(['L3', 'N5', 'N6', 'M4']));
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
        players:
        {
            turn0: Hasl.Players.Allied,
            allied: 
            {
                name: 'Allied Player'
            },
            axis:
            {
                name: 'Axis Player'
            }
        }
        /*victoryConditions: {}*/
    }
};