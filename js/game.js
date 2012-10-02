var Hasl = ( Hasl || {} );
Hasl.Game = function(scenario)
{
    var that = {};
    var mScenario = scenario;
    var mBoard = Hasl.Board(mScenario.board.type, mScenario.board.configuration);
    that.getScenario = function() {
        return mScenario;
    }
    that.getBoard = function() {
        return mBoard;
    }
    that.start = function() { }
    return that;
}
            
Hasl.GameInterface = function(scenario, useFills)
{
    var that = {};
    var mImageLoader = Hasl.ImageLoader(Hasl.ImageSourceDatabase);
    that.getImageLoader = function() { return mImageLoader; }
                
    var mGame = Hasl.Game(scenario);
                    
    var stage  = new Kinetic.Stage({
        container: "container",
        width: 1800,
        height: 645 
    });
    
    var selectedUnit;
    var boardRenderer;
    if(useFills)
    {
        boardRenderer = Hasl.BoardTerrainBasedRenderer(mGame.getBoard());
    }
    else
    {
        boardRenderer = Hasl.BoardImageRenderer(mGame.getBoard().getDimensions(), mGame.getBoard().getBoardType(), mImageLoader);
    }
    
    var unitLayer = new Kinetic.Layer();
    that.getUnitLayer = function() { return unitLayer; }
    that.setSelectedUnit = function(unit) { selectedUnit = unit; }
    that.getSelectedUnit = function() { return selectedUnit; }
                
    //var size = boardRenderer.render(mImageLoader);

    stage.add(boardRenderer.getBoardLayer());
    //stage.add(boardRenderer.getUnderlyingHexRepresentationLayer());
    //stage.add(boardRenderer.getSelectionLayer());
    
    stage.add(unitLayer);
                
    var stageScalar = 1.0;
    var size = boardRenderer.getSize();
    stage.setSize(stageScalar*size.width, stageScalar*size.height);
    stage.setScale(stageScalar);
    stage.draw();
    that.draw = function() { stage.draw(); }
    return that;
}

Hasl.BoardImageRenderer = function(boardDimensions, boardType, imageLoader)
{
    var that = {};
    
    var mBoardImageLayer = new Kinetic.Layer();
    that.getBoardLayer = function() { return mBoardImageLayer; }
    
    var drawBoardImage = function(imageLoader, boardDimensions, boardType)
    {
        var boardImageName = boardType;
        var boardImageSource = imageLoader.getImage(imageLoader.getDatabase()[boardImageName]);
        // TODO: need container for boardImages (so that height & width can be hardcoded)
        var boardImageHeight = 648; //Hasl.ImageSourceDatabase[boardImageName].height;
        var hexWidth2x = 57; // measured from image
        var scenarioImageWidth = (boardDimensions.width-1) * hexWidth2x - (boardDimensions.width) + 5;
        var boardImage = new Kinetic.Image({
            image: boardImageSource,
            stroke: 'white',
            strokeWidth: 6,
            listening: false,
            height: boardImageHeight,
            width: scenarioImageWidth,
            crop: {
                x:0, 
                y:0, 
                width: scenarioImageWidth, 
                height: boardImageHeight
            }
        });
                    
        mBoardImageLayer.add(boardImage);
        var size = {
            width: boardImage.getWidth(), 
            height: boardImage.getHeight()
        };
        return size;
    }
    
    // TODO: calculate from boardHeight, boardWidth
    var mSize = { width: 300, height: 190 };
    var useFills = false;
    if(!useFills)
    {
        mSize = drawBoardImage(imageLoader, boardDimensions, boardType);
    }
    that.getSize = function() { return mSize; }
    return that;
}

Hasl.BoardTerrainBasedRenderer = function(board)
{
    var that = {};
    
    // TODO: use extension here (so that BoardImageRenderer can be reused)
    var mBoardLayer = new Kinetic.Layer();
    that.getBoardLayer = function() { return mBoardLayer; }
    
    var mHexDimensions = {
        radius: 37.5, 
        height: 32
    }; // measured from image
    
    var mSelectionGroup, mSelectionLayer; // unused, needs redesign!
    
    var drawBoard = function(board)
    {
        var useFills = true;
        var radius = mHexDimensions.radius; 
        var hexHeight = mHexDimensions.height;

        var xOffset = radius;
        var nodeArray = board.getBoardGraph().getNodeArray();
        var numNodes = nodeArray.length;
    
        for(var i=0; i<numNodes; i++)
        {
            var yOffset = hexHeight;
            var isEvenHex = ((i+1) % 2 == 0);
            if(isEvenHex)
            {
                yOffset -= hexHeight;
            }
            for (var j=0; j<numNodes; j++)
            {
                if(nodeArray[i][j]) // != undefinded)
                {
                    var newHex = new Hasl.BoardHex (
                        { offset: { x: radius,   y: radius } },
                        radius, 
                        nodeArray[i][j],
                        useFills,
                        mSelectionGroup,
                        mSelectionLayer
                    );
                    newHex.move(xOffset, yOffset);
                    mBoardLayer.add(newHex);
                    yOffset += (hexHeight*2);
                    if(j > 0)
                    {
                        yOffset += 1;
                    }
                }
            
            }
            xOffset += radius+(radius*0.5);
        }
    }
    drawBoard(board);
    that.getSize = function() { return { width: 300, height: 190 }; }
    return that;
}

Hasl.BoardHex = function(config, radius, graphNode, useFill, selectionGroup, selectionLayer) {
    Kinetic.Group.call(this, config);
    
    this.hexNode = graphNode; // from our boardGraph
    
    this.terrainDatabaseTypes = graphNode.label;
    
    this.hexId = graphNode.id;
    
    this.name = "name"+this.hexId;
    this.id = "group"+this.hexId;
    
    //var terrainColors = new Array('khaki','gray','sienna','yellowgreen','olivedrab','goldenrod');
    
    var hexagon = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 6,
        radius: radius,
        fill: "transparent",
        rotationDeg: 90,
        name: "hex"+this.hexId,
        id: this.hexId,
        offset: {
            x: -radius, 
            y: 0
        }
    });    
    this.add(hexagon);
        
    if(useFill == true)
    {
        var terrainType = this.terrainDatabaseTypes[0];
        hexagon.setFill(Hasl.TerrainRedering[terrainType]);
        var textColor = 'black';
        // TODO: change this to a function, isDarkTerrain(terrainType)
        if(terrainType == Hasl.Terrains.TerrainType.Woods)
        {
            textColor = 'white'
        }
        hexagon.setStroke('black');
        hexagon.setStrokeWidth('1');
        
        var simpleText = new Kinetic.Text({
            x: -radius*2+5,
            y: 0,
            text: this.hexId,
            fontSize: 8,
            fontFamily: "Calibri",
            textFill: textColor,
            align: 'right',
            width: radius*2,
            name: "text"+this.hexId,
            offset: {
                x: 0, 
                y: -8
            }
        });
        this.add(simpleText);
    }

    this.on('mousemove', function() {
        //var hex = this.get("#"+this.hexId)[0];
        selectionGroup.add(createSelectionHex(radius));
        selectionGroup.id = "selection"+this.hexId;
        selectionGroup.name = this.hexId;
        var pos = this.getPosition();
        selectionGroup.setPosition(pos);
        selectionLayer.draw();
        
        var terrainHelperText = 'Terrain type';
        if(this.terrainDatabaseTypes.length > 1)
        {
            terrainHelperText += 's';
        }
        terrainHelperText += ': ';
        for(var i=0; i < this.terrainDatabaseTypes.length; i++)
        {
            terrainHelperText += Hasl.Terrains[this.terrainDatabaseTypes[i]].getType() + ', ';
        }
        terrainHelperText = terrainHelperText.slice(0, -2);
        $('#terrainInfo').text(terrainHelperText);
    });
};
Kinetic.Global.extend(Hasl.BoardHex, Kinetic.Group);

function createSelectionHex(radius) {
    var strokeWidth = 1;
    var selectionHexagon = new Kinetic.RegularPolygon({
        x: -radius,
        y: 0,
        sides: 6,
        radius: radius,
        fill: "orange",
        stroke: "black",
        strokeWidth: strokeWidth,
        rotationDeg: 90,
        opacity: .5
    });  
    return selectionHexagon;
}

function createClickedHex() {
    var clickedHex = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 6,
        radius: 70,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 4,
        rotationDeg: 90,
        opacity: .5
    });  
    clickedHex.off('click mousemove mouseout');
    return clickedHex;
}

//Hasl.BoardHexSelectors = function(selUnit)
//{
//    var that = {};
//    
//    var mSelectionLayer = new Kinetic.Layer();
//    that.getSelectionLayer = function() { return mSelectionLayer; }
//    
//    var mSelectedUnit = selUnit;
//    
//    var mSelectionGroup = new Kinetic.Group();
//    var mClickedGroup = new Kinetic.Group();
//    
//    // TODO: with some coordinate transforms, this entire layer/concept seems unnecessary
//    var mUnderlyingHexRepresentationLayer = new Kinetic.Layer();
//    that.getUnderlyingHexRepresentationLayer = function() { return mUnderlyingHexRepresentationLayer; }
//    
//     var mHexDimensions = {
//        radius: 37.5, 
//        height: 32
//    }; // measured from image
//    
//    that.drawBoard = function(selectedUnit, selectionGroup, clickedGroup)
//    {
//        var radius = mHexDimensions.radius; 
//        var hexHeight = mHexDimensions.height;
//
//        var xOffset = radius;
//        var nodeArray = board.getBoardGraph().getNodeArray();
//        var numNodes = nodeArray.length;
//    
//        for(var i=0; i<numNodes; i++)
//        {
//            var yOffset = hexHeight;
//            var isEvenHex = ((i+1) % 2 == 0);
//            if(isEvenHex)
//            {
//                yOffset -= hexHeight;
//            }
//            for (var j=0; j<numNodes; j++)
//            {
//                if(nodeArray[i][j]) // != undefinded)
//                {
//                    var newHex = new Hasl.BoardHex (
//                        { offset: { x: radius,   y: radius } },
//                        radius, 
//                        nodeArray[i][j],
//                        useFills,
//                        mSelectionGroup,
//                        mSelectionLayer
//                    );
//                    newHex.move(xOffset, yOffset);
//                    mUnderlyingHexRepresentationLayer.add(newHex);
//                    yOffset += (hexHeight*2);
//                    if(j > 0)
//                    {
//                        yOffset += 1;
//                    }
//                }
//            
//            }
//            xOffset += radius+(radius*0.5);
//        }
//        
//        mSelectionGroup.on("click", function() {
//            console.log(selectedUnit);
//            if(selectedUnit)
//            {
//                var radius = mHexDimensions.radius;
//                var hexId = mSelectionGroup.name;
//                var hex = mUnderlyingHexRepresentationLayer.get("#"+hexId)[0];
//                if(hex)
//                {
//                    var hexGroup = hex.getParent();
//                    var pos = hexGroup.getPosition();
//
//                    selectedUnit.transitionTo({
//                        x: pos.x - radius*2,
//                        y: pos.y - radius,
//                        duration: 0.3,
//                        easing: 'ease-in-out'
//                    });
//                    selectedUnit.getLayer().draw();
//                }
//            }
//        });
//        mSelectionGroup.on('mouseout', function() { 
//            mSelectionGroup.removeChildren();
//        });
//        mSelectionLayer.add(mSelectionGroup);
//        mSelectionLayer.add(mClickedGroup); 
//    }
//}

