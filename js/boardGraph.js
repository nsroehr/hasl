var BoardGraph = function() {
    this.nodeArray2d = new Array();
    this.graph = new Graph(); // using Dracula
    
    var boardHeightInHexes = 6;
    var alphas = new Array('A','B','C','D','E','F','G','H','I');
    
    this.graph.edgeFactory.build = function(source, target) {
        var e = jQuery.extend(true, {}, this.template);
        e.source = source;
        e.target = target;
        e.directed = false;
        e.style.label = e.weight = 1; //Math.floor(Math.random() * 10) + 1;
        return e;
    }
    
    for(var i=0; i<alphas.length; i++)
    {
        this.nodeArray2d[i] = new Array();
        for (var j=1; j<=boardHeightInHexes; j++)
        {
            var newNode = this.graph.addNode(alphas[i] + j.toString());
            this.nodeArray2d[i][j-1] = newNode;
        }
    }
    
    for(i=0; i<alphas.length; i++)
    {
        for (j=1; j<=boardHeightInHexes; j++)
        {
            var currentHex = alphas[i] + j.toString();
            // bottom row handling
            var notOnBottomEdge = (j+1 <= boardHeightInHexes);
            if(notOnBottomEdge)
            {
                notOnBottomEdge = true;
                var hexBelowCurrent = alphas[i] + (j+1).toString();
                this.graph.addEdge(currentHex, hexBelowCurrent);
            }
            
            var notOnRightmostColumn = ((i+1) < alphas.length);
            if(notOnRightmostColumn)
            {
                var hexNextColumnBelow = alphas[i+1] + j.toString();
                this.graph.addEdge(currentHex, hexNextColumnBelow);
            
                var isOddRow = ((i+1) % 2 == 0);
                if(isOddRow && notOnBottomEdge)
                {   // [i+1,j+2]
                    var hexNextColumnBelow = alphas[i+1] + (j+1).toString();
                    this.graph.addEdge(currentHex, hexNextColumnBelow);
                }
                var notOnTopRow = (j > 1);
                if(!isOddRow && notOnTopRow)
                {
                    var hexNextColumnAbove = alphas[i+1] + (j-1).toString();
                    this.graph.addEdge(currentHex, hexNextColumnAbove);
                }
            }
        }
    }
};