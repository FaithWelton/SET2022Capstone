/* 
* FILE : Rating.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-03-15
* DESCRIPTION :
* Functionality for the Rating Scale object
*/

/*
* FUNCTION : CreateRange()
* DESCRIPTION : Creates a range according to user input
* splits the text to get separate min / max vals and calls AddRating
* PARAMETERS : N/A
* RETURNS : N/A
*/
function CreateRange() {
    // Get Range from user
    var rangeString =prompt("Input Range (ie. '0-5' or '1-10')");
    
    if (rangeString !== null) {
        var range = SplitMinMax(rangeString);
        var min = range[0];
        var max = range[1];

        AddRating(max, min);
    }
}

/*
* FUNCTION : SplitMinMax()
* DESCRIPTION : Splits the min / max value into separate variables
* PARAMETERS : rangeString : user input to split
* RETURNS : range : separated range max & min
*/
function SplitMinMax(rangeString) {
    if (rangeString !== null) {
        var range = rangeString.split('-');
    }

    return range;
}

/*
* FUNCTION : ChangeRange()
* DESCRIPTION : Changes the range according to new input
* PARAMETERS : N/A
* RETURNS : N/A
*/
function ChangeRange() {
    var rangeString =prompt("Input New Range (ie. '0-5' or '1-10')");
    
    if (rangeString !== null) {
        var range = SplitMinMax(rangeString);
        var min = range[0];
        var max = range[1];

        var selection = GetSelection();
        var name = "";

        if (selection) {
            selection.forEachObject(function(obj){
                name = obj.name;
            });
        
            canvases.canvas.remove(selection)
            AddRating(max, min, name);
        }
        else {
            alert("Please select an object to change!");
        }
    }
}

/*
* FUNCTION : AddRating()
* DESCRIPTION : Creates & adds the rating object group to the canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function AddRating(max, min) {
    var group = new fabric.Group();
    var i, text, box;
    var left = 10;
    var content = parseInt(min);
    
    for (i = max; i >= min; i--) {
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
    

        text = new fabric.Text(content.toString(), {
            fontSize: 30,
            originX: 'center',
            originY: 'center',
            textAlign: 'center',
            borderColor: 'blue',
            hasBorder: true,
            lockRotation: true,
            editable: false
        })
        
        // Makes a group out of each box / text pair
        var scaleGroup = new fabric.Group([ box, text ], {
            left: left,
            top: 40
        })
        scaleGroup.name = name; // Giving the group a name so it can be referenced easily later

        left = left + 40; // Distance between each set of box & text
        content = content + 1; 

        group.addWithUpdate(scaleGroup);
    }

    group.toObject = (function(toObject) {
        return function() {
            return fabric.util.object.extend(toObject.call(this), {
                typeOfQuestion: this.typeOfQuestion
            });
        };
    })(group.toObject);
    var data = prompt("type of question");
    group.typeOfQuestion = data;

    canvases.canvas.add(group);
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
function UpdateRating(tmpobjects, num1, num2)
{
    var grouped = tmpobjects;
    // TODO Copy all the objects in the group. change the oriented object color to red
    var length = grouped._objects.length
    var i = 0;
    var left = 0;
    //alert("started with length" + length);
    var group = new fabric.Group();
    
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
            
        } else {
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

    group.toObject = (function (toObject) {
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
    //AddRSEvents(rs);
    groupquestions[num1][num2] = group;
    canvases.canvas.remove(tmpobjects);
    canvases.canvas.add(group);
}

//
// FUNCTION : AddRSEvents
// DESCRIPTION :
// updates the rating scale opject
// PARAMETERS :
// rs - the rating scale object
// RETURNS :
// N/A
function AddRSEvents(rs) {
    rs.on('selected', function() {
        var l1 = groupquestions.length;
        var l2 = 0;
        var i1 = 0;
        var i2 = 0;
        var location1 = 0;
        var location2 = 0;
        var found = false;

        while(i1 < l1) {
            l2 = groupquestions[i1].length;
            i2 = 0;

            while(i2 < l2) {
                if(groupquestion[i1][i2] === rs) {
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

        if(found === true) {
            while(i <  rs._objects.length) {
                if(i === value) {
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

                } else {
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
            AddRSEvents(group);
            console.log(group);
            groupquestions[loc1][loc2] = group;
            canvases.canvas.remove(rs);
            canvases.canvas.add(group);
        } else {
            while(i < rs._objects.length) {
                if(i === value) {
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
                } else {
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
            AddRSEvents(group);
            console.log(group);
            canvases.canvas.remove(rs);
            canvases.canvas.add(group);
        }
    });  
}
