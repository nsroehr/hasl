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
    //console.log('creating new boardgraph: ' + width + ' * ' + height);
    this.graph = new Graph(); // using Dracula Graph Library
    this.nodeArray2d = new Array();
    
    // some made up data for the board rep.
    var boardHeightInHexes = height;
    var boardWidthInHexes = width;
    //var alphas = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','U','R','S','T','U','V','W','X','Y','Z','AA','BB','CC','DD','EE','FF','GG');
   
    this.graph.edgeFactory.build = function(source, target) 
    {
        var e = jQuery.extend(true, {}, this.template);
        e.source = source;
        e.target = target;
        e.directed = false;
        e.style.label = e.weight = 1; //Math.floor(Math.random() * 10) + 1;
        
        if(!e.source.id || !e.target.id)
        {
            console.log("adding edge from " + e.source.id + " to " + e.target.id);
        }
        return e;
    }
    
    var alphas = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','U','R','S','T','U','V','W','X','Y','Z');
    var numberOfTimesToUseLetterAsLabel = 1; // A vs AA vs AAA
    var length = alphas.length;
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
        //console.log(i);
        this.nodeArray2d[i] = new Array();

        var numIndex = 0;
        var onEvenHexColumn = (i % 2 == 0);
        if(onEvenHexColumn)
        {
            numIndex = 1;
        }
        for(; numIndex < boardHeightInHexes+1; numIndex++)
        {
            var newNode = this.graph.addNode(alphaLabel + numIndex.toString());
            //console.log(alphaLabel + numIndex.toString());
            this.nodeArray2d[i][numIndex] = newNode;
        }
    }
    
    // TODO: need to create directed graph (edges for all adjacencies...)
    //    function createEdges() 
    var alphaSpan = boardWidthInHexes; // this.nodeArray2d.length;
    var numSpan = boardHeightInHexes+1; //this.nodeArray2d[0].length;
    for(alphaIndex=0; alphaIndex < alphaSpan; alphaIndex++)
    {
        numIndex = 0;
        onEvenHexColumn = (alphaIndex % 2 == 0);
        if(onEvenHexColumn)
        {
            numIndex = 1;
        }
        for (; numIndex < numSpan; numIndex++)
        {
            //console.log('alphaIndex: ' + alphaIndex + ', numIndex: ' + numIndex);
            var currentHex = this.nodeArray2d[alphaIndex][numIndex].id;

            var notOnBottomEdge = ((numIndex+1) < boardHeightInHexes);
            if(notOnBottomEdge)
            {
                var hexBelowCurrent = this.nodeArray2d[alphaIndex][numIndex+1].id;
                this.graph.addEdge(currentHex, hexBelowCurrent);
            }
            
            var notOnRightmostColumn = ((alphaIndex+1) < boardWidthInHexes);
            //console.log('not rightmost? ' + (alphaIndex+1) + ' vs ' + boardWidthInHexes);
            if(notOnRightmostColumn)
            {
                var notTopMostRow = (numIndex != 0);
                if(notTopMostRow)
                {
                    var hexNextColumnNext = this.nodeArray2d[alphaIndex+1][numIndex].id;
                    this.graph.addEdge(currentHex, hexNextColumnNext);
                }
            
                var isOddRow = ((alphaIndex+1) % 2 == 0);
                if(isOddRow && notOnBottomEdge)
                {   // [i+1,j+2]
                    var hexNextColumnBelow = this.nodeArray2d[alphaIndex+1][numIndex+1].id;
                    this.graph.addEdge(currentHex, hexNextColumnBelow);
                }
                var notOnTopRow = (numIndex > 1);
                if(!isOddRow && notOnTopRow)
                {
                    var hexNextColumnAbove = this.nodeArray2d[alphaIndex+1][numIndex-1].id;
                    this.graph.addEdge(currentHex, hexNextColumnAbove);
                }
            }
        }
    }
};

Hasl.BoardHex = function(radius, config, graphNode, useFill) {
    Kinetic.Group.call(this, config);
    
    this.hexNode = graphNode; /*from our boardGraph*/
    
    this.hexId = graphNode.id;
    
    this.name = "name"+this.hexId;
    this.id = "group"+this.hexId;
    
    var terrainColors = new Array('khaki','gray','sienna','yellowgreen','olivedrab','goldenrod');
    
    //var strokeWidth = 1;
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
        
    if(useFill)
    {
        hexagon.setFill(terrainColors[Math.floor((Math.random()*(terrainColors.length)))]);
        hexagon.setStroke('black');
        hexagon.setStrokeWidth('1');
        
        var simpleText = new Kinetic.Text({
            x: -radius*2+5,
            y: 0,
            text: this.hexId,
            fontSize: 8,
            fontFamily: "Calibri",
            textFill: 'black',
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
        var pos = this.getAbsolutePosition();
        selectionGroup.setAbsolutePosition(pos.x, pos.y);
        selectionLayer.draw();
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
function drawBoard(/*BoardGraph*/ boardGraph, layer, messageLayer, useFills)
{
    selectionGroup = new Kinetic.Group();
    clickedGroup = new Kinetic.Group();
    
    var radius = 37.5; //37.33333333;
    var y = radius * Math.sin(2 *  2 * Math.PI / 6);
    var x = radius * Math.cos(2 * Math.PI / 6);

    x *= 2;
    var xOffset = x; //x+xskip;
    for(var i=0; i<boardGraph.nodeArray2d.length; i++)
    {
        var yOffset = y;
        if((i+1) % 2 == 0) 
        {
            yOffset -= y;
        }
        for (var j=0; j<boardGraph.nodeArray2d[i].length; j++)
        {
            if(boardGraph.nodeArray2d[i][j]) // != undefinded)
            {
                var newHex = new Hasl.BoardHex(
                    radius, 
                    {
                        offset: {
                            x: radius, 
                            y: radius
                        }
                    }, 
                    boardGraph.nodeArray2d[i][j],
                    useFills
                    );
                newHex.move(xOffset, yOffset);
                layer.add(newHex);
                yOffset += (y*2);
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
                var pos = hexGroup.getAbsolutePosition();
        
                //selectedUnit.setAbsolutePosition(pos.x, pos.y);
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