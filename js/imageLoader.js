var Hasl = ( Hasl || {} );
Hasl.ImageSourceDatabase = 
{
    american_2_e_fs: {value: 0, source:"./assets/ame_2_e_fs.png"},
    german_1_e_hs:   {value: 1, source:"./assets/ger_1_e_hs.png"},
    board_y:         {value: 2, source:"./assets/boardYrasterized.png"} //, height: 1800, width: 648 }
//    board_y:         {value: 2, source:"./assets/board_y.gif"} //, height: 1800, width: 648 }
};

Hasl.ImageLoader = function(imageSourceDb) 
{
    var that = {};
    var images = {};
    var sourceDatabase = imageSourceDb;
    for(var entry in imageSourceDb) 
    {
        var src = imageSourceDb[entry].source;
        var value = imageSourceDb[entry].value;
        images[value] = new Image();
        images[value].src = src;
    }
    
    that.getImage = function(entry)
    {
        return images[entry.value];
    };
    
    that.getDatabase = function()
    {
        return sourceDatabase;
    }
    
    return that;
};