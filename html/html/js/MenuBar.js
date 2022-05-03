/* 
* FILE : MenuBar.js
* PROJECT : Lucy Digital Forms
* PROGRAMMER : Alex Palmer, Faith Madore, Daniel Treacy
* FIRST VERSION : 2022-03-15
* DESCRIPTION :
* Functionality for the MenuBar
*/

/*
* FUNCTION : NewCanvas()
* DESCRIPTION : This function will clear the canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
function NewCanvas() {
    canvases.canvas.clear();
}

/*
* FUNCTION : OpenCanvas()
* DESCRIPTION : This function will load a saved canvas from localstorage
* PARAMETERS : N/A
* RETURNS : N/A
*/
function OpenCanvas() {
    if (localStorage.getItem("saveState") !== null) {
        var ans = confirm("Would you like to pick up where you left off?");

        if (ans === true) {
            LoadStoredCanvas();
        }
    }
}

/*
* FUNCTION : UploadFile()
* DESCRIPTION : This function allows the user to upload a file
* PARAMETERS : N/A
* RETURNS : N/A
*/
function UploadFile() {
    var uploader = document.getElementById("dragable-uploader");
    uploader.style.display = "block";
}

/*
* FUNCTION : CloseSelector()
* DESCRIPTION : This function just closes the dragable selector div
* PARAMETERS : N/A
* RETURNS : N/A
*/
function CloseSelector() {
    var selector = document.getElementById("dragable-selector");
    selector.style.display = "none";
}

/*
* FUNCTION : CloseUploader()
* DESCRIPTION : This function just closes the dragable uploader div
* PARAMETERS : N/A
* RETURNS : N/A
*/
function CloseUploader() {
    var uploader = document.getElementById("dragable-uploader");
    uploader.style.display = "none";
}

/*
* FUNCTION : HelpfulPopup()
* DESCRIPTION : This function just opens the dragable helper div
* PARAMETERS : N/A
* RETURNS : N/A
*/
function HelpfulPopup() {
    var helper = document.getElementById("dragable-helper");
    helper.style.display = "block";
}

/*
* FUNCTION : CloseHelper()
* DESCRIPTION : This function just closes the dragable helper div
* PARAMETERS : N/A
* RETURNS : N/A
*/
function CloseHelper() {
    var helper = document.getElementById("dragable-helper");
    helper.style.display = "none";
}

/*
* FUNCTION : event listener for image upload
* DESCRIPTION : This listens for any changes made in image_upload
* Allows a user to upload an image to place on the canvas
* PARAMETERS : N/A
* RETURNS : N/A
*/
document.getElementById('image_upload').addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function (f) {
        var data = f.target.result;

        fabric.Image.fromURL(data, function (img) {
            var oImg = img.set({left: 50, top: 100, angle: 00}).scale(0.9);
            canvases.canvas.add(oImg).renderAll();
        });
    };
    reader.readAsDataURL(file);

    var uploader = document.getElementById("dragable-uploader");
    uploader.style.display = "none";
});
