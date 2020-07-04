function Player(name, marker){
    var newPlayer={};
    newPlayer.name=name;
    newPlayer.marker=marker;
    newPlayer.points=0;
    return newPlayer;
}


var gameBoard=(function(){
    var _gameArray=new Array(9);
    var _spaceLeft=9;
    var _gameFinished;
    
    function resetGameArray(){
        for(let i=0; i<_gameArray.length;i++){
            _gameArray[i]='';
        }
        _spaceLeft=9;
        _gameFinished=undefined;
    }
    function _isSpaceEmpty(i){
        return _gameArray[i]=='';
    }
    function _checkWin(marker){
        if((_gameArray[0]==marker &&_gameArray[1]==marker &&_gameArray[2]==marker)||(_gameArray[3]==marker &&_gameArray[4]===marker &&_gameArray[5]==marker)||(_gameArray[6]==marker &&_gameArray[7]==marker &&_gameArray[8]==marker)){
            //check horizontals
            return true;
        }else if((_gameArray[0]==marker &&_gameArray[3]==marker &&_gameArray[6]==marker)||(_gameArray[1]==marker &&_gameArray[4]==marker &&_gameArray[7]==marker)||(_gameArray[2]==marker &&_gameArray[5]==marker &&_gameArray[8]==marker)){
            //check verticals
            return true;
        }else if((_gameArray[0]==marker &&_gameArray[4]==marker &&_gameArray[8]==marker)||(_gameArray[2]==marker &&_gameArray[4]==marker &&_gameArray[6]==marker)){
            //check diagonals
            return true;
        }
        return false;
    }
    function _insertMarker(i,marker){
        _gameArray[i]=marker;
        _spaceLeft--;
    }
    function getGameFinished(){
        return _gameFinished;
    }
    function makePlay(i,marker){
        if(_isSpaceEmpty(i)){
            _insertMarker(i,marker);
            if(_checkWin(marker)){
                _gameFinished='win';
            }else if(_spaceLeft==0){
                _gameFinished='draw';
            }
            return true;
        }else{
            return false;
        }
    }
    return {
        resetGameArray,
        getGameFinished,
        makePlay
    }
})();

var gameControl=(function(){
    var _p1=Player('Player-X','x');
    var _p2=Player('Player-O','o');
    var _currentPlayer=_getFirstPlayer();
    var _gameStatus='active';
    function getp1Info(){
        return {name:_p1.name,score:_p1.points};
    }
    function getp2Info(){
        return {name:_p2.name,score:_p2.points};
    }
    function getGameStatus(){
        return _gameStatus;
    }
    function _getFirstPlayer(){
        var tempRand=Math.floor(Math.random()*2);
        if(tempRand==0){
            return _p1;
        }else{
            return _p2;
        }
    }
    function _changePlayer(){
        if(_currentPlayer==_p1){
            _currentPlayer=_p2;
        }else{
            _currentPlayer=_p1;
        }
    }
    function playRound(e){
        if(gameBoard.makePlay(parseInt(e.target.getAttribute('id')),_currentPlayer.marker)){
            //round played successfully
            var tempPlayer=_currentPlayer;
            _changePlayer();
            if(gameBoard.getGameFinished()!=undefined){
                _gameStatus='finish'
                if(gameBoard.getGameFinished()=='win'){
                    tempPlayer.points++;
                }
            }
            return tempPlayer;
        }else{
            return false;
        }
    }
    function newGame(){
        gameBoard.resetGameArray();
        _currentPlayer=_getFirstPlayer();
        _gameStatus=undefined;
    }
    function setp1Name(name){
        _p1.name=name;
    }
    function setp2Name(name){
        _p2.name=name;
    }
    return{
        playRound,
        getGameStatus,
        newGame,
        getp1Info,
        getp2Info,
        setp1Name,
        setp2Name
    }
})();

var displayControl=(function(){
    const boardCells=[...document.querySelectorAll('.board-space')];
    const finalOverlay=document.querySelector('.result-overlay');
    const redoBtns=[...document.querySelectorAll('.fa-redo')];
    const resultDisplay=document.querySelector('.result');
    const p1Score=document.querySelector('.p1-score');
    const p2Score=document.querySelector('.p2-score');
    const nameSubmitBtn=document.querySelector('.submitBtn');
    const p1NameInput=document.querySelector('.p1-name');
    const p2NameInput=document.querySelector('.p2-name');
    document.addEventListener('DOMContentLoaded',(e)=>{
        _resetGame();
        _updateScoreBoard();
        boardCells.forEach(cell=>{
            cell.addEventListener('click',(e)=>{
                
                let result=gameControl.playRound(e);
                //change this
                if(result!=false){
                    _updateDisplay(result,e);
                    if(gameControl.getGameStatus()=='finish'){
                        _finishGame(result);
                        return;
                    }
                }
            })
        });
        redoBtns.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                _resetGame();
                finalOverlay.style.visibility='hidden';
            })
        })
        nameSubmitBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            _updateNames();
            _updateScoreBoard();
        })
    });
    function _finishGame(result){
        _updateScoreBoard();
        if(gameBoard.getGameFinished()=='draw'){
            resultDisplay.textContent='draw game';
        }else{
            resultDisplay.textContent=`${result.name} wins`;
        }
        finalOverlay.style.visibility='visible';
    }
    function _resetGame(){
        gameControl.newGame();
        boardCells.forEach(cell=>{
            cell.textContent='';
        }) 
    };
    function _updateDisplay(player,e){
        e.target.textContent=player.marker;
    }
    function _updateScoreBoard(){
        p1Score.textContent=`${gameControl.getp1Info().name}: ${gameControl.getp1Info().score}`;
        p2Score.textContent=`${gameControl.getp2Info().name}: ${gameControl.getp2Info().score}`;
    }
    function _updateNames(){
        p1Name=p1NameInput.value;
        p2Name=p2NameInput.value;
        if(p1Name!=''){
            gameControl.setp1Name(p1Name);
        }
        if(p2Name!=''){
            gameControl.setp2Name(p2Name);
        }
    }
})();