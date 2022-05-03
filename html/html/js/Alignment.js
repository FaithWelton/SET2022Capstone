/* 
* FILE : Alignment.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-03-15
* DESCRIPTION :
* Functionality for the Canvas Alignement
*/

/*
* FUNCTION : AlignmentOpts()
* DESCRIPTION : This function will get a selected object and call Align items to
* Align according to the action (left, center, right, top, middle, bottom)
* PARAMETERS : Action : left, center, right, top, middle, bottom 
* RETURNS : N/A
*/
function AlignmentOpts(action) {
    var activeThings = GetSelection();

    if (activeThings) {
        if (action != "Select") {
            AlignItems(action, activeThings);
            activeThings.setCoords();
            canvases.canvas.renderAll();
        }
    }
    else {
        alert("Please select at least one item!");
    }
}

/*
* FUNCTION : CheckForCol()
* DESCRIPTION : This function checks if there is a column on the page
* PARAMETERS : N/A
* RETURNS : col : col object (means that yes theres a column)
*/
function CheckForCol() {
    var col;
    var objs = canvases.canvas.getObjects();
    for (var i = 0; i < objs.length; i ++) {
        if (objs[i].name === "col") {
            col = objs[i];
        }
    }

    return col;
}

/*
* FUNCTION : CheckForRow()
* DESCRIPTION : This function checks if there is a row on the page
* PARAMETERS : N/A
* RETURNS : row : row object (means yes there is a row)
*/
function CheckForRow() {
    var row;
    var objs = canvases.canvas.getObjects();
    for (var i = 0; i < objs.length; i ++) {
        if (objs[i].name === "row") {
            row = objs[i];
        }
    }
    return row;
}

/*
* FUNCTION : Align Items()
* DESCRIPTION : This function will align a token according to the
* action, it checks for the columns/rows and adjusts alignment
* PARAMETERS : Action : Action user chose : left, center, right, top, middle, bottom
* RETURNS : N/A
*/
function AlignItems(action, activeThings) {
    var col = CheckForCol();
    var row = CheckForRow();

    var activeW = activeThings.getScaledWidth();
    var activeH = activeThings.getScaledHeight();
    var canvasW = canvases.canvas.getWidth();
    var canvasH = canvases.canvas.getHeight();
    var offsetW = activeW / 2;
    var offsetH = activeH / 2;

    switch (action) {
        case 'alignLeft':
            // If selected is a group or 'activeSelection'
            if (activeThings.type === 'group' || activeThings.type === 'activeSelection') {
                
                // If there is a column
                if (col) {
                    
                    // If activeThings is on left column
                    if (activeThings.left < col.left) {
                        activeThings.set({ left: 0 });
                    }
                    else {
                        activeThings.set({ left: col.left });
                    }
                }
                else {
                    activeThings.set({ left: 0 });
                }
            }
            // If selected is just a single object
            else {
                
                // If there is a column
                if (col) {

                    // If activeThings is on left column
                    if (activeThings.left < col.left) {
                        activeThings.set({ left: 0 });
                    }
                    else {
                        activeThings.set({ left: col.left });
                    }
                }
                else {
                    activeThings.set({ left: 0 });
                }
            }
        break;

        case 'alignCenter':
            // If selected is a group or 'activeSelection'
            if (activeThings.type === 'group' || activeThings.type === 'activeSelection') {
    
                // If there is a column
                if (col) {
                    
                    // If activeThings is on left column
                    if (activeThings.left < col.left) {
                        activeThings.set({ left: col.left / 2 - offsetW });
                    }
                    else {
                        activeThings.set({ left: canvasW - (col.left / 2) - offsetW });
                    }
                }
                else {
                    activeThings.set({ left: canvasW / 2 - offsetW });
                }
            }
            // If selected is just a single object
            else {
                
                // If there is a column
                if (col) {

                    // If activeThings is on left column
                    if (activeThings.left < col.left) {
                        activeThings.set({ left: col.left / 2 - offsetW })
                    }
                    else {
                        activeThings.set({ left: canvasW - (col.left / 2) - offsetW })
                    }
                }
                else {
                    activeThings.set({ left: canvasW / 2 - offsetW });
                }
            }
        break;

        case 'alignRight':
            // If selected is a group or 'activeSelection'
            if (activeThings.type === 'group' || activeThings.type === 'activeSelection') {
    
                // If there is a column
                if (col) {
                    
                    // If activeThings is on left column
                    if (activeThings.left < col.left) {
                        activeThings.set({ left: col.left - activeW })
                    }
                    else { // right column
                        activeThings.set({ left: canvasW - activeW })
                    }
                }
                else { // no column
                    activeThings.set({ left: canvasW - activeW});
                }
            }
            // If selected is just a single object
            else {
                
                // If there is a column
                if (col) {

                    // If activeThings is on left column
                    if (activeThings.left < col.left) {
                        activeThings.set({ left: col.left - activeW })
                    }
                    else { // right column
                        activeThings.set({ left: canvasW - activeW })
                    }
                }
                else { // no column
                    activeThings.set({ left: canvasW - activeW });
                }
            }
        break;

        case 'alignTop':
            // If selected is a group or 'activeSelection'
            if (activeThings.type === 'group' || activeThings.type === 'activeSelection')
            {
                // If theres a row
                if (row) {

                    // If activeThings is on top row
                    if (activeThings.top < row.top) {
                        activeThings.set({ top: 0  });
                    }
                    else { // bottom row
                        activeThings.set({ top: row.top });
                    }
                }
                else { // no row
                    activeThings.set({ top: 0  });
                }
            }
            else { // Single object
                // If row
                if (row) {

                    // if activeThings on top
                    if (activeThings.top < row.top) {
                        activeThings.set({ top: 0 });
                    }
                    else { // bottom
                        activeThings.set({ top: row.top });
                    }
                }
                else { // no row
                    activeThings.set({ top: 0 });
                }
            }
        break;

        case 'alignMiddle':
            if (activeThings.type === 'group' || activeThings.type === 'activeSelection')
            {
                // if row
                if (row) {

                    // if on top
                    if (activeThings.top < row.top) {
                        activeThings.set({ top: row.top / 2 - offsetH});
                    }
                    else { // bottom
                        activeThings.set({ top: canvasH - (row.top / 2) - offsetH});
                    }
                }
                else { // no row
                    activeThings.set({ top: canvasH / 2 - offsetH});
                }
                
            }
            else {
                // if row
                if (row) {

                    // if on top
                    if (activeThings.top < row.top) {
                        activeThings.set({ top: row.top / 2 - offsetH });
                    }
                    else { // bottom
                        activeThings.set({ top: canvasH - (row.top / 2) });
                    }
                }
                else { // no row
                    activeThings.set({ top: canvasH / 2 - offsetH });
                }
            }
        break;

        case 'alignBottom':
            if (activeThings.type === 'group' || activeThings.type === 'activeSelection')
            {
                if (row) {

                    // if top
                    if (activeThings.top < row.top) {
                        activeThings.set({ top: row.top - activeH });
                    }
                    else { // bottom
                        activeThings.set({ top: canvasH - activeH });
                    }
                }
                else { // no row
                    activeThings.set({ top: canvasH - activeH });
                }
            }
            else {
                if (row) {
                    // if top
                    if (activeThings.top < row.top) {
                        activeThings.set({ top: row.top - activeH});
                    }
                    else { // bottom
                        activeThings.set({ top: canvasH - activeH});
                    }
                }
                else { // no row
                    activeThings.set({ top: canvasH - activeH});
                }
            }
        break;
    }
}

/*
* FUNCTION : AddCol()
* DESCRIPTION : Adds a column to the canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function AddCol() {
    var top = 0;
    var bot = canvases.canvas.getHeight();
    var left = canvases.canvas.getWidth() / 2;

    var col = new fabric.Line([left, top, left, bot], {
        stroke: '#ccc',
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        selectable: true
    });

    col.name = "col";

    canvases.canvas.add(col);
}

/*
* FUNCTION : AddRow()
* DESCRIPTION : Adds a row to the canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function AddRow() {

    var row = new fabric.Line([0, canvases.canvas.getHeight() / 2, canvases.canvas.getWidth(), canvases.canvas.getHeight() / 2], {
        stroke: '#ccc',
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        selectable: true
    });

    row.name = 'row';

    canvases.canvas.add(row);
}
