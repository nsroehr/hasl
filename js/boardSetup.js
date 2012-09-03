var boardHeightInHexes = 6;
var alphas = new Array('A','B','C','D','E','F','G','H','I');

var clickedHexs = new Array();
var selectionGroup;

var Hasl = {};
Hasl.BoardHex = function(config, graphNode, messageLayer) {
    Kinetic.Group.call(this, config);
    
    this.hexNode = graphNode; /*from our boardGraph*/
    
    this.hexId = graphNode.id;
    
    //    this.group = new Kinetic.Group({
    //        x: 75, //stage.getWidth() / 2, //220,
    //        y: 70, //stage.getHeight() / 2 //40,
    //        name: "group"+hexId
    //    });
    
    this.name = "group"+this.hexId;
    
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
    
    this.on('mouseout', function() { 
        var layer = this.getLayer();
        var hex = this.get("#"+this.hexId)[0];
        this.resetHexDefaults(hex);
        while(clickedHexs.length)
        {
            this.resetHexDefaults(clickedHexs.pop());
        }
            
        layer.draw();
        writeMessage(messageLayer, this.hexId + " <mouseout>"); 
    });
    this.on('mousemove', function() {
        selectionGroup.removeChildren();
        
        var hex = this.get("#"+this.hexId)[0];
        selectionGroup.add(this.createSelectionHex(hex));
        var pos = this.getAbsolutePosition();
        selectionGroup.setAbsolutePosition(pos.x, pos.y);
        selectionLayer.draw();
        //        var mousePos = stage.getMousePosition();
        //        var x = mousePos.x - 190;
        //        var y = mousePos.y - 40;
        writeMessage(messageLayer, this.hexId + " <hover>");
    });
    this.on("mousedown touchstart", function() 
    {
        var layer = this.getLayer();
        // do a distance calc to all other hexes
        writeMessage(messageLayer, this.hexNode.id  + " <click>"); 
        
        selectionGroup.removeChildren();
        
        var node = this.hexNode;
        var hex = this.get("#"+this.hexId)[0];
        selectionGroup.add(this.createSelectionHex(hex));
        for(var i=0; i < node.edges.length; i++)
        {
            var adjacentHexId = node.edges[i].target.id;
            // TODO: fix this in edge factory!
            if(adjacentHexId == this.hexId)
            {
                adjacentHexId = node.edges[i].source.id;
            }
            var adjacentHex = layer.get(".hex"+adjacentHexId)[0];
            if(adjacentHex)
            {
                selectionGroup.add(adjacentHex);
                clickedHexs.push(adjacentHex);
            }
            else
            {
                console.log("ERROR: could not find hex: "+adjacentHexId);
            }
        }
        selectionLayer.draw();
        //layer.draw();
    });
    this.add(hexagon);
    this.add(simpleText);
};

Hasl.BoardHex.prototype.resetHexDefaults = function(hex) {
    hex.setFill("white");
    hex.setStrokeWidth(4);
}
Hasl.BoardHex.prototype.createSelectionHex = function() {
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
Kinetic.Global.extend(Hasl.BoardHex, Kinetic.Group);

function drawBoard(/*BoardGraph*/ boardGraph, layer, messageLayer)
{
    selectionGroup = new Kinetic.Group();
    selectionLayer.add(selectionGroup);
    
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
            //var hexId = alphas[i] + j.toString();
            var newHex = new Hasl.BoardHex({
                x: 75, 
                y:70
            }, boardGraph.nodeArray2d[i][j], messageLayer);
            newHex.move(xOffset, yOffset);
            layer.add(newHex);
            yOffset += y*2;
        }
        xOffset += x;
    }
}

function createBoardHex(hexId, messageLayer)
{
    var group = new Kinetic.Group({
        x: 75, //stage.getWidth() / 2, //220,
        y: 70, //stage.getHeight() / 2 //40,
        name: "group"+hexId
    });
	        
    var hexagon = new Kinetic.RegularPolygon({
        x: 0, //stage.getWidth() / 2,
        y: 0, //stage.getHeight() / 2,
        sides: 6,
        radius: 70,
        fill: "white",
        stroke: "black",
        strokeWidth: 4,
        rotationDeg: 90,
        name: "hex"+hexId,
        id: hexId
    });    
        
    var simpleText = new Kinetic.Text({
        x: -70,
        y: -70+12+4, //hexagon.y + hexagon.radius,
        text: hexId,
        fontSize: 12,
        fontFamily: "Calibri",
        textFill: "black",
        align: "center",
        width: 140,
        name: "text"+hexId
    });

    group.on('mouseout', function() { 
        var layer = this.getLayer();
        var hex = group.get("#"+hexId)[0];
        resetHexDefaults(hex);
        while(clickedHexs.length)
        {
            resetHexDefaults(clickedHexs.pop());
        }
            
        layer.draw();
        writeMessage(messageLayer, hexId + " <mouseout>"); 
    });
    group.on('mousemove', function() {
        var layer = this.getLayer();
        var hex = group.get("#"+hexId)[0];
        hex.setStrokeWidth(4);
        hex.setFill("yellow");
        this.moveToTop();
        hex.setStrokeWidth(6);
        layer.draw();
        //        var mousePos = stage.getMousePosition();
        //        var x = mousePos.x - 190;
        //        var y = mousePos.y - 40;
        writeMessage(messageLayer, hexId + " <hover>");
    });
    group.on("mousedown touchstart", function() 
    {
        // do a distance calc to all other hexes
        writeMessage(messageLayer, hexId + " <click>"); 
    //        var node = findNode(hexId);
    //        for(var i=0; i < node.edges.length; i++)
    //        {
    //            var adjacentHex = group.get("#"+(node.edges[i].id))[0];
    //            adjacentHex.setFill("pink");
    //            clickedHexs.push(adjacentHex);
    //        }
    //        layer.draw();
    });
        
    group.add(hexagon);
    group.add(simpleText);

    return group;
}

function createBoard(layer, selectionLayer, messageLayer)
{
    var y = 60;
    var x = 105;
    var yOffset = 0;
    var xOffset = 0;
    for(var i=0; i<alphas.length; i++)
    {

        yOffset = 0;
        if((i+1) % 2 == 0) 
        {
            yOffset += y;
        }
        for (var j=1; j<=boardHeightInHexes; j++)
        {
            var hexId = alphas[i] + j.toString();
            var newHex = createBoardHex(hexId, selectionLayer, messageLayer);
				 
				
            newHex.move(xOffset, yOffset);
            layer.add(newHex);
            yOffset += y*2;
        }
        xOffset += x;
    }
}