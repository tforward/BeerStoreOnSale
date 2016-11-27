$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = parseFloat( $('#min').val(), 10 );
        var max = parseFloat( $('#max').val(), 10 );
        var col_2 = parseFloat( data[2] ) || 0; // use data for the cost per 100ml
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && col_2 <= max ) ||
             ( min <= col_2   && isNaN( max ) ) ||
             ( min <= col_2   && col_2 <= max ) )
        {
            return true;
        }
        return false;
    }
);

$(document).ready(function() {
    // Used by the Sort function so that numbers will sort correctly
    function sort_by_type(a, b) {
        if ($.isNumeric(a) === true){
            return a - b;
        } else {
            if (a < b) {
                return -1;
              }
            else if (a > b) {
                return 1;
              }
            // otherwise letters must be equal
            return 0;
        }
    }
      
  var table = $('#table_id').DataTable( {
    paging: true,
    responsive: true,
    "autoWidth": false,
    "bStateSave": false,
    "ordering": true,
    "bPaginate": false,
    "bFilter": true,
    //https://github.com/vedmack/yadcf
    //https://datatables.net/forums/discussion/comment/86497/#Comment_86497
    // Add more filters
    
    // Range Sorting on the cost per 100

    initComplete: function () {
        this.api().columns([1]).every( function () {
            var column = this;
            var select = $('#numberSelect')
                .appendTo( '#numberSelect' )
                .on( 'keyup change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column
                        .search( val ? '^'+val+'$' : '', true, false )
                        .draw();
                } );
                
            column.data().unique().sort(sort_by_type).each( function ( d, index ) {
                if (column.search() === '^'+d+'$'){
                    select.append( '<option value="'+d+'" selected="selected">'+d+'</option>')
                } else {
                    select.append( '<option value="'+d+'">'+d+'</option>')
                }
            } );
        } );
        
        $('#clrbtn').click(function() {
          document.getElementById('numberSelect').selectedIndex = 0;
          table.columns().search('');
          table.search('');
          table.draw();
        }); 
    }
} );
// Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup( function() {
        table.draw();
    } );
} );
    
    



