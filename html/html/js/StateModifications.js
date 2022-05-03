/* 
* FILE : StateModifications.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-03-15
* DESCRIPTION :
* Functionality for Save States / Undo/Redo
*/

/*
* FUNCTION : UpdateModifications()
* DESCRIPTION : Consistently keeps an updated version of the 
* Canvas state in local storage for an undo/redo as well as "pickup where you left off"
* PARAMETERS : saveHistory : canvas data
* RETURNS : N/A
*/
var state = [];
function UpdateModifications(saveHistory) {
    if (saveHistory === true) {
        jsonCanvas = JSON.stringify(canvases.canvas);
        state.push(jsonCanvas);

        // Save state to local storage for picking up where left off
        localStorage.setItem('saveState', jsonCanvas);
    }
}

/*
* FUNCTION : LoadStoredCanvas()
* DESCRIPTION : This function loads a canvas from localstorage
* PARAMETERS : N/A
* RETURNS : N/A
*/
function LoadStoredCanvas() {
    var savedCanvas = localStorage.getItem('saveState');

    canvases.canvas.clear();
    canvases.canvas.loadFromJSON(savedCanvas, function() {
        canvases.canvas.renderAll();
    });
}

/*
* FUNCTION : UndoLast()
* DESCRIPTION : UNDO an action
* PARAMETERS : N/A
* RETURNS : N/A
*/
var mods = 0;
function UndoLast() {
    if (mods < state.length) {
        canvases.canvas.clear().renderAll(); // Clear canvas
        canvases.canvas.loadFromJSON(state[state.length - 1 - mods - 1]); // Load saved canvas from state
        canvases.canvas.renderAll();
        mods += 1; // Tracking # of modifications made
    }
}
/*
* FUNCTION : RedoLast()
* DESCRIPTION : REDO an action
* PARAMETERS : N/A
* RETURNS : N/A
*/
function RedoLast() {
    if (mods > 0) {
        canvases.canvas.clear().renderAll();
        canvases.canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        canvases.canvas.renderAll();
        mods -= 1;
    }
}
