//http://harmen.no-ip.org/javascripts/diff/diff.js
//http://stackoverflow.com/questions/4462609/looking-for-a-javascript-visual-diff-lib
var tableBody;

function makeRow(x, y, type, rij){
    var tr = $('<tr/>');
    if(type === '+') {
        tr.addClass('add');
    } else if(type === '-') {
        tr.addClass('del');
    }

    tr.append($('<td/>').addClass('codekolom').text(y));
    tr.append($('<td/>').addClass('codekolom').text(x));
    tr.append($('<td/>').addClass('bredecode').text(type + ' ' + rij));

    tableBody.append(tr);
}

function getDiff(matrix, a1, a2, x, y){
    if(x>0 && y>0 && a1[y-1]===a2[x-1]){
        getDiff(matrix, a1, a2, x-1, y-1);
        makeRow(x, y, ' ', a1[y-1]);
    } else {
        if(x>0 && (y===0 || matrix[y][x-1] >= matrix[y-1][x])){
            getDiff(matrix, a1, a2, x-1, y);
            makeRow(x, '', '+', a2[x-1]);
        } else if(y>0 && (x===0 || matrix[y][x-1] < matrix[y-1][x])){
            getDiff(matrix, a1, a2, x, y-1);
            makeRow('', y, '-', a1[y-1], '');
        } else {
            return;
        }
    }

}

function diff(a1, a2){
    var matrix = new Array(a1.length+1);

    for(var y=0; y<matrix.length; y++){
        matrix[y] = new Array(a2.length+1);

        for(var x=0; x<matrix[y].length; x++){
            matrix[y][x] = 0;
        }
    }

    for(var y=1; y<matrix.length; y++){
        for(var x=1; x<matrix[y].length; x++){
            if(a1[y-1]===a2[x-1]){
                matrix[y][x] = 1 + matrix[y-1][x-1];
            } else {
                matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
            }
        }
    }

    try {
        getDiff(matrix, a1, a2, x-1, y-1);
    } catch(e){
        alert(e);
    }
}

function clearTableBody(){
    while(tableBody.hasChildNodes()){
        tableBody.removeChild(tableBody.lastChild);
    }
}
function diffstr(a, b) {
    tableBody = $('<table/>');
    diff(a.split('\n'), b.split('\n'));
    return $('<div/>').append(tableBody).html();
}
