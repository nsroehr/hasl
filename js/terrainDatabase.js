var Hasl = ( Hasl || {} ); //Loose Augmentation (http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)

// TODO: do something about roads!
//var hillTerrain = new Terrain('Hill', function(x) { return 2*x; }, 1, 0, false, false);
//var wallTerrain = new Terrain('Wall', function(x){ return x+1; }, 2, 0, false, false);
//var hedgeTerrain = new Terrain('Hedge', function(x){ return x+1; }, 1, 0, false, false);
Hasl.TerrainDatabases = (function()
{
    var that = {};
    
    var mTerrains = new Array();
    mTerrains[Hasl.Boards.Y] = Hasl.Terrains.Y;
    mTerrains[Hasl.Boards.Test] = Hasl.Terrains.Test;
    that.getDatabase = function(boardName)
    {
        return mTerrains[boardName];
    }
    return that;
})();