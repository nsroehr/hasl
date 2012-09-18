var Hasl = ( Hasl || {} ); //Loose Augmentation (http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)
Hasl.Terrain = function(type, mf, ffmo, tem, losHinderance, isConcealment, isBypassable )
{
    this.mType = type;
    this.mMF   = mf;
    this.mFFMO = ffmo;
    this.mTEM  = tem;
    this.mLOSHiderance = losHinderance;
    this.mIsConcealment = isConcealment;
    this.isBypassable = isBypassable;
};
      
Hasl.TerrainDatabases = function()
{
    // TODO: do something about roads!
    var openGroundTerrain = new Hasl.Terrain('Open Ground',  1, -1,  0,  0, false, false);
    var woodsTerrain = new Hasl.Terrain('Wood',               2,  0,  1,  0,  true,  true);
    var brushTerrain = new Hasl.Terrain('Brush',             2,  0,  1,  0,  true, false);
    var woodenBuilding = new Hasl.Terrain('Wooden Building', 2,  0,  2,  0,  true,  true);
    var stoneBuilding = new Hasl.Terrain('Stone Building',   2,  0,  3,  0,  true,  true);
    var orchardTerrain = new Hasl.Terrain('Orchard',         1,  0,  0,  1,  true, false);
    var grainTerrain = new Hasl.Terrain('Grain',           1.5,  0,  0,  1,  true, false);
//var hillTerrain = new Terrain('Hill', function(x) { return 2*x; }, 1, 0, false, false);
//var wallTerrain = new Terrain('Wall', function(x){ return x+1; }, 2, 0, false, false);
//var hedgeTerrain = new Terrain('Hedge', function(x){ return x+1; }, 1, 0, false, false);
    
    TerrainType = {
        OpenGround : 0,
        Woods      : 1,
        Brush      : 2,
        WoodBldg   : 3,
        StoneBldg  : 4,
        Orchard    : 5,
        Grain      : 6
    };
    
    this.mTerrains = new Array();
    this.mTerrains['y'] = this.createTerrainForBoardY();
    this.mTerrains['test'] = this.createTerrainForTestBoard();
};

Hasl.TerrainDatabases.prototype.getDatabase = function(boardName)
{
    return this.mTerrains[boardName];
};

Hasl.TerrainDatabases.prototype.getTerrainFromTerrainType = function(terrainType)
{
    switch(terrainType)
    {
        case TerrainType.OpenGround:
            return openGroundTerrain;
        case TerrainType.Woods:
            return woodsTerrain;
        case TerrainType.Brush:
            return brushTerrain;
        case TerrainType.WoodBldg:
            return woodenBuilding;
        case TerrainType.StoneBldg:
            return stoneBuilding;
        case TerrainType.Orchard:
            return orchardTerrain;
        case TerrainType.Grain:
            return grainTerrain;
    }
    throw "invalid terrain type";
};

Hasl.TerrainDatabases.prototype.createTerrainForBoardY = function()
{
    var terrainDB = [
        // A1 - A10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // B0 - B10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // C1 - C10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.Orchard],
        // D0 - D10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.WoodBldg],
        [TerrainType.Orchard]
        [TerrainType.OpenGround],
        // E1 - E10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Woods],
        [TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.Orchard],
        // F0 - F10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Woods],
        [TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Orchard]
        [TerrainType.OpenGround],
        // G1 - G10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Orchard],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // H0 - H10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.Woods],
        // I1 - I10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // J0 - J10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.Orchard],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        // K1 - K10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        // L0 - L10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        // M1 - M10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        // N0 - N10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.Woods],
        // O1 - O10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.WoodBldg],
        // P0 - P10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // Q1 - Q10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // R0 - R10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // S1 - S10
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        // T0 - T10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.Woods],
        // U1 - U10
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        // V0 - 10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.Woods],
        // W1 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        // X0 - 10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.Woods],
        // Y1 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // Z0 - 10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.Woods],
        // AA1 - 10
        [TerrainType.OpenGround],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.Orchard],
        [TerrainType.OpenGround, TerrainType.Woods],
        // BB0 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.Grain],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.Orchard],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // CC1 - 10
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // DD0 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.WoodBldg],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // EE1 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.WoodBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // FF0 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.StoneBldg],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        // GG1 - 10
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround, TerrainType.Woods],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround],
        [TerrainType.OpenGround]
    ];
    return terrainDB;
};

Hasl.TerrainDatabases.prototype.createTerrainForTestBoard = function()
{
    var terrainDB = [
        // A1-3
        [TerrainType.OpenGround],
        [TerrainType.Brush],
        [TerrainType.Grain],
        // B0-3
        [TerrainType.Orchard],
        [TerrainType.StoneBldg],
        [TerrainType.WoodBldg],
        [TerrainType.Woods],
        // C1-3
        [TerrainType.OpenGround],
        [TerrainType.Brush],
        [TerrainType.Grain],
        // D0-3
        [TerrainType.Orchard],
        [TerrainType.StoneBldg],
        [TerrainType.WoodBldg],
        [TerrainType.Woods],
        // E1-3
        [TerrainType.OpenGround],
        [TerrainType.Brush],
        [TerrainType.Grain],
        // F0-3
        [TerrainType.Orchard],
        [TerrainType.StoneBldg],
        [TerrainType.WoodBldg],
        [TerrainType.Woods]
    ];
    return terrainDB;
}