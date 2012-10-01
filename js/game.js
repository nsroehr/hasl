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
            
Hasl.GameInterface = function(useFills)
{
    var that = {};
    var mImageLoader = Hasl.ImageLoader(Hasl.ImageSourceDatabase);
    that.getImageLoader = function() { return mImageLoader; }
                
    var mGame;
    that.selectScenario = (function()
    {
        var scenario = Hasl.Scenarios.Vierville;
        mGame = Hasl.Game(scenario);
    })();
                
    var stage  = new Kinetic.Stage({
        container: "container",
        width: 1800,
        height: 645 
    });
    var boardImageLayer = new Kinetic.Layer();
    // TODO: with some coordinate transforms, this entire layer/concept seems unnecessary
    var underlyingHexRepresentationLayer = new Kinetic.Layer();
    var selectionLayer = new Kinetic.Layer();
    var unitLayer = new Kinetic.Layer();
    that.getUnitLayer = function() { return unitLayer; }
                
    var selectionGroup = new Kinetic.Group();
    var clickedGroup = new Kinetic.Group();
    var selectedUnit;
    that.setSelectedUnit = function(unit) { selectedUnit = unit; }
    that.getSelectedUnit = function() { return selectedUnit; }
                
    var mHexDimensions = {
        radius: 37.5, 
        height: 32
    }; // measured from image
    var drawBoard = function()
    {
        var board = mGame.getBoard();
    
        // TODO: standardize these magic numbers! (current y-board is y: 32, x: 56 (2*28)
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
                    var newHex = new Hasl.BoardHex
                    (
                    {
                        offset: {
                            x: radius,  
                            y: radius
                        }
                    },
                    radius, 
                    nodeArray[i][j],
                    useFills,
                    selectionGroup,
                    selectionLayer
                    );
                    newHex.move(xOffset, yOffset);
                    underlyingHexRepresentationLayer.add(newHex);
                    yOffset += (hexHeight*2);
                    if(j > 0)
                    {
                        yOffset += 1; // 1/j;
                    }
                }
            
            }
            xOffset += radius+(radius*0.5);
        }

        selectionGroup.on("click", function() {
            if(selectedUnit)
            {
                var radius = mHexDimensions.radius;
                var hexId = selectionGroup.name;
                var hex = stage.get("#"+hexId)[0];
                if(hex)
                {
                    var hexGroup = hex.getParent();
                    var pos = hexGroup.getPosition();

                    selectedUnit.transitionTo({
                        x: pos.x - radius*2,
                        y: pos.y - radius,
                        duration: 0.3,
                        easing: 'ease-in-out'
                    });
                    selectedUnit.getLayer().draw();
                }
            }
        });
        selectionGroup.on('mouseout', function() { 
            selectionGroup.removeChildren();
        });
        selectionLayer.add(selectionGroup);
        selectionLayer.add(clickedGroup);
    }
    var drawBoardImage = function()
    {
        var boardDimensions = mGame.getBoard().getDimensions();
        var boardImageName = mGame.getScenario().board.type;
        var boardImageSource = mImageLoader.getImage(mImageLoader.getDatabase()[boardImageName]);
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
                    
        boardImageLayer.add(boardImage);
        var size = {
            width: boardImage.getWidth(), 
            height: boardImage.getHeight()
        };
        return size;
    }
    drawBoard();
    var size = drawBoardImage();
    var stageScalar = 1.0;
                
    stage.add(boardImageLayer);
    stage.add(underlyingHexRepresentationLayer);
    stage.add(selectionLayer);
    stage.add(unitLayer);
                
    stage.setSize(stageScalar*size.width, stageScalar*size.height);
    stage.setScale(stageScalar);
    stage.draw();
    that.draw = function() { stage.draw(); }
    return that;
}