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
            var unit = Hasl.Unit(reinforcements[i]); //, isReinforcement);
            reinforcementUnits.push(unit);
        }
    };
    
    that.placeReinforcements = function(units, placementHexId) //, hexCenter)
    {
        var addedToExistingStack = false;
        for(var i = 0; i < unitStacks.length; i++)
        {
            var unitStack = unitStacks[i];
            if(unitStack.getLocation() === placementHexId)
            {
                unitStack.addUnits(units);
                addedToExistingStack = true;
                break;
            }
        }
        if(!addedToExistingStack)
        {
            // didn't find an existing stack at this location, add new stack
            var newUnitStack = Hasl.UnitStack();
            newUnitStack.addUnits(units);
            newUnitStack.setLocation(placementHexId);
            unitStacks.push(newUnitStack);
        }
        for(i=0; i< units.length; i++)
        {
            reinforcementUnits.remove(units[i]);
        }
    };
    that.placeUnitStack = function(unitStack, placementHexId)
    {
        var addedToExistingStack = false;
        for(var i = 0; i < unitStacks.length; i++)
        {
            var currentUnitStack = unitStacks[i];
            if(currentUnitStack.getLocation() === placementHexId)
            {
                currentUnitStack.addUnits(unitStack.getUnitsInStack());
                addedToExistingStack = true;
                break;
            }
        }
        if(addedToExistingStack)
        {
            unitStacks.remove(unitStack);
        }
        else
        {
            unitStack.setLocation(placementHexId);
        }
    }
    
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
    var mUnits = [];
    var mHexLocation = 'A0';
    
    that.getLocation = function()
    {
        return mHexLocation;
    };
    
    that.setLocation = function(placementLocationHex)
    {
        mHexLocation = placementLocationHex;
    }
    
    that.getUnitsInStack = function()
    {
        return mUnits;
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
        mUnits = mUnits.concat(unitsToAdd);
        return mUnits;
    }
    
    that.addUnit = function(unit)
    {
        mUnits.push(unit);
        return mUnits;
    };
    
    that.removeUnit = function(unit)
    {
        mUnits.remove(unit);
    };
    
    that.moveStack = function(hexGridLocation)
    {
        mHexLocation = hexGridLocation;
    };
    return that;
};

Hasl.Unit = function(spec)
{
    var that = {};
    var mType = spec.type;
    that.getType = function()
    {
        return mType;
    };
    return that;
};