var boardHeightInHexes = 6;
var alphas = new Array('A','B','C','D','E','F','G','H','I');

// TODO: move these globals into an interface...
var clickedHexs = new Array();
var selectionGroup;
var clickedGroup;

var Hasl = ( Hasl || {} );
Hasl.BoardUtils = {};

Hasl.BoardUtils.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

Hasl.BoardUtils.getBoardDimensions = function(topLeftHexId, bottomRightHexId)
{
    var dimensions = [];
    var topLeftIndices = Hasl.BoardUtils.getIndicesFromHexId(topLeftHexId);
    var bottomRightIndices = Hasl.BoardUtils.getIndicesFromHexId(bottomRightHexId);
    var boardWidth = 1 + bottomRightIndices[0] - topLeftIndices[0];
    var boardHeight = 1 + bottomRightIndices[1] - topLeftIndices[1];
    dimensions.rowOffset = 0;
    dimensions.colOffset = 0;
    dimensions.width = boardWidth;
    dimensions.height = boardHeight;
    //console.log('w:'+boardWidth+',h:'+boardHeight);
    return dimensions;
};
            
Hasl.BoardUtils.getIndicesFromHexId = function(hexId)
{
    var alphabetLength = Hasl.BoardUtils.alphabet.length;
    var indecies = [];
               
    var alphaString = "";
    var numericString = "";
    var alphaPosition = -1;
    for(var i=0; i < hexId.length; i++)
    {
        var currentChar = hexId.charAt(i);
//        console.log('['+i+']::character'+currentChar);
        if(!IsNumeric(currentChar))
        {
            alphaString += currentChar;
//            console.log('['+i+']::alphaString:'+alphaString);
            if(i === 0)
            {
                alphaPosition = Hasl.BoardUtils.alphabet.indexOf(currentChar);
//                console.log('['+i+']::alphaPosition:'+alphaPosition);
            }
        }
        else 
        {
            numericString += currentChar;
//            console.log('[' + i + ']::numericString:' +numericString);
        }
    }

    indecies[0] = ((alphaString.length-1)*alphabetLength)+alphaPosition;
    indecies[1] = Number(numericString);
    return indecies;
};

Hasl.Board = function(name, configuration)
{
    var that = {};
    var mDimensions = Hasl.BoardUtils.getBoardDimensions(configuration.playableArea.topLeft, configuration.playableArea.bottomRight);
    var mTerrainDatabase = Hasl.TerrainDatabases.getDatabase(name);
    var mBoardGraph = Hasl.BoardGraph(mTerrainDatabase, mDimensions);
    that.getTerrainDatabase = function()
    {
        return mTerrainDatabase;
    }
    that.getBoardGraph = function()
    {
        return mBoardGraph;
    }
    that.getDimensions = function()
    {
        return mDimensions;
    }
    return that;
}

Hasl.BoardGraphUtils = {};
Hasl.BoardGraphUtils.createNodes = function(graph, nodeArray, dimensions, terrainDatabase)
{
    var numberOfTimesToUseLetterAsLabel = 1; // A vs AA vs AAA
    var length = Hasl.BoardUtils.alphabet.length;
    var terrainOffset = 0;
    for(var i=0; i < dimensions.width; i++)
    {
        var alphaLabel = '';
        var alphaIndex = i % length;
        if(i / length == numberOfTimesToUseLetterAsLabel )
        {
            numberOfTimesToUseLetterAsLabel++;
        }
        for(var repeats=0; repeats < numberOfTimesToUseLetterAsLabel; repeats++)
        {
            alphaLabel += Hasl.BoardUtils.alphabet[alphaIndex];
        }
        nodeArray[i] = new Array();
        
        for(var numIndex = ((i+1) % 2); numIndex < dimensions.height+1; numIndex++)
        {
            var newNode = graph.addNode(alphaLabel + numIndex.toString(), {
                label : terrainDatabase[terrainOffset]
            });
            // console.log('added node @: ' + alphaLabel + numIndex.toString() + ' tDB: ' + terrainOffset);
            nodeArray[i][numIndex] = newNode;
            
            terrainOffset++;
        }
    }
};

Hasl.BoardGraphUtils.addEdge = function(graph, nodeArray, node1, colIndex, rowIndex)
{
    var node2 = nodeArray[colIndex][rowIndex].id;
    graph.addEdge(node1, node2, {
        directed: true
    });
    graph.addEdge(node2, node1, {
        directed: true
    });
}

Hasl.BoardGraphUtils.createEdges = function(graph, nodeArray, dimensions)
{
    var alphaSpan = dimensions.width;
    var numSpan = dimensions.height+1;
    for(var alphaIndex=0; alphaIndex < alphaSpan; alphaIndex++)
    {
        for (var numIndex = ((alphaIndex+1) % 2); numIndex < numSpan; numIndex++)
        {
            //console.log('alphaIndex: ' + alphaIndex + ', numIndex: ' + numIndex);
            var currentHex = nodeArray[alphaIndex][numIndex].id;

            var notOnBottomEdge = ((numIndex+1) < dimensions.height);
            if(notOnBottomEdge)
            {
                Hasl.BoardGraphUtils.addEdge(graph, nodeArray, currentHex, alphaIndex, numIndex+1);
            }
            
            var notOnRightmostColumn = ((alphaIndex+1) < dimensions.width);
            if(notOnRightmostColumn)
            {
                var notTopMostRow = (numIndex != 0);
                if(notTopMostRow)
                {
                    Hasl.BoardGraphUtils.addEdge(graph, nodeArray, currentHex, alphaIndex+1, numIndex);
                }
            
                var isOddRow = ((alphaIndex+1) % 2 == 0);
                if(isOddRow && notOnBottomEdge)
                {   
                    Hasl.BoardGraphUtils.addEdge(graph, nodeArray, currentHex, alphaIndex+1, numIndex+1);
                }
                var notOnTopRow = (numIndex > 1);
                if(!isOddRow && notOnTopRow)
                {
                    Hasl.BoardGraphUtils.addEdge(graph, nodeArray, currentHex, alphaIndex+1, numIndex-1);
                }
            }
        }
    }
};

Hasl.BoardGraph = function(/*Hasl.TerrainDatabase*/ terrainDatabase, dimensions) 
{
    var that = {};
    //    console.log('creating new board ' + width +'*'+ height);
    var mGraph = new Graph(); // using Dracula Graph Library
    var mNodeArray2d = new Array();
    
    mGraph.edgeFactory.build = function(source, target) 
    {
        // TODO: confirm usage of *** this *** below!
        var e = jQuery.extend(true, {}, mGraph.edgeFactory.template);
        e.source = source;
        e.target = target;
        e.directed = true;
        //console.log("adding edge from " + e.source.id + " to " + e.target.id);
        // TODO: there can easily be multiple terrain types at this hex, what should be done?
        var terrainDatabaseTypes = target.label;
        //console.log(terrainDatabaseTypes);
        var weight = Hasl.Terrains[terrainDatabaseTypes[0]].getMf();
        e.style.label = e.weight = weight;
        return e;
    }
    that.getNodeArray = function() {
        return mNodeArray2d;
    }
    that.getGraph = function() { return mGraph; }
    
    Hasl.BoardGraphUtils.createNodes(mGraph, mNodeArray2d, dimensions, terrainDatabase);
    Hasl.BoardGraphUtils.createEdges(mGraph, mNodeArray2d, dimensions);
    return that;
};

Hasl.BoardHex = function(config, radius, graphNode, useFill) {
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
        //hexagon.setFill(terrainColors[Math.floor((Math.random()*(terrainColors.length)))]);
        var terrainType = this.terrainDatabaseTypes[0];
        hexagon.setFill(Hasl.TerrainRedering[terrainType]);
        var textColor = 'black';
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

// TODO: move this into a well defined interface
function drawBoard(/*BoardGraph*/ boardGraph, layer, useFills)
{
    selectionGroup = new Kinetic.Group();
    clickedGroup = new Kinetic.Group();
    
    var radius = 37.5; // measured from image
    var y = radius * Math.sin(4 * (Math.PI / 6));
    var x = radius;

    var xOffset = x;
    var nodeArray = boardGraph.getNodeArray();
    var numNodes = nodeArray.length;
    
    for(var i=0; i<numNodes; i++)
    {
        var yOffset = y;
        var isEvenHex = ((i+1) % 2 == 0);
        if(isEvenHex)
        {
            yOffset -= y;
        }
        for (var j=0; j<numNodes; j++)
        {
            if(nodeArray[i][j]) // != undefinded)
            {
                var newHex = new Hasl.BoardHex(
                {
                    offset: {
                        x: radius,  
                        y: radius
                    }
                },
                radius, 
                nodeArray[i][j],
                useFills
                );
                newHex.move(xOffset, yOffset);
                layer.add(newHex);
                yOffset += (y*2);
                if(j > 0)
                {
                    yOffset -= 1/j;
                }
            }
            
        }
        xOffset += x+(x*0.5);
    }

    selectionGroup.on("click", function() {
        if(selectedUnit)
        {
            var radius = 37.5;
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