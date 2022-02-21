$( document ).ready(() => {

    // Make table content a DataTable with catalan translation
    $('#table').DataTable({
        "language": {
            "decimal": "",
            "emptyTable": "No hi ha informació disponible a aquesta taula",
            "info": "Mostrant _START_ de _END_ a _TOTAL_ ",
            "infoEmpty": "Mostrant 0 de 0 a 0 ",
            "infoFiltered": "(filtrat desde _MAX_ total)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostra _MENU_",
            "loadingRecords": "Carregant...",
            "processing": "Procesant...",
            "search": "Cerca:",
            "zeroRecords": "No hi ha coincidencies",
            "paginate": {
                "first": "Primer",
                "last": "Últim",
                "next": "Següent",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": Ordena ascendent",
                "sortDescending": ": Ordena descendent"
            }
        }
    });

});

