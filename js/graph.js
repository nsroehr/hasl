var redraw;

window.onload = function() {
    var width = $(document).width();
    var height = $(document).height() - 100;

    
    /* We need to write a new node renderer function to display the computed
       distance.
       (the Raphael graph drawing implementation of Dracula can draw this shape,
       please consult the RaphaelJS reference for details http://raphaeljs.com/) */
    var render = function(r, n) {
            /* the Raphael set is obligatory, containing all you want to display */
            var set = r.set().push(
                /* custom objects go here */
                r.rect(n.point[0]-30, n.point[1]-13, 60, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
                r.text(n.point[0], n.point[1] + 10, (n.label || n.id) + "\n(" + (n.distance == undefined ? "Infinity" : n.distance) + ")"));
            return set;
        };
    
    var bg = new BoardGraph();
   
    /* layout the graph using the Spring layout implementation */
    var layouter = new Graph.Layout.Spring(bg.graph);
    
    /* draw the graph using the RaphaelJS draw implementation */

    /* calculating the shortest paths via Bellman Ford */
    //    bellman_ford(g, g.nodes["Berlin"]);
    
    /* calculating the shortest paths via Dijkstra */
    dijkstra(bg.graph, bg.graph.nodes["A1"]);
    
    /* calculating the shortest paths via Floyd-Warshall */
    //floyd_warshall(g, g.nodes["Berlin"]);


    /* colourising the shortest paths and setting labels */
    for(e in bg.graph.edges) {
        if(bg.graph.edges[e].target.predecessor === bg.graph.edges[e].source || bg.graph.edges[e].source.predecessor === bg.graph.edges[e].target) {
            bg.graph.edges[e].style.stroke = "#bfa";
            bg.graph.edges[e].style.fill = "#56f";
        } else {
            bg.graph.edges[e].style.stroke = "#aaa";
        }
    }
    
    var renderer = new Graph.Renderer.Raphael('canvas', bg.graph, width, height);

    redraw = function() {
        layouter.layout();
        renderer.draw();
    };
};