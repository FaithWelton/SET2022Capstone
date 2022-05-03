/* 
* FILE : Designer.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-01-31
* DESCRIPTION :
* Functionality for the Designer Page
*/

var selectedEle = "";
var canvas, hubCanvas, canvases;
var rectButton;
var groupquestions;
var grouplength;
var object;
var clipboard = null;

//Object is used for the general settings of the canvas snapping
settings = {
    objectSnap: false,
    edgeDetection: 2
};

//
// FUNCTION : SetEdgeDetection
// DESCRIPTION :
// Sets up the edge detection
// PARAMETERS :
// N/A
// RETURNS :
// N/A
function SetEdgeDetection() {
    var edgeElement = document.getElementById("edgeDetection");
    edgeElement.value = settings.edgeDetection;
}

//
// FUNCTION : SetObjectSnap
// DESCRIPTION :
// Sets up the object snap
// PARAMETERS :
// N/A
// RETURNS :
// N/A
function SetObjectSnap() {
    var snapElement = document.getElementById("snapObject");
    snapElement.checked = settings.objectSnap;
}

//
// FUNCTION : EdgeDetectionUpdate
// DESCRIPTION :
// Event update upon Edge Detection
// PARAMETERS :
// event- object containing neccarry data on the object that activated the event
// RETURNS :
// N/A
function EdgeDetectionUpdate(event){
    settings.edgeDetection = parseInt(event.target.value);
}

//
// FUNCTION : ObjectSnapUpdate
// DESCRIPTION :
// Event update upon Object Snap
// PARAMETERS :
// event- object containing neccarry data on the object that activated the event
// RETURN
// N/A
function ObjectSnapUpdate(event){
    if(event.target.checked)
    {
        settings.objectSnap = true;
    }else{
        settings.objectSnap = false;
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
            canvas.on('object:modified', UpdateCount);
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

// FUNCTION : ClearSettingsDiv
// DESCRIPTION :
// Clears the settings div
// PARAMETERS :
// N/A
// RETURN
// N/A
function ClearSettingsDiv() {
    document.getElementById("fontSettings").style.display = "none";
    document.getElementById("fillSetting").style.display = "none";
    document.getElementById("bgSetting").style.display = "none";
    document.getElementById("fontSizeSetting").style.display = "none";
    document.getElementById("inputLimitSetting").style.display = "none";
    document.getElementById("questionValSetting").style.display = "none";
    document.getElementById("textSpaceSetting").style.display = "none";
    document.getElementById("txtOutlineSetting").style.display = "none";
    document.getElementById("checkShapeSetting").style.display = "none";
    document.getElementById("strokeWidSetting").style.display = "none";
    document.getElementById("saveShapeSetting").style.display = "none";
}

// FUNCTION : DomContentLoaded
// DESCRIPTION :
// Activates when the HTML is loading
// PARAMETERS :
// event- object containing neccarry data on the object that activated the event
// RETURN
// N/A
document.addEventListener('DOMContentLoaded', (event) => {
    canvases = {
        canvas : new fabric.Canvas('c'),
        hubCanvas : new fabric.Canvas('hubC')
    };

    CreateTextBlock();
    CreateCheckBoxRect();
    CreateCheckBoxCircle();
    CreateLinedTextBox();

    CreateElasticCount();

    SetEdgeDetection();
    SetObjectSnap();

    groupquestions = [];
    grouplength = 0;

    //Event for selecting elements on the canvas when changing from another element
    canvases.canvas.on("selection:updated", function(object) {
        if (object.target != null) {
            ClearSettingsDiv();
            BuildSettingDiv(canvases.canvas.getActiveObject());
            BuildDebugSettingDiv(canvases.canvas.getActiveObject());
        }
    });

    //Event for when an element is selected from an unselected state
    canvases.canvas.on("selection:created", function(object) {
        if (object.target != null) {
            ClearSettingsDiv();
            BuildSettingDiv(canvases.canvas.getActiveObject());
            BuildDebugSettingDiv(canvases.canvas.getActiveObject());
        }
    });

    //When no token is selected it will clear the settings div
    canvases.canvas.on("selection:cleared", function() {
        ClearSettingsDiv();
        //var settingsDiv = document.getElementById("settings");
        var debugsettingsDiv = document.getElementById("debugger-settings");
        //settingsDiv.innerHTML = "";
        debugsettingsDiv.innerHTML = "";
    })

    canvases.canvas.on("object:scaling", function(event){
        var object = event.target;
        BuildDebugSettingDiv(object);
    });

    canvases.canvas.on("object:moving", function(event) {
        var object = event.target;
        object.setCoords();
        BuildDebugSettingDiv(object);
        //Lines don't handle left and top the same way so will be a special case to handle
        if(object.type == "activeSelection") {
            if(object.left < settings.edgeDetection){
                object.left = 0;
                return;
            }

            if(object.left + object.width > canvases.canvas.getWidth() - settings.edgeDetection){
                object.left = canvases.canvas.getWidth() - object.width;
                return;
            }

            if(object.top < settings.edgeDetection){
                object.top = 0;
                return;
            }

            if(object.top + object.height > canvases.canvas.getHeight() - settings.edgeDetection){
                object.top = canvases.canvas.getHeight() - object.height;
                return;
            }
        } else if (object.type == "line") {

            if(object.left < settings.edgeDetection){
                object.left = 0;
            }

            if(object.left + object.width > canvases.canvas.getWidth() - settings.edgeDetection){
                object.left = canvases.canvas.getWidth() - (object.strokeWidth + object.width);
            }

            if(object.top < settings.edgeDetection){
                object.top = 0;
            }

            if(object.top + object.height > canvases.canvas.getHeight() - settings.edgeDetection){
                object.top = canvases.canvas.getHeight() - (object.strokeWidth + object.height);
            }
        } else {
            //Sets the limit of the tokens on the canvas
            //As the OriginX and OriginxY are set to center
            //Have to remember the left, top are at the ceneter
            if ((object.left < settings.edgeDetection) && settings.objectSnap) {
                object.left = 0;
            }

            if ((object.top < settings.edgeDetection) && settings.objectSnap) {
                object.top = 0;
            }

            if ((object.getScaledWidth() + object.left) > (canvases.canvas.getWidth() - settings.edgeDetection) && settings.objectSnap) {
                object.left = canvases.canvas.getWidth() - object.getScaledWidth();
            }

            if ((object.getScaledHeight() + object.top) > (canvases.canvas.getHeight() - settings.edgeDetection) && settings.objectSnap) {
                object.top = canvases.canvas.getHeight() - object.getScaledHeight();
            }
        }

        //Snap to for each token on the canvas
        canvases.canvas.forEachObject(function(target) {
            aObject = canvases.canvas.getActiveObject();
            //Handle cases when comparing against the token being moved against the scope of the canvas
            if (target == aObject) {
                //Token is within 10 pixels of the middle height of the canvas 
                if (aObject.top > canvases.canvas.getHeight() / 2 - 5 && aObject.top < canvases.canvas.getHeight() / 2 + 5) {
                    var line = new fabric.Line(
                        [0, aObject.top, canvases.canvas.getWidth(), aObject.top], {
                            stroke: 'black',
                            strokeWidth: 1,
                            id: 'midline'
                        });

                    canvases.canvas.add(line);
                    canvases.canvas.renderAll();
                }
                //Token is within 10 pixels of the middle width of the canvas
                if (aObject.left > canvases.canvas.getWidth() / 2 - 5 && aObject.left < canvases.canvas.getWidth() / 2 + 5) {
                    
                    var line = new fabric.Line(
                        [aObject.left, 0, aObject.left, canvases.canvas.getHeight()], {
                            stroke: 'black',
                            strokeWidth: 1,
                            id: 'midline'
                        });

                    canvases.canvas.add(line);
                    canvases.canvas.renderAll();
                }

                return;
            }

            if (target.id == 'midline') {
                canvases.canvas.remove(target);
                return;
            }
            //When the token's right side and the target tokens right side align
            if (aObject.oCoords.tr.x > target.oCoords.tr.x - 1 && aObject.oCoords.tr.x < target.oCoords.tr.x + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.tr.x, aObject.oCoords.mr.y,
                        aObject.oCoords.tr.x, target.oCoords.mr.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: 'midline'
                    });
                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }
            //When the token's left side and the target tokens left side align
            if (aObject.oCoords.tl.x > target.oCoords.tl.x - 1 && aObject.oCoords.tl.x < target.oCoords.tl.x + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.tl.x, aObject.oCoords.mr.y,
                        aObject.oCoords.tl.x, target.oCoords.mr.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: 'midline'
                    });
                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }
            //When the tokens left side and the targets right side align
            if (aObject.oCoords.tl.x > target.oCoords.tr.x - 1 && aObject.oCoords.tl.x < target.oCoords.tr.x + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.tl.x, aObject.oCoords.mr.y,
                        aObject.oCoords.tl.x, target.oCoords.mr.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: "midline"
                    }
                );

                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }

            //When the token right side and the targets left side align
            if (aObject.oCoords.tr.x > target.oCoords.tl.x - 1 && aObject.oCoords.tr.x < target.oCoords.tl.x + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.tr.x, aObject.oCoords.mr.y,
                        aObject.oCoords.tr.x, target.oCoords.mr.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: "midline",
                    }
                );

                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }

            //When token top is align with target top align
            if (aObject.oCoords.tl.y > target.oCoords.tl.y - 1 && aObject.oCoords.tl.y < target.oCoords.tl.y + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.mt.x, aObject.oCoords.tl.y,
                        target.oCoords.mt.x, aObject.oCoords.tl.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: "midline",
                    }
                );

                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }

            //When token bottom is align with target bottom
            if (aObject.oCoords.bl.y > target.oCoords.bl.y - 1 && aObject.oCoords.bl.y < target.oCoords.bl.y + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.mb.x, aObject.oCoords.bl.y,
                        target.oCoords.mb.x, aObject.oCoords.bl.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: 'midline',
                    }
                );

                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }

            //Token top and target bottom
            if (aObject.oCoords.tl.y > target.oCoords.bl.y - 1 && aObject.oCoords.tl.y < target.oCoords.bl.y + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.mb.x, aObject.oCoords.tl.y,
                        target.oCoords.mb.x, aObject.oCoords.tl.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: 'midline',
                    }
                );

                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }
            //Token bottom and target top
            if (aObject.oCoords.bl.y > target.oCoords.tl.y - 1 && aObject.oCoords.bl.y < target.oCoords.tl.y + 1) {

                var line = new fabric.Line(
                    [aObject.oCoords.mb.x, aObject.oCoords.bl.y,
                        target.oCoords.mb.x, aObject.oCoords.bl.y
                    ], {
                        stroke: 'black',
                        strokeWidth: 1,
                        id: 'midline',
                    }
                );

                canvases.canvas.add(line);
                canvases.canvas.renderAll();
            }

            if(aObject.type == "activeSelection"){
                return;
            }

            //Adding a false to object snapping to objects atm - MAKING A GENERAL SETTINGS
            if (Math.abs(aObject.oCoords.tr.x - target.oCoords.tl.x) < settings.edgeDetection && target.id != 'midline' && settings.objectSnap) {
                aObject.left = target.left - aObject.getScaledWidth();
            }

            if (Math.abs(aObject.oCoords.tl.x - target.oCoords.tr.x) < settings.edgeDetection && target.id != 'midline' && settings.objectSnap) {
                aObject.left = (target.left + target.getScaledWidth());
            }

            if (Math.abs(aObject.oCoords.br.y - target.oCoords.tr.y) < settings.edgeDetection && target.id != 'midline' && settings.objectSnap) {
                aObject.top = target.top - aObject.getScaledHeight();
            }

            if (Math.abs(aObject.oCoords.tr.y - target.oCoords.br.y) < settings.edgeDetection && target.id != 'midline' && settings.objectSnap) {
                aObject.top = (target.top + target.getScaledHeight());
            }
        })
    });

    canvases.canvas.on('object:moved', function(){
        canvases.canvas.forEachObject(function (target){
            if(target.id == "midline"){
                canvases.canvas.remove(target);
                return;
            }
        })
    });

    keyShortcuts = {
        ctrlDown: false,
        cDown: false,
        vDown: false,
        copyLifted: true,
        pasteLifted: true,
    };

    document.addEventListener("keydown", function(event){
        switch(event.key){
            //ctrl
            case "Control" || "Command":
                keyShortcuts.ctrlDown = true;
                break;
            //v
            case "v":
                keyShortcuts.vDown = true;
                break;
            //c
            case "c":
                keyShortcuts.cDown = true;
                break;
            default:
                break;
            
        }
        CopyPasteHandle(event, keyShortcuts);
    });

    document.addEventListener("keyup", function(event){
        switch(event.key){
            //ctrl
            case "Control" || "Command":
                keyShortcuts.ctrlDown = false;
                keyShortcuts.copyLifted = true;
                keyShortcuts.pasteLifted = true;
                break;
            //v
            case "v":
                keyShortcuts.vDown = false;
                keyShortcuts.pasteLifted = true;
                break;
            //c
            case "c":
                keyShortcuts.cDown = false;
                keyShortcuts.copyLifted = true;
                break;
            default:
                break;
        }
        CopyPasteHandle(event, keyShortcuts);
    })

    // Ability to undo/redo actions
    canvases.canvas.on(
        'object:modified', function () {
            UpdateModifications(true);
        },
        'object:added', function () {
            UpdateModifications(true);
    });

    // Dragging from hub to canvas
    var activeThing;
    var initialCanvas = hubCanvas;
    canvases.hubCanvas.on('mouse:down', function() {
        if (this.getActiveObject()) {
            activeThing = $.extend({}, this.getActiveObject());

            document.getElementById("delshape").disabled = false;

            initialCanvas = this.lowerCanvasEl.id;
        }
    });

    $(document).on('mouseup', function(evt) {
        if (evt.target.localName === 'canvas' && initialCanvas)
        {
            var canvasID = $(evt.target).siblings().attr('id');
            if (canvasID !== "hubC") {
                var newThing = activeThing;
                canvases.canvas.add(newThing);

                //AddTag(newThing); ?

                if(newThing.type == "ElasticCount"){
                    var checkboxIDTracker = [];

                    var checkObjects = canvases.canvas.getActiveObjects();
                    checkObjects.forEach(object => {
                        checkboxIDTracker.push(object.id);
                    });
                    newThing.set('checkboxList', checkboxIDTracker);
                }

                if(newThing.type == "textbox"){
                    newThing.toObject = (function(toObject) {
                        return function(){
                            return fabric.util.object.extend(toObject.call(this), {
                                maxLength: this.maxLength,
                                lasH: this.lasH,
                            });
                        };
                    })(newThing.toObject);
                    
                    let lastHeight;
                    function UpdateTextSize() {
                        var controlPoint = newThing.__corner;
                        
                        if(controlPoint && controlPoint != "mr" && controlPoint != "ml"){
                            lastHeight = newThing.height * newThing.scaleY;
                         
                        }
                        
                
                        newThing.set({
                            height: lastHeight || newThing.height,
                            scaleY: 1,
                        });

                        newThing.lasH = newThing.height;
                        canvases.canvas.renderAll();
                    }
                
                    canvases.canvas.on("object:resizing", UpdateTextSize);
                    newThing.on("editing:entered", UpdateTextSize);
                    newThing.on("editing:exited", UpdateTextSize);
                    newThing.on("modified", UpdateTextSize);
                    canvases.canvas.on('text:changed', UpdateTextSize);
                    canvases.canvas.on('object:modified', UpdateTextSize);
                }
                if(newThing.type == "textbox" || newThing.type == "CheckBoxRect" || newThing.type == "CheckBoxCircle" || newThing.type == "LinedTextBox")
                {
                    
                    newThing.toObject = (function(toObject) {
                        return function(){
                            return fabric.util.object.extend(toObject.call(this), {
                                typeOfQuestion: this.typeOfQuestion
                            });
                        };
                    })(newThing.toObject);
                }
        
                var mousePos = canvases.canvas.getPointer(evt);
                newThing.set({ left: mousePos.x - (activeThing.getScaledWidth() / 2), top: mousePos.y -(activeThing.getScaledHeight() / 2), editable: true });
                newThing.setCoords();

                // Redraw Hub
                if (saveSelectedHub) {
                    document.getElementById("delshape").disabled = true;
                    DisplayWhichHub(saveSelectedHub);
                }
                canvases.canvas.renderAll();
            }
        }

        initialCanvas = '';
        activeThing = {};
    })
});

/*
* FUNCTION      : CopyPasteHandle
* 
* DESCRIPTION   : This function handle the logic for only allowing
*
* PARAMETERS    : object event           : keyup or keydown event
*               : object keyShortcuts    : current state of ctrl, c, & v keys
*
* RETURNS       : Void
*/
function CopyPasteHandle(event, keyShortcuts){
    if(keyShortcuts.ctrlDown && keyShortcuts.cDown && keyShortcuts.copyLifted){
        CopyToken(event);
        keyShortcuts.copyLifted = false;
    }
    if(keyShortcuts.ctrlDown && keyShortcuts.vDown && keyShortcuts.pasteLifted){
        PasteToken(event);
        keyShortcuts.pasteLifted = false;
    }
}

/*
* FUNCTION      : BuildSettingDiv
* 
* DESCRIPTION   : Handler of dynamic display of setting for selected token
*
* PARAMETERS    : object object    : Token that has been selected by user
*
* RETURNS       : Void
*/
function BuildSettingDiv(object) {
    //const settingsDiv = document.getElementById("settings");
    //settingsDiv.innerHTML = "";
    var objectType = object.type;

    document.getElementById("saveShapeSetting").style.display = "block";

    switch (objectType) {
        case "line":
            BuildLineSetting(object);
            break;
        case "textbox":
            BuildTextBoxSetting(object);
            break;
        case "CheckBoxRect":
        case "CheckBoxCircle":
            BuildCheckBoxSetting(object);
            break;
        case "TextBlock":
            BuildTextBlockSetting(object);
            break;
        case "LinedTextBox":
            BuildLinedTextBoxSetting(object);
        default:
            break;

    }
}
/*
* FUNCTION      : SettingLineBreak
* 
* DESCRIPTION   : Builds the HTML Element to add to the Settings to add spacing to all previous settings
*
* PARAMETERS    : HTMLElement settingsDiv    : HTML div to place setting options
*
* RETURNS       : Void
*/
function SettingLineBreak(settingsDiv){
    var lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
}

/*
* FUNCTION      : BuildLineSetting
* 
* DESCRIPTION   : Settings for Line Tokens
*
* PARAMETERS    : HTMLElement settingsDiv    : HTML div to place setting options
*               : object object              : Token that has been selected by user
*
* RETURNS       : Void
*/
function BuildLineSetting(object) {
    // Line Stroke Width
    document.getElementById("strokeWidSetting").style.display = "block";
    var strokeWeight = document.getElementById("strokeWidth");
    strokeWeight.value = object.strokeWidth;

    //SettingStrokeWidth(settingsDiv, object);
}

/*
* FUNCTION      : BuildTextBoxSetting
* 
* DESCRIPTION   : Settings for TextBox Tokens
*
* PARAMETERS    : HTMLElement settingsDiv    : HTML div to place setting options
*               : object object              : Token that has been selected by user
*
* RETURNS       : Void
*/
function BuildTextBoxSetting(object) {
    // Font Settings (Italic, Bold, Underline)
    document.getElementById("fontSettings").style.display = "block";
    var fontStyleInput = document.getElementById("fontStyle");
    fontStyleInput.value = object.fontStyle;
    var fontWeightInput = document.getElementById("fontWeight");
    fontWeightInput.value = object.fontWeight;
    var underlineInput = document.getElementById("underline");
    underlineInput.value = object.underline;

    // Fill Setting (Text Colour)
    document.getElementById("fillSetting").style.display = "block";
    var fillInput = document.getElementById("fillColour");
    fillInput.value = `#${new fabric.Color(object.fill).toHex()}`;

    // Background Colour Setting
    document.getElementById("bgSetting").style.display = "block";
    var backgroundInput = document.getElementById("backgroundColour");
    backgroundInput.value = `#${new fabric.Color(object.backgroundColor).toHex()}`;

    // Font Size Setting
    document.getElementById("fontSizeSetting").style.display = "block";
    var fontSizeInput = document.getElementById("fontSize");
    fontSizeInput.value = object.fontSize;

    // Character Limit Setting
    document.getElementById("inputLimitSetting").style.display = "block";
    var inputLimit = document.getElementById("characterLimit")
    inputLimit.value = object.maxLength;

    // Question Value Setting
    document.getElementById("questionValSetting").style.display = "block";
    var questionField = document.getElementById("questionInput");
    questionField.value = object.typeOfQuestion;
}

/*
* FUNCTION      : BuildTextBlockSetting
* 
* DESCRIPTION   : Settings for TextBlock Tokens
*
* PARAMETERS    : HTMLElement settingsDiv    : HTML div to place setting options
*               : object object              : Token that has been selected by user
*
* RETURNS       : Void
*/
function BuildTextBlockSetting(object) {
    // Font Settings (Italic, Bold, Underline)
    document.getElementById("fontSettings").style.display = "block";
    var fontStyleInput = document.getElementById("fontStyle");
    fontStyleInput.value = object.fontStyle;
    var fontWeightInput = document.getElementById("fontWeight");
    fontWeightInput.value =object.fontWeight;
    var underlineInput = document.getElementById("underline");
    underlineInput.value = object.underline;

    // Fill Setting (Text Colour)
    document.getElementById("fillSetting").style.display = "block";
    var fillInput = document.getElementById("fillColour");
    fillInput.value = `#${new fabric.Color(object.fill).toHex()}`;

    // Background Colour Setting
    document.getElementById("bgSetting").style.display = "block";
    var backgroundInput = document.getElementById("backgroundColour");
    backgroundInput.value = `#${new fabric.Color(object.backgroundColor).toHex()}`;

    // Font Size Setting
    document.getElementById("fontSizeSetting").style.display = "block";
    var fontSizeInput = document.getElementById("fontSize");
    fontSizeInput.value = object.fontSize;

    // Text Outline Setting
    document.getElementById("txtOutlineSetting").style.display = "block";
    var outlineBox = document.getElementById("outlineBox");
    if (object.outline) {
        outlineBox.checked = true;
    } else {
        outlineBox.checked = false;
    }
}

/*
* FUNCTION      : BuildCheckBoxSetting
* 
* DESCRIPTION   : Settings for CheckBox Tokens
*
* PARAMETERS    : HTMLElement settingsDiv    : HTML div to place setting options
*               : object object              : Token that has been selected by user
*
* RETURNS       : Void
*/
function BuildCheckBoxSetting(object) {//!??
    // Question Value Setting
    document.getElementById("questionValSetting").style.display = "block";
    var questionField = document.getElementById("questionInput");
    questionField.value = object.typeOfQuestion;

    // Checkbox Shape Setting
    document.getElementById("checkShapeSetting").style.display = "block";

    //SettingCheckboxChange(settingsDiv, object);
    //SettingTypeOfQuestion(settingsDiv, object);
}

function SetCheckShape(shape) {
    if (shape === "CheckBoxCircle") {
        UpdateCheckBoxShape("CheckBoxCircle");
        document.getElementById("checkShapeSettingValue").value = "Circle";
    } else {
        UpdateCheckBoxShape("CheckBoxRect");
        document.getElementById("checkShapeSettingValue").value = "Rectangle";
    }
}

/*
* FUNCTION      : BuildLinedTextBoxSetting
* 
* DESCRIPTION   : Settings for LinedTextBox Tokens
*
* PARAMETERS    : HTMLElement settingsDiv    : HTML div to place setting options
*               : object object              : Token that has been selected by user
*
* RETURNS       : Void
*/
function BuildLinedTextBoxSetting(object){
    // Font Settings (Italic, Bold, Underline)
    document.getElementById("fontSettings").style.display = "block";
    var fontStyleInput = document.getElementById("fontStyle");
    fontStyleInput.value = object.fontStyle;
    var fontWeightInput = document.getElementById("fontWeight");
    fontWeightInput.value = object.fontWeight;
    var underlineInput = document.getElementById("underline");
    underlineInput.value = object.underline;

    // Fill Setting (Text Colour)
    document.getElementById("fillSetting").style.display = "block";
    var fillInput = document.getElementById("fillColour");
    fillInput.value = `#${new fabric.Color(object.fill).toHex()}`;

    // Background Colour Setting
    document.getElementById("bgSetting").style.display = "block";
    var backgroundInput = document.getElementById("backgroundColour");
    backgroundInput.value = `#${new fabric.Color(object.backgroundColor).toHex()}`;

    // Font Size Setting
    document.getElementById("fontSizeSetting").style.display = "block";
    var fontSizeInput = document.getElementById("fontSize");
    fontSizeInput.value = object.fontSize;

    // Input Limit Setting
    document.getElementById("inputLimitSetting").style.display = "block";
    var inputLimit = document.getElementById("characterLimit")
    inputLimit.value =  object.maxLength;

    // Question Value Setting
    document.getElementById("questionValSetting").style.display = "block";
    var questionField = document.getElementById("questionInput");
    questionField.value = object.typeOfQuestion;

    // Text Spacing Setting
    document.getElementById("textSpaceSetting").style.display = "block";
    var textSpacing = document.getElementById("textSpacing");
    textSpacing.value = object.charSpacing;
}

//
// FUNCTION : BuildDebugSettingsDiv
// DESCRIPTION :
// This function checks the type of object is selected and sends it to designated function
// PARAMETERS :
// object : the object that is selected
// RETURNS :
// N/A
function BuildDebugSettingDiv(object) {
    //grab the div where the change will happen
    const debugsettingsDiv = document.getElementById("debugger-settings");

    //empty out the div
    debugsettingsDiv.innerHTML = "";
    var objectType = object.type;

    // check the object type
    switch (objectType) {
        case "line":
            BuilldDebugLineSetting(debugsettingsDiv, object);
            break;
        case "textbox":
        case "LinedTextBox":
            BuildDebugTextBoxSetting(debugsettingsDiv, object);
            break;
        case "CheckBoxRect":
        case "CheckBoxCircle":
            BuildDebugCheckBoxSetting(debugsettingsDiv, object);
            break;
        case "TextBlock":
            BuildDebugTextBlockSetting(debugsettingsDiv, object);
            break;
        case "group":
            BuildDebugRatingScale(debugsettingsDiv, object);
            break;
        default:
            break;
    }
}

//
// FUNCTION : BuildDebugTextBlockSetting
// DESCRIPTION :
// This function sets the debug values for a TextBlock object
// PARAMETERS :
// settingsDiv : the debug settings div
// object : the object that is selected
// RETURNS :
// N/A
function BuildDebugTextBlockSetting(settingsDiv, object) {
    // enters a label for Type
    var label = document.createElement('label');
    label.innerHTML = "Type : Text Block";
    settingsDiv.appendChild(label);
    var lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Text
    label = document.createElement('label');
    label.innerHTML = "Text : " + object.text;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Left
    label = document.createElement('label');
    label.innerHTML = "Left : " + object.left.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Top
    label = document.createElement('label');
    label.innerHTML = "Top : " + object.top.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Width
    label = document.createElement('label');
    label.innerHTML = "Width : " + object.width.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Height
    label = document.createElement('label');
    label.innerHTML = "Height : " + object.height.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Font Family
    label = document.createElement('label');
    label.innerHTML = "Font Family : " + object.fontFamily;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
}

//
// FUNCTION : BuildDebugLineSetting
// DESCRIPTION :
// This function sets the debug values for a Line object
// PARAMETERS :
// settingsDiv : the debug settings div
// object : the object that is selected
// RETURNS :
// N/A
function BuilldDebugLineSetting(settingsDiv, object) {
    // enters a label for Type
    var label = document.createElement('label');
    label.innerHTML = "Type : Line";
    settingsDiv.appendChild(label);
    var lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Left
    label = document.createElement('label');
    label.innerHTML = "Left : " + object.left.toFixed(2) ;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Top
    label = document.createElement('label');
    label.innerHTML = "Top : " + object.top.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Width
    label = document.createElement('label');
    label.innerHTML = "Width : " + object.width.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Height
    label = document.createElement('label');
    label.innerHTML = "Height : " + object.height.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);

}

//
// FUNCTION : BuildDebugTextBoxSetting
// DESCRIPTION :
// This function sets the debug values for TextBox object
// PARAMETERS :
// settingsDiv : the debug settings div
// object : the object that is selected
// RETURNS :
// N/A
function BuildDebugTextBoxSetting(settingsDiv, object) {
    // enters a label for Type
    var label = document.createElement('label');
    label.innerHTML = "Type : TextBox";
    settingsDiv.appendChild(label);
    var lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Text
    label = document.createElement('label');
    label.innerHTML = "Text : " + object.text;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Left
    label = document.createElement('label');
    label.innerHTML = "Left : " + object.left.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Top
    label = document.createElement('label');
    label.innerHTML = "Top : " + object.top.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Width
    label = document.createElement('label');
    label.innerHTML = "Width : " + object.width.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Height
    label = document.createElement('label');
    label.innerHTML = "Height : " + object.height.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Max Length
    label = document.createElement('label');
    label.innerHTML = "Max Length : " + object.maxLength;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Font Family
    label = document.createElement('label');
    label.innerHTML = "Font Family : " + object.fontFamily;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
}

//
// FUNCTION : BuildDebugCheckBoxSetting
// DESCRIPTION :
// This function sets the debug values for Checkbox object
// PARAMETERS :
// settingsDiv : the debug settings div
// object : the object that is selected
// RETURNS :
// N/A
function BuildDebugCheckBoxSetting(settingsDiv, object) {
    // enters a label for Type
    var label = document.createElement('label');
    label.innerHTML = "Type : Checkbox";
    settingsDiv.appendChild(label);
    var lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Checked
    label = document.createElement('label');
    label.innerHTML = "Checked : " + object.checked;
    settingsDiv.appendChild(label);

    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Left
    label = document.createElement('label');
    label.innerHTML = "Left : " + object.left.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Top
    label = document.createElement('label');
    label.innerHTML = "Top : " + object.top.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Width
    label = document.createElement('label');
    label.innerHTML = "Width : " + object.width.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Height
    label = document.createElement('label');
    label.innerHTML = "Height : " + object.height.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
}

//
// FUNCTION : BuildDebugRatingScale
// DESCRIPTION :
// This function sets the debug values for RatingScale object
// PARAMETERS :
// settingsDiv : the debug settings div
// object : the object that is selected
// RETURNS :
// N/A
function BuildDebugRatingScale(settingsDiv, object) {
    // enters a label for Type
    var label = document.createElement('label');
    label.innerHTML = "Type : RatingScale";
    settingsDiv.appendChild(label);
    var lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    
    label = document.createElement('label');
    label.innerHTML = "Type of Question : " + object.typeOfQuestion;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Left
    label = document.createElement('label');
    label.innerHTML = "Left : " + object.left.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Top
    label = document.createElement('label');
    label.innerHTML = "Top : " + object.top.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Width
    label = document.createElement('label');
    label.innerHTML = "Width : " + object.width.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Height
    label = document.createElement('label');
    label.innerHTML = "Height : " + object.height.toFixed(2);
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for Value
    label = document.createElement('label');
    label.innerHTML = "Value : " + object.values;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    // enters a label for MergedValue
    label = document.createElement('label');
    label.innerHTML = "MergedValue : " + object.MergedValue;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
    label = document.createElement('label');
    // enters a label for Rating of
    label.innerHTML = "Rating of : " + object._objects[0]._objects[1].text + "-" + object._objects[object._objects.length - 1]._objects[1].text;
    settingsDiv.appendChild(label);
    
    lineBreak = document.createElement("br");
    settingsDiv.appendChild(lineBreak);
}

/*
* FUNCTION      : UpdateColour
* 
* DESCRIPTION   : Changes the fill colour of the Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateColour(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject == null) return;
        
    aObject.set('fill', event.target.value.toString());
    canvases.canvas.renderAll();   
}

/*
* FUNCTION      : UpdateBackgroundColour
* 
* DESCRIPTION   : Changes the background colour of the Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateBackgroundColour(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject != null) {
        aObject.set('backgroundColor', event.target.value.toString());
        canvases.canvas.renderAll();
    }
}


/*
* FUNCTION      : UpdateStrokeWidth
* 
* DESCRIPTION   : Changes the stroke width of the Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateStrokeWidth(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject != null) {
        aObject.set('strokeWidth', parseInt(event.target.value));
        canvases.canvas.renderAll();
    }
}

/*
* FUNCTION      : UpdateCheckBoxShape
* 
* DESCRIPTION   : Allows for changing between Circle and Square checkboxes
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateCheckBoxShape(shape) {

    var aObjects = canvases.canvas.getActiveObjects();
    aObjects.forEach(function(aObject) {
        if (aObject.type == "CheckBoxRect" || aObject.type == "CheckBoxCircle") {
            if (shape == "CheckBoxRect") {

                var CBR = new fabric.CheckBoxRect({
                    left: aObject.left,
                    top: aObject.top,
                    width: 2 * aObject.radius,
                    height: 2 * aObject.radius,
                    stroke: 1,
                    stroke: 'black',
                    fill: 'LightBlue',
                    id: aObject.id,

                });


                canvases.canvas.add(CBR);
                canvases.canvas.remove(aObject);
                canvases.canvas.setActiveObject(CBR);


            } else if (shape == "CheckBoxCircle") {
                var CBC = new fabric.CheckBoxCircle({
                    left: aObject.left,
                    top: aObject.top,
                    radius: aObject.width / 2,
                    strokeWidth: 1,
                    stroke: 'black',
                    fill: 'LightBlue',
                    id: aObject.id,
                });

                canvases.canvas.add(CBC);
                canvases.canvas.remove(aObject);
                canvases.canvas.setActiveObject(CBC);

            }
            canvases.canvas.renderAll();
        }
    });
}

/*
* FUNCTION      : UpdateFontSize
* 
* DESCRIPTION   : Changes the font size of the Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateFontSize(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject != null) {
        aObject.set('fontSize', parseInt(event.target.value));
        canvases.canvas.renderAll();
    }

}

/*
* FUNCTION      : UpdateOutlineBox
* 
* DESCRIPTION   : Draws or removes outlinebox of the TextBlock Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateOutlineBox(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject != null) {
        aObject.set('outline', event.target.checked);
        canvases.canvas.renderAll();
    }
}

/*
* FUNCTION      : UpdateFontStyle
* 
* DESCRIPTION   : Changes whole or partial section of text to italics
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateFontStyle(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject == null) return;
    
    if(aObject.selectionStart == aObject.selectionEnd){
        if(aObject.fontStyle == "normal"){
            aObject.set('fontStyle', "italic");
            aObject.setSelectionStyles({fontStyle: "italic"}, 0, aObject._text.length)
            event.target.style.backgroundColor = "darkgray";
        }else{
            aObject.set('fontStyle', "normal");
            aObject.setSelectionStyles({fontStyle: "normal"}, 0, aObject._text.length)
            event.target.style.backgroundColor = "lightgray";
        }      
    }else{
        if(aObject.styles[0] === undefined || aObject.styles[0][aObject.selectionStart] === undefined){
            aObject.setSelectionStyles({fontStyle: "italic"}, aObject.selectionStart, aObject.selectionEnd);
        }
        else if(aObject.styles[0][aObject.selectionStart].fontStyle=="normal"){
            aObject.setSelectionStyles({fontStyle: "italic"}, aObject.selectionStart, aObject.selectionEnd);
        }else{
            aObject.setSelectionStyles({fontStyle: "normal"}, aObject.selectionStart, aObject.selectionEnd);
        }
    }
    canvases.canvas.renderAll();
    canvases.canvas.fire('object:modified');
}

/*
* FUNCTION      : UpdateFontWeight
* 
* DESCRIPTION   : Changes whole or partial section of text to bold
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateFontWeight(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject == null) return;

    if(aObject.selectionStart == aObject.selectionEnd){
        if(aObject.fontWeight == "normal"){
            aObject.set("fontWeight", "bold");
            aObject.setSelectionStyles({fontWeight: "bold"}, 0, aObject._text.length);
            event.target.style.backgroundColor = "darkgray";
        }else{
        aObject.set("fontWeight", "normal");
        aObject.setSelectionStyles({fontWeight: "normal"}, 0, aObject._text.length);
        event.target.style.backgroundColor = "lightgray"
        }
    }else{
        if(aObject.styles[0] === undefined || aObject.styles[0][aObject.selectionStart] === undefined){
            aObject.setSelectionStyles({fontWeight: "bold"}, aObject.selectionStart, aObject.selectionEnd);
        }else if(aObject.styles[0][aObject.selectionStart].fontWeight=="normal"){
            aObject.setSelectionStyles({fontWeight: "bold"}, aObject.selectionStart, aObject.selectionEnd);
        }else{
            aObject.setSelectionStyles({fontWeight: "normal"}, aObject.selectionStart, aObject.selectionEnd);
        }
    }
    canvases.canvas.renderAll();
    canvases.canvas.fire('object:modified');
}

/*
* FUNCTION      : UpdateUnderline
* 
* DESCRIPTION   : Changes whole or partial section of text to have an underline
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateUnderline(event) {
    var aObject = canvases.canvas.getActiveObject();
    if (aObject == null) return;

    if(aObject.selectionStart == aObject.selectionEnd){
        if(aObject.underline){
            aObject.set("underline",false);
            aObject.setSelectionStyles({underline: false}, 0, aObject._text.length);
            event.target.style.backgroundColor = "darkgray";
        }else{
        aObject.set("underline", true);
        aObject.setSelectionStyles({underline: true}, 0, aObject._text.length);
        event.target.style.backgroundColor = "lightgray"
        }
    }else{
        if(aObject.styles[0] === undefined || aObject.styles[0][aObject.selectionStart] === undefined){
            aObject.setSelectionStyles({underline: true}, aObject.selectionStart, aObject.selectionEnd);
        }else if(aObject.styles[0][aObject.selectionStart].underline){
            aObject.setSelectionStyles({underline: false}, aObject.selectionStart, aObject.selectionEnd);
        }else{
            aObject.setSelectionStyles({underline: true}, aObject.selectionStart, aObject.selectionEnd);
        }
    }

    canvases.canvas.renderAll();
    canvases.canvas.fire('object:modified');
}

/*
* FUNCTION      : UpdateInputLimit
* 
* DESCRIPTION   : Sets the max accepted input of a text field in a Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateInputLimit(event){
    var aObject = canvases.canvas.getActiveObject();
    if(aObject != null){
        aObject.set('maxLength', parseInt(event.target.value));
    }
    canvases.canvas.renderAll();
}

/*
* FUNCTION      : UpdateQuestion
* 
* DESCRIPTION   : Allows editing of the hiden question field
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateQuestion(event){
    var aObject = canvases.canvas.getActiveObject()
    if(aObject == null) return;
    aObject.set('typeOfQuestion', event.target.value);
}

/*
* FUNCTION      : UpdateTextSpacing
* 
* DESCRIPTION   : Controls the space between characters in the text field of a Token
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function UpdateTextSpacing(event){
    var aObject = canvases.canvas.getActiveObject();
    if(aObject ==null) return;

    aObject.set('charSpacing', parseInt(event.target.value));

    canvases.canvas.renderAll();
}

/*
* FUNCTION      : BackOne
* 
* DESCRIPTION   : Moves a token back 1 value in the z-axis
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function BackOne() {
    var aObject = canvases.canvas.getActiveObject();
    if(aObject == null) return; 

    canvases.canvas.sendBackwards(aObject);
}

/*
* FUNCTION      : BackOne
* 
* DESCRIPTION   : Moves a token to the back of the z-axis
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function BackAll() {
    var aObject = canvases.canvas.getActiveObject();
    if(aObject == null) return; 

    canvases.canvas.sendToBack(aObject);
}

/*
* FUNCTION      : ForwardOne
* 
* DESCRIPTION   : Moves a token to the forward 1 value of the z-axis
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function ForwardOne() {
    var aObject = canvases.canvas.getActiveObject();
    if(aObject == null) return;

    canvases.canvas.sendForward(aObject);
}

/*
* FUNCTION      : ForwardAll
* 
* DESCRIPTION   : Moves a token to the back of the z-axis
*
* PARAMETERS    : Object event    : Event containing the target Token
*
* RETURNS       : Void
*/
function ForwardAll() {
    var aObject = canvases.canvas.getActiveObject();
    if(aObject == null) return; 

    canvases.canvas.sendToFront(aObject);
}

// FUNCTION : CopyToken
// DESCRIPTION :
// Copies token to clipboard
// PARAMETERS :
// N/A
// RETURN
// N/A
function CopyToken(){
    var aObject = canvases.canvas.getActiveObject();

    if(aObject == null || aObject.name === "col" || aObject.name === "row") return;
 
    aObject.clone(function(cloned){
        clipboard = cloned
    });
}

// FUNCTION : PasteToken
// DESCRIPTION :
// Pastes token from clipboard
// PARAMETERS :
// event- object containing neccarry data on the object that activated the event
// RETURN
// N/A 
 function PasteToken(event){
    if(clipboard){
        clipboard.clone(function(nToken) {
            canvases.canvas.discardActiveObject();

            nToken.set({
                left: nToken.left += 10,
                top: nToken.top += 10,
                evented: true,
            });
            canvases.canvas.add(nToken);
            if(nToken.type == "CheckBoxRect" || nToken.type == "CheckBoxCircle"){
                nToken.set({
                    id: parseInt(Math.random() * Date.now()),
                });
            }
        if(nToken.type == "activeSelection"){
            nToken.canvas = canvases.canvas;
            nToken.forEachObject(function(obj) {
                canvases.canvas.add(obj);
            });
                nToken.setCoords();
        }else{
            canvases.canvas.add(nToken);
        }
            clipboard.left += 10;
            clipboard.top += 10;
            canvases.canvas.setActiveObject(nToken);
            canvases.canvas.renderAll();
        },
        
        );

    }
}

// FUNCTION : DeleteToken
// DESCRIPTION :
// Deletes selected tokens
// PARAMETERS :
// N/A
// RETURN
// N/A
function DeleteToken() {
    var active = GetSelection();

    if (active.type === "activeSelection") {
        var activeObjects = active.getObjects();
        for (let i in activeObjects) {
            canvases.canvas.remove(activeObjects[i]);
        }
    } else {
        canvases.canvas.remove(canvases.canvas.getActiveObject());
    }

    canvases.canvas.discardActiveObject();
}

 
// FUNCTION : ExportCanvas
// DESCRIPTION :
// Exports the canvas to a json
// PARAMETERS :
// buttonEl- object containing neccarry data on the object that activated the event
// RETURN
// N/A
function ExportCanvas(buttonEl) {
    object = {
        groupedQuestions: groupquestions,
        fabric: canvases.canvas
    }
    var data = JSON.stringify(object);
    var name = prompt('File Name') + '.json';
    create_file(data, name, 'application/JSON');
}

//
// FUNCTION : create_file
// DESCRIPTION :
// Create and fills the file with the data being sent
// PARAMETERS :
// data - the data being entered in the file
// filename - the file name
// type - the type of file
// RETURNS :
// N/A
function create_file(data, filename, type) {
    var file = new Blob([data], {
        type: type
    });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

// FUNCTION : GetSelection
// DESCRIPTION :
// Gets the active object / active group
// PARAMETERS :
// N/A
// RETURN
// N/A
function GetSelection() {
    return canvases.canvas.getActiveObject() === null ? canvases.canvas.getActiveGroup() : canvases.canvas.getActiveObject()
}

// FUNCTION : AddTag
// DESCRIPTION :
// Adds the question tag to object
// PARAMETERS :
// object - The object htat needs the question tag
// RETURN
// N/A
function AddTag(object) {
    var newobject = object
    newobject.toObject = (function(toObject) {
        return function() {
            return fabric.util.object.extend(toObject.call(this), {
                typeOfQuestion: this.typeOfQuestion
            });
        };
    })(newobject.toObject);
    var data = prompt("type of question");
    newobject.typeOfQuestion = data;
}

// FUNCTION : GroupQuestions
// DESCRIPTION :
// Groups selected questions to the group question array
// PARAMETERS :
// N/A
// RETURN
// N/A
function GroupQuestions() {
    alert("activated");
    var questions = canvases.canvas.getActiveObjects()
    var length = questions.length;
    var i = 0;
    while (i < length) {
        if (questions[i].type === "CheckBoxCircle") {
            var value = parseInt(prompt("number value for " + questions[i].typeOfQuestion));
            var newobject = questions[i];
            newobject.toObject = (function(toObject) {
                return function() {
                    return fabric.util.object.extend(toObject.call(this), {
                        questionValue: this.questionValue
                    });
                };
            })(newobject.toObject);
            questions[i].questionValue = value;
        }
        if (questions[i].type === "group") {

            var newobject = questions[i];
            newobject.toObject = (function(toObject) {
                return function() {
                    return fabric.util.object.extend(toObject.call(this), {
                        mergeValue: this.mergeValue
                    });
                };
            })(newobject.toObject);
            questions[i].mergeValue = 0;
        }
        i = i + 1;
    }
    groupquestions[grouplength] = questions;
    grouplength = grouplength + 1;
}

// FUNCTION : SaveCanvas
// DESCRIPTION :
// Saves the Canvas
// PARAMETERS :
// N/A
// RETURN
// N/A
function SaveCanvas()
{
    object = {
        groupedQuestions: groupquestions,
        fabric: canvases.canvas
    }
    var data = JSON.stringify(object);
    var name = prompt('File Name') + '.Designer';
    create_file(data, name, 'application/JSON');
}

// FUNCTION : LoadCanvas
// DESCRIPTION :
// Loads the Canvas
// PARAMETERS :
// N/A
// RETURN
// N/A
function LoadCanvas()
{
    var selector = document.getElementById("dragable-selector");
    selector.style.display = "block";

    var file = document.getElementById('import').files[0];

    var reader = new FileReader();
    //function activates when the 
    reader.addEventListener('load', function(e) {
        var text = e.target.result;
        var json = JSON.parse(text);
        groupquestions = json.groupedQuestions;
        grouplength = groupquestions.length;
        canvases.canvas.loadFromJSON(json.fabric, canvases.canvas.renderAll.bind(canvases.canvas));
    });
    reader.readAsText(file);
}