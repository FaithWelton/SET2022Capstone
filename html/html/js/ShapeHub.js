/* 
* FILE : ShapeHub.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-03-15
* DESCRIPTION :
* The functionality for the "shape hub" canvas where
* the user can select a shape and drag it onto the main canvas
*/

// Saved Shapes for hub
const texts = new Array();
const txtblocks = new Array();
const checks = new Array();
const lines = new Array();
const boxes = new Array();
const customs = new Array();

var saveSelectedHub;

/*
* FUNCTION : UpdateSavedShapeFile()
* DESCRIPTION : This function will update the relevant files that the
* shapes are saved into each time there is a change made to the saved shapes
* PARAMETERS : N/A
* RETURNS : N/A
*/
function UpdateSavedShapeFile() {
    localStorage.clear();

    // Something to Add in the future: Checking to make sure no duplicates are added

    // Textboxes
    if (texts.length > 0) {
        localStorage.setItem('jsonTexts', JSON.stringify(texts));
    }

    // Textblocks
    if (txtblocks.length > 0) {
        localStorage.setItem('jsonTxtBlocks', JSON.stringify(txtblocks));
    }

    // Checkboxes
    if (checks.length > 0) {
        localStorage.setItem('jsonChecks', JSON.stringify(checks));
    }

    // Lines
    if (lines.length > 0) {
        localStorage.setItem('jsonLines', JSON.stringify(lines));
    }

    // Boxes
    if (boxes.length > 0) {
        localStorage.setItem('jsonBoxes', JSON.stringify(boxes));
    }

    // Custom Shapes
    if (customs.length > 0) {
        localStorage.setItem('jsonCustoms', JSON.stringify(customs));
    }
}

/*
* FUNCTION : DisplayWhichHub()
* DESCRIPTION : This function will display the selected hub based off which
* button the user presses
* PARAMETERS : selectedHub : will be one of texts, textblocks, checks,
* lines, boxes, or customs ( Whichever button the user presses will display
* the relevant hub )
* RETURNS : N/A
*/
function DisplayWhichHub(selectedHub) {
    // Clear canvas before updating hub
    canvases.hubCanvas.clear();

    // Load in saved shapes
    //LoadSavedShapeFiles();

    // Save the selected hub, for when a user
    // takes a shape from the hub / saves / or deletes a shape
    // so it can know which hub to refresh
    saveSelectedHub = selectedHub;

    // Depending on selected hub, display the relevant canvas objects
    switch (selectedHub) {
        case 'texts':
            DisplayTextHub();
            break;
        case 'textblocks':
            DisplayTextBlockHub();
            break;
        case 'checks':
            DisplayCheckHub();
            break;
        case 'lines':
            DisplayLinesHub();
            break;
        case 'boxes':
            DisplayBoxesHub();
            break;
        case 'customs':
            DisplayCustomHub();
            break;
    }
}

/*
* FUNCTION : SaveShape()
* DESCRIPTION : This function will save a shape when the user has selected
* one on the canvas, then save it to the relevant array and then display the contents
* of the newly updated hub
* PARAMETERS : N/A
* RETURNS : N/A
*/
function SaveShape() {
    // Gets the selection
    var selected = GetSelection();
    var newShape = selected;

    // Prompt the user to get info about what the shape is 
    // so it can be saved to the correct place
    var whatShape =prompt("What shape is this? (text/check/line/box/custom)");
    
    // Clear canvas before updating hub
    canvases.hubCanvas.clear();

    // Save shape to appropriate array then display the hub
    if (selected) {
        switch (whatShape) {
            case 'text':
                texts.push(newShape);
                DisplayTextHub();
                break;
            case 'textblock':
                txtblocks.push(newShape);
                DisplayTextBlockHub();
            case 'check':
                checks.push(newShape);
                DisplayCheckHub();
                break;
            case 'line':
                lines.push(newShape);
                DisplayLinesHub();
                break;
            case 'box':
                boxes.push(newShape);
                DisplayBoxesHub();
                break;
            case 'custom':
                customs.push(newShape);
                DisplayCustomHub();
                break;
        }
    }

    // Update the shape file
    UpdateSavedShapeFile();
}

/*
* FUNCTION : DeleteSaved()
* DESCRIPTION : This function will delete a saved shape from the shape hub
* and then refresh & display the hub to reflect the change
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DeleteSaved() {
    // Get the selected shape
    var selected = GetSelection();

    // If theres a selected shape
    if ( selected ) {
        // Clear the canvas before updating
        canvases.hubCanvas.clear();
        
        if (saveSelectedHub === 'texts') {
            texts.forEach(function (item) {
                if (item === selected) {
                    texts.splice(texts.indexOf(item), 1); // Remove from array
                    DisplayTextHub(); // Redisplay hub
                }
            })
        }

        if (saveSelectedHub === 'textblocks') {
            txtblocks.forEach(function (item) {
                if (item === selected) {
                    txtblocks.splice(txtblocks.indexOf(item), 1);
                    DisplayTextBlockHub();
                }
            })
        }

        if (saveSelectedHub === 'checks') {
            checks.forEach(function (item) {
                if (item === selected) {
                    checks.splice(checks.indexOf(item), 1);
                    DisplayCheckHub();
                }
            })
        }

        if (saveSelectedHub === 'lines') {
            lines.forEach(function (item) {
                if (item === selected) {
                    lines.splice(lines.indexOf(item), 1);
                    DisplayLinesHub();
                }
            })
        }

        if (saveSelectedHub === 'boxes') {
            boxes.forEach(function (item) {
                boxes.splice(boxes.indexOf(item), 1);
                DisplayBoxesHub();
            })
        }

        if (saveSelectedHub === 'customs') {
            customs.forEach(function(item) { 
                customs.splice(customs.indexOf(item), 1);
                DisplayCustomHub();
            })
        }
    } else {
        alert("Nothing Selected!");
    }

    // Update the shape file
    UpdateSavedShapeFile();
}


/*
* FUNCTION : DisplayTextHub()
* DESCRIPTION : This function will create a default plain textbox
* and a default lined textbox, then load in any saved shapes and display
* them in the hub canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DisplayTextHub() {
    var left = 0;
    var top = 0;
    var fontSz = 20;
    var charSpace = 600;

    // Add a Default Plain
    var dText = new fabric.Textbox("Edit Text", {
        fontSize: fontSz,
        editable: false,
        maxLength: 0,
        backgroundColor: 'lightblue',

    });
    canvases.hubCanvas.add(dText);

    left = left + dText.getScaledWidth() / 2;
    top = canvases.hubCanvas.getHeight() / 2 - dText.getScaledHeight() / 2;

    dText.set({ left: left, top: top });
    dText.setCoords();

    left = left + dText.getScaledWidth() + 10;

    // Add a Default Lined
    var linedText = new fabric.LinedTextBox({
        text: 'EditMe',
        fontSize: fontSz,
        backgroundColor: 'lightblue',
        maxLength: 6,
        width: 140,
        splitByGrapheme: true,
    });

    canvases.hubCanvas.add(linedText);

    left = left + linedText.getScaledWidth() / 2;
    top = canvases.hubCanvas.getHeight() / 2 - linedText.getScaledHeight() / 2;

    charSpace = (linedText.getScaledWidth() - 15) * linedText.text.length;
    
    linedText.set({ left: left, top: top, charSpacing: charSpace });
    linedText.setCoords();

    left = left + linedText.getScaledWidth() + 10;

    // Load in Saved Textboxes
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        canvases.hubCanvas.add(text);

        top = canvases.hubCanvas.getHeight() / 2 - text.getScaledHeight() / 2;

        text.set({ left: left + text.getScaledWidth(), top: top });
        text.setCoords();

        left = left + text.getScaledWidth();
    }

    // Resizing
    var origWidth;
    var charBoundsOffset;

    // When the textbox is modified we want to get the current width to be 
    // the original width. We also want to get the charBounds for the 
    // first char as an offset for the resizing calculations
    linedText.on('modified', function(e) {
        origWidth = e.transform.target.width;
        if(e.transform.target.__charBounds.length != 0){
        charBoundsOffset = e.transform.target.__charBounds[0][0].width;
        }
    })

    linedText.on('resizing', onObjectResized);

    var resizedObj;
    var newCharSpace;
    function onObjectResized(e) {
        resizedObj = e.transform.target;

        if (resizedObj.getScaledWidth() !== origWidth) {
            
            if (resizedObj.getScaledWidth() > origWidth) {
                newCharSpace = (resizedObj.getScaledWidth() + charBoundsOffset) * resizedObj.text.length;
            } else {
                newCharSpace = (resizedObj.getScaledWidth() - charBoundsOffset) * resizedObj.text.length;
            }
        }

        canvases.canvas.on('mouse:up', function() {
            resizedObj.set({ charSpacing: newCharSpace });
            resizedObj.setCoords();
        })
    }
};

/*
* FUNCTION : DisplayTextHub()
* DESCRIPTION : This function will create a default plain textbblock
* then load in any saved shapes and display them in the hub canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DisplayTextBlockHub() {
    var left = 0;
    var top = 0;

    //Add a Default
    var newTextBlock = new fabric.TextBlock({
        text: 'Header',
        fill: 'black',
        editable: false
    });

    let lastHeight;
    function UpdateTextSize() {
        var controlPoint = newTextBlock.__corner;

        if(controlPoint && controlPoint != "mr" && controlPoint != "ml"){
            lastHeight = newTextBlock.height * newTextBlock.scaleY;
            
        }

        newTextBlock.set({
            height: lastHeight || newTextBlock.height,
            scaleY: 1,
        });
        canvases.canvas.renderAll();
    }

    newTextBlock.on("scaling", UpdateTextSize);
    newTextBlock.on("editing:entered", UpdateTextSize);
    newTextBlock.on("editing:exited", UpdateTextSize);
    newTextBlock.on("modified", UpdateTextSize);
    canvases.canvas.on('text:changed', UpdateTextSize);
    canvases.canvas.on('object:modified', UpdateTextSize);

    canvases.hubCanvas.add(newTextBlock);
    
    left = left + newTextBlock.getScaledWidth() / 2;
    top = canvases.hubCanvas.getHeight() / 2 - newTextBlock.getScaledHeight() / 2;

    newTextBlock.set({ left: left, top: top });
    newTextBlock.setCoords();

    // Load Saved Textblocks
    for (var i = 0; i < txtblocks.length; i++) {
        var txtblock = txtblocks[i];
        canvases.hubCanvas.add(txtblock);

        top = canvases.hubCanvas.getHeight() / 2 - text.getScaledHeight() / 2;

        txtblock.set({ left: left + txtblock.getScaledWidth(), top: top });
        txtblock.setCoords();

        left = left + txtbox.getScaledWidth();
    }
}

/*
* FUNCTION : DisplayCheckHub()
* DESCRIPTION : This function will create a default checkbox
* then load in any saved shapes and display them in the hub canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DisplayCheckHub() {
    var left = 0;

    // Add a Default
    var checkbox = GetCheckBox(0, 0);
    canvases.hubCanvas.add(checkbox);

    left = left + checkbox.getScaledWidth();

    checkbox.set({ left: left, top: canvases.hubCanvas.getHeight() / 2 });
    checkbox.setCoords();

    left = left + 10;

    // Load in Saved Checkboxes
    for (var i = 0; i < checks.length; i++) {
        var check = checks[i];
        canvases.hubCanvas.add(check);

        top = canvases.hubCanvas.getHeight() / 2 - check.getScaledHeight() / 2;

        check.set({ left: left + check.getScaledWidth(), top: top });
        check.setCoords();

        left = left + check.getScaledWidth();
    }
}

/*
* FUNCTION : GetCheckBox()
* DESCRIPTION : creates a new checkbox class
* PARAMETERS : N/A
* RETURNS : checkbox : a checkbox class object
*/
function GetCheckBox() {
    fabric.CheckBoxRect = fabric.util.createClass(fabric.Rect, {

        type: 'CheckBoxRect',

        initialize: function(options) {
            options || (options = {})
            this.callSuper('initialize', options);
            this.set('originX', options.originX || 'center');
            this.set('originY', options.originY || 'center');
            this.set('width', options.width || 50);
            this.set('height', options.height || 50);
            this.set('checked', options.checked || false);
            this.set('id', options.id || parseInt(Math.random() * Date.now()));
        },

        render: function(ctx) {
            this.callSuper('render', ctx);
            if (this.checked) {
                var coords = this.calcCoords();
                ctx.beginPath();
                ctx.moveTo(coords.tl.x, coords.tl.y);
                ctx.lineTo(coords.br.x, coords.br.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(coords.bl.x, coords.bl.y);
                ctx.lineTo(coords.tr.x, coords.tr.y);
                ctx.stroke();
            }
        },

        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                checked: this.get('checked'),
                id: this.get('id'),
            });
        },

    });

    fabric.CheckBoxRect.fromObject = function(object, callback) {
        return fabric.Object._fromObject('CheckBoxRect', object, callback);
    }

    fabric.CheckBoxCircle = fabric.util.createClass(fabric.Circle, {

        type: 'CheckBoxCircle',

        initialize: function(options) {
            options || (options = {});
            this.callSuper('initialize', options);
            this.set('originX', options.originX || 'center');
            this.set('originY', options.originY || 'center');
            this.set('width', options.width || 50);
            this.set('height', options.height || 50);
            this.set('radius', options.radius || 25);
            this.set('checked', options.checked || false);
            this.set('id', options.id || parseInt(Math.random() * Date.now()));
        },

        render: function(ctx) {
            this.callSuper('render', ctx);
            if (this.checked) {
                ctx.beginPath();
                ctx.moveTo(this.left + this.getRadiusX() * Math.cos(3 * Math.PI / 4), this.top + this.getRadiusX() * Math.sin(3 * Math.PI / 4));
                ctx.lineTo(this.left + this.getRadiusX() * Math.cos(7 * Math.PI / 4), this.top + this.getRadiusX() * Math.sin(7 * Math.PI / 4));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.left + this.getRadiusX() * Math.cos(5 * Math.PI / 4), this.top + this.getRadiusX() * Math.sin(5 * Math.PI / 4));
                ctx.lineTo(this.left + this.getRadiusX() * Math.cos(Math.PI / 4), this.top + this.getRadiusX() * Math.sin(Math.PI / 4));
                ctx.stroke();
            }
        },


        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                checked: this.get('checked'),
                id: this.get('id'),
            });
        },
    });

    fabric.CheckBoxCircle.fromObject = function(object, callback) {
        return fabric.Object._fromObject('CheckBoxCircle', object, callback);
    }

    var checkbox = new fabric.CheckBoxCircle({
        strokeWidth: 1,
        stroke: 'black',
        fill: 'lightblue',
        editable: false
    });


    return checkbox;
}

/*
* FUNCTION : DisplayLinesHub()
* DESCRIPTION : This function will create a default vertical and horizontal line
* then load in any saved shapes and display them in the hub canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DisplayLinesHub() {
    var left = 20;
    var top = 5;
    var bottom = 70;

    // Add a Default Vertical Line
    var vLine = new fabric.Line([left, bottom, left, top], {
            stroke: 'black',
            strokeWidth: 3,
            strokeUniform: true,
            lockScalingX: true,
            editable: false
        });

        vLine.setControlsVisibility({
            tr: false,
            br: false,
            mr: false,
            bl: false,
            tl: false,
            ml: false,
        });

    canvases.hubCanvas.add(vLine);

    left = left + vLine.getScaledWidth() + 10;
    top = canvases.hubCanvas.getHeight() / 2 - vLine.getScaledHeight() / 2;

    var mid = canvases.hubCanvas.getHeight() / 2;

    // Add a Default Horizontal Line
    var hLine = new fabric.Line(
        [top + 20, mid, bottom + top, mid], {
            stroke: 'black',
            strokeWidth: 3,
            strokeUniform: true,
            lockScalingY: true,
            editable: false
        });

    hLine.setControlsVisibility({
        tr: false,
        br: false,
        mb: false,
        bl: false,
        tl: false,
        mt: false,
    });

    canvases.hubCanvas.add(hLine);

    left = left + hLine.getScaledWidth();
    top = canvases.hubCanvas.getHeight() / 2 - hLine.getScaledHeight() / 2;

    hLine.set({ left: left + hLine.getScaledWidth(), top: top });
    hLine.setCoords();

    // Load in Saved Lines
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        canvases.hubCanvas.add(line);

        top = canvases.hubCanvas.getHeight() / 2 - line.getScaledHeight() / 2;

        line.set({ left: left + line.getScaledWidth(), top: top });
        line.setCoords();

        left = left + line.getScaledWidth();
    }
}


/*
* FUNCTION : DisplayBoxesHub()
* DESCRIPTION : This function will create a default box
* then load in any saved shapes and display them in the hub canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DisplayBoxesHub() {
    var left = 0;
    var top = 0;

    // Add a Default
    var dBox = new fabric.Rect({
        fill: 'transparent',
        opactiy: 0,
        width: 45,
        height: 45,
        strokeWidth: 3,
        stroke: 'black',
    });
    canvases.hubCanvas.add(dBox);

    top = canvases.hubCanvas.getHeight() / 2 - dBox.getScaledHeight() / 2;

    dBox.set({ left: left + dBox.getScaledWidth() / 2, top: top });
    dBox.setCoords();

    left = left + dBox.getScaledWidth() + 10;

    // Load in Saved Boxes
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        canvases.hubCanvas.add(box);

        top = canvases.hubCanvas.getHeight() / 2 - box.getScaledHeight() / 2;

        box.set({ left: left + box.getScaledWidth(), top: top });
        box.setCoords();

        left = left + box.getScaledWidth();
    }
}

/*
* FUNCTION : DisplayCustomHub()
* DESCRIPTION : This function will create a shape (textbox)
* then load in any saved shapes and display them in the hub canvas
* This is to house any shapes that dont quite fit into the other categories
* PARAMETERS : N/A
* RETURNS : N/A
*/
function DisplayCustomHub() {
    var left = 0;
    var top = 0;

    // Add a Default
    var dCustom = new fabric.Textbox("Edit Custom", {
        fontSize: 20,
        editable: false
    });
    canvases.hubCanvas.add(dCustom);

    top = canvases.hubCanvas.getHeight() / 2 - dCustom.getScaledHeight() / 2;

    dCustom.set({ left: left + dCustom.getScaledWidth() / 2, top: top });
    dCustom.setCoords();

    left = left + dCustom.getScaledWidth() + 10;

    CreateElasticCount();
    var checkboxIDTracker = [];
    var dElastic = new fabric.ElasticCounter({
        text: "Tests: 0",
        checkBoxList: checkboxIDTracker,
    });
    canvases.hubCanvas.add(dElastic);

    dElastic.set({left: left + dElastic.getScaledWidth()/2, top: top});
    dElastic.setCoords();

    left = left + dElastic.getScaledWidth() + 10;

    // Load in Saved Custom Shapes
    for (var i = 0; i < customs.length; i++) {
        var custom = customs[i];
        canvases.hubCanvas.add(custom);

        top = canvases.hubCanvas.getHeight() / 2 - custom.getScaledHeight() / 2;

        custom.set({ left: left + custom.getScaledWidth(), top: top });
        custom.setCoords();

        left = left + custom.getScaledWidth();
    }

}

/*
* FUNCTION : 
* DESCRIPTION : 
* PARAMETERS : 
* RETURNS : 
*/
function CreateLinedTextBox(){
    fabric.LinedTextBox = fabric.util.createClass(fabric.Textbox, {

        type: 'LinedTextBox',

        initialize: function(options){
            options || (options = {});
            this.callSuper('initialize', options.text, options);
            this.set('maxLength', options.maxLength || 0);
        },

        render: function(ctx){
            this.clearContextTop();
            this.callSuper('render', ctx);
            this.cursorOffsetsetCache = {};
            this.renderCursorOrSelection();
            if(this.maxLength >= 2){
                var coords = this.calcCoords();
                var cWidth = coords.br.x - coords.bl.x;
                var dWidth = cWidth/this.maxLength;
                var cHeight = Math.abs(coords.tl.y - coords.bl.y);
                ctx.strokeStyle= "#0000FF";
                for(let i = dWidth; i<cWidth; i+= dWidth){
                    ctx.beginPath();
                    ctx.moveTo(i + coords.bl.x, coords.bl.y);
                    ctx.lineTo(i + coords.bl.x, coords.tl.y + cHeight*0.35);
                    ctx.stroke();
                }
            }
        },

        toObject: function(){
            return fabric.util.object.extend(this.callSuper('toObject'), {
                maxLength: this.get('maxLength')
            });
        },

    });

    fabric.LinedTextBox.fromObject = function(object, callback) {
        return fabric.Object._fromObject('LinedTextBox', object, callback);
    }
}

/*
* FUNCTION : 
* DESCRIPTION : 
* PARAMETERS : 
* RETURNS : 
*/
function CreateTextBlock() {
    fabric.TextBlock = fabric.util.createClass(fabric.IText, {

        type: 'TextBlock',

        initialize: function(options) {
            options || (options = {});
            this.callSuper('initialize', options.text, options);
            this.set('outline', options.outline || false);
            this.set('orignX', options.originX || 'center');
            this.set('orignY', options.originY || 'center');
            this.set('left', options.left || 0);
            this.set('top', options.top || 0);
        },

        render: function(ctx) {
            this.clearContextTop();
            this.callSuper('render', ctx);
            this.cursorOffsetsetCache = {};
            this.renderCursorOrSelection();
            if (this.outline) {
                var coords = this.calcCoords();
                ctx.strokeStyle= "#000000";
                ctx.beginPath();
                ctx.moveTo(coords.tl.x, coords.tl.y);
                ctx.lineTo(coords.bl.x, coords.bl.y);
                ctx.lineTo(coords.br.x, coords.br.y);
                ctx.lineTo(coords.tr.x, coords.tr.y)
                ctx.closePath()
                ctx.stroke();
            }
        },


        toObject: function(){
            return fabric.util.object.extend(this.callSuper('toObject'), {
                outline: this.get('outline')
            });
        },
    });

    fabric.TextBlock.fromObject = function(object, callback) {
        return fabric.Object._fromObject('TextBlock', object, callback);
    }

}

/*
* FUNCTION : 
* DESCRIPTION : 
* PARAMETERS : 
* RETURNS : 
*/
function CreateCheckBoxRect() {
    fabric.CheckBoxRect = fabric.util.createClass(fabric.Rect, {

        type: 'CheckBoxRect',

        initialize: function(options) {
            options || (options = {})
            this.callSuper('initialize', options);
            this.set('originX', options.originX || 'center');
            this.set('originY', options.originY || 'center');
            this.set('width', options.width || 50);
            this.set('height', options.height || 50);
            this.set('checked', options.checked || false);
            this.set('id', options.id || parseInt(Math.random() * Date.now()));
            this.on('selected', CheckBoxEvent);
        },

        render: function(ctx) {
            this.callSuper('render', ctx);
            if (this.checked) {
                var coords = this.calcCoords();
                ctx.lineWidth = 3;
                ctx.strokeStyle= "#0000FF";
                ctx.beginPath();
                ctx.moveTo(coords.tl.x, coords.tl.y);
                ctx.lineTo(coords.br.x, coords.br.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(coords.bl.x, coords.bl.y);
                ctx.lineTo(coords.tr.x, coords.tr.y);
                ctx.stroke();
            }
        },


        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                checked: this.get('checked'),
                id: this.get('id'),
            });
        },

    });

    fabric.CheckBoxRect.fromObject = function(object, callback) {
        return fabric.Object._fromObject('CheckBoxRect', object, callback);
    }

    function CheckBoxEvent(checkbox){
        var count = 0;
        var count2 = 0;
        var count3 = 0;
        var tempobject;
        var tempobject2;

        if (checkbox.target.checked) {
            checkbox.target.set('checked', false);

            while (count < grouplength) {

                while (count2 < groupquestions[count].length) {
                    tempobject = groupquestions[count];
                    if (tempobject[count2] === checkbox.target) {
                        while (count3 < groupquestions[count].length) {
                            if (tempobject[count3].type === "group") {
                                tempobject[count3].mergeValue = tempobject[count3].mergeValue - tempobject[count2].questionValue;
                                tempobject2 = tempobject[count3];
                                updateRating(tempobject2, count, count3)
                            }
                            count3 = count3 + 1;
                        }
                    }
                    count2 = count2 + 1;
                }
                count = count + 1;
            }

        } else {
            checkbox.target.set('checked', true);

            while (count < grouplength) {
                while (count2 < groupquestions[count].length) {
                    tempobject = groupquestions[count];
                    if (tempobject[count2] === checkbox.target) {
                        while (count3 < groupquestions[count].length) {
                            if (tempobject[count3].type === "group") {
                                tempobject[count3].mergeValue = tempobject[count3].mergeValue + tempobject[count2].questionValue;
                                tempobject2 = tempobject[count3];
                                updateRating(tempobject2, count, count3)
                            }
                            count3 = count3 + 1;
                        }
                    }
                    count2 = count2 + 1;
                }
                count = count + 1;
            }
        }
        canvases.canvas.fire('object:modified', checkbox.target);
        checkbox.target.set('dirty', true);
        canvases.canvas.renderAll();
    }
}

/*
* FUNCTION : 
* DESCRIPTION : 
* PARAMETERS : 
* RETURNS : 
*/
function CreateCheckBoxCircle() {
    fabric.CheckBoxCircle = fabric.util.createClass(fabric.Circle, {

        type: 'CheckBoxCircle',

        initialize: function(options) {
            options || (options = {});
            this.callSuper('initialize', options);
            this.set('originX', options.originX || 'center');
            this.set('originY', options.originY || 'center');
            this.set('width', options.width || 50);
            this.set('height', options.height || 50);
            this.set('radius', options.radius || 25);
            this.set('checked', options.checked || false);
            this.set('id', options.id || parseInt(Math.random() * Date.now()));
        },

        render: function(ctx) {
            this.callSuper('render', ctx);
            if (this.checked) {
                ctx.lineWidth = 3;
                ctx.strokeStyle= "#0000FF";
                ctx.beginPath();
                ctx.moveTo(this.left + this.getRadiusX() * Math.cos(3 * Math.PI / 4), this.top + this.getRadiusX() * Math.sin(3 * Math.PI / 4));
                ctx.lineTo(this.left + this.getRadiusX() * Math.cos(7 * Math.PI / 4), this.top + this.getRadiusX() * Math.sin(7 * Math.PI / 4));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.left + this.getRadiusX() * Math.cos(5 * Math.PI / 4), this.top + this.getRadiusX() * Math.sin(5 * Math.PI / 4));
                ctx.lineTo(this.left + this.getRadiusX() * Math.cos(Math.PI / 4), this.top + this.getRadiusX() * Math.sin(Math.PI / 4));
                ctx.stroke();
            }
        },

        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                checked: this.get('checked'),
                id: this.get('id'),
            });
        },
    });

    fabric.CheckBoxCircle.fromObject = function(object, callback) {
        return fabric.Object._fromObject('CheckBoxCircle', object, callback);
    }

    function CheckBoxEvent(checkbox){
        var count = 0;
        var count2 = 0;
        var count3 = 0;
        var tempobject;
        var tempobject2;

        if (checkbox.target.checked) {
            checkbox.target.set('checked', false);

            while (count < grouplength) {

                while (count2 < groupquestions[count].length) {
                    tempobject = groupquestions[count];
                    if (tempobject[count2] === checkbox.target) {
                        while (count3 < groupquestions[count].length) {
                            if (tempobject[count3].type === "group") {
                                tempobject[count3].mergeValue = tempobject[count3].mergeValue - tempobject[count2].questionValue;
                                tempobject2 = tempobject[count3];
                                updateRating(tempobject2, count, count3)
                            }
                            count3 = count3 + 1;
                        }
                    }
                    count2 = count2 + 1;
                }
                count = count + 1;
            }

        } else {
            checkbox.target.set('checked', true);

            while (count < grouplength) {
                while (count2 < groupquestions[count].length) {
                    tempobject = groupquestions[count];
                    if (tempobject[count2] === checkbox.target) {
                        while (count3 < groupquestions[count].length) {
                            if (tempobject[count3].type === "group") {
                                tempobject[count3].mergeValue = tempobject[count3].mergeValue + tempobject[count2].questionValue;
                                tempobject2 = tempobject[count3];
                                updateRating(tempobject2, count, count3)
                            }
                            count3 = count3 + 1;
                        }
                    }
                    count2 = count2 + 1;
                }
                count = count + 1;
            }
        }
        canvases.canvas.fire('object:modified', checkbox.target);
        checkbox.target.set('dirty', true);
        canvases.canvas.renderAll();
    }
}

// FUNCTION : CreateElasticCount
// DESCRIPTION :
// Creates the Elastic Counter Object
// PARAMETERS :
// N/A
// RETURN
// N/A
function CreateElasticCount(){
    fabric.ElasticCounter = fabric.util.createClass(fabric.IText,{

        type: 'ElasticCount',

        initialize: function(options){
            options || (options = {})
            this.callSuper('initialize', options.text, options);
            this.set('checkboxList', options.checkboxList || [] );
            this.set('counter', options.counter || 0);
            canvases.canvas.on('object:modified', UpdateCount);
        },
        
        toObject: function(){
            return fabric.util.object.extend(this.callSuper('toObject'), {
                checkboxList: this.get('checkboxList'),
                counter: this.get('counter'),
            });
        },
    });

    
    function UpdateCount(checkbox){
        if(!checkbox.hasOwnProperty('id')) return;
        var testTracker = canvas.getObjects();
        var counter;
        testTracker.forEach(function(obj)
        {
            if(obj.hasOwnProperty('checkboxList')){
                if(obj.checkboxList.includes(checkbox.id)){
                    counter = obj;
                }
            }
        })
        if(counter == null) return;
        if(!Object.values(counter.checkboxList).includes(checkbox.id)) return;

        if(checkbox.checked){
            counter.set('counter', counter.counter + 1);
            counter.set({text: `Tests: ${counter.counter}`});
        }else{
            counter.set('counter', counter.counter - 1);
            counter.set({text: `Tests: ${counter.counter}`});
            
        }
        canvas.renderAll();
    }

    fabric.ElasticCounter.fromObject = function(object, callback){
        return fabric.Object._fromObject('ElasticCounter', object, callback);
    }
}
