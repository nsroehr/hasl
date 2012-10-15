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
//            console.log('adding reinforcements');
            var isReinforcement = true;
            var unit = Hasl.Unit(reinforcements[i], isReinforcement);
            reinforcementUnits.push(unit);
        }
    };
    
    // TODO: how do you move a reinforcement that's already placed?
    that.placeReinforcements = function(units, placementHexId, hexCenter)
    {
        var addedToExistingStack = false;
        for(var i = 0; i < unitStacks.length; i++)
        {
            var unitStack = unitStacks[i];
            if(unitStack.getLocation().hexId === placementHexId)
            {
                unitStack.addUnits(units);
                addedToExistingStack = true;
            }
        }
        if(!addedToExistingStack)
        {
            // didn't find an existing stack at this location, add new stack
            var newUnitStack = Hasl.UnitStack();
            newUnitStack.addUnits(units);
            newUnitStack.setLocation({hexId: placementHexId, position: hexCenter});
            unitStacks.push(newUnitStack);
        }
//        units.setIsReinforcement(false);
        
        //var unitIndex = reinforcementUnits.indexOf(unit);
        for(i=0; i< units.length; i++)
        {
            reinforcementUnits.remove(units[i]);
        }
    };
    
    that.getReinforcements = function()
    {
//        console.log(reinforcementUnits[0].getIsReinforcement());
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
    var units = [];
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
    
    that.addUnits = function(unitsToAdd)
    {
        console.log(unitsToAdd);
        console.log(units);
        units = units.concat(unitsToAdd);
        console.log(units);
        return units;
    }
    
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

Hasl.Unit = function(spec, isReinforcement)
{
//    console.log('unit spec is: ' + spec.toString() + ' reinforcement: ' + isReinforcement);
    
    var that = {};
    var mType = spec.type;
    var mIsReinforcement = isReinforcement;
    that.getType = function()
    {
        return mType;
    };
    that.getIsReinforcement = function()
    {
//        console.log('getIsReinforcement called: ' + mIsReinforcement.toString());
        return mIsReinforcement;
    };
    that.setIsReinforcement = function(_isReinforcement)
    {
//        console.log('setIsReinforcement called: ' + _isReinforcement.toString());
        mIsReinforcement = _isReinforcement;
    };
    return that;
};