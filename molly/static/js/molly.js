/*
 * Molly Library
 * Copyright 2015, Mouzakitis Spiros
*/

function initData() {
  return [
    ['example', '2011', '2012', '2013', '2014'],
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
	  maxRows: 3000,
	  maxCols: 50,
	  rowHeaders: true,
	  colHeaders: true,
	  minSpareRows: 1,
	  contextMenu: true
	});
};

function normalizeData(){
   //  Access Handsontable api methods by passing their names as an argument:
   var hotInstance = $("#hot").handsontable('getInstance');
   //Bind New Data to the data table
   var newData = hotInstance.getData();
   //Clone current values of the data table in an old data array.
   var oldData = JSON.parse(JSON.stringify(newData));
   //Clear new Data
   newData.length=0;
   //Set the column where normalization should take place
   var normalizationStartColumn = 2;
   
   //Begin the normalization procedure
  //For each row in the old data 
  for (i = 1; i < oldData.length; i++) {

       //For each column in the old data 
      for (j=1;j <oldData[i].length;j++) {
        
        //Create a temporary array (curRowData) that represents a row in the New Data
        var curRowData =[];
		if (oldData[i][j]!= null) {
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
   
   hotInstance.render();
};