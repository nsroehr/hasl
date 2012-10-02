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
    var mName = name;
    var mDimensions = Hasl.BoardUtils.getBoardDimensions(configuration.playableArea.topLeft, configuration.playableArea.bottomRight);
    var mTerrainDatabase = Hasl.TerrainDatabases.getDatabase(name);
    var mBoardGraph = Hasl.BoardGraph(mTerrainDatabase, mDimensions);
    that.getBoardType = function()
    {
        return mName;
    }
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