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
Hasl.UnitPicker = function(pickableUnits, kineticLayer, imageLoader, orientation)
{
    var that = {};
    var layer = kineticLayer;
    
    var imageDimensions = {width: 72, height: 72};
    var padding = 5;
    var offset = padding;
    for(var i=0; i < pickableUnits.length; i++)
    {
        //var unit = pickableUnits[i];
        var unitImage = Hasl.UnitUtils.getUnitImage(imageLoader);
        var selectableUnit = createSelectableSingleUnit({
            x: offset,
            y: 0,
            image: unitImage,
            width: imageDimensions.width,
            height: imageDimensions.height
        });
        layer.add(selectableUnit);
        offset += imageDimensions.width + padding;
    }
    var unitPickerDimensions = {width: offset, height: imageDimensions.height+padding };

    that.getDimensions = function()
    {
        return unitPickerDimensions;
    }
    
    that.draw = function()
    {
        layer.draw();
    }
    
    return that;
}

function createUnitStack(unitStack, imageLoader, isSelectable)
{
    var unitsInStack = unitStack.getUnitsInStack();
    var perUnitOffset = -2;
    var unitOnBoardScalar = 0.625; //6666666;
    var unitImageDimensions = 
    {
        width:  Hasl.ImageSourceDatabase.american_2_e_fs.width * unitOnBoardScalar, 
        height: Hasl.ImageSourceDatabase.american_2_e_fs.height * unitOnBoardScalar
    };
    
    var stack = new Kinetic.Group();
    var currentOffset = 0;
    for(var i=0; i < unitsInStack.length; i++)
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
    var stackPos = unitStack.getLocation().position;

    stack.setPosition(stackPos);
    return stack;
}

// TODO: when a unit it 'placed' on the board, it will be 'stacked'
//       how do these events change?
function createSelectableSingleUnit(spec)
{
//    var size = 36;
//    var halfSize = size * 0.5;
    var unit = new Kinetic.Image(spec);
    
    // this should only be done for groups...
    unit.on('mousemove', function() {
        document.body.style.cursor = "pointer";
    });
    unit.on('click', function() {
        //mGameInterface.setSelectedUnit(unit);
        var selectedUnit = mGameInterface.getSelectedUnit()
        if(selectedUnit)
        {
            selectedUnit.setShadow({
                color: 'transparent',
                blur: 3,
                offset: [3, 3],
                opacity: 0.5
            });
            //selected.setScale([1,1]);
        }
        var unitUnSelected = (selectedUnit == unit);
        if(unitUnSelected)
        {
            $('#selectedUnit').attr('src', '');
//            selectedUnit.setShadow({
//                color: 'transparent',
//                blur: 3,
//                offset: [3, 3],
//                opacity: 0.5
//            });
            mGameInterface.setSelectedUnit(undefined);
            unit.getLayer().draw();
            return;
        }
        selectedUnit = unit;
        //selectedUnit.setScale([1.1,1.1]);
        selectedUnit.setShadow({
            color: 'black',
            blur: 3,
            offset: [3, 3],
            opacity: 0.5
        });
        unit.getLayer().draw();

        $('#selectedUnit').attr('src', unit.getId())
        mGameInterface.setSelectedUnit(selectedUnit);
    });
    unit.on('mouseout', function(){
        document.body.style.cursor = "default"; 
    });
    //unitLayer.add(unit);
    return unit;
}