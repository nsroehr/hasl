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

Hasl.UnitUtils = {};
Hasl.UnitUtils.getUnitImage = function(imageLoader)
{
    return imageLoader.getImage(imageLoader.getDatabase().american_2_e_fs);
}

// TODO: createUnit() that creates a selectable unit (with appropriate callbacks
//       for selection...
Hasl.UnitPicker = function(pickableUnits, kineticLayer, imageLoader, orientation, isCloseable)
{
    var that = {};
    var mSelectableUnits = [];
    var mSelectedUnits = [];
    var unselectedShadowSpec =  {
        color: 'transparent',
        blur: 3,
        offset: [3, 3],
        opacity: 0.5
    };
    var selectedShadowSpec =  {
        color: 'black',
        blur: 3,
        offset: [3, 3],
        opacity: 0.5
    };
    var layer = kineticLayer;
    
    var imageDimensions = {width: 72, height: 72};
    var padding = 5;
    var offset = padding;
    
    that.draw = function()
    {
//        console.log(mSelectedUnits);
        for(var i=0; i < mSelectableUnits.length; i++)
        {
            var selectableUnitImage = mSelectableUnits[i];
            var isSelected = (mSelectedUnits.indexOf(selectableUnitImage) >= 0);
            if(isSelected)
            {
                selectableUnitImage.setShadow(selectedShadowSpec);
            }
            else
            {
                selectableUnitImage.setShadow(unselectedShadowSpec);
            }
        }
        layer.draw();
    }
    var multiSelectRangeWithGaps = function(selectableUnit)
    {
        // this isn't too bad to implement, but we'll wait on it...
        alert('not implemented');
    }
    var multiSelectRange = function(selectableUnit)
    {
        if(mSelectedUnits.length === 0)
        {
            changeSelection(selectableUnit);
        }
        // this doesn't work correctly when you keep shift held down
        var index = selectableUnit.getIndex();
        var indexOfLastSelection = mSelectedUnits.pop().getIndex();
        var startingIndex = Math.min(index, indexOfLastSelection);
        var lastIndex = Math.max(index, indexOfLastSelection);
        mSelectedUnits.removeAll();
        for(var i=startingIndex; i <= lastIndex; i++)
        {
            mSelectedUnits.push(mSelectableUnits[i]);
        }
    }
    var addToCurrentSelection = function(selectableUnit)
    {
        var alreadySelected = (mSelectedUnits.indexOf(selectableUnit) >= 0);
        if(alreadySelected)
        {
            mSelectedUnits.remove(selectableUnit);
        }
        else
        {
            mSelectedUnits.push(selectableUnit);
        }
    }
    var changeSelection = function(selectableUnit)
    {
        mSelectedUnits.removeAll();
        mSelectedUnits.push(selectableUnit);
    }
    
    var selectionHelper = function(selectedUnitImage)
    {
      return function(e) {
            if(e.shiftKey && e.ctrlKey)
            {
                multiSelectRangeWithGaps(selectedUnitImage);
            }
            else if(e.shiftKey) {
                multiSelectRange(selectedUnitImage);
            }
            else if(e.ctrlKey)
            {
                addToCurrentSelection(selectedUnitImage);
            }
            else 
            {
                changeSelection(selectedUnitImage);
            }
            mGameInterface.setSelectedUnits(mSelectedUnits);
            that.draw();
        };
    };
    for(var i=0; i < pickableUnits.length; i++)
    {
        var unit = pickableUnits[i];
        var unitImage = Hasl.UnitUtils.getUnitImage(imageLoader);
        var selectableUnit = createSelectableSingleUnit(
            unit,
            i,
            {
                x: offset,
                y: 0,
                image: unitImage,
                width: imageDimensions.width,
                height: imageDimensions.height
            }
        );
        selectableUnit.on('mousemove', function() {
            document.body.style.cursor = "pointer";
        });
        
        selectableUnit.on('click', selectionHelper(selectableUnit));
        
        selectableUnit.on('mouseout', function(){
            document.body.style.cursor = "default"; 
        });
        
        mSelectableUnits.push(selectableUnit);
        layer.add(selectableUnit);
        offset += imageDimensions.width + padding;
    }
    var unitPickerDimensions = {width: offset, height: imageDimensions.height+padding };

    that.getDimensions = function()
    {
        return unitPickerDimensions;
    }
    
    that.getSelectedUnits = function()
    {
        return mSelectedUnits;
    }
    
    return that;
}

function createUnitStack(unitStack, imageLoader, isSelectable)
{
    // TODO: encapsulte this (it's all precalculatable...)
    var mUnitStack = unitStack;
    var mUnitsInStack = unitStack.getUnitsInStack();
    var perUnitOffset = -2;
    var unitOnBoardScalar = 0.625; //6666666;
    var unitImageDimensions = 
    {
        width:  Hasl.ImageSourceDatabase.american_2_e_fs.width * unitOnBoardScalar, 
        height: Hasl.ImageSourceDatabase.american_2_e_fs.height * unitOnBoardScalar
    };
    
    var stack = new Kinetic.Group();
    var currentOffset = 0;
    for(var i=0; i < mUnitsInStack.length; i++)
    {
        var unitImageSrc = Hasl.UnitUtils.getUnitImage(imageLoader);
        var specOffsetX = currentOffset-(unitImageDimensions.width*.5);
        var specOffsetY = currentOffset-(unitImageDimensions.height*.5);
        var spec = {
            x: specOffsetX,
            y: specOffsetY,
            image: unitImageSrc,
            width: unitImageDimensions.width,
            height: unitImageDimensions.height
        };
        var unitImage = new Kinetic.Image(spec);
        stack.add(unitImage);
        currentOffset += perUnitOffset;
    }
    stack.setShadow = function(shadowSpec)
    {
        var units = stack.getChildren();
        var unit = units[0];
        unit.setShadow(shadowSpec);
    }
    stack.setScale = function(scalars)
    {
        var units = stack.getChildren();
        for(var i=0; i < units.length; i++)
        {
            var unit = units[i];
            unit.setScale(scalars);
        }
    }
    stack.on('mousemove', function() {
        document.body.style.cursor = "pointer";
        mGameInterface.unitStackMouseHover(stack);
    });
    stack.on('click', function() {
        var selectedStack = mGameInterface.getSelectedUnitStack()
        if(selectedStack)
        {
            selectedStack.setShadow({
                color: 'transparent',
                blur: 3,
                offset: [3, 3],
                opacity: 0.5
            });
            selectedStack.setScale([1,1]);
        }
        var unitUnSelected = (selectedStack == stack);
        if(unitUnSelected)
        {
            $('#selectedUnit').attr('src', '');
            mGameInterface.setSelectedUnitStack(undefined);
            stack.getLayer().draw();
            return;
        }
        selectedStack = stack;
        selectedStack.setScale([1.1,1.1]);
        selectedStack.setShadow({
            color: 'black',
            blur: 3,
            offset: [3, 3],
            opacity: 0.5
        });
        stack.getLayer().draw();

        $('#selectedUnit').attr('src', stack.getId())
        mGameInterface.setSelectedUnitStack(selectedStack);
    });
    stack.on('mouseout', function(){
        document.body.style.cursor = "default";
        mGameInterface.unitStackMouseOut(stack);
    });

    var stackLocation = mGameInterface.getHexCenter(unitStack.getLocation());
    console.log(stackLocation);

    stack.setPosition(stackLocation);
    
    stack.getUnitStack = function()
    {
        return mUnitStack;
    }
    stack.getUnitsInStack = function()
    {
        return mUnitsInStack;
    }
    stack.moveUnitStack = function(hexId)
    {
        mUnitStack.setLocation(hexId);
    }
    return stack;
}

function createSelectableSingleUnit(unit, unitIndex, spec)
{
    var mUnit = unit;
    var mIndex = unitIndex;
    var mUnitImage = new Kinetic.Image(spec);
    
    mUnitImage.getUnit = function() { return mUnit; }
    mUnitImage.getIndex = function() { return mIndex; }
    
    return mUnitImage;
}