var boardHeightInHexes = 6;
var alphas = new Array('A','B','C','D','E','F','G','H','I');

// TODO: move these globals into an interface...
var clickedHexs = new Array();
var selectionGroup;

var Hasl = {};
Hasl.BoardGraph = function() 
{
    this.graph = new Graph(); // using Dracula Graph Library
    this.nodeArray2d = new Array();
    
    // some made up data for the board rep.
    var boardHeightInHexes = 6;
    var alphas = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q');
    
    this.graph.edgeFactory.build = function(source, target) 
    {
        var e = jQuery.extend(true, {}, this.template);
        e.source = source;
        e.target = target;
        e.directed = false;
        e.style.label = e.weight = 1; //Math.floor(Math.random() * 10) + 1;
        
        if(!e.source.id || !e.target.id)
            console.log("adding edge from " + e.source.id + " to " + e.target.id);
        
        return e;
    }
    
    //    function createNodes() 
    for(var alphaIndex=0; alphaIndex < alphas.length; alphaIndex++)
    {
        this.nodeArray2d[alphaIndex] = new Array();
        for (var numIndex=1; numIndex <= boardHeightInHexes; numIndex++)
        {
            var newNode = this.graph.addNode(alphas[alphaIndex] + numIndex.toString());
            this.nodeArray2d[alphaIndex][numIndex-1] = newNode;
        }
    }
    
    //    function createEdges() 
    var alphaSpan = this.nodeArray2d.length;
    var numSpan = this.nodeArray2d[0].length;
    for(alphaIndex=0; alphaIndex < alphaSpan; alphaIndex++)
    {
        for (numIndex=0; numIndex < numSpan; numIndex++)
        {
            var currentHex = this.nodeArray2d[alphaIndex][numIndex].id;

            var notOnBottomEdge = ((numIndex+1) < boardHeightInHexes);
            if(notOnBottomEdge)
            {
                var hexBelowCurrent = this.nodeArray2d[alphaIndex][numIndex+1].id;
                this.graph.addEdge(currentHex, hexBelowCurrent);
            }
            var notOnRightmostColumn = ((alphaIndex+1) < alphas.length);
            if(notOnRightmostColumn)
            {
                var hexNextColumnNext = this.nodeArray2d[alphaIndex+1][numIndex].id;
                this.graph.addEdge(currentHex, hexNextColumnNext);
            
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

Hasl.BoardHex = function(config, graphNode) {
    Kinetic.Group.call(this, config);
    
    this.hexNode = graphNode; /*from our boardGraph*/
    
    this.hexId = graphNode.id;
    
    this.name = "name"+this.hexId;
    this.id = "group"+this.hexId;
    
    var hexagon = new Kinetic.RegularPolygon({
        x: 0, //stage.getWidth() / 2,
        y: 0, //stage.getHeight() / 2,
        sides: 6,
        radius: 70,
        fill: "white",
        stroke: "black",
        strokeWidth: 4,
        rotationDeg: 90,
        name: "hex"+this.hexId,
        id: this.hexId
    });    
        
    var simpleText = new Kinetic.Text({
        x: -70,
        y: -70+12+4, //hexagon.y + hexagon.radius,
        text: this.hexId,
        fontSize: 12,
        fontFamily: "Calibri",
        textFill: "black",
        align: "center",
        width: 140,
        name: "text"+this.hexId
    });
    
   
    this.on('mousemove', function() {
        var hex = this.get("#"+this.hexId)[0];
        selectionGroup.add(createSelectionHex(hex));
        selectionGroup.id = "selection"+this.hexId;
        selectionGroup.name = this.hexId;
        var pos = this.getAbsolutePosition();
        selectionGroup.setAbsolutePosition(pos.x, pos.y);
        selectionLayer.draw();
    });
    
    this.add(hexagon);
    this.add(simpleText);
};
Hasl.BoardHex.prototype.resetHexDefaults = function(hex) {
    hex.setFill("white");
    hex.setStrokeWidth(4);
}
Kinetic.Global.extend(Hasl.BoardHex, Kinetic.Group);

function createSelectionHex() {
    var selectionHexagon = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 6,
        radius: 70,
        fill: "orange",
        stroke: "black",
        strokeWidth: 4,
        rotationDeg: 90,
        opacity: .5
    });  
    return selectionHexagon;
}

function createClickedHex() {
    return new Kinetic.RegularPolygon({
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
}

// TODO: move this into a well defined interface
function drawBoard(/*BoardGraph*/ boardGraph, layer, messageLayer)
{
    selectionGroup = new Kinetic.Group();

    // TODO: unmagicify!
    var y = 60;
    var x = 105;
    var yOffset = 0;
    var xOffset = 0;
    for(var i=0; i<boardGraph.nodeArray2d.length; i++)
    {
        yOffset = 0;
        if((i+1) % 2 == 0) 
        {
            yOffset += y;
        }
        for (var j=0; j<boardGraph.nodeArray2d[i].length; j++)
        {
            var newHex = new Hasl.BoardHex({x: 75,  y:70}, boardGraph.nodeArray2d[i][j], messageLayer);
            newHex.move(xOffset, yOffset);
            layer.add(newHex);
            yOffset += y*2;
        }
        xOffset += x;
    }

    selectionGroup.on("click", function(e) {
        
        
        var hexId = selectionGroup.name;
        var hex = stage.get("#"+hexId)[0];
        if(hex)
        {
            var hexGroup = hex.getParent();
            var node = hexGroup.hexNode;
            
            //selectionGroup.add(createClickedHex(hex));
            var pos = hexGroup.getAbsolutePosition();
            selectionGroup.setAbsolutePosition(pos.x, pos.y);
            console.log('added clicked hex to ' + pos.x + ', ' + pos.y);
            
            console.log("Hex " + node.id + " parent(" + node.id + ") has " + node.edges.length + " edges.");
            for(var i=0; i < node.edges.length; i++)
            {
                var adjacentHexId = node.edges[i].target.id;
                // TODO: fix this in edge factory!
                if(adjacentHexId == hexId)
                {
                    adjacentHexId = node.edges[i].source.id;
                }
                var adjacentHex = stage.get("#"+adjacentHexId)[0];
                if(adjacentHex)
                {
                    var clickedAdjacentHex = createClickedHex(adjacentHex);
                    var newPos = adjacentHex.getAbsolutePosition();
                    clickedAdjacentHex.setAbsolutePosition(newPos.x-pos.x, newPos.y-pos.y);
                    selectionGroup.add(clickedAdjacentHex);
                    //pos = clickedAdjacentHex.getAbsolutePosition();
                    //console.log('added clicked adjacent hex to ' + pos.x + ', ' + pos.y);
                }
                else
                {
                    console.log("ERROR: could not find hex: "+adjacentHexId);
                }
            }
        }
        else
        {
            console.log("error " + hexId + " not found!");
        }
        console.log("Selection size: " + selectionGroup.getChildren().length);
        selectionLayer.draw();
    });
    selectionGroup.on('mouseout', function() { 
        selectionGroup.removeChildren();
    });
    selectionLayer.add(selectionGroup);
}