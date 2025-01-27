$(document).ready(function () {
    iniciarTabla();
});
var tableContabilizados;
function iniciarTabla() {
    tableContabilizados = $('#tblContabilizados').DataTable({
        destroy: true,
        responsive: true,
        autoWidth: false,
        order: [[0, 'asc']],
        scrollX: true,
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchSolicitudes'
            },
            dataSrc: ""
        },
        columns: [
            { "data": "" },
            { "data": "DocNum" },
            { "data": "Serie" },
            { "data": "ReqIdUser" },
            { "data": "TotalImp" },
            { "data": "" },
            { "data": "" },
        ],
        columnDefs: [
            {
                targets: [0],
                class: "text-center",
                orderable: true,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                },
            },
            {
                targets: [1],
                class: "text-center",
                orderable: true,
                render: function (data, type, row, meta) {
                    return '<span class="badge badge-primary">' + row.DocNum + '</span>';
                },

            },
            {
                targets: [2],
                class: "text-center",
                orderable: false,
                render: function (data, type, row, meta) {
                    if (row.Serie == 75) {
                        return '<span class="badge badge-black">75 </span> / <span class="badge badge-success"> Primario</span>';
                    } else {
                        return row.Serie;
                    }
                },
            },
            {
                targets: [-2],
                class: "text-center",
                orderable: false,
                render: function (data, type, row, meta) {
                    return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.DocEntry + '" id="' + row.DocEntry + '" style="width: 20px; height: 50px; vertical-align: center;" ></input></div>';
                },
            },
            {
                targets: [-1],
                class: "text-center",
                orderable: false,
                render: function (data, type, row) {
                    return '<button rel="remove" type="button" class="btn btn-info btn-xs btn-flat" onclick="mostrarDetallesContabilizados(' + parseInt(row.DocEntry) + ')"><i class="fas fa-info-circle"></i> Detalles</button>';
                },
            },
        ],
        initComplete: function (settings, json) {
            $('#tblContabilizados').on('change', 'input[type="checkbox"]', function () {
                var $checkbox = $(this);
                var table = $('#tblContabilizados').DataTable();
                var rowDataC = table.row($checkbox.closest('tr')).data();
                if ($checkbox.is(':checked')) {
                    if (rowDataC.DocType === 'I') {
                        $.ajax({
                            url: window.location.pathname,
                            type: 'POST',
                            data: {
                                'action': 'getDetails',
                                'code': rowDataC.DocEntry
                            },
                            dataSrc: "",
                            success: function (response) {
                                for (var j = 0; j < response.length; j++) {
                                    var founded = false;
                                    var index = checked.findIndex(function (item) {
                                        return item.Code === response[j].Code && item.ItemCode === response[j].ItemCode;
                                    });
                                    if (index === -1) {
                                        if (orden.items.item.length > 0) {
                                            for (var i = 0; i < orden.items.item.length; i++) {
                                                if (orden.items.item[i].ItemCode == response[j].ItemCode && orden.items.item[i].Almacen == response[j].Almacen && orden.items.item[i].LineVendor == response[j].LineVendor && orden.items.item[i].UnidadMedida == response[j].UnidadMedida) {
                                                    orden.items.item[i].Quantity = orden.items.item[i].Quantity + response[j].Quantity;
                                                    orden.items.item[i].total = orden.items.item[i].total + response[j].total;
                                                    founded = true;
                                                    break;
                                                }
                                            }
                                            if (founded == false) {
                                                orden.add(response[j]);
                                                orden.list();
                                            } else {
                                                orden.list();
                                            }
                                        } else {
                                            orden.add(response[j]);
                                            orden.list();
                                        }
                                        checked.push({ Code: response[j].Code, ItemCode: response[j].ItemCode });
                                    }
                                }
                            },
                            error: function (xhr, status, error) {
                                // Maneja cualquier error aquí
                                console.error('Error en la solicitud:', status, error);
                            }
                        });
                    } else if (rowDataC.DocType === 'S') {
                        $.ajax({
                            url: window.location.pathname,
                            type: 'POST',
                            data: {
                                'action': 'getDetails',
                                'code': rowDataC.DocEntry
                            },
                            dataSrc: "",
                            success: function (response) {
                                for (var j = 0; j < response.length; j++) {
                                    var founded = false;
                                    var index = checkedSv.findIndex(function (item) {
                                        return item.Code === response[j].Code && item.ItemCode === response[j].ItemCode;
                                    });
                                    if (index === -1) {
                                        if (ordenServ.items.item.length > 0) {
                                            for (var i = 0; i < ordenServ.items.item.length; i++) {
                                                if (ordenServ.items.item[i].ItemCode == response[j].ItemCode && ordenServ.items.item[i].Almacen == response[j].Almacen && ordenServ.items.item[i].LineVendor == response[j].LineVendor && ordenServ.items.item[i].UnidadMedida == response[j].UnidadMedida) {
                                                    ordenServ.items.item[i].Quantity = ordenServ.items.item[i].Quantity + response[j].Quantity;
                                                    ordenServ.items.item[i].total = ordenServ.items.item[i].total + response[j].total;
                                                    founded = true;
                                                    break;
                                                }
                                            }
                                            if (founded == false) {
                                                ordenServ.add(response[j]);
                                                ordenServ.list();
                                            } else {
                                                ordenServ.list();
                                            }
                                        } else {
                                            ordenServ.add(response[j]);
                                            ordenServ.list();
                                        }
                                        checkedSv.push({ Code: response[j].Code, ItemCode: response[j].ItemCode });
                                    }
                                }
                            },
                            error: function (xhr, status, error) {
                                // Maneja cualquier error aquí
                                console.error('Error en la solicitud:', status, error);
                            }
                        });
                    }
                } else {
                    if (rowDataC.DocType === 'I') {
                        $.ajax({
                            url: window.location.pathname,
                            type: 'POST',
                            data: {
                                'action': 'getDetails',
                                'code': rowDataC.DocEntry
                            },
                            dataSrc: "",
                            success: function (response) {
                                for (var j = 0; j < response.length; j++) {
                                    if (orden.items.item.length > 0) {
                                        for (var i = 0; i < orden.items.item.length; i++) {
                                            if (orden.items.item[i].ItemCode == response[j].ItemCode && orden.items.item[i].Almacen == response[j].Almacen && orden.items.item[i].LineVendor == response[j].LineVendor && orden.items.item[i].UnidadMedida == response[j].UnidadMedida) {
                                                orden.items.item[i].Quantity = orden.items.item[i].Quantity - response[j].Quantity;
                                                orden.items.item[i].total = orden.items.item[i].total - response[j].total;
                                                if (orden.items.item[i].Quantity === 0 && orden.items.item[i].total === 0) {
                                                    orden.items.item.splice(i, 1);
                                                }
                                                orden.list();
                                                break;
                                            }
                                        }
                                    }
                                    var index = checked.findIndex(function (item) {
                                        return item.Code === response[j].Code && item.ItemCode === response[j].ItemCode;
                                    });
                                    if (index > -1) {
                                        checked.splice(index, 1);
                                    }
                                }
                            },
                            error: function (xhr, status, error) {
                                // Maneja cualquier error aquí
                                console.error('Error en la solicitud:', status, error);
                            }
                        });
                    } else if (rowDataC.DocType === 'S'){
                        $.ajax({
                            url: window.location.pathname,
                            type: 'POST',
                            data: {
                                'action': 'getDetails',
                                'code': rowDataC.DocEntry
                            },
                            dataSrc: "",
                            success: function (response) {
                                for (var j = 0; j < response.length; j++) {
                                    if (ordenServ.items.item.length > 0) {
                                        for (var i = 0; i < ordenServ.items.item.length; i++) {
                                            if (ordenServ.items.item[i].ItemCode == response[j].ItemCode && ordenServ.items.item[i].Almacen == response[j].Almacen && ordenServ.items.item[i].LineVendor == response[j].LineVendor && ordenServ.items.item[i].UnidadMedida == response[j].UnidadMedida) {
                                                ordenServ.items.item[i].Quantity = ordenServ.items.item[i].Quantity - response[j].Quantity;
                                                ordenServ.items.item[i].total = ordenServ.items.item[i].total - response[j].total;
                                                if (ordenServ.items.item[i].Quantity === 0 && ordenServ.items.item[i].total === 0) {
                                                    ordenServ.items.item.splice(i, 1);
                                                }
                                                ordenServ.list();
                                                break;
                                            }
                                        }
                                    }
                                    var index = checkedSv.findIndex(function (item) {
                                        return item.Code === response[j].Code && item.ItemCode === response[j].ItemCode;
                                    });
                                    if (index > -1) {
                                        checkedSv.splice(index, 1);
                                    }
                                }
                            },
                            error: function (xhr, status, error) {
                                // Maneja cualquier error aquí
                                console.error('Error en la solicitud:', status, error);
                            }
                        });
                    }
                }
            });
        }
    });
}

//Métodos para manejar las Tablas Productos y Servicios

var tblOrdenProd;
var orden = {
    items: {
        item: []
    },
    add: function (item) {
        this.items.item.push(item);
    },
    list: function (item) {
        tblOrdenProd = $('#tblOrdenProd').DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            scrollX: true,
            "language": {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            data: this.items.item,
            columns: [
                { "data": "" },
                { "data": "ItemCode" },
                { "data": "LineVendor" },
                { "data": "Description" },
                { "data": "Quantity" },
                { "data": "total" },
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: "text-center",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
                    },
                },
            ],
            initComplete: function (settings, json) {
            }
        });
    },
    delete: function () {
        tblOrdenProd.clear().draw();
        orden.items.item = [];
        orden.list();
    }
}

var tblOrdenServ;
var ordenServ = {
    items: {
        item: []
    },
    add: function (item) {
        this.items.item.push(item);
    },
    list: function (item) {
        tblOrdenServ = $('#tblOrdenProd').DataTable({
            destroy: true,
            responsive: true,
            autoWidth: false,
            scrollX: true,
            "language": {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            data: this.items.item,
            columns: [
                { "data": "" },
                { "data": "ItemCode" },
                { "data": "LineVendor" },
                { "data": "Description" },
                { "data": "Quantity" },
                { "data": "total" },
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: "text-center",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
                    },
                },
            ],
            initComplete: function (settings, json) {
            }
        });
    },
    delete: function () {
        tblOrdenServ.clear().draw();
        ordenServ.items.item = [];
        ordenServ.list();
    }
}

//Listener para el botón remove en tabla Productos y tabla Servicios

$(document).ready(function () {
    $('#tblOrdenProd tbody').on('click', 'a[rel="remove"]', function () {
        var trIndex = $('#tblOrdenProd').DataTable().cell($(this).closest('td')).index();
        var itemCodeToRemove = orden.items.item[trIndex.row].ItemCode;
        var CodeToRemove = orden.items.item[trIndex.row].Code;
        orden.items.item.splice(trIndex.row, 1);
        orden.list();
        checked = checked.filter(function (item) {
            return item.ItemCode !== itemCodeToRemove;
        });
        var table = $('#tblContabilizados').DataTable();
        for (var p = 0; p < table.data().count(); p++) {
            (function (p) {
                var data = table.row(p).data();
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'getDetails',
                        'code': data.DocEntry
                    },
                    success: function (response) {
                        for (var l = 0; l < response.length; l++) {
                            if (response[l].ItemCode == itemCodeToRemove) {
                                var rowNode = table.row(p).node();
                                if (rowNode) {
                                    var $checkbox = $(rowNode).find('input[type="checkbox"]');
                                    $checkbox.prop('checked', false);
                                }
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error en la solicitud:', status, error);
                    }
                });
            })(p);
        }
    });
});

$(document).ready(function () {
    $('#tblOrdenServ tbody').on('click', 'a[rel="remove"]', function () {
        var trIndex = $('#tblOrdenServ').DataTable().cell($(this).closest('td')).index();
        var itemCodeToRemove = ordenServ.items.item[trIndex.row].ItemCode;
        var CodeToRemove = ordenServ.items.item[trIndex.row].Code;
        ordenServ.items.item.splice(trIndex.row, 1);
        orden.list();
        ordenServ = checkedSv.filter(function (item) {
            return item.ItemCode !== itemCodeToRemove;
        });
        var table = $('#tblContabilizados').DataTable();
        for (var p = 0; p < table.data().count(); p++) {
            (function (p) {
                var data = table.row(p).data();
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'getDetails',
                        'code': data.DocEntry
                    },
                    success: function (response) {
                        for (var l = 0; l < response.length; l++) {
                            if (response[l].ItemCode == itemCodeToRemove) {
                                var rowNode = table.row(p).node();
                                if (rowNode) {
                                    var $checkbox = $(rowNode).find('input[type="checkbox"]');
                                    $checkbox.prop('checked', false);
                                }
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error en la solicitud:', status, error);
                    }
                });
            })(p);
        }
    });
});

//Función para mostrar datos de detalle de una solicitud en un modal
function mostrarDetallesContabilizados(docNum) {
    var data = $('#tblContabilizados').DataTable().row(function (index, data) {
        return parseInt(data.DocEntry) === parseInt(docNum);
    }).data();
    $('#idSolicitud').text(data.DocNum);
    $('#InputDocEntry').text(data.DocEntry);
    $('#detallesDocNum').text(data.DocNum);
    $('#detallesReqIdUser').text(data.ReqIdUser);
    $('#departmentUser').text(data.Department);
    if (data.DocType === 'I') {
        $('#detallesDocType').text('Artículo');
        tablaDetalleProducto(docNum);
    } else if (data.DocType === 'S') {
        $('#detallesDocType').text('Servicio');
        tablaDetalleServicio(docNum);
    } else {
        $('#detallesDocType').text('No especificado');
    }
    $('#detallesMoneda').text(data.moneda);
    $('#detalleSerie').text(data.Serie);
    $('#detallesTaxCode').text(data.TaxCode);
    $('#detallesDocDate').text(data.DocDate);
    $('#detallesDocDueDate').text(data.DocDueDate);
    if (data.DocStatus === 'P') {
        $('#detallesDocStatus').text('Pendiente');
        if ($('#btnAprobar').length && $('#btnRechazar').length) {
            document.getElementById("btnAprobar").disabled = false;
            document.getElementById("btnRechazar").disabled = false;
        }
    } else if (data.DocStatus === 'A') {
        $('#detallesDocStatus').text('Aprobado por Jefatura');
        if ($('#btnAprobar').length && $('#btnRechazar').length) {
            disableAndMakeTransparent();
        }

    } else if (data.DocStatus === 'R') {
        $('#detallesDocStatus').text('Rechazado por Jefatura');
        if ($('#btnAprobar').length && $('#btnRechazar').length) {
            disableAndMakeTransparent();
        }
    } else if (data.DocStatus === 'C') {
        $('#detallesDocStatus').text('Contabilizado');
        if ($('#btnAprobar').length && $('#btnRechazar').length) {
            disableAndMakeTransparent();
        }
    }
    else {
        $('#detallesDocStatus').text('No especificado');
    }
    $('#detallesTotal').text(data.Total);
    $('#detallesTotalImp').text(data.TotalImp);
    if ($.fn.DataTable.isDataTable('#tblDetalles')) {
        $('#tblDetalles').DataTable().destroy();
    }
    $('#modalDetallesContabilizados').modal('show');
}

//Funciones que manejan el detalle de un producto
var checked = [];
var checkedSv = [];
function tablaDetalleProducto(docNum) {
    $("#tblDetallesServ").hide();
    $("#tblDetallesServ_wrapper").hide();
    $("#tblDetallesProd").show();
    // Desvincula eventos previos
    $('#tblDetallesProd').off('change', 'input[type="checkbox"]')
    $('#tblDetallesProd').DataTable({
        destroy: true,
        responsive: true,
        autoWidth: false,
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'showDetails',
                'id': docNum
            },
            dataSrc: ""
        },
        columns: [
            { "data": "ItemCode" },
            { "data": "LineVendor" },
            { "data": "Description" },
            { "data": "Quantity" },
            { "data": "UnidadMedida" },
            { "data": "Almacen" },
            { "data": "total" },
            { "data": "" }
        ],
        columnDefs: [
            {
                targets: [-2],
                class: "text-center",
                orderable: false,
                render: function (data, type, row) {
                    var value = parseFloat(row.total).toFixed(2);

                    var sol = 'S/. ';
                    return sol + value;
                },
            },
            {
                targets: [-1],
                class: "text-center",
                orderable: false,
                render: function (data, type, row) {
                    if (checked.length > 0) {
                        for (var i = 0; i < checked.length; i++) {
                            if (checked[i].Code === row.Code) {
                                return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.Code + '" id="' + row.Code + '" checked></input></div>';
                            }
                        }
                        return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.Code + '" id="' + row.Code + '" ></input></div>';
                    } else {
                        return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.Code + '" id="' + row.Code + '" ></input></div>';
                    }
                },
            },
        ],
        initComplete: function (settings, json) {
            $('#tblDetallesProd').on('change', 'input[type="checkbox"]', function () {
                var founded = false;
                var atLeastOne = false;
                var $checkbox = $(this);
                var table = $('#tblDetallesProd').DataTable();
                var rowData = table.row($checkbox.closest('tr')).data();
                if ($checkbox.is(':checked')) {
                    if (orden.items.item.length > 0) {
                        for (var i = 0; i < orden.items.item.length; i++) {
                            if (orden.items.item[i].ItemCode == rowData.ItemCode && orden.items.item[i].Almacen == rowData.Almacen && orden.items.item[i].LineVendor == rowData.LineVendor && orden.items.item[i].UnidadMedida == rowData.UnidadMedida) {
                                orden.items.item[i].Quantity = orden.items.item[i].Quantity + rowData.Quantity;
                                orden.items.item[i].total = orden.items.item[i].total + rowData.total;
                                founded = true;
                                break;
                            }
                        }
                        if (founded == false) {
                            orden.add(rowData);
                            orden.list();
                        } else {
                            orden.list();
                        }
                    } else {
                        orden.add(rowData);
                        orden.list();
                    }
                    checked.push({ Code: rowData.Code, ItemCode: rowData.ItemCode });
                    updateTableContabilizados(docNum, true);

                } else {
                    if (orden.items.item.length > 0) {
                        for (var i = 0; i < orden.items.item.length; i++) {
                            if (orden.items.item[i].ItemCode == rowData.ItemCode && orden.items.item[i].Almacen == rowData.Almacen && orden.items.item[i].LineVendor == rowData.LineVendor && orden.items.item[i].UnidadMedida == rowData.UnidadMedida) {
                                orden.items.item[i].Quantity = orden.items.item[i].Quantity - rowData.Quantity;
                                orden.items.item[i].total = orden.items.item[i].total - rowData.total;
                                if (orden.items.item[i].Quantity === 0 && orden.items.item[i].total === 0) {
                                    orden.items.item.splice(i, 1);
                                }
                                orden.list();
                                break;
                            }
                        }
                    }
                    var index = checked.findIndex(function (item) {
                        return item.Code === rowData.Code && item.ItemCode === rowData.ItemCode;
                    });
                    if (index !== -1) {
                        checked.splice(index, 1);
                    }
                    for (var k = 0; k < table.data().count(); k++) {
                        data = table.row(k).data();
                        var index = checked.findIndex(function (item) {
                            return item.Code === data.Code && item.ItemCode === data.ItemCode;
                        });
                        if (index !== -1) {
                            atLeastOne = true;
                        }
                    }
                    if (!atLeastOne) {
                        updateTableContabilizados(docNum, false);
                    } else {
                        updateTableContabilizados(docNum, true);
                    }
                }
            });
        }
    });
}

//

function updateTableContabilizados(docNum, isChecked) {
    var tableContabilizados = $('#tblContabilizados').DataTable();
    tableContabilizados.rows().every(function () {
        var data = this.data();
        if (parseInt(data.DocEntry) === parseInt(docNum)) {
            var rowNode = this.node();
            var $checkbox = $(rowNode).find('input[type="checkbox"]');
            $checkbox.prop('checked', isChecked);
        }
    });
}



function tablaDetalleServicio(docNum) {
    $("#tblDetallesProd").hide();
    $("#tblDetallesProd_wrapper").hide();
    $("#tblDetallesServ").show();
    $('#tblDetallesServ').DataTable({
        destroy: true,
        responsive: true,
        autoWidth: false,
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'showDetails',
                'id': docNum
            },
            dataSrc: ""
        },
        columns: [
            { "data": "ItemCode" },
            { "data": "LineVendor" },
            { "data": "Description" },
            { "data": "Quantity" },
            { "data": "CuentaMayor" },
            { "data": "total" },
            { "data": "" }
        ],
        columnDefs: [
            {
                targets: [-2],
                class: "text-center",
                orderable: false,
                render: function (data, type, row) {
                    var value = parseFloat(row.total).toFixed(2);

                    var sol = 'S/. ';
                    return sol + value;
                },
            },
            {
                targets: [-1],
                class: "text-center",
                orderable: false,
                render: function (data, type, row) {
                    if (checkedSv.length > 0) {
                        for (var i = 0; i < checkedSv.length; i++) {
                            if (checkedSv[i].Code === row.Code) {
                                return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.Code + '" id="' + row.Code + '" checked></input></div>';
                            }
                        }
                        return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.Code + '" id="' + row.Code + '" ></input></div>';
                    } else {
                        return '<div class="form-check"> <input class="form-check-input" type="checkbox" value="' + row.Code + '" id="' + row.Code + '" ></input></div>';
                    }
                },
            },
        ],
        initComplete: function (settings, json) {
            $('#tblDetallesProd').on('change', 'input[type="checkbox"]', function () {
                var founded = false;
                var atLeastOne = false;
                var $checkbox = $(this);
                var table = $('#tblDetallesProd').DataTable();
                var rowData = table.row($checkbox.closest('tr')).data();
                if ($checkbox.is(':checked')) {
                    if (ordenServ.items.item.length > 0) {
                        for (var i = 0; i < ordenServ.items.item.length; i++) {
                            if (ordenServ.items.item[i].ItemCode == rowData.ItemCode && ordenServ.items.item[i].Almacen == rowData.Almacen && ordenServ.items.item[i].LineVendor == rowData.LineVendor && ordenServ.items.item[i].UnidadMedida == rowData.UnidadMedida) {
                                ordenServ.items.item[i].Quantity = ordenServ.items.item[i].Quantity + rowData.Quantity;
                                ordenServ.items.item[i].total = ordenServ.items.item[i].total + rowData.total;
                                founded = true;
                                break;
                            }
                        }
                        if (founded == false) {
                            ordenServ.add(rowData);
                            ordenServ.list();
                        } else {
                            ordenServ.list();
                        }
                    } else {
                        ordenServ.add(rowData);
                        ordenServ.list();
                    }
                    checkedSv.push({ Code: rowData.Code, ItemCode: rowData.ItemCode });
                    updateTableContabilizados(docNum, true);

                } else {
                    if (ordenServ.items.item.length > 0) {
                        for (var i = 0; i < ordenServ.items.item.length; i++) {
                            if (ordenServ.items.item[i].ItemCode == rowData.ItemCode && ordenServ.items.item[i].Almacen == rowData.Almacen && ordenServ.items.item[i].LineVendor == rowData.LineVendor && ordenServ.items.item[i].UnidadMedida == rowData.UnidadMedida) {
                                ordenServ.items.item[i].Quantity = ordenServ.items.item[i].Quantity - rowData.Quantity;
                                ordenServ.items.item[i].total = ordenServ.items.item[i].total - rowData.total;
                                if (ordenServ.items.item[i].Quantity === 0 && ordenServ.items.item[i].total === 0) {
                                    ordenServ.items.item.splice(i, 1);
                                }
                                ordenServ.list();
                                break;
                            }
                        }
                    }
                    var index = checkedSv.findIndex(function (item) {
                        return item.Code === rowData.Code && item.ItemCode === rowData.ItemCode;
                    });
                    if (index !== -1) {
                        checkedSv.splice(index, 1);
                    }
                    for (var k = 0; k < table.data().count(); k++) {
                        data = table.row(k).data();
                        var index = checkedSv.findIndex(function (item) {
                            return item.Code === data.Code && item.ItemCode === data.ItemCode;
                        });
                        if (index !== -1) {
                            atLeastOne = true;
                        }
                    }
                    if (!atLeastOne) {
                        updateTableContabilizados(docNum, false);
                    } else {
                        updateTableContabilizados(docNum, true);
                    }
                }
            });
        }
    });
}