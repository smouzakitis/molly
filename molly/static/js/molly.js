/*
 * Molly Library
 * Copyright 2015, Mouzakitis Spiros
*/

function getData() {
  return [
    ['', 'GDP', 'Unemployment', 'Happiness', 'Cost'],
    ['2008', 10, 11, 12, 13],
    ['2009', 20, 11, 14, 13],
    ['2010', 30, 15, 12, 13]
  ];
}

function initMolly() {
	// Instead of creating a new Handsontable instance with the container element passed as an argument,
	// you can simply call .handsontable method on a jQuery DOM object.
	var $container = $("#hot");

	$container.handsontable({
	  data: getData(),
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

	// This way, you can access Handsontable api methods by passing their names as an argument, e.g.:
	var hotInstance = $("#hot").handsontable('getInstance');
};