/* 
* FILE : Player.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-01-31
* DESCRIPTION :
* Functionality for the Player Page
*/
var selectedEle = "";
var canvas;
var rectButton;
var txttype;
var chkbtype;
var version;
var jsexport;
var grouplength;
var grouped;
var bruteforcecount;
var defaultAnswers;
var checker;
var rsi
//
// FUNCTION : CreateTextBlock
// DESCRIPTION :
// This have to be called on creation of the function to allow the customTextBlock to be rendered fromJSONLoad
// PARAMETERS :
// N/A
// RETURNS :
// N/A
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
                ctx.strokeStyle= "#000000";
                ctx.lineWidth = 1;
                var coords = this.calcCoords();
                ctx.beginPath();
                ctx.rect(coords.tl.x, coords.tl.y, coords.tr.x - coords.tl.x, coords.bl.y - coords.tl.y);
                ctx.closePath();
                ctx.stroke();
            }
        },


        _render: function(ctx) {
            this.callSuper('_render', ctx);
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
//
// FUNCTION : CreateCheckBoxRect
// DESCRIPTION :
// This have to be called on creation of the function to allow the customCheckBockRect to be rendered fromJSONLoad
// PARAMETERS :
// N/A
// RETURNS :
// N/A
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
}
//
// FUNCTION : CreateCheckBoxRect
// DESCRIPTION :
// This have to be called on creation of the function to allow the customCheckBockCircle to be rendered fromJSONLoad
// PARAMETERS :
// N/A
// RETURNS :
// N/A
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
}
// FUNCTION : CrateElasicCount
// DESCRIPTION :
// Creates the Elastic Counter Object
// PARAMETERS :
// N/A
// RETURN
// N/A
function CreateElasticCount(){
    fabric.ElasticCount = fabric.util.createClass(fabric.IText,{

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

    fabric.ElasticCount.fromObject = function(object, callback){
        return fabric.Object._fromObject('ElasticCount', object, callback);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    canvas = new fabric.Canvas('c');
    version = "0.0.0";
    canvas.selection = false;

    CreateTextBlock();
    CreateCheckBoxRect();
    CreateLinedTextBox();
    CreateCheckBoxCircle();
    CreateElasticCount();

    //This handles the mousebox check/uncheck function
    canvas.on('mouse:down', function(event) {


        if(event.target == null) return;

        if(event.target.type == 'CheckBoxRect' || event.target.type == 'CheckBoxCircle'){

            var count = 0;
            var count2 = 0;
            var count3 = 0;
            var tempobject;
            var tempobject2;
            var tempobject3;
            
            if(event.target.checked){
                event.target.set('checked', false);   
                while(count < grouplength)
                {
                    while(count2 < jsexport.groupedQuestions[count].length)
                    {
                        tempobject = jsexport.groupedQuestions[count];
                        if(tempobject[count2].typeOfQuestion === event.target.typeOfQuestion)
                        {
                            while(count3 < jsexport.groupedQuestions[count].length)
                            {
                                if(tempobject[count3].type === "group")
                                {
                                    tempobject[count3].mergeValue = tempobject[count3].mergeValue - tempobject[count2].questionValue;
                                    tempobject2 = tempobject[count3];
                                    updateRating(tempobject2, count, count3)
                                }
                                count2 = count2 + 1;
                            }
                            count = count + 1;
                        }
                        count2 = count2 + 1;
                    }
                    count = count + 1;
                }
            }else{
                event.target.set('checked', true);
                while(count < grouplength)
                {
                    while(count2 < jsexport.groupedQuestions[count].length)
                    {
                        tempobject = jsexport.groupedQuestions[count];
                        if(tempobject[count2].typeOfQuestion === event.target.typeOfQuestion)
                        {
                            while(count3 < jsexport.groupedQuestions[count].length)
                            {
                                if(tempobject[count3].type === "group")
                                {
                                    tempobject[count3].mergeValue = tempobject[count3].mergeValue + tempobject[count2].questionValue;
                                    tempobject2 = tempobject[count3];
                                    updateRating(tempobject2, count, count3);
                                }
                                count2 = count2 + 1;
                            }
                            count = count + 1;
                        }
                    }
                    event.target.set('dirty', true);
                    canvas.renderAll();
                }
            }
            canvas.fire('object:modified', event.target);
            event.target.set('dirty', true);
            canvas.renderAll();
        }
        if(event.target != null && event.target.type == 'group')
        {
            var rs = event.target;
            var l1 = jsexport.groupedQuestions.length;
            var l2 = 0;
            var i1 = 0;
            var i2 = 0;
            var found = false;
            while(i1 < l1)
            {
                 l2 = jsexport.groupedQuestions[i1].length;
                 i2 = 0;
                 while(i2 < l2)
                 {
                      if(jsexport.groupedQuestions[i1][i2] === rs)
                      {
                          location1 = i1;
                          location2 = i2;
                          found = true;
                      }
                      i2 = i2 + 1;
                 }
                 i1 = i1 + 1;
            }
            var value = parseInt(prompt("number value scale"));
            var i = 0;
            var left = 0;
            var group = new fabric.Group();
            if(found === true)
            {
                while(i <  rs._objects.length)
                {
                    if(i === value)
                    {
                       //alert("created red");
                       var box = new fabric.Rect({
                           width: 40,
                           height: 40,
                           originX: 'center',
                           originY: 'center',
                           fill: 'transparent',
                           opactiy: 0,
                           strokeWidth: 2,
                           stroke: 'red',
                           lockRotation: true,
                           editable: false
                       });
                 
                 
                       var text = new fabric.Text(rs._objects[i]._objects[1].text, {
                           fontSize: 30,
                           originX: 'center',
                           originY: 'center',
                           textAlign: 'center',
                           borderColor: 'red',
                           hasBorder: true,
                           lockRotation: true,
                           editable: false
                       });
                       var scaleGroup = new fabric.Group([ box, text ], {
                           left: left,
                           top: 40
                       });
            
                    }else{
                       //alert("created black");
                       var box = new fabric.Rect({
                           width: 40,
                           height: 40,
                           originX: 'center',
                           originY: 'center',
                           fill: 'transparent',
                           opactiy: 0,
                           strokeWidth: 2,
                           stroke: 'black',
                           lockRotation: true,
                           editable: false
                       });
        
     
                       var text = new fabric.Text(rs._objects[i]._objects[1].text, {
                          fontSize: 30,
                          originX: 'center',
                          originY: 'center',
                          textAlign: 'center',
                          borderColor: 'blue',
                          hasBorder: true,
                          lockRotation: true,
                          editable: false
                       });
                       var scaleGroup = new fabric.Group([ box, text ], {
                           left: left,
                           top: 40
                       });
            
                    }
                    group.addWithUpdate(scaleGroup);
                    left = left + 40;
                    i = i + 1;
                }
                group.toObject = (function (toObject) {
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            mergeValue: this.mergeValue
                        });
                    };
                })(group.toObject);
                group.mergeValue = object.mergeValue;
                group.left = rs.left;
                group.top = rs.top;
                group.originX = 'center';
                group.originY = 'center';
                console.log(group);
                jsexport.groupedQuestions[loc1][loc2] = group;
                canvas.remove(rs);
                canvas.add(group);
            }else{
                while(i < rs._objects.length)
                {
                    if(i === value)
                    {
                        //alert("created red");
                        var box = new fabric.Rect({
                            width: 40,
                            height: 40,
                            originX: 'center',
                            originY: 'center',
                            fill: 'transparent',
                            opactiy: 0,
                            strokeWidth: 2,
                            stroke: 'red',
                            lockRotation: true,
                            editable: false
                        });
                 
                 
                        var text = new fabric.Text(rs._objects[i]._objects[1].text, {
                            fontSize: 30,
                            originX: 'center',
                            originY: 'center',
                            textAlign: 'center',
                            borderColor: 'red',
                            hasBorder: true,
                            lockRotation: true,
                            editable: false
                        });
                        var scaleGroup = new fabric.Group([ box, text ], {
                            left: left,
                            top: 40
                        });
            
                    }else{
                        //alert("created black");
                        var box = new fabric.Rect({
                            width: 40,
                            height: 40,
                            originX: 'center',
                            originY: 'center',
                            fill: 'transparent',
                            opactiy: 0,
                            strokeWidth: 2,
                            stroke: 'black',
                            lockRotation: true,
                            editable: false
                        });
                                    
                                
                        var text = new fabric.Text(rs._objects[i]._objects[1].text, {
                            fontSize: 30,
                            originX: 'center',
                            originY: 'center',
                            textAlign: 'center',
                            borderColor: 'blue',
                            hasBorder: true,
                            lockRotation: true,
                            editable: false
                        });
                        var scaleGroup = new fabric.Group([ box, text ], {
                            left: left,
                            top: 40
                        });
                     
                    }
                    group.addWithUpdate(scaleGroup);
                    left = left + 40;
                    i = i + 1;
                }
                group.left = rs.left;
                group.top = rs.top;
                group.originX = 'center';
                group.originY = 'center';
                group.set("value", value);
                console.log(group);
                canvas.remove(rs);
                canvas.add(group);
            }
        }
    });

});
//
// FUNCTION : TokenSetup
// DESCRIPTION :
// Turns off general controls of all tokens, will also handle token specific cases
// PARAMETERS :
// obj - the object that is being set up
// RETURNS :
// N/A
function TokenSetup(obj) {
    obj.set('lockMovementX', true);
    obj.set('lockMovementY', true);
    obj.set('lockRotation', true);
    obj.set('lockScalingFlip', true);
    obj.set('lockScalingX', true);
    obj.set('lockScalingY', true);
    obj.set('lockSkewingX', true);
    obj.set('lockSkewingY', true);
    obj.set('hasBorders', false);
    obj.set('hasControls', false);
    obj.set('dirty', true);

    if (obj.type != 'textbox' || obj.type != 'LinedTextBox') {
        obj.set('selectable', true);
    }

    if(obj.type == "textbox"){
        obj.set({height: obj.lasH});
        let lastHeight;
        function UpdateTextSize() {
            var controlPoint = obj.__corner;
    
            if(controlPoint && controlPoint != "mr" && controlPoint != "ml"){
                lastHeight = obj.height * obj.scaleY;
                
            }
    
            obj.set({
                height: obj.lasH,
                scaleY: 1,
            });
            canvas.renderAll();
        }
    
        obj.on("scaling", UpdateTextSize);
        obj.on("editing:entered", UpdateTextSize);
        obj.on("editing:exited", UpdateTextSize);
        obj.on("modified", UpdateTextSize);
        canvas.on('text:changed', UpdateTextSize);
        canvas.on('object:modified', UpdateTextSize);
        
    }

    if (obj.type == "TextBlock") {
        obj.set('editable', false);
    }
    if (obj.type == "CheckBoxRect" || obj.type == "CheckBoxCircle") {
        if(haveanswers === true)
        {
            obj.set('checked',jsexport2.answers[1].values[ckbi].answer);
            ckbi = ckbi + 1;
        }
        defaultAnswers.defaultType[1].defaultValue.push(false);
    }
    if (obj.type == "group") {
       if(haveanswers === true)
       {
           obj.set('value', jsexport2.answers[2].values[rsi].answer);
           rsi = rsi + 1;
           obj._objects[0]._objects[obj.value].stroke = 'red';
       }
       else
       {
           obj.set('value', 0);
       }
    }
}
//
// FUNCTION : OpenImporter
// DESCRIPTION :
// Displays the Import Div
// PARAMETERS :
// N/A
// RETURNS :
// N/A
function OpenImporter() {
    var importer = document.getElementById("dragable-importer");
    importer.style.display = "block";
}
//
// FUNCTION : CloseImporter
// DESCRIPTION :
// Removes the Import Div
// PARAMETERS :
// N/A
// RETURNS :
// N/A
function CloseImporter() {
    var importer = document.getElementById("dragable-importer");
    importer.style.display = "none";
}

//
// FUNCTION : OpenImporter
// DESCRIPTION :
// Checks if the file has a type file and if it does, reads the file. if it doesn't have the file it continues to opening the file
// PARAMETERS :
// event - the event clause that contains the necassary data
// RETURNS :
// N/A
function CheckFile(event)
{
    var file = event.files[0].name;
    var text = file.split('.');
    var xhr = new XMLHttpRequest();
    var text;
    xhr.open('GET', text[0]  + ".player", false);
    xhr.onreadystatechange = function ()
    {
        //alert(xhr.readyState);
        if(xhr.readyState === 4)
        {
            if(xhr.status === 200 || xhr.statu == 0)
            {
                text = xhr.responseText;
                  
                jsexport2 = JSON.parse(text);
                ImportCanvas(event);
                haveanswers = true;
                
            }else{
                ImportCanvas(event);
                haveanswers = false;
                //alert("false");
            }
        }
    }
    xhr.send();
}
//
// FUNCTION : ImportCanvas
// DESCRIPTION :
// Reads and organizes the data in the file to be displayed onto the screen
// PARAMETERS :
// event - the event clause that contains the necassary data
// RETURNS :
// N/A
function ImportCanvas(event) {
    
    var file = event.files[0];
    var i2 = 0;
    checker = false;
    bruteforcecount = 0;
    ckbi = 0;
    txti = 0;
    rsi = 0;
    defaultAnswers = {
        defaultType: [{
            type: "textbox",
            defaultValue: []
        },
        {
            type: "Checkbox",
            defaultValue: []
        },
        {
            type: "Ratingscale",
            defaultValue: []
        }]
    };
        
        
    var reader = new FileReader();
    //function activates when the 
    reader.addEventListener('load', function(e) {
        var text = e.target.result;
        jsexport = JSON.parse(text);
        grouplength = jsexport.groupedQuestions.length;
        var json = jsexport.fabric;
        //retrieve all attributes from textboxes
        var i = 0;
        object = {
            dform: version,
            answers: [{
                    type: "textbox",
                    values: []
                },
                {
                    type: "checkbox",
                    values: []
                },
                {
                    type: "Ratingscale",
                    values: []
                }

            ]
        };
        var newobject = {
            type: "",
            answer: ""
        };
        
        while (i < json.objects.length) {
            newobject = new Object();
            newobject.type = '';
            newobject.answer = '';
            if (json.objects[i].type === "textbox" || json.objects[i].type === "LinedTextBox") {
                newobject.type = json.objects[i].typeOfQuestion;
                object.answers[0].values.push(newobject);
                defaultAnswers.defaultType[0].defaultValue.push({ value: json.objects[i].text});
                if(haveanswers === true)
                {
                    json.objects[i].text = jsexport2.answers[0].values[txti].answer;
                    txti = txti + 1;
                }
            }
            if (json.objects[i].type === "CheckBoxRect" || json.objects[i].type == "CheckBoxCircle") {
                newobject.type = json.objects[i].typeOfQuestion;
                object.answers[1].values.push(newobject);
            }
            if (json.objects[i].type === "group")
            {
                newobject.type = json.objects[i].typeOfQuestion;
                object.answers[2].values.push(newobject);
            }
            i = i + 1;
        }
        //alert(chkbtype);
        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function(event, object) {
            TokenSetup(object);
            if (object.type == "textbox" || object.type == "LinedTextBox") {
                object.on('editing:entered', () => {
                    if(object.maxLength != 0){
                    object.hiddenTextarea.setAttribute('maxLength', object.maxLength);
                    }
                })
            }
        });


    });
    reader.readAsText(file);

    CloseImporter();
}
//
// FUNCTION : ExportPDF
// DESCRIPTION :
// Transforms the canvas to a pdf and begins to collect the data to the canvas
// PARAMETERS :
// event - the event clause that contains the necassary data
// RETURNS :
// N/A
function ExportPDF(event) {
    const {
        jsPDF
    } = window.jspdf;
    var file = prompt("File Name");
    // get the canvas's jpeg image url
    var mycanvas = document.getElementById('c');
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    //send the picture to he pdf file
    var pdf = new jsPDF();
    pdf.addImage(imgData, 'JPEG', 0, 0, -143, -130);
    var data = JSON.stringify(canvas);
    //alert(data);
    collectText(data, file + ".player");
    if(checker)
    {
        pdf.save(file + ".pdf");
    }
    //grab the JSON data
    
}
//
// FUNCTION : CreateLinedTextBox
// DESCRIPTION :
// Created a Lined textbox
// PARAMETERS :
// N/A
// RETURNS :
// N/A
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
                ctx.lineWidth = 1;
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
//
// FUNCTION : collectText
// DESCRIPTION :
// Collects the text and organizes it to be sent to a .player file
// PARAMETERS :
// jtext - the JSON text
// fname - the file name
// RETURNS :
// N/A
function collectText(jtext, fname) {
    var file = fname;
    var json = JSON.parse(jtext);
    var i = 0;
    var txtvalues = [];
    var ckbvalues = [];
    var questions = [];
    //grab the text box values
    var ti = 0;
    var ckbi = 0;
    var rtsi = 0;
    while (i < json.objects.length) {
        if (json.objects[i].type === "textbox" || json.objects[i].type === "LinedTextBox") {
            object.answers[0].values[ti].answer = json.objects[i].text;
            //alert(defaultAnswers.defaultType[0].defaultValue[ti] + " " + json.objects[i].text);
            if(defaultAnswers.defaultType[0].defaultValue[ti] === json.objects[i].text)
            {
                //alert("activated");
                questions.push(json.objects[i].typeOfQuestion);
            }          
            ti = ti + 1;
        }
        if (json.objects[i].type === "CheckBoxRect" || json.objects[i].type === "CheckBoxCircle") {
            object.answers[1].values[ckbi].answer = json.objects[i].checked;
            if(defaultAnswers.defaultType[1].defaultValue[ckbi] === json.objects[i].checked)
            {
                questions.push(json.objects[i].typeOfQuestion);
            }
            ckbi = ckbi + 1;
        }
        if (json.objects[i].type === "group") {
            alert("activated");
            alert("numer:"+ rtsi + " " + canvas._objects[i].value);
            object.answers[2].values[rtsi].answer = canvas._objects[i].value;
            if(defaultAnswers.defaultType[2].defaultValue[rtsi] === canvas._objects[i].value)
            {
                questions.push(json.objects[i].typeOfQuestion);
            }
            rtsi = rtsi + 1;
        }
        i = i + 1;
    }
    var sjson = JSON.stringify(object);
        if(haveanswers === true)
    {
        if(questions.length > 0)
        {
            let newtext = questions.toString();
            var check = prompt("you have " + questions.length + " unanswered questions, is this ok?", "y/n");
            if(check === "y")
            {
                checker = true;
            }else{
                checker = false;
            }
        }
        else
        {
            checker = true;
        }
    }
    else
    {
        checker = true;
    }
    if(checker)
    {
        create_file(sjson, file, 'application/JSON');
    }
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
//
// FUNCTION : updateRating
// DESCRIPTION :
// updates the rating scale opject
// PARAMETERS :
// tmpobjects - the rating scale
// num1 - array location 1
// num2 - array location 2
// RETURNS :
// N/A
function updateRating(tmpobjects, num1, num2)
{
    grouped = tmpobjects;
    
    // TODO Copy all the objects in the group. change the oriented object color to red
    var length; 
    var i = 0;
    var left = 0;
    //alert("started with length" + length);
    var group = new fabric.Group();
    if(bruteforcecount < 1) {
        length = grouped.objects.length;
        while(i < length)
        {
            
            if(i === grouped.mergeValue)
            {
                //alert("created red");
                var box = new fabric.Rect({
                    width: 40,
                    height: 40,
                    originX: 'center',
                    originY: 'center',
                    fill: 'transparent',
                    opactiy: 0,
                    strokeWidth: 2,
                    stroke: 'red',
                    lockRotation: true,
                    editable: false
                });
        
     
                var text = new fabric.Text(grouped.objects[i].objects[1].text, {
                    fontSize: 30,
                    originX: 'center',
                    originY: 'center',
                    textAlign: 'center',
                    borderColor: 'red',
                    hasBorder: true,
                    lockRotation: true,
                    editable: false
                });
                var scaleGroup = new fabric.Group([ box, text ], {
                    left: left,
                    top: 40
                });
            
            }else{
                //alert("created black");
                var box = new fabric.Rect({
                    width: 40,
                    height: 40,
                    originX: 'center',
                    originY: 'center',
                    fill: 'transparent',
                    opactiy: 0,
                    strokeWidth: 2,
                    stroke: 'black',
                    lockRotation: true,
                    editable: false
                });
        
     
                var text = new fabric.Text(grouped.objects[i].objects[1].text, {
                    fontSize: 30,
                    originX: 'center',
                    originY: 'center',
                    textAlign: 'center',
                    borderColor: 'blue',
                    hasBorder: true,
                    lockRotation: true,
                    editable: false
                });
                var scaleGroup = new fabric.Group([ box, text ], {
                    left: left,
                    top: 40
                });
            
            }
            group.addWithUpdate(scaleGroup);
            left = left + 40;
            i = i + 1;
        }
    }else{
        length = grouped._objects.length;
        while(i < length)
        {
            if(i === grouped.mergeValue)
            {
                //alert("created red");
                var box = new fabric.Rect({
                    width: 40,
                    height: 40,
                    originX: 'center',
                    originY: 'center',
                    fill: 'transparent',
                    opactiy: 0,
                    strokeWidth: 2,
                    stroke: 'red',
                    lockRotation: true,
                    editable: false
                });
        
     
                var text = new fabric.Text(grouped._objects[i]._objects[1].text, {
                    fontSize: 30,
                    originX: 'center',
                    originY: 'center',
                    textAlign: 'center',
                    borderColor: 'red',
                    hasBorder: true,
                    lockRotation: true,
                    editable: false
                });
                var scaleGroup = new fabric.Group([ box, text ], {
                    left: left,
                    top: 40
                });
            
            }else{
                //alert("created black");
                var box = new fabric.Rect({
                    width: 40,
                    height: 40,
                    originX: 'center',
                    originY: 'center',
                    fill: 'transparent',
                    opactiy: 0,
                    strokeWidth: 2,
                    stroke: 'black',
                    lockRotation: true,
                    editable: false
                });
        
     
                var text = new fabric.Text(grouped._objects[i]._objects[1].text, {
                    fontSize: 30,
                    originX: 'center',
                    originY: 'center',
                    textAlign: 'center',
                    borderColor: 'blue',
                    hasBorder: true,
                    lockRotation: true,
                    editable: false
                });
                var scaleGroup = new fabric.Group([ box, text ], {
                    left: left,
                    top: 40
                });
            
            }
            group.addWithUpdate(scaleGroup);
            left = left + 40;
            i = i + 1;
        }
    }
    group.toObject = (function(toObject) {
        return function() {
            return fabric.util.object.extend(toObject.call(this), {
                mergeValue: this.mergeValue
            });
        };
    })(group.toObject);
    group.mergeValue = tmpobjects.mergeValue;
    group.left = tmpobjects.left;
    group.top = tmpobjects.top;
    console.log(group);
    jsexport.groupedQuestions[num1][num2] = group;
    canvas.remove(tmpobjects);
    TokenSetup(group);
    canvas.add(group);
    bruteforcecount = bruteforcecount + 1;
}

