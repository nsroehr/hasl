var Hasl = ( Hasl || {} );

Hasl.Player = function(playerType)
{
    var that = {};
    var type = playerType;
    var unitStacks = new Array();
    var reinforcementUnits = new Array();
    that.getType = function() { return type; }
    
    that.addReinforcements = function(reinforcements)
    {
        for(var i=0; i < reinforcements.length; i++)
        {
            var unit = reinforcements[i];
            reinforcementUnits.push(unit);
        }
    };
    
    // TODO: how do you move a reinforcement that's already placed?
    
    that.placeReinforcement = function(unit, placementHexId, hexCenter)
    {
        var addedToExistingStack = false;
        for(var i = 0; i < unitStacks.length; i++)
        {
            var unitStack = unitStacks[i];
            if(unitStack.getLocation().hexId === placementHexId)
            {
                unitStack.addUnit(unit);
                addedToExistingStack = true;
            }
        }
        if(!addedToExistingStack)
        {
            // didn't find an existing stack at this location, add new stack
            var newUnitStack = Hasl.UnitStack();
            newUnitStack.addUnit(unit);
            newUnitStack.setLocation({hexId: placementHexId, position: hexCenter});
            unitStacks.push(newUnitStack);
        }
        
        var unitIndex = reinforcementUnits.indexOf(unit);
        reinforcementUnits.remove(unitIndex);
    };
    
    that.getReinforcements = function()
    {
        return reinforcementUnits;
    }
    
    that.getPlacedUnits = function()
    {
        return unitStacks;
    }
    
    return that;
};

Hasl.UnitStack = function()
{
    var that = {};
    var units = new Array();
    var location = {hexId: 'A0', position: {x: 0, y: 0}};
    
    that.getLocation = function()
    {
        return location;
    };
    
    that.setLocation = function(placementLocationHex)
    {
        location = placementLocationHex;
    }
    
    that.getUnitsInStack = function()
    {
        return units;
    };
    
    that.getMovementPoints = function()
    {
        return 4;
    };
    
    that.getFirepower = function()
    {
        return 6;
    };
    
    that.addUnit = function(unit)
    {
        units.push(unit);
        return units;
    };
    
    that.removeUnit = function(unit)
    {
        units.remove(unit);
    };
    
    that.moveStack = function(hexGridLocation)
    {
        location = hexGridLocation;
    };
    return that;
};

Hasl.Unit = function(spec)
{
    var that = {};
    
    that.getType = function()
    {
        return spec.type;
    };
    
    return that;
};