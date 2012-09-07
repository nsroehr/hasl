Hasl.ImageLoader = function() {
    this.sources = {
        american_2_e_fs: "./assets/ame_2_e_fs.png",
        german_1_e_hs: "./assets/ger_1_e_hs.png"
    };
    this.images = {};
}
Hasl.ImageLoader.prototype.loadImages = function(/*callback*/) {
    //var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in this.sources) {
        numImages++;
    }
    for(var src in this.sources) {
        this.images[src] = new Image();
        //        images[src].onload = function() {
        //            if(++loadedImages >= numImages) {
        //                callback(images);
        //            }
        //        };
        this.images[src].src = this.sources[src];
    }
}