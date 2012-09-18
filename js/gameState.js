var Hasl = ( Hasl || {} ); //Loose Augmentation (http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)
var terrainDatabases = new Hasl.TerrainDatabases();
Hasl.GameState = function()
{
    // TODO: add scenario object (encapsulate board, terrainDb, available units)
    
    // TODO: add boards to a board list...
    var boardName = 'y';
    var boardY = new Hasl.Board(boardName, 33, 10, terrainDatabase.getDatabase(boardName));
    var boardGraph;
    // TODO: should board own it's graph?

    var allyPlayer;
    var axisPlayer;
}