var Hasl = ( Hasl || {} );

// TODO: add broken images
Hasl.ImageSourceDatabase = 
{
    american_2_e_fs: {value: 0, source:"./assets/ame_2_e_fs.png", width: 72, height: 72, broken: ''},
    german_1_e_hs:   {value: 1, source:"./assets/ger_1_e_hs.png", width: 72, height: 72, broken: ''},
    board_y:         {value: 2, source:"./assets/boardYrasterized.png", width: 1800, height: 648, 
                      hex: { radius: 37.5,  height: 32, distBetweenCenters: 28.5 } 
                     }
//    board_y:         {value: 2, source:"./assets/board_y.gif"} //, width: 1800, height: 648 }
};

Hasl.ImageLoader = function(imageSourceDb) 
{
    var that = {};
    var images = {};
    var sourceDatabase = imageSourceDb;
    
    for(var entry in imageSourceDb) 
    {
        var imgSrc = imageSourceDb[entry].source;
        var val = imageSourceDb[entry].value;
        images[val] = new Image();
        images[val].src = imgSrc;
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