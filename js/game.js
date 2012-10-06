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
    var mImageSourceDb = Hasl.ImageSourceDatabase;
    var mImageLoader = Hasl.ImageLoader(mImageSourceDb);
    that.getImageLoader = function() { return mImageLoader; }
                
    var mGame = Hasl.Game(scenario);
                    
    var stage  = new Kinetic.Stage({
        container: "container",
        width: 1800,
        height: 645 
    });
    
    var boardRenderer;
    var hexDimensions = { radius: 37.5,  height: 32, distBetweenCenters: 28.5 };
    var boardNodeArray = mGame.getBoard().getBoardGraph().getNodeArray();
    if(useFills)
    {
        boardRenderer = Hasl.BoardTerrainBasedRenderer(boardNodeArray, mGame.getBoard().getDimensions(), hexDimensions);
    }
    else
    {
        boardRenderer = Hasl.BoardImageRenderer(mGame.getBoard().getDimensions(), mGame.getBoard().getBoardType(), mImageLoader);
        hexDimensions = mImageSourceDb[mGame.getBoard().getBoardType()].hex;
    }
    
    var mSelectionLayer = new Kinetic.Layer();
    Hasl.BoardHexSelectors(boardNodeArray, mSelectionLayer, false, hexDimensions);
    
    var unitLayer = new Kinetic.Layer();
    that.getUnitLayer = function() { return unitLayer; }
    var selectedUnit;
    that.setSelectedUnit = function(unit) { selectedUnit = unit; }
    that.getSelectedUnit = function() { return selectedUnit; }
                
    stage.add(boardRenderer.getBoardLayer());
    stage.add(mSelectionLayer);
    stage.add(unitLayer);
                
    var stageScalar = 1.0;
    var size = boardRenderer.getSize();
    stage.setSize(stageScalar*size.width, stageScalar*size.height);
    stage.setScale(stageScalar);
    stage.draw();
    
    that.draw = function() { stage.draw(); }
    
    return that;
}

Hasl.BoardRendererUtils = {};
Hasl.BoardRendererUtils.getBoardDimensionsInPixels = function(boardDimensions, hexDimensions)
{
    var boardWidth =  (boardDimensions.width-1) * (hexDimensions.distBetweenCenters*2) - (boardDimensions.width) + 5
    var boardHeight = (boardDimensions.height) * (hexDimensions.height*2);
    return {width: boardWidth, height: boardHeight};
}

Hasl.BoardImageRenderer = function(boardDimensions, boardType, imageLoader)
{
    var mBoardImageLayer = new Kinetic.Layer();
    
    var drawBoardImage = function(imageLoader, boardDimensions, boardType)
    {
        var boardImageName = boardType;
        var boardImageSource = imageLoader.getImage(imageLoader.getDatabase()[boardImageName]);
        var boardSourceInfo = Hasl.ImageSourceDatabase[boardImageName];
        //var boardImageHeight = boardSourceInfo.height;
        var scenarioImageDimensions = Hasl.BoardRendererUtils.getBoardDimensionsInPixels(boardDimensions, boardSourceInfo.hex);
       
        var boardImage = new Kinetic.Image({
            image: boardImageSource,
            stroke: 'white',
            strokeWidth: 6,
            listening: false,
            height: scenarioImageDimensions.height,
            width: scenarioImageDimensions.width,
            crop: {
                x:0, 
                y:0, 
                width: scenarioImageDimensions.width, 
                height: scenarioImageDimensions.height
            }
        });
                    
        mBoardImageLayer.add(boardImage);
        var size = {
            width: boardImage.getWidth(), 
            height: boardImage.getHeight()
        };
        return size;
    }
    
    var mSize = drawBoardImage(imageLoader, boardDimensions, boardType);
    
    var that = {};
    that.getBoardLayer = function() { return mBoardImageLayer; }
    that.getSize = function() { return mSize; }
    return that;
}

Hasl.Orchestrator = function()
{
    var that = {};
    
    var selectedHex;
    var hoverHex;
    var selectedUnit;
    
    that.selectHex = function(hexId)
    {
        selectedHex = hexId;
    }
    
    that.hoverHex = function(hexId)
    {
        hoverHex = hexId;
    }
    
    that.hoverOutHex = function(hexId)
    {
        hoverHex = undefined;
    }
    
    that.selectUnit = function(unit)
    {
        that.unSelectUnit(unit);
        selectedUnit = unit;
    }
    
    that.unSelectUnit = function(unit)
    {
        selectedUnit = undefined;
    }
    
    that.getSelectedUnit = function()
    {
        return selectedUnit;
    }
    
    that.getSelectedHex = function()
    {
        return selectedHex;
    }
    
    return that;
}

var orchestrator = Hasl.Orchestrator();

Hasl.BoardHexSelectors = function(boardNodeArray, selectionLayer, useFills, hexDimensions)
{
    var radius = hexDimensions.radius; 
    var hexHeight = hexDimensions.height;

    var xOffset = radius;
    var numNodes = boardNodeArray.length;

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
            if(boardNodeArray[i][j]) // != undefinded)
            {
                var newHex = new Hasl.BoardHex (
                    { offset: { x: radius,   y: radius } },
                    radius, 
                    boardNodeArray[i][j],
                    useFills,
                    selectionLayer
                );
                newHex.move(xOffset, yOffset);
                selectionLayer.add(newHex);
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

Hasl.BoardTerrainBasedRenderer = function(boardNodeArray, boardDimensions, hexDimensions)
{
    var that = {};
    
    var mBoardLayer = new Kinetic.Layer();
    that.getBoardLayer = function() { return mBoardLayer; }
    
    var useFills = true;
    Hasl.BoardHexSelectors(boardNodeArray, mBoardLayer, useFills, hexDimensions);
    
    var boardDimensionsInPixels = Hasl.BoardRendererUtils.getBoardDimensionsInPixels(boardDimensions, hexDimensions)
    
    that.getSize = function() { return boardDimensionsInPixels; }
    
    return that;
}

Hasl.BoardHex = function(config, radius, graphNode, useFill, layer) {
    Kinetic.Group.call(this, config);
    
    this.terrainDatabaseTypes = graphNode.label;
    
    this.hexId = graphNode.id;
    
    this.name = "name"+this.hexId;
    this.id = "group"+this.hexId;
    
    var selectedColor = 'orange';
    var unSelectedColor = 'transparent';
    this.hexagon = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 6,
        radius: radius,
        fill: unSelectedColor,
        rotationDeg: 90,
        name: "hex"+this.hexId,
        id: this.hexId,
        offset: {
            x: -radius, 
            y: 0
        }
    });
    this.add(this.hexagon);
        
    if(useFill === true)
    {
        var terrainType = this.terrainDatabaseTypes[0];
        this.hexagon.setFill(Hasl.TerrainRedering[terrainType]);
        var textColor = 'black';
        // TODO: change this to a function, isDarkTerrain(terrainType)
        if(terrainType == Hasl.Terrains.TerrainType.Woods)
        {
            textColor = 'white'
        }
        this.hexagon.setStroke('black');
        this.hexagon.setStrokeWidth('1');
        
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
    else // useFill === false
    {
        this.setOpacity(0.5);
        
        var terrainHelperText = 'Terrain type';
        var hex = this.hexagon;
        if(hex.getParent().terrainDatabaseTypes.length > 1)
        {
            terrainHelperText += 's';
        }
        terrainHelperText += ': ';
        for(var i=0; i < hex.getParent().terrainDatabaseTypes.length; i++)
        {
            terrainHelperText += Hasl.Terrains[hex.getParent().terrainDatabaseTypes[i]].getType() + ', ';
        }
        terrainHelperText = terrainHelperText.slice(0, -2);
            
        this.hexagon.on('mousemove', function() {
            this.setFill(selectedColor);
            layer.draw();
            
            $('#terrainInfo').text(terrainHelperText);
            
            orchestrator.hoverHex(this.getParent().hexId);
        });
        
        this.hexagon.on('mouseout', function() {
           this.setFill(unSelectedColor);
           layer.draw();
           
           $('#terrainInfo').text('');
           
           orchestrator.hoverOutHex(this.getParent().hexId);
        });
        
        this.hexagon.on('click', function(){
            orchestrator.selectHex(this.getParent().hexId);
        });
    }
    this.fill = this.hexagon.getFill();

    
};
Kinetic.Global.extend(Hasl.BoardHex, Kinetic.Group);