/*
 * Molly Library
 * Copyright 2015, Mouzakitis Spiros
 */
var isRevertOperationActive = false;
var oldData;
function revertOperation() {
    var hotInstance = $("#hot").handsontable('getInstance');
    var newData = hotInstance.getData();
    //Clear new Data
    newData.length = 0;
    //Performance check
    for (var i = 0; i < oldData.length; i++)
      newData[i] = oldData[i].slice();
    hotInstance.render();
    deactivateRevertOperation();
}
function activateRevertOperation(){
    $("#revertBtn").bind( "click",revertOperation);
    $("#revertBtn").removeClass("btn-disabled");
    $("#img-revert").removeClass("img-disabled");
}
function deactivateRevertOperation(){
	$("#revertBtn").unbind("click");
	$("#revertBtn").addClass("btn-disabled");
    $("#img-revert").addClass("img-disabled");
}

function hasExtension(inputID, exts) {
    var fileName = document.getElementById(inputID).value;
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

//Import XLS file
function handleFile(e) {
if (hasExtension('importfile', ['.xls', '.xlsx'])) {
    // ... block upload
  var files = e.target.files;
  var i,f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function(e) {
			  var data = e.target.result;

			  var workbook = XLSX.read(data, {type: 'binary'});
			  
		/* DO SOMETHING WITH workbook HERE */
		$('#myModalSelectSheetBox').empty();
		// Get the SheetNames on the select modal dialog box
		for (l = 0; l != workbook.SheetNames.length; ++l){
			var option = $('<option></option>').attr("value", l).text(workbook.SheetNames[l]);
			$('#myModalSelectSheetBox').append(option);
		}
		$('#btn-select-sheet').bind( "click", function() {importXLSSheet(e);});
		$('#myModalSelectSheet').foundation('reveal','open');
    };
    reader.readAsBinaryString(f);
  }
  }

else if (hasExtension('importfile', ['.csv'])) {
  	$('input[type=file]').parse({
	config: {
		// base config to use for each file
		complete: function(results, file) {
			var hotInstance = $("#hot").handsontable('getInstance');
            var newData = hotInstance.getData();
		    //Clear new Data
           newData.length = 0;
           //Performance check
           for (var i = 0; i < results.data.length; i++)
             newData[i] = results.data[i].slice();
           hotInstance.render();
		}
	},
	before: function(file, inputElem)
	{
		// executed before parsing each file begins;
		// what you return here controls the flow
	},
	error: function(err, file, inputElem, reason)
	{
		// executed if an error occurs while loading the file,
		// or if before callback aborted for some reason
	},
	complete: function()
	{
	}
});

}
else {
	alert('This file is not supported for import. Only CSV and Excel files are supported');
}
}

function importXLSSheet(e) {
	$('#myModalSelectSheet').foundation('reveal','close');
              var data = e.target.result;
			  var workbook = XLSX.read(data, {type: 'binary'});
			  var selected_sheet = $( "#myModalSelectSheetBox option:selected" ).val();
			  /* Parse XLS sheet */
			 xlsresults = Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[selected_sheet]]));
			var hotInstance = $("#hot").handsontable('getInstance');
            var newData = hotInstance.getData();
		    //Clear new Data
           newData.length = 0;
           // Copy parsed XLS results to handsontable
           for (var i = 0; i < xlsresults.data.length; i++)
             newData[i] = xlsresults.data[i].slice();
           hotInstance.render();
}

function initData() {
    return [
        ['GDP', '2011', '2012', '2013', '2014'],
        ['Greece', 10, 11, 12, 13],
        ['Italy', 20, 11, 14, 13],
        ['Austria', 30, 15, 12, 13]
    ];
}

function initMolly() {
    // Instead of creating a new Handsontable instance with the container element passed as an argument,
    // you can simply call .handsontable method on a jQuery DOM object.
    var $container = $("#hot");
    $container.handsontable({
        data: initData(),
        startRows: 20,
        startCols: 20,
        minRows: 20,
        minCols: 20,
        maxRows: 50000,
        maxCols: 300,
        rowHeaders: true,
        colHeaders: true,
        minSpareRows: 1,
        contextMenu: true
    });
    //Set event handling when someone selects a file
   var xlf = document.getElementById('importfile');
   if(xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
};

function recognizeEntityfromText(text) {
    return $.ajax({
        method: "GET",
        url: "ner",
        data: {
            text: text
        },
    });

};


function jsonLength(json_data) {
    //Count a JSON structure length - Backward compatibility with older versions of IE
    var count = 0;
    var i;
    for (i in json_data) {
        if (json_data.hasOwnProperty(i)) {
            count++;
        }
    };
    return count;
}

function countNonEmptyCols(data) {
    var counter = 0;
    for (i = 0; i < 1; i++) {
        for (j = 0; j < data[i].length; j++)
            if ((data[i][j] != null) && (data[i][j].trim() != ''))
                counter++;
    };
    return counter;
}

function normalizeData() {

    // Access Handsontable api methods by passing their names as an argument:
    var hotInstance = $("#hot").handsontable('getInstance');
    //Bind New Data to the data table
    var newData = hotInstance.getData();

    // Should the system ProceedWithNormalization boolean
    var bProceedWithNormalization = true;
    //Check if normalize data makes sense (more than 3 columns)
    if (countNonEmptyCols(newData) <= 3) {
        bProceedWithNormalization = window.confirm("You have less than 3 columns.Are you sure to proceed with normalization?")
    };

    if (bProceedWithNormalization) {
        //Clone current values of the data table in an old data array.
         oldData = JSON.parse(JSON.stringify(newData));
        //Begin the normalization procedure
        activateRevertOperation();
        //Clear new Data
        newData.length = 0;
        //Set the column where normalization should take place
        var normalizationStartColumn = 2;

        //For each row in the old data 
        for (i = 1; i < oldData.length; i++) {

            //For each column in the old data 
            for (j = 1; j < oldData[i].length; j++) {

                //Create a temporary array (curRowData) that represents a row in the New Data
                var curRowData = [];
                if ((oldData[i][j] != null) && (oldData[i][j] != '')) {
                    //Push row label (e.g. Country name in the example) 
                    curRowData.push(oldData[i][0]);
                    //Push column label (e.g. Current year in the example) 
                    curRowData.push(oldData[0][j]);
                    //Push value
                    curRowData.push(oldData[i][j]);
                    //Push curRowData (1-dimension) to NewData (multi-dimension array)
                    newData.push(curRowData);
                }
            };
        };
        // Set Headers for the columns
        // Recognize the entity of the column types if possible
        var headerRow = [];
        //Call the Named Entity Recognition service and when done create the headerRow
        $.when(recognizeEntityfromText(newData[0])).done(function(resp) {
            for (i = 0; i < jsonLength(resp) - 1; i++) {
                headerRow.push(resp[i]);
            };
            //Push header for Value column
            headerRow.push(oldData[0][0])
                //Insert HeaderRow at top of the data grid
            newData.unshift(headerRow);
            //Render the handsontable
            hotInstance.render();
        });

        //End of check if normalization makes sense (columns >3)
    };
};