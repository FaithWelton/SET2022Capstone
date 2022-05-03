/* 
* FILE : DivMovement.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-03-15
* DESCRIPTION :
* Make the "draggable" DIV elements draggagle
*/

//Make the DIV element draggagle
DragElement(document.getElementById("dragable-settings"));
DragElement(document.getElementById("dragable-uploader"));
DragElement(document.getElementById("dragable-selector"));
DragElement(document.getElementById("dragable-debugger"));
DragElement(document.getElementById("dragable-importer"));
DragElement(document.getElementById("dragable-helper"));

/*
* FUNCTION : DragElement()
* DESCRIPTION : Takes a div with a draggable ID and allows the user
* to drag the element around the screen
* PARAMETERS : elmnt : draggable div
* RETURNS : N/A
*/
function DragElement(elmnt) {
  if (elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from
      document.getElementById(elmnt.id + "header").onmousedown = DragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV
      elmnt.onmousedown = DragMouseDown;
    }

    function DragMouseDown(e) {
      e = e || window.event;

      // get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = CloseDragElement;

      // call a function whenever the cursor moves
      document.onmousemove = ElementDrag;
    }

    function ElementDrag(e) {
      e = e || window.event;

      // calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the element's new position
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function CloseDragElement() {
      // stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
