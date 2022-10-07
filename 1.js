/* The Battleship game where the bots playing with each other
all the steps of the bots can be seen on the console, to see them 
please go to the inspect/inspect page on the web page.
Hope everything is clear in my code
ps, see comments for help :) */

class Battleship{
    leftFieldBoats = [];//for the boat class of the left field
    leftContainer = [];//left container for divs
    leftField;//the main left div
    rightFieldBoats = [];//for the boat class of the right field
    rightField;//the main right field div
    rightContainer = [];//for all divs in the right field
    leftFired = [];//list of the indexes we can attack on the left field
    rightFired = [];//the same but on the right field
    timer = 1000;//starting timer
    clicker = 0;//for show and hide button
    leftPoints = 0;//to count points
    rightPoints = 0;//if it succeeds the 20 points mark then it is the end
    interval;//for the timeout
    stepCounter = 1;//it will be used in console log where all the steps will be shown, step numerator in short

    constructor(container, player_1_name, player_2_name){
        this.container = container;
        this.player_1_name = player_1_name;
        this.player_2_name = player_2_name;
        this.start();
    }

    //creating the start button
    start(){
        let start = new Button("start").render(this.container);
        $(start).click( () => {
           this.renderPlayTable();
           $(start).fadeToggle();
        });
    }

 //creates play table
    renderPlayTable(){
        this.createBoard();
        this.createBoats();  
        this.createButtons();
        this.whoseTurn(this.randomInteger(0,1));//random one starts the game
    }

    //creates left and right boards for the game
    createBoard(){
            let ldiv = document.createElement('div');
            $(ldiv).css({"background-color":"white" , "width":"550px", "height": "550px", "border-style":"none", "display":"inline-block"});
            this.container.append(ldiv);
            let rdiv = document.createElement('div');
            $(rdiv).css({"background-color":"white" , "width":"550px", "height": "550px", "border-style":"none", "display":"inline-block"});
            this.container.append(rdiv);
            this.leftField = ldiv;
            this.rightField = rdiv
        }

    //creates boats 
    createBoats(){
            for(let i=0; i<100; i++){//here we just create 100 divs for each board
                let leftBoat = new Boat(true);
                this.leftFieldBoats[i] = leftBoat;
                let rightBoat = new Boat(true);
                this.rightFieldBoats[i] = rightBoat;
                this.leftContainer[i] = this.leftFieldBoats[i].render(this.leftField, 'none');//assign as none class
                this.rightContainer[i] = this.rightFieldBoats[i].render(this.rightField, 'none');//in order to make them water class after the boat placement
                this.leftFired[i] = i;
                this.rightFired[i] = i;        
            }
            //starting from one 4-placed boat to four 1-placed boats
            for (let lengthOfShip = 4; lengthOfShip>=1; lengthOfShip--){
                for(let count = (5 - lengthOfShip); count>=1; count--){
                    var lPosiotions = this.randomizer(lengthOfShip, this.leftContainer);//get a random start position and other boat indexes
                    var rPosiotions = this.randomizer(lengthOfShip, this.rightContainer);     

                    for(let i=0; i<lPosiotions.length; i++){//place our positions
                        this.placeBoats(lPosiotions[i], this.leftContainer, this.leftFieldBoats);
                        this.placeBoats(rPosiotions[i], this.rightContainer,this.rightFieldBoats);
                    }
                }
            }
            $(".none").removeClass('none').addClass('water');//making all left blank space as water
        }

    randomizer(x, container){
        var out = [];
        var direction = this.randomInteger(0,1);//direction vertical or horizontal
        out[0] = this.randomInteger(0,99);//start position on index [0] of out list

        if (direction){//if horizontal
            if (out[0]%10 > (10-x)){// we change our start position if our boat will not fit on the line
                out[0] = Math.floor(out[0]/10)*10+(10-x);
            }
            for(let i=1;i<x;i++){//adding next positions horizontally
                out[i] = out[i-1]+1;
            }
        }

        else{//vertical
            if (out[0]>(x*10-1)){//checking will it fit or not
                out[0]=(x*10-1)+Math.round(out[0]%10);
            }
            for(let i=1;i<x;i++){	
                out[i]=out[i-1]+10;//adding vertical next postions
            }
        }

        for(var i=0; i<x; i++){//check for availability of the positions
            if($(container[out[i]]).hasClass('ship') || $(container[out[i]]).hasClass('water')){
                return this.randomizer(x, container);
            }
        }
        return out;//return out boat positions
    }

    placeBoats(boat, container, sideField){//here we place each postion we get from the randomizer function
        var around = [boat-1, boat-10, boat+10, boat-11, boat+9, boat+1, boat-9, boat+11];//places around
        var aroundLength;
        if (Math.floor(boat%10)<9){//checking is the position placed at the corner
            aroundLength= around.length;
        }
        else{//if yes shortening the length of the around list so the places after the corner will not be banned for other boats
            aroundLength = around.length - 3;
        }
        for(let i=0; i<aroundLength; i++){//creating waters around the boat place if it is not already boated
            $(container[around[i]]).hasClass('ship')?0:$(container[around[i]]).removeClass('none ship water fired-ship fired-water').addClass('water');

        }
        $(container[boat]).removeClass('none ship water fired-ship fired-water').addClass('ship');//making the place boated
        sideField[boat].boat();//making the index true for boated place
    }

    createButtons(){//creating functional buttons
        let normalSpeedButton = new Button("1x").render(this.container);//normal speed
        $(normalSpeedButton).css({"background-color": "#7ACEF4"});//at the start 1x speed is being activated
        $(normalSpeedButton).click( () => {//color changes when it is active
            $(normalSpeedButton).css({"background-color": "#7ACEF4"});
            $(doubleSpeedButton).css({"background-color": "gray"});
            $(tripleSpeedButton).css({"background-color": "gray"});
            this.timer = 1000;//changing timer
        });
        //these 3 functional buttons are similar so other two don't need explanation
        let doubleSpeedButton = new Button("2x").render(this.container);//2x speed
        $(doubleSpeedButton).click( () => {
            $(doubleSpeedButton).css({"background-color": "#7ACEF4"});
            $(normalSpeedButton).css({"background-color": "gray"});
            $(tripleSpeedButton).css({"background-color": "gray"});
            this.timer = 500;
        });

        let tripleSpeedButton = new Button("3x").render(this.container);//3x speed
        $(tripleSpeedButton).click( () => {
            $(tripleSpeedButton).css({"background-color": "#7ACEF4"});
            $(doubleSpeedButton).css({"background-color": "gray"});
            $(normalSpeedButton).css({"background-color": "gray"});
            this.timer = 250;
        });

        let showAndHideButton = new Button("show").render(this.container);//show and hide button
        $(showAndHideButton).click( () => {
            if (this.clicker){//if clicker is true the button is inactive
                $(showAndHideButton).css({"background-color": "gray"});
                $(".ship").css({"background-color": "gray"});
                this.clicker = 0;
            }
            else{//else active, so the clicker changes every time it is clicked 
                $(showAndHideButton).css({"background-color": "green"});
                $(".ship").css({"background-color": "black"});
                this.clicker = 1;
            }
        });
    }

    whoseTurn(x){
        if(x){//comp2's turn
            this.attackLeft();
        }
        else{//comp1's turn
            this.attackRight();
        }   
    }

    attackLeft(){
        var boomIndex = this.randomInteger(0, this.leftFired.length-1);//get random index
        if(arguments[0]=='boom'){// this checks if it the previous shot was on boat
            boomIndex = arguments[1];//assign the second argument (boomIndex)
            if (Math.floor(boomIndex/10)>9){//if the previous index was on the corner
                boomIndex = arguments[1] - 1;
            }
            if (boomIndex == this.leftFired.length){//if it was the last index of the previous step
                boomIndex = arguments[1] - 1;
            }
        }
        
        var index = this.leftFired[boomIndex];//gets the index from the list
        this.leftFired.splice(boomIndex,1);//drop it from the list so it will not duplicate after
        setTimeout( () => {//timer for the thinking time :)
            if($(this.leftContainer[index]).hasClass('ship')){//checking if the index is boated
                $(this.leftContainer[index]).removeClass('ship').addClass('fired-ship');//change the class
                $(this.leftContainer[index]).css({"background-color": "red"});
                console.log(this.stepCounter +". " + this.player_2_name + "'s turn: "+ (index+1)+ " cell: Boom!")//printing the step in the console panel
                this.stepCounter++;
                this.rightPoints++;
                if(this.rightPoints == 20){//checking whether the game is ended
                    this.comp2Won();
                    return 0;//if yes final message and stop the game
                }
                this.attackLeft('boom', boomIndex);//gets the extra turn for the good shot
            }
            else if ($(this.leftContainer[index]).hasClass('water')){//if it is not boated
                $(this.leftContainer[index]).removeClass('water').addClass('fired-water');//show watered place
                $(this.leftContainer[index]).css({"background-color":"blue"});
                console.log(this.stepCounter +". " + this.player_2_name + "'s turn: "+ (index+1)+ " cell: missed");//print the step
                this.stepCounter++;
                this.whoseTurn(0);//giving the the turn
            }
        }, this.timer);
    }

    //this function is just the same but functions for other computer
    attackRight(){
        var boomIndex = this.randomInteger(0, this.rightFired.length-1);
        if(arguments[0]=='boom'){
            boomIndex = arguments[1];
            if (Math.floor(boomIndex/10)>9){
                boomIndex = arguments[1] - 1;
            }
            if (boomIndex == this.rightFired.length){
                boomIndex = arguments[1] - 1;
            }
        }
        var index = this.rightFired[boomIndex];
        this.rightFired.splice(boomIndex,1);

        setTimeout( () =>{
            if($(this.rightContainer[index]).hasClass('ship')){
                $(this.rightContainer[index]).removeClass('ship').addClass('fired-ship');
                $(this.rightContainer[index]).css({"background-color": "red"});
                console.log(this.stepCounter +". " + this.player_1_name + "'s turn: "+ (index+1)+ " cell: Boom!");
                this.stepCounter++;
                this.leftPoints++;
                if(this.leftPoints == 20){
                    this.comp1Won();
                    return 0;
                }
                this.attackRight('boom', boomIndex);

            }
            else if ($(this.rightContainer[index]).hasClass('water')){
                $(this.rightContainer[index]).removeClass('water').addClass('fired-water');
                $(this.rightContainer[index]).css({"background-color":"blue"});
                console.log(this.stepCounter +". " + this.player_1_name + "'s turn: "+ (index+1)+ " cell: missed");
                this.stepCounter++;
                this.whoseTurn(1);
            }
        },this.timer);
    }

    //final print messages
    comp1Won(){
        console.log(this.player_1_name + " won!");
        $(this.container).append("<br>" + this.player_1_name + " won! Please reload the page to restart the game!");
    }

    comp2Won(){
        console.log(this.player_2_name + " won!");
        $(this.container).append("<br>" + this.player_2_name + " won!  Please reload the page to restart the game!"); 
    }

    //random integer function
    randomInteger(min,max){
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

   

}

class Boat{
    constructor(notBoat){
        this.notBoat = notBoat;
    }

    boat(){
        this.notBoat = false;
    }

    render(field,className){
        let boat = document.createElement("div");
        $(boat).css({"background-color":"gray" , "width":"48px", "height": "48px", "border-style":"dotted", "display": "inline-block"});
        $(boat).addClass(className);
        field.append(boat);
        return boat;
    }
}

class Button{
    constructor(name){
        this.name = name;
    }

    render(container){
        var but = document.createElement("button");
        but.setAttribute("type", "button");
        $(but).css({"background-color":"gray" , "width":"50px", "height": "50px", "border-radius":"15px", "border-style":"bold", "display": "inline-block"});
        $(but).html(this.name);
        container.append(but);
        return but;
    }
}

var div = $("#target");

let battleship = new Battleship(div, 'Comp1', 'Comp2');
















