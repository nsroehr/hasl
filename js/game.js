var Hasl = ( Hasl || {} );

/*
 * Some ideas?!
 * 
 * Game startup
 * 1. select scenario (get nice list of details, maybe even nested, so you can dive down to get further info)
 * 2. setup board, players, etc (game interface, game)
 * 3. first player to setup goes...
 *    - look up scenario info:
 *      * find starting player
 *      * reinforce starting player
 *      * place units
 *      * validate placement on 'commit'
 *      * end setup phase
 *    - advance state to first real turn
 *    - change player
 *    - start Rally Phase, turn 1
 *    - . . .
 * 
 */


// the idea of orchestrator is basically a glorified message passer
// taking some user action (event) it combines the current game phase and selections
// into a package (ex: move stack to position) that can be pushed to the game 
// to update state and validate the action, game state updates can then be passed
// back to orchestrator to update the game interface
// 
// the hope is that someday this will help with client-server messenging and responses
//Hasl.Orchestrator = function()
//{
//    var that = {};
//    
//    var selectedHex;
//    var hoverHex;
//    var selectedUnit;
//    
//    that.selectHex = function(hexId)
//    { 
//        //alert('Hex ' + hexId + ' was selected.');
//        selectedHex = hexId;
//    }
//    
//    that.hoverHex = function(hexId)
//    {
//        hoverHex = hexId;
//    }
//    
//    that.hoverOutHex = function(hexId)
//    {
//        hoverHex = undefined;
//    }
//    
//    that.selectUnit = function(unit)
//    {
//        that.unSelectUnit(unit);
//        selectedUnit = unit;
//    }
//    
//    that.unSelectUnit = function(unit)
//    {
//        selectedUnit = undefined;
//    }
//    
//    that.getSelectedUnit = function()
//    {
//        return selectedUnit;
//    }
//    
//    that.getSelectedHex = function()
//    {
//        return selectedHex;
//    }
//    
//    var _phaseChange = function(e) 
//    {
//        var elem = $('#phase')
//        if(elem) { 
//            var msg = e.phaseName + ' Phase';
//            if(e.acronym) { msg += ' (' + e.acronym + ')'}
//            elem.text(msg);
//        }
//    }
//    that.phaseChange = _phaseChange;
//    
//    that.turnChange = function(e)
//    {
//        var elem = $('#player')
//        if(elem) { elem.text(e.playerName); }
//        
//        elem = $('#turn');
//        if(elem) { elem.text('Turn: ' + e.turnCount + '/' + e.totalTurns); }
//        _phaseChange(e);
//    }
//    return that;
//};

Hasl.GamePhases = { 
    Setup:         {value:-1, acro: '',     name: 'Setup'         },
    Rally:         {value: 0, acro: 'RPh',  name: 'Rally'         },
    PrepFire:      {value: 1, acro: 'PFPh', name: 'Prep Fire'     },
    Movement:      {value: 2, acro: 'MPh',  name: 'Movement'      },
    DefensiveFire: {value: 3, acro: 'DFPh', name: 'Defensive Fire'},
    AdvancingFire: {value: 4, acro: 'AFph', name: 'Advancing Fire'},
    Rout:          {value: 5, acro: 'RtPh', name: 'Rout'          },
    Advance:       {value: 6, acro: 'APh',  name: 'Advance'       },
    CloseCombat:   {value: 7, acro: 'CCPh', name: 'Close Combat'  }
};

Hasl.Game = function(scenario)
{
    var that = {};
    
    var mGamePhases = [
        Hasl.GamePhases.Rally, 
        Hasl.GamePhases.PrepFire,
        Hasl.GamePhases.Movement,
        Hasl.GamePhases.DefensiveFire,
        Hasl.GamePhases.AdvancingFire,
        Hasl.GamePhases.Rout,
        Hasl.GamePhases.Advance,
        Hasl.GamePhases.CloseCombat
    ];
        
    var mScenario = scenario;
    that.getScenario = function() {
        return mScenario;
    }

    var mTurnCount = 0;
    var mRoundCount = 0;
    
    var mCurrentPlayer;
    var mCurrentPhase;
    
    var mPlayers;
    var initializePlayers = function()
    {
        mPlayers = [ Hasl.Player(Hasl.Players.Allied), Hasl.Player(Hasl.Players.Axis) ];
        
        var playerScenarioName = mCurrentPlayer.scenarioName;
        
        if(mScenario.players[playerScenarioName])
        {
            var playersTurnOptions = mScenario.players[playerScenarioName]['turn'+mTurnCount];
            if(playersTurnOptions)
            {
                var reinforcements = playersTurnOptions.getUnits();
                mPlayers[mCurrentPlayer.value].addReinforcements(reinforcements);
            }
        }
    }
    
    var init = function() {
        mCurrentPlayer = mScenario.players.turn0;
        
        mCurrentPhase = Hasl.GamePhases.Setup;
        // rout phase should reinforce and what-nots...
        
        initializePlayers();
        // TODO: this event should be part of the gameInterface *NOT* orchestrator...
        //var event = {playerName: getCurrentPlayerName(), turnCount: mTurnCount, totalTurns: mScenario.turns, phaseName: mCurrentPhase.name, acronym: mCurrentPhase.acro};
        //Hasl.Orchestrator.turnChange(event);
    };
    init();
    
    that.getCurrentPlayerName = function()
    {
        if(mCurrentPlayer === Hasl.Players.Allied)
        {
            return mScenario.players.allied.name;
        }
        return mScenario.players.axis.name;
    }
    
    // TODO: there's got to be a better way here!
    var rally = function() { };
    mGamePhases[Hasl.GamePhases.Rally.value].something = rally;

    var prepFire = function() { };
    mGamePhases[Hasl.GamePhases.PrepFire.value].something = prepFire;
    
    var movement = function() { };
    mGamePhases[Hasl.GamePhases.Movement.value].something = movement;
    
    var defensiveFire = function() { /*this one is tricky*/ };
    mGamePhases[Hasl.GamePhases.DefensiveFire.value].something = defensiveFire;
    
    var advancingFire = function() { };
    mGamePhases[Hasl.GamePhases.AdvancingFire.value].something = advancingFire;
    
    var rout = function() { };
    mGamePhases[Hasl.GamePhases.Rout.value].something = rout;
    
    var advance = function() { };
    mGamePhases[Hasl.GamePhases.Advance.value].something = advance;
    
    var closeCombat = function() { };
    mGamePhases[Hasl.GamePhases.CloseCombat.value].something = closeCombat;
    
    var nextPlayer = function()
    {
        if(mCurrentPlayer === Hasl.Players.Allied)
        {
            mCurrentPlayer = Hasl.Players.Axis;
        }
        mCurrentPlayer = Hasl.Players.Allied;
    }
    
    var mBoard = Hasl.Board(mScenario.board.type, mScenario.board.configuration);
    that.getBoard = function() {
        return mBoard;
    }
    
    var mCurrentPhaseIndex = 0;
//    var mCurrentPhase = mGamePhases[mCurrentPhaseIndex];
    that.advancePhase = function()
    {
        if(mCurrentPhase === Hasl.GamePhases.Setup || mCurrentPhase === Hasl.GamePhase.CloseCombat)
        {
            advanceTurn();
        }
        else if (mCurrentPhase === Hasl.GamePhases )
        {
            
        }
        mCurrentPhaseIndex++;
        mCurrentPhase = mGamePhases[mCurrentPhaseIndex];
    }
    that.getCurrentPhase = function()
    {
        return mCurrentPhase;
    }
    
    that.getCurrentPlayer = function()
    {
        return mPlayers[mCurrentPlayer.value];
    }
    
    that.getTurnCount = function()
    {
        return mTurnCount;
    }
    
    that.getTotalGameTurns = function()
    {
        return mScenario.turns;
    }
    
    that.advanceTurn = function()
    {
        mRoundCount++;
        if(mRoundCount > 1)
        {
            mRoundCount = 1;
            mTurnCount++;
        }
        if(mTurnCount === mScenario.turns)
        {
            endGame();
            return;
        }
        
        mCurrentPlayer = nextPlayer();
        
        // reset to start phase
        mCurrentPhaseIndex = 0;
        mCurrentPhase = mGamePhases[mCurrentPhaseIndex];
    }
    return that;
}


// TODO:
// BoardRendering (including hex selectors)
// UnitRendering (given current player)
// User input handling (unit selection, hex selection)
//  -> resulting updates to base-models (game, player, unit)
// update for current player (also see Hasl.Orchestrator.turnChange() event - should be handled here)
// 
// update for current phase:
//  if rally | setup:
//      - display any reinforcements in reinforcement area
//
// * is there an easy way to only attach event handlers for the current player's units?
//
// * remember that pie-menus might be a great idea after unit selection
Hasl.GameInterface = function()
{
    var that = {};
    var mImageSourceDb = Hasl.ImageSourceDatabase;
    var mImageLoader = Hasl.ImageLoader(mImageSourceDb);
    that.getImageLoader = function() { return mImageLoader; }
                
    var mGame;
    
    var mStage; 
        
    var mBoardRenderer;
    var mSelectionLayer = new Kinetic.Layer();
    var mUnitLayer = new Kinetic.Layer();
    that.getUnitLayer = function() { return mUnitLayer; }
    
    var selectedUnit;
    that.setSelectedUnit = function(unit) { selectedUnit = unit; }
    that.getSelectedUnit = function() { return selectedUnit; }
    
    var phaseChange = function() 
    {
        var elem = $('#phase')
        if(elem) { 
            var currentPhase = mGame.getCurrentPhase();
            var msg = currentPhase.name + ' Phase';
            if(currentPhase.acronym) 
            { 
                msg += ' (' + currentPhase.acronym + ')'
            }
            elem.text(msg);
        }
    }
    
    var turnChange = function()
    {
        var elem = $('#player')
        if(elem) 
        { 
            elem.text(mGame.getCurrentPlayerName()); 
        }
        
        elem = $('#turn');
        if(elem) 
        { 
            elem.text('Turn: ' + mGame.getTurnCount() + '/' + mGame.getTotalGameTurns()); 
        }
        
        phaseChange();
    }
    
    that.startScenario = function(scenario, useFills)
    {
        mGame = Hasl.Game(scenario);

        // TODO: modularize all this crap...there needs to be a division between
        // board setup and phase setup and unit setup
        mStage = new Kinetic.Stage({
            container: "container",
            width: 1800,
            height: 645 
        });
        
        var hexDimensions = { radius: 37.5,  height: 32, distBetweenCenters: 28.5 };
        var boardNodeArray = mGame.getBoard().getBoardGraph().getNodeArray();
        if(useFills)
        {
            // HACK: this should go away...doesn't really make sense to have a board that's so simple
            mBoardRenderer = Hasl.BoardTerrainBasedRenderer(boardNodeArray, mGame.getBoard().getDimensions(), hexDimensions);
        }
        else
        {
            mBoardRenderer = Hasl.BoardImageRenderer(mGame.getBoard().getDimensions(), mGame.getBoard().getBoardType(), mImageLoader);
            hexDimensions = mImageSourceDb[mGame.getBoard().getBoardType()].hex;
        }
    
        Hasl.BoardHexSelectors(boardNodeArray, mSelectionLayer, false, hexDimensions);
    
        mStage.add(mBoardRenderer.getBoardLayer());
        mStage.add(mSelectionLayer);
        mStage.add(mUnitLayer);
                
        var mStageZoomScalar = 1.0;
        var mBoardSize = mBoardRenderer.getSize();
        mStage.setSize(mStageZoomScalar*mBoardSize.width, mStageZoomScalar*mBoardSize.height);
        mStage.setScale(mStageZoomScalar);
        mStage.draw();

        turnChange();
        if(mGame.getCurrentPhase() === Hasl.GamePhases.Setup)
        {
            that.updateReinforcements();
        }
    }
    
    var reinforcementPickerStage;
    that.updateReinforcements = function()
    {
        if(reinforcementPickerStage)
        {
            reinforcementPickerStage.remove();
        }
        
        var currentPlayer = mGame.getCurrentPlayer();
        var reinforcements = currentPlayer.getReinforcements();
        console.log(reinforcements);

        // TODO: create a simple 'unit picker' here
        //  - use another stage
        //  - use same unit selection (or at least ideas)
        //    * need to figure out how to identify these units (with player, within game)
        //      . add an id, when added to player's 'hand'...?
        //  - can units go back into 'picker'? likely not...
        //    * once a unit it placed, it should just 'move' around on board
        //  - this unit picker should be able to be reused in some manner for stack ordering and picking smaller 'sub-stacks'
        //    * special cases for a single unit
        //    * shown when stack is 'selected'?
        //  - 
        // rely on the unit picker for the event handling...
        var unitPickerLayer = new Kinetic.Layer();
        var unitPicker = Hasl.UnitPicker(reinforcements, unitPickerLayer, mImageLoader);

        var unitPickerSize = unitPicker.getDimensions();
        reinforcementPickerStage = new Kinetic.Stage({
            container: 'reinforcements',
            width: unitPickerSize.width,
            height: unitPickerSize.height 
        });
        reinforcementPickerStage.add(unitPickerLayer);
        reinforcementPickerStage.draw();
    }
    
    that.draw = function() { mStage.draw(); }
    
    var selectedHex;
    that.selectHex = function(selector)
    {
        selectedHex = selector;
        var hexId = selectedHex.hexId;
        console.log(hexId);
        if(mGame.getCurrentPhase() === Hasl.GamePhases.Setup)
        {
            mGame.getCurrentPlayer().placeReinforcement(selectedUnit, hexId);
        }
        that.updateReinforcements();
    }
    
    return that;
};

var mGameInterface = Hasl.GameInterface();

Hasl.BoardRendererUtils = {};
Hasl.BoardRendererUtils.getBoardDimensionsInPixels = function(boardDimensions, hexDimensions)
{
    var boardWidth =  (boardDimensions.width-1) * (hexDimensions.distBetweenCenters*2) - (boardDimensions.width) + 5
    var boardHeight = (boardDimensions.height) * (hexDimensions.height*2);
    return {width: boardWidth, height: boardHeight};
}

Hasl.BoardImageRenderer = function(boardDimensions, boardType, imageLoader)
{
    var mBoardImageLayer = new Kinetic.Layer();
    
    var drawBoardImage = function(imageLoader, boardDimensions, boardType)
    {
        var boardImageName = boardType;
        var boardImageSource = imageLoader.getImage(imageLoader.getDatabase()[boardImageName]);
        var boardSourceInfo = Hasl.ImageSourceDatabase[boardImageName];
        //var boardImageHeight = boardSourceInfo.height;
        var scenarioImageDimensions = Hasl.BoardRendererUtils.getBoardDimensionsInPixels(boardDimensions, boardSourceInfo.hex);
       
        var boardImage = new Kinetic.Image({
            image: boardImageSource,
            stroke: 'white',
            strokeWidth: 6,
            listening: false,
            height: scenarioImageDimensions.height,
            width: scenarioImageDimensions.width,
            crop: {
                x:0, 
                y:0, 
                width: scenarioImageDimensions.width, 
                height: scenarioImageDimensions.height
            }
        });
                    
        mBoardImageLayer.add(boardImage);
        var size = {
            width: boardImage.getWidth(), 
            height: boardImage.getHeight()
        };
        return size;
    }
    
    var mSize = drawBoardImage(imageLoader, boardDimensions, boardType);
    
    var that = {};
    that.getBoardLayer = function() { return mBoardImageLayer; }
    that.getSize = function() { return mSize; }
    return that;
}

Hasl.BoardHexSelectors = function(boardNodeArray, selectionLayer, useFills, hexDimensions)
{
    var radius = hexDimensions.radius; 
    var hexHeight = hexDimensions.height;

    var xOffset = radius;
    var numNodes = boardNodeArray.length;

    for(var i=0; i<numNodes; i++)
    {
        var yOffset = hexHeight;
        var isEvenHex = ((i+1) % 2 == 0);
        if(isEvenHex)
        {
            yOffset -= hexHeight;
        }
        for (var j=0; j<numNodes; j++)
        {
            if(boardNodeArray[i][j]) // != undefinded)
            {
                var newHex = new Hasl.BoardHex (
                    { offset: { x: radius,   y: radius } },
                    radius, 
                    boardNodeArray[i][j],
                    useFills,
                    selectionLayer
                );
                newHex.move(xOffset, yOffset);
                selectionLayer.add(newHex);
                yOffset += (hexHeight*2);
                if(j > 0)
                {
                    yOffset += 1;
                }
            }

        }
        xOffset += radius+(radius*0.5);
    }
}

Hasl.BoardTerrainBasedRenderer = function(boardNodeArray, boardDimensions, hexDimensions)
{
    var that = {};
    
    var mBoardLayer = new Kinetic.Layer();
    that.getBoardLayer = function() { return mBoardLayer; }
    
    var useFills = true;
    Hasl.BoardHexSelectors(boardNodeArray, mBoardLayer, useFills, hexDimensions);
    
    var boardDimensionsInPixels = Hasl.BoardRendererUtils.getBoardDimensionsInPixels(boardDimensions, hexDimensions)
    
    that.getSize = function() { return boardDimensionsInPixels; }
    
    return that;
}

Hasl.BoardHex = function(config, radius, graphNode, useFill, layer) {
    Kinetic.Group.call(this, config);
    
    this.terrainDatabaseTypes = graphNode.label;
    
    this.hexId = graphNode.id;
    
    this.name = "name"+this.hexId;
    this.id = "group"+this.hexId;
    
    var selectedColor = 'orange';
    var unSelectedColor = 'transparent';
    this.hexagon = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 6,
        radius: radius,
        fill: unSelectedColor,
        rotationDeg: 90,
        name: "hex"+this.hexId,
        id: this.hexId,
        offset: {
            x: -radius, 
            y: 0
        }
    });
    this.add(this.hexagon);
        
    if(useFill === true)
    {
        var terrainType = this.terrainDatabaseTypes[0];
        this.hexagon.setFill(Hasl.TerrainRedering[terrainType]);
        var textColor = 'black';
        // TODO: change this to a function, isDarkTerrain(terrainType)
        if(terrainType == Hasl.Terrains.TerrainType.Woods)
        {
            textColor = 'white'
        }
        this.hexagon.setStroke('black');
        this.hexagon.setStrokeWidth('1');
        
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
    else // useFill === false
    {
        this.setOpacity(0.5);
        
        var terrainHelperText = 'Terrain type';
        var hex = this.hexagon;
        if(hex.getParent().terrainDatabaseTypes.length > 1)
        {
            terrainHelperText += 's';
        }
        terrainHelperText += ': ';
        for(var i=0; i < hex.getParent().terrainDatabaseTypes.length; i++)
        {
            terrainHelperText += Hasl.Terrains[hex.getParent().terrainDatabaseTypes[i]].getType() + ', ';
        }
        terrainHelperText = terrainHelperText.slice(0, -2);
            
        this.hexagon.on('mousemove', function() {
            this.setFill(selectedColor);
            layer.draw();
            
            $('#terrainInfo').text(terrainHelperText);
            
            //Hasl.Orchestrator.hoverHex(this.getParent().hexId);
        });
        
        this.hexagon.on('mouseout', function() {
           this.setFill(unSelectedColor);
           layer.draw();
           
           $('#terrainInfo').text('');
           
           //Hasl.Orchestrator.hoverOutHex(this.getParent().hexId);
        });
        
        this.hexagon.on('click', function(){
            //Hasl.Orchestrator.selectHex(this.getParent().hexId);
            mGameInterface.selectHex(this.getParent());
        });
    }
    this.fill = this.hexagon.getFill();

    
};
Kinetic.Global.extend(Hasl.BoardHex, Kinetic.Group);