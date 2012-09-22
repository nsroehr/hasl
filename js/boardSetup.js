var boardHeightInHexes = 6;
var alphas = new Array('A','B','C','D','E','F','G','H','I');

// TODO: move these globals into an interface...
var clickedHexs = new Array();
var selectionGroup;
var clickedGroup;

var Hasl = ( Hasl || {} );
Hasl.Board = function(name, width, height, terrainDb)
{
    var mName = name; 
    var mWidth = width;
    var mHeight = height;
    var mTerrainDatabase = terrainDb;
    var mBoardGraph = new Hasl.BoardGraph(mTerrainDatabase, mWidth, mHeight);
    
    this.getSize = function() 
    {
        return new Utils.Pair(mWidth, mHeight);
    }
    this.getBoardName = function()
    {
        return mName;
    }
    this.getTerrainDatabase = function()
    {
        return mTerrainDatabase;
    }
    this.getBoardGraph = function()
    {
        return mBoardGraph;
    }
} 



Hasl.BoardGraph = function(/*Hasl.TerrainDatabase*/ terrainDatabase, width, height) 
{
//    console.log('creating new board ' + width +'*'+ height);
    this.graph = new Graph(); // using Dracula Graph Library
    this.nodeArray2d = new Array();
    
    var boardHeightInHexes = height;
    var boardWidthInHexes = width;
   
    this.graph.edgeFactory.build = function(source, target) 
    {
        var e = jQuery.extend(true, {}, this.template);
        e.source = source;
        e.target = target;
        e.directed = true;
        
        var terrainDatabaseTypes = target.label;
        
//        console.log("adding edge from " + e.source.id + " to " + e.target.id);
//        console.log(terrainDatabaseTypes);
        var weight = getTerrainFromTerrainType(terrainDatabaseTypes[0]).mMF;
        e.style.label = e.weight = weight;
        
        return e;
    }
    
    var alphas = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','U','R','S','T','U','V','W','X','Y','Z');
    var numberOfTimesToUseLetterAsLabel = 1; // A vs AA vs AAA
    var length = alphas.length;
    var terrainOffset = 0;
    for(var i=0; i < boardWidthInHexes; i++)
    {
        var alphaLabel = '';
        var alphaIndex = i % length;
        if(i / length == numberOfTimesToUseLetterAsLabel )
        {
            numberOfTimesToUseLetterAsLabel++;
        }
        for(var repeats=0; repeats < numberOfTimesToUseLetterAsLabel; repeats++)
        {
            alphaLabel += alphas[alphaIndex];
        }
        this.nodeArray2d[i] = new Array();
        
        for(var numIndex = ((i+1) % 2); numIndex < boardHeightInHexes+1; numIndex++)
        {
            var newNode = this.graph.addNode(alphaLabel + numIndex.toString(), { label : terrainDatabase[terrainOffset] });
//            console.log('added node @: ' + alphaLabel + numIndex.toString() + ' tDB: ' + terrainOffset);
            this.nodeArray2d[i][numIndex] = newNode;
            
            terrainOffset++;
        }
    }
    
    var alphaSpan = boardWidthInHexes;
    var numSpan = boardHeightInHexes+1;
    for(alphaIndex=0; alphaIndex < alphaSpan; alphaIndex++)
    {
        for (numIndex = ((alphaIndex+1) % 2); numIndex < numSpan; numIndex++)
        {
            //console.log('alphaIndex: ' + alphaIndex + ', numIndex: ' + numIndex);
            var currentHex = this.nodeArray2d[alphaIndex][numIndex].id;

            var notOnBottomEdge = ((numIndex+1) < boardHeightInHexes);
            if(notOnBottomEdge)
            {
                var hexBelowCurrent = this.nodeArray2d[alphaIndex][numIndex+1].id;
                this.graph.addEdge(currentHex, hexBelowCurrent, {directed: true});
                this.graph.addEdge(hexBelowCurrent, currentHex, {directed: true});
            }
            
            var notOnRightmostColumn = ((alphaIndex+1) < boardWidthInHexes);
            if(notOnRightmostColumn)
            {
                var notTopMostRow = (numIndex != 0);
                if(notTopMostRow)
                {
                    var hexNextColumnNext = this.nodeArray2d[alphaIndex+1][numIndex].id;
                    this.graph.addEdge(currentHex, hexNextColumnNext, {directed: true});
                    this.graph.addEdge(hexNextColumnNext, currentHex, {directed: true});
                }
            
                var isOddRow = ((alphaIndex+1) % 2 == 0);
                if(isOddRow && notOnBottomEdge)
                {   
                    var hexNextColumnBelow = this.nodeArray2d[alphaIndex+1][numIndex+1].id;
                    this.graph.addEdge(currentHex, hexNextColumnBelow, {directed: true});
                    this.graph.addEdge(hexNextColumnBelow, currentHex, {directed: true});
                }
                var notOnTopRow = (numIndex > 1);
                if(!isOddRow && notOnTopRow)
                {
                    var hexNextColumnAbove = this.nodeArray2d[alphaIndex+1][numIndex-1].id;
                    this.graph.addEdge(currentHex, hexNextColumnAbove, {directed: true});
                    this.graph.addEdge(hexNextColumnAbove, currentHex, {directed: true});
                }
            }
        }
    }
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
        hexagon.setFill(getTerrainColor(terrainType));
        var textColor = 'black';
        if(terrainType == TerrainType.Woods)
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
            terrainHelperText += getTerrainFromTerrainType(this.terrainDatabaseTypes[i]).mType + ', ';
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
    for(var i=0; i<boardGraph.nodeArray2d.length; i++)
    {
        var yOffset = y;
        var isEvenHex = ((i+1) % 2 == 0);
        if(isEvenHex)
        {
            yOffset -= y;
        }
        for (var j=0; j<boardGraph.nodeArray2d[i].length; j++)
        {
            if(boardGraph.nodeArray2d[i][j]) // != undefinded)
            {
                var newHex = new Hasl.BoardHex(
                    { offset: { x: radius,  y: radius } },
                    radius, 
                    boardGraph.nodeArray2d[i][j],
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