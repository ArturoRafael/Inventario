    var ipp = "obscure-forest-10901.herokuapp.com";
    //Delete tab with icon
    $("html body").on("click",".nav-tabs li .tab-toggle.nav-link.show.active .bg-tab-icon",function(event){
        swal({
              title: "¿Estas seguro?",
              text: "¿Quieres cerrar el tab actual y perder la información?",
              type: "warning", 
              showCancelButton: true, 
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Yes",   
              cancelButtonText: "No"              
            })
            .then((willDelete) => {
              if (willDelete.dismiss != "cancel") {
                closeTabActive(); 
              } else {
                return false;
              }
          });
    });

    
    $("html body").on('click', '.notificacion .card-body .btnVistaNot' ,function(event){
        var status = $(this).attr('aria-pressed');
        var data_item = $(this).data('item');
        if(status == "false"){
            postRequestForm(`https://${ipp}/api/notificaciones/leida/${data_item}`, '')
            .then(function(data){
                searchNotifications(2);
            })
            .catch(function(error){
               console.log(error.toString());
            });          
        }else{
            $(this).removeAttr('data-toggle');
        }
    });

    $("html body").on('click', '.btnConsultarBauche' ,function(event){
        var valores= [];
        var id = -1;
        $(this).parents("tr").find("td").each(function(){
            valores.push($(this).html());
        }); 
        id = valores[0];
        getRequestForm(`https://${ipp}/api/bauches/detalle/${id}`)
        .then(function(data) {             
            
            
            $("#fech_ini_bauch_consul").text(data.bauche["fecha_ingreso"]);
            $("#fech_rep_bauch_consul").text(data.bauche["fecha_reparado"]);
            $("#fech_sal_bauch_consul").text(data.bauche["fecha_salida"]);

            $("#ced_user_consul").text(data.bauche["cedula"]);
            $("#nombre_consul").text(data.bauche["nombre"]);
            $("#telefono_consul").text(data.bauche["telefono"]);
            $("#direccion_consul").text(data.bauche["direccion"]);

            $("#tipo_equipo_consul").text(data.bauche["tipo_equipo"]);
            $("#marca_consul").text(data.bauche["marca"]);
            $("#modelo_consul").text(data.bauche["modelo"]);
            $("#serial_consul").text(data.bauche["serial"]);

            if(data.bauche["estado"] == 0)
                $("#estado_consul").text("En reparación");
            else if(data.bauche["estado"] == 1)
                $("#estado_consul").text("Reparado");
            else
                $("#estado_consul").text("Sin reparación");
            
            $("#estado_telf_consul").text(data.bauche["estado_equipo"]);
            $("#diagnostico_consul").text(data.bauche["diagnostico"]);

            $("#presupuesto_consul").text(data.bauche["presupuesto"]);
            $("#anticipo_consul").text(data.bauche["anticipo"]);
            $("#resta_consul").text(data.bauche["restante"]);            
            
            $('#ModalConsultarBauche').modal("show");
        
        }).catch(function(error){
            $('#ModalConsultarBauche').modal("hide");
            swal("Error",error.toString(),"warning");
        });
    });

    $("html body").on('click', '.btnActualizarBauche' ,function(event){
        var valores= [];
        var id = -1;
        $(this).parents("tr").find("td").each(function(){
            valores.push($(this).html());
        }); 
        id = valores[0];
        getRequestForm(`https://${ipp}/api/bauches/detalle/${id}`)
        .then(function(data) {             
            $("#id_bauch_edit").val(data.bauche["id"]);
            $("#fechini_bauch_edit").val(data.bauche["fecha_ingreso"]);
            $("#fechrep_bauch_edit").val(data.bauche["fecha_reparado"]);
            $("#fechsal_bauch_edit").val(data.bauche["fecha_salida"]);
            $("#diagnostico_bauch_edit").val(data.bauche["diagnostico"]);
            $("#estado_bauch_edit").val(data.bauche["estado"]);            
            
            $('#ModalActuBauche').modal("show");

            ! function(window, document, $) {
                "use strict";
                $("#formActulizarBauche input, #formActulizarBauche textarea, #formActulizarBauche select").not("[type=submit]").jqBootstrapValidation()
            }(window, document, jQuery);
        
        }).catch(function(error){
            $('#ModalActuBauche').modal("hide");
            swal("Error",error.toString(),"warning");
        });
    });

    $("html body").on('click', '.btnEditBauche' ,function(event){
        var valores= [];
        var id = -1;
        $(this).parents("tr").find("td").each(function(){
            valores.push($(this).html());
        }); 
        id = valores[0];
        getRequestForm(`https://${ipp}/api/bauches/detalle/${id}`)
        .then(function(data) {             
            
            $("#fecha_fac_fact").text(data.ok["fecha_facturacion"]);
            $("#num_fact").text(data.ok["num_factura"]);
            $("#cedula_fact").text(data.ok["cedula_usuario"]);            
            $("#name_fact").text(data.ok["nombre"]);

            $("#name_fact").text(data.ok["nombre"]);
            $("#total_fact").text(data.ok["total"]+' $COP');
            $("#email_fact").text(data.ok["email"]);
            $("#telf_fact").text(data.ok["telf_fact"]);


            var array_productos = data.ok["detalle_factura"];
            var item = 0;
            for (var i = 0; i < array_productos.length; i++) {
                item = array_productos[i]["id_producto"]
                getRequestForm(`https://${ipp}/api/productos/detalle/${item}`)
                .then(function(data) {
                    
                    var TableRow = "<tr>"+
                                    "<td>"+ data.productos["codigo_barras"] + "</td>"+
                                    "<td>"+ data.productos["marca"] +"</td>"+
                                    "<td>"+ data.productos["modelo"] +"</td>"+
                                    "<td>"+ data.productos["descripcion"] +"</td>"+
                                    "<td>"+ array_productos[i]["cantidad"] +"</td>"+
                                    "<td>"+ array_productos[i]["precio"] +"</td>"+
                                    "</tr>";
                    
                    $('#tableDetalleFactura tbody').append(TableRow); 

                });
            }
            
            $('#ModalSearchDeatils').modal("show");
        
        }).catch(function(error){
            $('#ModalSearchDeatils').modal("hide");
            swal("Error",error.toString(),"warning");
        });
    });
   
    $("html body").on('click', '.btnSearchFac' ,function(event){
        var valores= [];
        var codigo = -1;
        $(this).parents("tr").find("td").each(function(){
            valores.push($(this).html());
        }); 
        codigo = valores[0];
        getRequestForm(`https://${ipp}/api/facturas/detalle/${codigo}`)
        .then(function(data) {             
            
            $("#fecha_fac_fact").text(data.ok["fecha_facturacion"]);
            $("#num_fact").text(data.ok["num_factura"]);
            $("#cedula_fact").text(data.ok["cedula_usuario"]);            
            $("#name_fact").text(data.ok["nombre"]);

            $("#name_fact").text(data.ok["nombre"]);
            $("#total_fact").text(data.ok["total"]+' $COP');
            $("#email_fact").text(data.ok["email"]);
            $("#telf_fact").text(data.ok["telf_fact"]);


            var array_productos = data.ok["detalle_factura"];
            var item = 0;
            for (var i = 0; i < array_productos.length; i++) {
                item = array_productos[i]["id_producto"]
                getRequestForm(`https://${ipp}/api/productos/detalle/${item}`)
                .then(function(data) {
                    
                    var TableRow = "<tr>"+
                                    "<td>"+ data.productos["codigo_barras"] + "</td>"+
                                    "<td>"+ data.productos["marca"] +"</td>"+
                                    "<td>"+ data.productos["modelo"] +"</td>"+
                                    "<td>"+ data.productos["descripcion"] +"</td>"+
                                    "<td>"+ array_productos[i]["cantidad"] +"</td>"+
                                    "<td>"+ array_productos[i]["precio"] +"</td>"+
                                    "</tr>";
                    
                    $('#tableDetalleFactura tbody').append(TableRow); 

                });
            }
            
            $('#ModalSearchDeatils').modal("show");
        
        }).catch(function(error){
            $('#ModalSearchDeatils').modal("hide");
            swal("Error",error.toString(),"warning");
        });
    });

    $("html body").on('click', '#editProductoInventario' ,function(event){
        var valores= [];
        var id = -1;
        $(this).parents("tr").find("td").each(function(){
            valores.push($(this).html());
        }); 
        id = valores[1];
        getRequestForm(`https://${ipp}/api/productos/detalle/${id}`)
        .then(function(data) {
                $('#myModalEditProducto').modal("show");
                $("#id_produc_edit").val(data.productos["id"]);
                $("#barras_edit").val(data.productos["codigo_barras"]);
                $("#marca_edit").val(data.productos["marca"]);
                $("#modelo_edit").val(data.productos["modelo"]);
                $("#color_edit").val(data.productos["color"]);
                $("#garantia_edit").val(data.productos["garantia"]);
                $("#descripcion_edit").text(data.productos["descripcion"]);
                $("#tipo_prod_edit").val(data.productos["tipo_producto"]);
                $("#precio_compra_edit").val(data.productos["precio_compra"]);
                $("#precio_venta_edit").val(data.productos["precio_venta"]);
                $("#cantidad_edit").val(data.productos["cantidad_disponible"]);
                $("#estado_edit").val(data.productos["estado"]);

        }).catch(function(error){
            swal("Error",error.toString(),"warning");
        });


    });

    $("html body").on('click', '#btnEliminarClientes' ,function(event){
        var valores= [];
        var cedula = "";
        $(this).parents("tr").find("td").each(function(){
            valores.push($(this).html());
        }); 
        cedula = valores[0];

        swal({
              title: "Eliminar Usuario",
              text: `¿Eliminarás al cliente con cedula: ${cedula}?`,
              type: "warning", 
              showCancelButton: true, 
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Yes",   
              cancelButtonText: "No"              
            })
            .then((willDelete) => {
              if (willDelete.dismiss != "cancel") {
                postRequestForm(`https://${ipp}/api/usuarios/eliminar`,{cedula:cedula} )
                    .then(function(data){ 
                        if(data.usuarios){
                            swal("Usuario Eliminado Exitosamente", "", "info")
                                 .then((willDelete) => {
                                    cargarClientes('das_clientes');
                              });                
                        }
                    })
                    .catch(function(error){
                          swal("No se pudo eliminar al usuario","","warning");              
                    });
              } else {
                return false;
              }
        });

    });

    
    //Arrow effect for collapses
    $("html body").on('click', '.card .card-header.content-add-atributes' ,function(event){
        
        var nav = $(this);
        var href = $(nav).attr('href');
        if(!$(this).hasClass('collapsed')){
            $('.card .card-header.content-add-atributes[href="'+href+'"] .icon-collapse').addClass('ti-angle-up');
            $('.card .card-header.content-add-atributes[href="'+href+'"] .icon-collapse').removeClass('ti-angle-down');                
        }else{
            $('.card .card-header.content-add-atributes[href="'+href+'"] .icon-collapse').removeClass('ti-angle-up');
            $('.card .card-header.content-add-atributes[href="'+href+'"] .icon-collapse').addClass('ti-angle-down');
        }

    });

    $("html body").on('click', '.bauche_all #print' ,function(event){       
            var mode = 'popup';
            var close = mode == "popup";
            var options = {
                mode: mode,
                popHt    : 600,
                popWd    : 800,
                popX     : 400,
                popY     : 400,
                popTitle : 'Bauche Carrillo_System',
                popClose: close
            };
            $(".bauche_all div.printableArea").printArea(options);        
    });

    $("html body").on('click', '.facturación_all #printFact' ,function(event){       
            var mode = 'popup';
            var close = mode == "popup";
            var options = {
                mode: mode,
                popHt    : 600,
                popWd    : 800,
                popX     : 400,
                popY     : 400,
                popTitle : 'Factura Carrillo_System',
                popClose: close
            };
            $(".facturación_all div.printableFactura").printArea(options);        
    });

    $("html body").on('click', '.bauche_all #CancelBauche' ,function(event){       
        $('.areaPrint').addClass('hide');
        $('#formTabBauche').removeClass('hide'); 
        $('#formTabBauche')[0].reset();         
    });

    $("html body").on('click', '.facturación_all #regresarFacturar' ,function(event){       
        $('.printFactura').addClass('hide');
        $('.formFact').removeClass('hide'); 
        $('#formTabFactura')[0].reset();         
    });

      
    /*
        _heading = Toast title (Required)
        _text = Contents of the toast (Required)
        _type = Type of toast => ( success / warning / error / info ) (Required)
        _hideAfter = Time the toast is hidden (Default : 3000 mseg)
        _textAlign = Alignment of text i.e. left, right, center (Default :  left)
    */
    function showToast(_heading, _text, _type, _hideAfter = 3000, _textAlign = "left" ){
        if(_heading.length == 0 || _text.length == 0 || _type.length == 0 ){
            return false;
        }else{
            $.toast({
                heading: _heading,
                text: _text,
                showHideTransition: 'slide',
                icon: _type,
                hideAfter: _hideAfter, 
                position: "top-right", //bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center (Default : top-right )
                textAlign: _textAlign 
            });
            
        }
    }
 
    //function to generate the tabs
    function tabsDynamic(namefile,id,href,icon_tab,nameTab, tipo_archivo){
        
        if(tipo_archivo == null){
             swal("Ocurrio un problema. Selecciona una opción del menu lateral"); 
            return false; 
        }

        if(!$('.customtab').find("#"+id+'-tab').length)
        {

            $('.customtab').append('<li class="nav-item li-tab-toggle" href="#'+href+'"><a class="tab-toggle nav-link" id="'+id+'-tab" data-toggle="tab" href="#'+href+'" role="tab" aria-controls="'+href+'" aria-expanded="false"><span class="hidden-sm-up"><i class="mdi '+icon_tab+'"></i></span><span class="hidden-xs-down">'+nameTab+' <i class="mdi mdi-close-circle-outline bg-tab-icon"></i></span></a></li>');

            $('.tab-content').append('<div role="tabpanel" class="tab-pane fade" id="'+href+'" aria-labelledby="'+id+'-tab"></div>');

                
            if(!$('#'+href).find("."+id).length){
                
                $.ajaxSetup({ cache: false });
                
                $("#"+href).load(namefile+".html", function(){
                    
                    if(tipo_archivo == 0){

                        $("#"+id+" .datepicker").datepicker({
                            format: 'yyyy/mm/dd',
                            autoclose: true,
                            widgetPositioning: {
                                vertical: "bottom", horizontal: "auto"
                            }                  
                        });

                        $("#"+id+" .custom_select").select2();
                        $("#"+id+" .selectpicker").selectpicker();
                        cargarAtencion(id);                        

                    }else if(tipo_archivo == 1){
                        $("#"+id+" .custom_select").select2();
                        $("#"+id+" .dropify").dropify();
                        
                        var drEvent = $('#input-file-events').dropify();

                        drEvent.on('dropify.beforeClear', function(event, element) {
                            return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
                        });

                        drEvent.on('dropify.afterClear', function(event, element) {
                            alert('File deleted');
                        });

                        drEvent.on('dropify.errors', function(event, element) {
                            console.log('Has Errors');
                        });

                        var drDestroy = $('#input-file-to-destroy').dropify();
                        drDestroy = drDestroy.data('dropify')
                        $('#toggleDropify').on('click', function(e) {
                            e.preventDefault();
                            if (drDestroy.isDropified()) {
                                drDestroy.destroy();
                            } else {
                                drDestroy.init();
                            }
                        });


                        $("#formNewProducto input,#formNewProducto select,#formNewProducto textarea").jqBootstrapValidation (
                          {
                            submitSuccess : function (form, event) { 
                              event.preventDefault();    
                              
                              var codigo_barras = $('#cod_barras_pro').val();
                              var marca = $('#marca').val();
                              var modelo = $('#modelo').val();    
                              var color = $('#color').val();
                              var garantia = $('#garantia').val();    
                              var descripcion = $('#descripcion').val();

                              var tipo_prod = $('#tipo_prod').val();
                              var precio_compra = $('#precio_compra').val();
                              var precio_venta = $('#precio_venta').val();
                              var cantidad = $('#cantidad').val();
                              //var imagen = document.getElementById('input-file-now');

                              postRequestForm(`https://${ipp}/api/productos`, {codigo_barras:codigo_barras, 
                                estado:1, precio_venta:precio_venta, precio_compra: precio_compra, marca: marca, modelo: modelo,
                                garantia : garantia, cantidad_disponible : cantidad, color:color, descripcion: descripcion, tipo_producto:tipo_prod})
                                .then(function(data){ 
                                    if(data.ok){
                                        swal("Registro Exitoso","Haz clic para continuar!","info");
                                        $('#formNewProducto')[0].reset();
                                    }else if(data.nok && data.nok.length == 0){
                                       swal("El código de barras ya se encuentra asociado con otro producto.", 'Cambie el código de barras',"warning"); 
                                    }
                                    
                                }).catch(function(error){
                                    swal("No se pudo registrar el producto","Verifica los datos!","warning");
                                });

                            }
                          });

                    }else if(tipo_archivo == 2){
                        
                        $("#"+id+" .custom_select").select2();
                        $("#"+id+" .selectpicker").selectpicker();

                        cargarInvent(id);

                    }else if(tipo_archivo == 3){

                        cargarClientes(id);

                    }else if(tipo_archivo == 4){
                        $("#"+id+" .cedula-inputmask").inputmask("V-99999999");
                        
                        $("#formTabHistorial input").jqBootstrapValidation ({
                            
                            submitSuccess : function (form, event) {
                                event.preventDefault();
                                var cedula = $('#cedula_cliente_historial').val();
                                
                                getRequestForm(`https://${ipp}/api/usuarios/historial-compra/${cedula}`)
                                    .then(function(data){
                                            if(data.historial["factura"].length < 1){
                                                swal("El usuario no posee compras","","info");
                                            }else{
                                                //console.log(data.historial["factura"]);
                                                $('#tableFacturas').removeClass("hide");
                                                $("#"+id+" #tableFacturas").DataTable({                                                    
                                                        "dom": 'f<t>lp<"contentInfo"i>',                                         
                                                        "displayLength": 25,
                                                        "data" : data.historial["factura"],
                                                        "language": {
                                                            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                                                        },                                                                                  
                                                        "columnDefs": [                                
                                                            {
                                                                "targets": 0,
                                                                "className": "hide"
                                                            },                                                            
                                                            {
                                                                "targets": 5,
                                                                "data": null,
                                                                "className": "text-center",
                                                                "defaultContent": "<td><a href='#' class='btnSearchFac'><i class='fas fa-search search'></i></td>"
                                                            }
                                                        ],
                                                        "columns": [                                                            
                                                              {"data" : "id", "visible": true},
                                                              {"data" : "nombre", "visible": true},
                                                              {"data" : "num_factura", "visible": true},
                                                              {"data" : "fecha_facturacion", "visible": true,
                                                                        "render": function ( data, type, row, meta ) {
                                                                            var dates = data.split("-");
                                                                            return dates[2]+'/'+dates[1]+'/'+dates[0];                                                                            
                                                                        }},
                                                              {"data" : "total", "visible": true}                                                          
                                                          ] 
                                                });
                                            }
                                        
                                    }).catch(function(error){
                                       swal("El usuario no posee compras","","warning");
                                    });
                            }
                        });
                        

                    }else if(tipo_archivo == 5){
                        
                        $("#"+id+" .datepicker").datepicker({
                            format: 'yyyy/mm/dd',
                            autoclose: true,
                            widgetPositioning: {
                                vertical: "bottom", horizontal: "auto"
                            }                  
                        });

                        
                        $("#"+id+" .cedula-inputmask").inputmask("V-99999999"); 
                        

                        $("#formTabBauche input,#formTabBauche textarea").jqBootstrapValidation (
                        {
                            submitSuccess : function (form, event) { 
                              event.preventDefault();
                                                            
                              var fecha_ingreso = $('#bauchdate_bauch').val();
                              var fecha_salida = $('#bauchsal_bauch').val();
                              var fecha_reparado = $('#fecha_reparado').val();    
                              
                              var cedula = $('#cedula_bauch').val();
                              var name_bauch = $('#name_bauch').val();
                              var telf_bauch = $('#telf_bauch').val();
                              var dir_bauch = $('#dir_bauch').val();
                              
                              var tipoequi_bauch = $('#tipoequi_bauch').val();
                              var marca_bauch = $('#marca_bauch').val();
                              var modelo_bauch = $('#modelo_bauch').val();
                              var serial_bauch = $('#serial_bauch').val();
                              var estadotel_bauch = $('#estadotel_bauch').val();
                              var diagnostico_bauch = $('#diagnostico_bauch').val();
                              
                              var presup_bauch = $('#presup_bauch').val();
                              var anticipo_bauch = $('#anticipo_bauch').val();
                              var resta_bauch = $('#resta_bauch').val();
 
                                postRequestForm(`https://${ipp}/api/bauches`, 
                                    {fecha_ingreso:fecha_ingreso, cedula:cedula, 
                                        fecha_salida:fecha_salida,fecha_reparado:fecha_reparado, nombre: name_bauch, 
                                        telefono: telf_bauch, estado: 0,
                                        direccion: dir_bauch, tipo_equipo: tipoequi_bauch,
                                        marca: marca_bauch, modelo: modelo_bauch, serial: serial_bauch,
                                        estado_equipo: estadotel_bauch, diagnostico: diagnostico_bauch,
                                        presupuesto: presup_bauch, anticipo: anticipo_bauch,
                                        restante: resta_bauch 
                                    })
                                .then(function(data){ 
                                
                                    if(data.bauche){
                                        
                                        $('#id_bauche').val(data.bauche["id"]);
                                        $('#fech_ini_bauch_edit').val(data.bauche["fecha_ingreso"]);
                                        $('#fech_sal_bauch_edit').val(data.bauche["fecha_salida"]);
                                        $('#fech_rep_bauch_edit').val(data.bauche["fecha_reparado"]);
                                        
                                        $('#ced_user_edit').val(data.bauche["cedula_usuario"]);
                                        $('#nombre_edit').val(data.bauche["nombre"]);
                                        $('#telefono_edit').val(data.bauche["telefono"]);
                                        $('#direccion_edit').text(data.bauche["direccion"]);
                                        
                                        $('#tipo_equipo_edit').val(data.bauche["tipo_equipo"]);
                                        $('#marca_edit').val(data.bauche["marca"]);
                                        $('#modelo_edit').val(data.bauche["modelo"]);
                                        $('#serial_edit').val(data.bauche["serial"]);
                                        $('#estado_telf_edit').val(data.bauche["estado_equipo"]);
                                        $('#diagnostico_edit').text(data.bauche["diagnostico"]);
                                        $('#presupuesto_edit').val(data.bauche["presupuesto"]);
                                        $('#anticipo_edit').val(data.bauche["anticipo"]);
                                        $('#resta_edit').val(data.bauche["restante"]);

                                        swal("Bauche Creado", "Haz clic para mostrar el bauche para imprimir", "info")
                                             .then((willDelete) => {
                                                $('.areaPrint').removeClass('hide');
                                                $('#formTabBauche').addClass('hide');

                                                $('#name_user').text('Nombre Cliente: '+name_bauch);
                                                $('#ced_user').text('Cédula: '+cedula);
                                                $('#dir_user').text('Dirección: '+dir_bauch);
                                                $('#fech_ini_bauch').text(fecha_ingreso);                                                 
                                                if(fecha_salida != null && fecha_salida.lenght > 0){
                                                     $('#fech_sal_bauch').text(fecha_salida);
                                                }else{
                                                    $('#fech_sal_bauch').text('No aplica');
                                                }
                                                if(fecha_reparado != null && fecha_reparado.lenght > 0){
                                                     $('#fech_rep_bauch').text(fecha_reparado);
                                                }else{
                                                    $('#fech_rep_bauch').text('No aplica');
                                                }
                                                if(telf_bauch != null && telf_bauch.lenght > 0){
                                                     $('#tel_user').text('Telefono: '+telf_bauch);
                                                }else{
                                                    $('#tel_user').text('Telefono: No aplica');
                                                }
                                                $('#prep_user').text('Presupuesto: '+presup_bauch+' $COP');
                                                $('#anticipo_user').text('Anticipo: '+anticipo_bauch+' $COP');
                                                $('#resta_user').text('Restante: '+resta_bauch+' $COP');

                                                $('#tipo_equi_user').text('Tipo de Equipo: '+tipoequi_bauch);
                                                $('#marca_user').text('Marca: '+marca_bauch);
                                                $('#modelo_user').text('Modelo: '+modelo_bauch);
                                                $('#serial_user').text('Serial: '+serial_bauch);
                                                $('#estadotel_user').text('Estado del teléfono: '+estadotel_bauch);
                                                $('#diagnostico_user').text('Diagnóstico: '+diagnostico_bauch);
                                                                                          
                                          });
                                        
                                    }

                                })
                                .catch(function(error){
                                      swal("No se pudo crear el bauche","Verifica los datos!","warning");
                                });//fin post

                            
                            }//fin submit form
                        });

                    }else if(tipo_archivo == 6){
                        $("#"+id+" .cedula-inputmask").inputmask("V-99999999"); 
                        $("#"+id+" .datepicker").datepicker({
                            format: 'yyyy/mm/dd',
                            autoclose: true,
                            widgetPositioning: {
                                vertical: "bottom", horizontal: "auto"
                            }                  
                        });
                       
                       $('html body').on('click', '#formTabFactura #addDetailsFactu', function(){
                          var fila_nueva = $('<tr></tr>');
                          var tbody = $('#formTabFactura #tableFacturacion tbody'); 
                          var rand = Math.floor((Math.random() * 1000) + 1);
                          var fila_contenido = '<td><input type="text" data-item="'+rand+'" class="form-control items_factura" id="item_codigo" name="item_codigo[]" ><input type="hidden" id="item_id_'+rand+'" name="item_id[]" ></td>'+
                                '<td><input type="text" readonly="" class="form-control" id="item_name_'+rand+'" name="item_name[]"></td>'+
                                '<td><input type="text" readonly="" class="form-control" id="item_price_'+rand+'" name="item_price[]"></td>'+
                                '<td><input type="number" readonly="" class="form-control" id="item_disponible_'+rand+'" name="item_disponible[]"></td>'+
                                '<td><input type="number" class="form-control cantidad_solit" min="0" max="1" onkeyup="validateNumber('+rand+')" id="item_cant_'+rand+'" name="item_cant[]"></td>'+
                                '<td class="text-center">'+  
                                     '<button disabled="disabled" class="btn btn-danger button_eliminar"><span><i class="fas fa-trash-alt"></i></span></button>'+
                                '</td>';                               

                          fila_nueva.append(fila_contenido); 
                          tbody.prepend(fila_nueva); 

                          $('#formTabFactura #tableFacturacion .button_eliminar').removeAttr('disabled');
                       }); 
                        
                       $('html body').on('click', '#formTabFactura #tableFacturacion .button_eliminar', function(){
                          $(this).parents('tr').eq(0).remove();
                          var tbody = $('#formTabFactura #tableFacturacion tbody tr');
                          if(tbody.length == 2){
                            $('#formTabFactura #tableFacturacion .button_eliminar').attr('disabled', 'disabled');
                          }else{
                            $('#formTabFactura #tableFacturacion .button_eliminar').removeAttr('disabled');
                          }
                       });

                        $(document).on('submit', "#formTabFactura", function( event ) {
                            event.preventDefault();   
                            $("#formTabFactura input").jqBootstrapValidation('destroy');
                            $("#formTabFactura input").not("[type=submit]").jqBootstrapValidation();

                            if (!$("#formTabFactura").jqBootstrapValidation("hasErrors")) {

                                 
                                var fecha_fact = $('#bauchdate_fact').val();
                                var numero_fact = $('#numero_fact').val();
                                var cedula_fact = $('#cedula_fact').val();
                                var name_fact = $('#name_fact').val();
                                var tel_fact = $('#tel_fact').val();
                                var total_fact = $('#total_fact').val();

                                var inputIds = $('input[name="item_id[]"]').slice();
                                var inputPrice = $('input[name="item_price[]"]').slice();
                                var inputName = $('input[name="item_name[]"]').slice();
                                var inputCant = $('input[name="item_cant[]"]').slice();

                                var leng = $('input[name="item_id[]"]').length;
                                var detalleFactura = [];
                                for (var i = 0; i < leng; i++) {
                                   
                                   detalleFactura.push({id_producto:inputIds[i].value, 
                                                        precio: inputPrice[i].value,
                                                        descripcion: inputName[i].value,
                                                        cantidad: inputCant[i].value
                                                    });
                                   
                                }
                              

                              postRequestForm(`https://${ipp}/api/facturas`, {num_factura:numero_fact, 
                                fecha_facturacion:fecha_fact , cedula_usuario:cedula_fact, nombre:name_fact, telefono:tel_fact, 
                                total:total_fact}, detalleFactura)
                                .then(function(data){ 
                                        
                                        swal({
                                          title: "Factura Generada Exitosamente",
                                          text: "Haz clic para imprimir factura!",
                                          type: "info", 
                                          showCancelButton: false, 
                                          confirmButtonColor: "#DD6B55",   
                                          confirmButtonText: "OK",
                                        })
                                        .then((willDelete) => {
                                            //$('#formTabFactura')[0].reset();
                                            
                                            $('.printFactura').removeClass('hide');
                                            $('.formFact').addClass('hide');

                                            $('#fecha_fact_print').text(fecha_fact);
                                            $('#num_fact_print').text(numero_fact);
                                            $('#nombre_print').text(name_fact);
                                            $('#cedula_print').text(cedula_fact);
                                            $('#tel_print').text(tel_fact);

                                            $('#total_fact_print').text(total_fact);

                                            $("#cuerpo_tabla_print").html("");
                                            for(var i=0; i<detalleFactura.length; i++){
                                                var tr = '<tr>'+
                                                  '<td class="text-center">'+(i+1)+'</td>'+ 
                                                  '<td>'+detalleFactura[i].descripcion+'</td>'+
                                                  '<td class="text-right">'+detalleFactura[i].cantidad+'</td>'+
                                                  '<td class="text-right">'+detalleFactura[i].precio+'</td>'+
                                                  '<td class="text-right">'+(parseInt(detalleFactura[i].precio)*(parseInt(detalleFactura[i].cantidad)))+'</td>'+
                                                '</tr>';
                                                $("#cuerpo_tabla_print").append(tr)
                                            }

                                        });
                                       
                                    
                                    
                                }).catch(function(error){
                                    swal("No se pudo registrar la factura","Verifica los datos!","warning");
                                });

                              
                            }

                        });

                    }else if(tipo_archivo == 7){
                        $("#"+id+" .cedula-inputmask").inputmask("V-99999999");
                        
                        $("#formNewCliente input").jqBootstrapValidation (
                        {
                            submitSuccess : function (form, event) { 
                                event.preventDefault();    
                                var cedula = $('#cedula').val();
                                var nombre = $('#nombre').val();
                                var correo = $('#correo').val();
                                var telefono = $('#telefono').val();

                                postRequestForm(`https://${ipp}/api/public/usuarios/registrar`, {cedula:cedula, nombre:nombre, email:correo, telefono: telefono, tipo_usuario: 0}  )
                                .then(function(data){
                                    if(data.ok){
                                        swal("Registro Exitoso!", "Haz click para continuar!", "success");
                                        $('#formNewCliente')[0].reset();
                                    }else{
                                        swal("No se pudo registrar al usuario","Verifica los datos!","warning");
                                    }
                                })
                                .catch(function(error){
                                   swal("No se pudo registrar al usuario","Verifica los datos!","warning");
                                });//fin post
                            }
                        });

                    }else if(tipo_archivo == 9){
                        cargarBauchesAtencion('bauche_das', 99);
                        $("#"+id+" .cedula-inputmask").inputmask("V-99999999");

                        $("#formTabBauches input").jqBootstrapValidation ({                            
                            submitSuccess : function (form, event) {
                                event.preventDefault();
                                var cedula = $('#cedula_cliente_bauche').val();
                                var ced = cedula.split('-');
                                cedula = ced[1];
                                getRequestForm(`https://${ipp}/api/bauches/detalle_user/${cedula}`)
                                .then(function(data)
                                {                                     
                                    
                                    if(data.bauche && data.bauche.length  > 0)
                                    {
                                        if ( $.fn.DataTable.isDataTable$(".myTableBauches") && $(".myTableBauches").length > 0) {
                                                $(".myTableBauches").dataTable().fnClearTable();
                                                $(".myTableBauches").dataTable().fnDestroy();
                                        }
                                        $("#bauche_das #tableBauchesDas").DataTable({
                                                "dom": 'f<t>lp<"contentInfo"i>',
                                                "order": [[ 0, 'asc' ]],
                                                "destroy": true,
                                                "language": {
                                                            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                                                        },
                                                "data" : data.bauche,
                                                "columnDefs": [                                                             
                                                                {
                                                                    "targets": 0,
                                                                    "className": "hide"
                                                                },
                                                                {
                                                                    "targets": 6,
                                                                    "className": "text-center"
                                                                },
                                                                {
                                                                    "targets": 7,
                                                                    "data": null,
                                                                    "className": "text-center",
                                                                    "defaultContent": "<td><a href='#' class='btnConsultarBauche'><i class='fas fa-search'></i></a><a href='#' class='btnActualizarBauche m-l-10'><i class='fas fa-edit'></i></a></td>"
                                                                }
                                                            ],
                                                "columns": [
                                                      {"data" : "id", "visible": true},
                                                      {"data" : "fecha_ingreso", "visible": true, 
                                                                "render": function ( data, type, row, meta ) {
                                                                    var dates = data.split("-");
                                                                    return dates[2]+'/'+dates[1]+'/'+dates[0];                                                                            
                                                                }},
                                                      {"data" : "cedula", "visible": true},
                                                      {"data" : "nombre", "visible": true},                             
                                                      {"data" : "telefono", "visible": true},
                                                      {"data" : "diagnostico", "visible": true},
                                                      {"data" : "estado", "visible": true,
                                                                "render": function ( data, type, row, meta ) {
                                                                    if(data == "0"){
                                                                        return '<i class="mdi mdi-alert-circle icon-table text-warning"></i> En reparación';
                                                                    }else if(data == "1"){
                                                                        return '<i class="mdi mdi-alert-circle icon-table text-green"></i> Reparado';
                                                                    }else{
                                                                        return '<i class="mdi mdi-alert-circle icon-table text-danger"></i> No reparado';
                                                                    }
                                                                }
                                                      },

                                                ]              
                                            });
                                        
                                    }else{
                                        $('#cedula_cliente_bauche').val(''); 
                                        swal("El usuario no posee bauches","Verifique la cédula","warning");                                       
                                        $("#bauche_das #tableBauchesDas").DataTable({
                                            "dom": 'f<t>lp<"contentInfo"i>',
                                            "order": [[ 0, 'asc' ]],
                                            "destroy": true
                                        });                                        
                                    }
                                        
                                }).catch(function(error){                                    
                                   swal("El usuario no posee bauches","Verifique la cédula","warning");                                                                       
                                });
                            }
                        });
                    }else if(tipo_archivo == 10){
                        
                        $("#"+id+" .datepicker").datepicker({
                            format: 'yyyy/mm/dd',
                            autoclose: true,
                            widgetPositioning: {
                                vertical: "bottom", horizontal: "auto"
                            }                  
                        });

                        $("#formTotalVentas input").jqBootstrapValidation ({                            
                            submitSuccess : function (form, event) {
                                event.preventDefault();
                                var fecha = $('#fecha_dia_ventas').val();
                                if(fecha == "" || fecha == null){
                                    swal("Ingrese fecha", "","warning");
                                    return false;
                                }
                                postRequestForm(`https://${ipp}/api/usuarios/admin/ventas`, {fecha:fecha})
                                .then(function(data)
                                { 
                                  $('#titulo_venta').text('Ventas Totales en Pesos: '+ fecha);
                                  $('#ventas_total_diaria').text('Dinero Facturado: '+data.total+' $COP');
                                  $('#ventas_total_diaria_efectivo').text('Dinero en Efectivo: '+data.total_efectivo+' $COP');
                                        
                                }).catch(function(error){                                    
                                   swal("Hubo un error", error.toString(),"warning");                                                                       
                                });
                            }
                        });
                    }else if(tipo_archivo == 11){
                        searchNotifications(99);
                    }else if(tipo_archivo == 14){
                        $('.contAlerProductos').addClass("hide");
                        $('.contAlerProductos').html('');
                        $("#formVentaRapida input").jqBootstrapValidation ({
                            
                            submitSuccess : function (form, event) { 
                              event.preventDefault();    
                              var codg = $('#item_id_').val();
                              var cantd = $('#item_cant_').val();

                              postRequestForm(`https://${ipp}/api/usuarios/compraRapida`, {codigo:codg, 
                                cantidad:cantd})
                                .then(function(data){  
                                    if(data.ok == 'Inventario actualizado'){
                                        if(data.producto){
                                          if(data.producto["cantidad_disponible"] == 0){
                                            $('.contAlerProductos').html('<label>Status</label><div class="alert alert-danger" role="alert">Producto actualizado. <strong>No hay más disponibles</strong> en el inventario</div>');  
                                          }else{
                                            $('.contAlerProductos').html('<label>Status</label><div class="alert alert-success" role="alert">Producto #'+codg+' actualizado. Solo hay <strong>'+data.producto["cantidad_disponible"]+' disponibles</strong> en el inventario</div>');  
                                          }
                                          
                                          $('#item_disponible_').text('');
                                          $('#item_cant_').val('');
                                          $('#total_vent').text('');
                                          $('#item_disponible_').text(data.producto["cantidad_disponible"]);
                                          $('.contAlerProductos').removeClass("hide");
                                        }                                        
                                    }else{
                                        $('.contAlerProductos').html('<label>Status</label><div class="alert alert-warning" role="alert">'+error.toString()+'</div>');
                                        $('.contAlerProductos').removeClass("hide");
                                    }

                                }).catch(function(error){

                                    $('.contAlerProductos').html('<label>Status</label><div class="alert alert-warning" role="alert">'+error.toString()+'</div>');
                                    $('.contAlerProductos').removeClass("hide");

                                });

                              
                            }

                        });
                        
                    }
                         
                });
                    
                
            }
            $('.nav-tabs a[href="#'+href+'"]').tab('show');
        }else{          
            $('.nav-tabs a[href="#' + href + '"]').tab('show');
        }
        
    }


    function searchNotifications(search = 2){
        getRequestForm(`https://${ipp}/api/notificaciones`)
        .then(function(data) {
            
            if(search == 2){
                if(data.cantidad != 0){
                    if($('.notify_custom').hasClass('hide')){
                        $('.notify_custom').removeClass('hide'); 
                    }                   
                }else{
                    if(!$('.notify_custom').hasClass('hide')){
                        $('.notify_custom').addClass('hide');
                    }
                }
                
            }else{
                if(search == 99 && data.cantidad != 0){
                    $('.notificacion .mjsDefaultNotf').addClass("hide");
                                        
                    for (var i = 0; i < data.ok.length; i++) {
                        var html = '<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12"> \
                                        <div class="card bg-light-inverse"> \
                                            <div class="card-body">\
                                                <div class="row">\
                                                    <div class="col-6">\
                                                        <h3 class="card-title">Bauche #'+data.ok[i]["id"]+'</h3>\
                                                    </div> \
                                                    <div class="col-6 text-right"> \
                                                        <button type="button" class="btn btn-success btnVistaNot" data-toggle="button" data-item="'+data.ok[i]["id"]+'" aria-pressed="false"> \                                                       <span class="text text_Notvista">Marcar como Vista</span> \
                                                            <i class="ti-check text-active" aria-hidden="true"></i> \
                                                            <span class="text-active">Vista</span>\
                                                        </button> \
                                                    </div> \
                                                </div> \
                                                <hr role="separator" class="divider"/>\
                                                <p class="f-w-600">Datos del Usuario:</p>\
                                                <div class="row">\
                                                    <div class="col-6">\
                                                        <p class="card-text"><b>Nombre:</b> '+data.ok[i]["bauches"]["nombre"]+'</p>\
                                                    </div>\
                                                    <div class="col-6">\
                                                        <p class="card-text"><b>Cédula:</b> '+data.ok[i]["bauches"]["cedula"]+'</p>\
                                                    </div>\
                                                    <div class="col-6">\
                                                        <p class="card-text"><b>Teléfono:</b> '+data.ok[i]["bauches"]["telefono"]+'</p>\
                                                    </div>\
                                                    <div class="col-6">\
                                                        <p class="card-text"><b>Dirección:</b> '+data.ok[i]["bauches"]["direccion"]+'</p>\
                                                    </div>\
                                                </div>\
                                                <hr role="separator" class="divider"/>\
                                                <p class="f-w-600">Detalle del Bauche:</p>\
                                                <div class="row">\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Fecha Ingresa:</b> <br/>'+data.ok[i]["bauches"]["fecha_ingreso"]+'</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Fecha Reparado:</b> <br/>'+data.ok[i]["bauches"]["fecha_reparado"]+'</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Fecha Salida:</b> <br/>'+data.ok[i]["bauches"]["fecha_salida"]+'</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Marca:</b> <br/>'+data.ok[i]["bauches"]["marca"]+'</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Modelo:</b> <br/>'+data.ok[i]["bauches"]["modelo"]+'</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Serial:</b> <br/>'+data.ok[i]["bauches"]["serial"]+'</p>\
                                                    </div>\
                                                    <div class="col-12  p-t-10">\
                                                        <p class="card-text">Diagnóstico: '+data.ok[i]["bauches"]["diagnostico"]+'</p>\
                                                    </div>\
                                                </div>\
                                                <hr role="separator" class="divider"/>\
                                                <p class="f-w-600">Precio de la reparación:</p>\
                                                <div class="row">\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Presupuesto:</b> <br/>'+data.ok[i]["bauches"]["presupuesto"]+' $COP</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Anticipo:</b> <br/>'+data.ok[i]["bauches"]["anticipo"]+' $COP</p>\
                                                    </div>\
                                                    <div class="col-4">\
                                                        <p class="card-text"><b>Restante:</b> <br/>'+data.ok[i]["bauches"]["restante"]+' $COP</p>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>';

                        $('.contenidoNot').append(html);
                    
                    }
                   

                }else{
                    $('.notificacion .mjsDefaultNotf').removeClass("hide");
                }
            }
            
        }).catch(function(error){
                  console.log(error.toString());
        });
    }


    function changeBaucheValor(){
        
        var input_presu = $('.bauche_all #presup_bauch').val();
        var input_anticp = $('.bauche_all #anticipo_bauch').val();

        if(input_presu != null && input_presu != ''){
            if(input_anticp != null && input_anticp != ''){
                
                if(parseFloat(input_presu) >= parseFloat(input_anticp)){                    
                    val_actu = parseFloat(input_presu) - parseFloat(input_anticp);
                    $('.bauche_all #resta_bauch').val(val_actu);
                }
            }else{
               $('.bauche_all #resta_bauch').val('');
               $('.bauche_all #anticipo_bauch').val('');                
            }
        }
        else{
           $('.bauche_all #resta_bauch').val('');
           $('.bauche_all #anticipo_bauch').val(''); 
           $('.bauche_all #presup_bauch').val('');
        }

    }


    function changeSelect(chek, select){
        var target = $('#'+chek).attr('data-target');
        if( $('#'+target).is(':disabled') && $('#'+chek).val() == select ) {
            $('#'+target).removeAttr('disabled');
            
            $('#codigo_barras_servicio').attr('disabled','disabled');
            
            $('.tableServicio').addClass('hide');
            $('.tableBauches').removeClass('hide');

            cargarBauchesAtencion("servico_cliente");

        }else{
            $('#'+target).attr('disabled','disabled');
            
            $('#codigo_barras_servicio').removeAttr('disabled');
            
            $('.tableBauches').addClass('hide');
            $('.tableServicio').removeClass('hide');

            cargarAtencion("servico_cliente");

        }
    }

    function changeUser(chek){
        if( $('#'+chek).is(':checked') ) {
            $('.clienteSystem').addClass('hide');
            $('.usuarioSystem').removeClass('hide');
            cargarClientes('das_clientes', true);
        }else{
            $('.clienteSystem').removeClass('hide');
            $('.usuarioSystem').addClass('hide');
            cargarClientes('das_clientes');
        }
    }

    function closeTabActive(){

        var nav = $('.tab-toggle.active');
        var href = $(nav).attr('href');
        var tabs = $('.tab-toggle').length;
        nav.add($(nav).attr('href')).remove();
        $('li[href="'+href+'"]').remove();
        $('.nav-tabs a:last').tab('show');
        
    }

    function reset_imagen(){        
        $('.dropify-clear').click();
    }


    function editarBauche(){
    
        var id = $('#id_bauche').val();
        var fech_ing = $('#fech_ini_bauch_edit').val();
        var fech_sal = $('#fech_sal_bauch_edit').val();
        var fech_rep = $('#fech_rep_bauch_edit').val();
        var nombre = $('#nombre_edit').val();
        var telefono = $('#telefono_edit').val();
        var direccion = $('#direccion_edit').val();
        var tipo_equipo = $('#tipo_equipo_edit').val();
        var marca = $('#marca_edit').val();
        var modelo = $('#modelo_edit').val();
        var serial = $('#serial_edit').val();
        var estado_telf = $('#estado_telf_edit').val();
        var diagnostico = $('#diagnostico_edit').val();
        var presupuesto = $('#presupuesto_edit').val();
        var anticipo = $('#anticipo_edit').val();
        var resta = $('#resta_edit').val();        
        
        putRequestForm(`https://${ipp}/api/bauches/${id}`,{
        fecha_ingreso:fech_ing, 
        fecha_salida:fech_sal,fecha_reparado:fech_rep, nombre: nombre, 
        telefono: telefono, direccion: direccion, tipo_equipo: tipo_equipo,
        marca: marca, modelo: modelo, serial: serial,
        estado_equipo: estado_telf, diagnostico: diagnostico,
        presupuesto: presupuesto, anticipo: anticipo,
        restante: resta 
        })

        .then(function(data){ 
        
            if(data.bauche){
                swal("Bauche Editado Exitosamente", "Haz clic para mostrar el bauche para imprimir", "info")
                     .then((willDelete) => {
                        
                        $('#myModalEditBauche').modal("hide");

                        $('#fech_ini_bauch').text(fech_ing);
                        $('#name_user').text('Nombre Cliente: '+nombre);
                        $('#dir_user').text('Dirección: '+direccion);

                        $('#prep_user').text('Presupuesto: '+presupuesto+' $COP');
                        $('#anticipo_user').text('Anticipo: '+anticipo+' $COP');
                        $('#resta_user').text('Restante: '+resta+' $COP');

                        if(fech_sal != null){
                            $('#fech_sal_bauch').text(fech_sal);
                        }else{
                            $('#fech_sal_bauch').text('No aplica');
                        }
                        if(fech_rep != null && fech_rep.lenght > 0){
                             $('#fech_rep_bauch').text(fech_rep);
                        }else{
                            $('#fech_rep_bauch').text('No aplica');
                        }
                        
                        if(telefono != null && telefono.lenght > 0){
                             $('#tel_user').text('Telefono: '+telefono);
                        }else{
                            $('#tel_user').text('Telefono: No aplica');
                        }

                        $('#tipo_equi_user').text('Tipo de equipo: '+tipo_equipo);
                        $('#marca_user').text('Marca: '+marca);
                        $('#modelo_user').text('Modelo: '+modelo);
                        $('#serial_user').text('Serial: '+serial);
                        $('#estadotel_user').text('Estado del teléfono: '+estado_telf);
                        $('#diagnostico_user').text('Diagnóstico: '+diagnostico);

                  });
                
            }else{
                swal("No se pudo editar el bauche","Verifica los datos!","warning");
                $('#myModalEditBauche').modal("hide");
            }

        })
        .catch(function(error){
              swal("No se pudo editar el bauche","Verifica los datos!","warning");
              $('#myModalEditBauche').modal("hide");
          });//fin put

    }


    function cargarInvent(id){

        if ( !$.fn.DataTable.isDataTable('.myTable') && $(".myTable").length > 0) {
            $("#"+id+" #tableInventory").dataTable().fnClearTable();
            $("#"+id+" #tableInventory").dataTable().fnDestroy();
        }
        getRequestForm(`https://${ipp}/api/productos`)
        .then(function(data) {
            if(data.productos && data.productos.length > 0){

                var type = localStorage.getItem("type");
                if(type == "1"){
                    
                    $("#"+id+" #tableInventory").DataTable({
                        "dom": 'Bf<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "lengthChange": false,
                        "destroy": true,
                        "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                        "buttons": [ 'excel', 'pdf' ],
                        "data" : data.productos,
                        "columnDefs": [
                            {
                                "targets": 6,
                                "className": "text-center",
                            },
                            {
                                "targets": 0,
                                "className": "hide",
                            },
                            {
                                "targets": 7,
                                "className": "text-center",
                                "defaultContent": '<td><a href="#" id="editProductoInventario"><span><i class="fas fa-edit"></i></span></a></td>'
                            }
                        ],
                        "columns": [
                              {"data" : "id", "visible": true},
                              {"data" : "codigo_barras", "visible": true},
                              {"data" : "marca", "visible": true},
                              {"data" : "modelo", "visible": true}, 
                              {"data" : "precio_compra", "visible": true},
                              {"data" : "precio_venta", "visible": true},
                              {"data" : "cantidad_disponible", "visible": true},

                        ],                            
                        "displayLength": 25
                                       
                    });

                }else{

                    $("#"+id+" #tableInventory").DataTable({
                        "dom": 'f<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "lengthChange": false,
                        "destroy": true,
                        "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                        "data" : data.productos,
                        "columnDefs": [
                            {
                                "targets": 6,
                                "className": "text-center",
                            },
                            {
                                "targets": 0,
                                "className": "hide",
                            },
                            {
                                "targets": 4,
                                "className": "hide",
                            },
                            {
                                "targets": 7,
                                "className": "text-center",
                                "defaultContent": '<td><a href="#" id="editProductoInventario"><span><i class="fas fa-edit"></i></span></a></td>'
                            }
                        ],
                        "columns": [
                              {"data" : "id", "visible": true},
                              {"data" : "codigo_barras", "visible": true},
                              {"data" : "marca", "visible": true},
                              {"data" : "modelo", "visible": true}, 
                              {"data" : "precio_compra", "visible": false},
                              {"data" : "precio_venta", "visible": true},
                              {"data" : "cantidad_disponible", "visible": true},

                        ],                            
                        "displayLength": 25
                                       
                    });
                }

                
                
            }else{
                swal("Productos", "No hay productos registrados","info");
            }
            
        }).catch(function(error){
                  swal("Error",error.toString(),"warning");
        });
    }

    function editarProducto(){
        var id = $("#id_produc_edit").val();

        var codigo_barras = $('#barras_edit').val();
        var marca = $('#marca_edit').val();
        var modelo = $('#modelo_edit').val();    
        var color = $('#color_edit').val();
        var garantia = $('#garantia_edit').val();    
        var descripcion = $('#descripcion_edit').val();

        var tipo_prod = $('#tipo_prod_edit').val();
        var precio_compra = $('#precio_compra_edit').val();
        var precio_venta = $('#precio_venta_edit').val();
        var cantidad = $('#cantidad_edit').val();
        var estado = $('#estado_edit').val();

        putRequestForm(`https://${ipp}/api/productos/${id}`,{codigo_barras:codigo_barras, 
                                estado:estado, precio_venta:precio_venta, precio_compra: precio_compra, 
                                marca: marca, modelo: modelo,
                                garantia : garantia, cantidad_disponible : cantidad, color:color, descripcion: descripcion, tipo_producto:tipo_prod} )
        .then(function(data){ 
            swal("Actualización Exitosa","Haz clic para continuar!","info");
            $('#myModalEditProducto').modal("hide");
            cargarInvent('inventario_producto');
        }).catch(function(error){
              swal("No se pudo editar el producto","Verifica los datos!","warning");
              $('#myModalEditProducto').modal("hide");
          });//fin put
    }


    function cargarClientes(id, system = false){
        if ( $.fn.DataTable.isDataTable('.myTable') && $(".myTable").length > 0) {
            $("#"+id+" #tableClientes").dataTable().fnClearTable();
            $("#"+id+" #tableClientes").dataTable().fnDestroy();
        }
        getRequestForm(`https://${ipp}/api/usuarios`)
        .then(function(data) {
            if(data.usuarios && data.usuarios.length > 0){
                
                if(system){
                    $("#"+id+" #tableUsuario").DataTable({
                        "dom": 'f<t>p',
                        "order": [[ 1, 'asc' ]],
                        "destroy": true,
                        "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                        "data" : data.usuarios.filter(usuario => usuario.tipo_usuario > 0 ),
                        "columns": [
                              {"data" : "tipo_usuario", "visible": true,
                                  "render": function ( data, type, row, meta ) {
                                            if(data == "1"){
                                                return 'Administrador';
                                            }else if(data == "2"){
                                                return 'Caja';
                                            }else{
                                                return 'Atención al Cliente';
                                            }
                                        }      
                              },                                                            
                              {"data" : "cedula", "visible": true},
                              {"data" : "nombre", "visible": true},                              
                              {"data" : "tipo_usuario", "visible": true,
                                        "render": function ( data, type, row, meta ) {
                                            if(data == "1"){
                                                return 'Admin1234';
                                            }else if(data == "2"){
                                                return 'Caja4321';
                                            }else{
                                                return 'Atencion0987';
                                            }
                                        } 
                              },
                        ],                            
                        "displayLength": 10
                                       
                    });          
                }else{
                    
                    $("#"+id+" #tableClientes").DataTable({
                        "dom": 'f<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "destroy": true,
                        "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                        "data" : data.usuarios.filter(usuario => usuario.tipo_usuario < 1 ),
                        "columnDefs": [
                            {
                                "targets": 4,
                                "className": "text-center",
                                "defaultContent": '<a href="#" id="btnEliminarClientes"><span><i class="fas fa-trash-alt"></i></span></a>'
                            }
                        ],
                        "columns": [
                              {"data" : "cedula", "visible": true},                                                            
                              {"data" : "nombre", "visible": true},
                              {"data" : "email", "visible": true},
                              {"data" : "telefono", "visible": true},
                        ],                            
                        "displayLength": 10
                                       
                    });
                }
                
                
            }else{
                swal("Usuarios", "No hay usuarios registrados","warning");
            }
            
        }).catch(function(error){
            swal("Error",error.toString(),"warning");
        });
      
    }


    function cargarBauchesAtencion(id, admin = 2){
        
        
            getRequestForm(`https://${ipp}/api/bauches`)
            .then(function(data) {
                if(admin == 2){
                    if ( $.fn.DataTable.isDataTable("#"+id+" #tableBauchesList") && $("#"+id+" #tableBauchesList").length > 0) {
                        $("#"+id+" #tableBauchesList").dataTable().fnClearTable();
                        $("#"+id+" #tableBauchesList").dataTable().fnDestroy();
                    }          
                    if(data.bauche && data.bauche.length  > 0){
                        $("#"+id+" #tableBauchesList").DataTable({
                                "dom": 'f<t>lp<"contentInfo"i>',
                                "order": [[ 0, 'asc' ]],
                                "destroy": true,
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                                },
                                "data" : data.bauche,
                                "columns": [
                                      {"data" : "fecha_ingreso", "visible": true,
                                                "render": function ( data, type, row, meta ) {
                                                    var dates = data.split("-");
                                                    return dates[2]+'/'+dates[1]+'/'+dates[0];                                                                            
                                                }},
                                      {"data" : "cedula", "visible": true},
                                      {"data" : "nombre", "visible": true},                             
                                      {"data" : "telefono", "visible": true},
                                      {"data" : "diagnostico", "visible": true},
                                      {"data" : "estado", "visible": true,
                                                "render": function ( data, type, row, meta ) {
                                                    if(data == "0"){
                                                        return '<i class="mdi mdi-alert-circle icon-table text-warning"></i> En reparación';
                                                    }else if(data == "1"){
                                                        return '<i class="mdi mdi-alert-circle icon-table text-green"></i> Reparado';
                                                    }else{
                                                        return '<i class="mdi mdi-alert-circle icon-table text-danger"></i> No reparado';
                                                    }
                                                }
                                      },

                                ],
                                "columnDefs": [ 
                                    {
                                    "targets": 5,
                                    "className": "text-center"
                                    }
                                ],                            
                                "displayLength": 25
                                               
                            });
                        
                    }else{
                        var table = $("#"+id+" #tableBauchesList").DataTable({
                                "dom": 'f<t>lp<"contentInfo"i>',
                                "order": [[ 0, 'asc' ]],
                                "destroy": true
                            });
                    }
                }else{
                    if ( $.fn.DataTable.isDataTable("#"+id+" #tableBauchesDas") && $("#"+id+" #tableBauchesDas").length > 0) {
                        $("#"+id+" #tableBauchesDas").dataTable().fnClearTable();
                        $("#"+id+" #tableBauchesDas").dataTable().fnDestroy();
                    } 
                    if(data.bauche && data.bauche.length  > 0){
                        $("#"+id+" #tableBauchesDas").DataTable({
                                "dom": 'f<t>lp<"contentInfo"i>',
                                "order": [[ 0, 'asc' ]],
                                "destroy": true,
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                                },
                                "data" : data.bauche,
                                "columnDefs": [                                                             
                                                {
                                                    "targets": 0,
                                                    "className": "hide"
                                                },
                                                {
                                                    "targets": 6,
                                                    "className": "text-center"
                                                },
                                                {
                                                    "targets": 7,
                                                    "data": null,
                                                    "className": "text-center",
                                                    "defaultContent": "<td><a href='#' class='btnConsultarBauche'><i class='fas fa-search'></i></a><a href='#' class='btnActualizarBauche m-l-10'><i class='fas fa-edit'></i></a></td>"
                                                }
                                            ],
                                "columns": [
                                      {"data" : "id", "visible": true},
                                      {"data" : "fecha_ingreso", "visible": true, 
                                                "render": function ( data, type, row, meta ) {
                                                    var dates = data.split("-");
                                                    return dates[2]+'/'+dates[1]+'/'+dates[0];                                                                            
                                                }},
                                      {"data" : "cedula", "visible": true},
                                      {"data" : "nombre", "visible": true},                             
                                      {"data" : "telefono", "visible": true},
                                      {"data" : "diagnostico", "visible": true},
                                      {"data" : "estado", "visible": true,
                                                "render": function ( data, type, row, meta ) {
                                                    if(data == "0"){
                                                        return '<i class="mdi mdi-alert-circle icon-table text-warning"></i> En reparación';
                                                    }else if(data == "1"){
                                                        return '<i class="mdi mdi-alert-circle icon-table text-green"></i> Reparado';
                                                    }else{
                                                        return '<i class="mdi mdi-alert-circle icon-table text-danger"></i> No reparado';
                                                    }
                                                }
                                      },

                                ]              
                            });
                        
                    }else{
                        var table = $("#"+id+" #tableBauchesDas").DataTable({
                                "dom": 'f<t>lp<"contentInfo"i>',
                                "order": [[ 0, 'asc' ]],
                                "destroy": true
                            });
                    }
                }
                
            }).catch(function(error){                
                swal("Error", error.toString(),"warning");
            });

    }

    function cargarAtencion(id){
        $("#"+id+" #formTabServicioCliente")[0].reset();
        if ( !$.fn.DataTable.isDataTable('.myTable') && $(".myTable").length > 0) {
            $("#"+id+" #tableServicio").dataTable().fnClearTable();
            $("#"+id+" #tableServicio").dataTable().fnDestroy();
        }
        getRequestForm(`https://${ipp}/api/productos`)
        .then(function(data) {
                        
            if(data.productos && data.productos.length  > 0){
                var table = $("#"+id+" #tableServicio").DataTable({
                        "dom": 'f<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "destroy": true,
                        "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                        "data" : data.productos,
                        "columnDefs": [
                            {
                                "targets": 4,
                                "className": "text-center",
                            }                            
                        ],
                        "columns": [
                              {"data" : "codigo_barras", "visible": true},
                              {"data" : "marca", "visible": true},
                              {"data" : "modelo", "visible": true},                             
                              {"data" : "precio_venta", "visible": true},
                              {"data" : "cantidad_disponible", "visible": true},

                        ],                            
                        "displayLength": 25
                                       
                    });
                
            }else{
                var table = $("#"+id+" #tableServicio").DataTable({
                        "dom": 'f<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "destroy": true
                    });
            }
            
        }).catch(function(error){
                  swal("Error",error.toString(),"warning");
        });
    }


    function searchInventFiltros(id){
        
        var tip_ser = $('#tipo_ser_servicio').val();
        if(tip_ser == 1){
            
            var barras_servicio = $('#codigo_barras_servicio').val();
            
            if(barras_servicio == ""){
                return false;
            }
            
            $("#"+id+" #tableServicio").dataTable().fnClearTable();
            $("#"+id+" #tableServicio").dataTable().fnDestroy();

            getRequestForm(`https://${ipp}/api/productos?codigo=${barras_servicio}`)
            .then(function(data) {
                
                
                if(data.productos && data.productos  > 0){
                    
                    $("#"+id+" #tableServicio").DataTable({
                            "dom": 'f<t>lp<"contentInfo"i>',
                            "order": [[ 0, 'asc' ]],
                            "destroy": true,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                            "data" : data.productos,
                            "columnDefs": [
                                {
                                    "targets": 5,
                                    "className": "text-center",
                                }                            
                            ],
                            "columns": [
                                  {"data" : "codigo_barras", "visible": true},
                                  {"data" : "marca", "visible": true},
                                  {"data" : "modelo", "visible": true},                             
                                  {"data" : "precio_venta", "visible": true},
                                  {"data" : "cantidad_disponible", "visible": true},

                            ],                            
                            "displayLength": 25
                                           
                        });
                    
                }else{
                    swal("No hay productos","","warning");
                    $("#"+id+" #tableServicio").DataTable({
                            "dom": 'f<t>lp<"contentInfo"i>',
                            "order": [[ 0, 'asc' ]],
                            "destroy": true
                        });
                }
                
            }).catch(function(error){
                swal("No hay productos","","warning");
                $("#"+id+" #formTabServicioCliente")[0].reset();
                $("#"+id+" #tableServicio").DataTable({
                            "dom": 'f<t>lp<"contentInfo"i>',
                            "order": [[ 0, 'asc' ]],
                            "destroy": true
                        });
            });

        }else{
            var fech_servicio = $('#fecha_bus_servicio').val();

            if(fech_servicio == ""){
                return false;
            }
            
            $("#"+id+" #tableBauchesList").dataTable().fnClearTable();
            $("#"+id+" #tableBauchesList").dataTable().fnDestroy();

            getRequestForm(`https://${ipp}/api/bauches?fecha=${fech_servicio}`)
            .then(function(data) {
                
                if(data.bauche && data.bauche.length  > 0){
                    
                    $("#"+id+" #tableBauchesList").DataTable({
                        "dom": 'f<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "destroy": true,
                        "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            },
                        "data" : data.bauche,
                        "columns": [
                              {"data" : "fecha_ingreso", "visible": true},
                              {"data" : "cedula_usuario", "visible": true},
                              {"data" : "user.nombre", "visible": true},                             
                              {"data" : "user.telefono", "visible": true},
                              {"data" : "descripcion", "visible": true},
                              {"data" : "estado", "visible": true,
                                        "render": function ( data, type, row, meta ) {
                                            if(data == "0"){
                                                return '<i class="mdi mdi-alert-circle icon-table text-warning"></i> En reparación';
                                            }else if(data == "1"){
                                                return '<i class="mdi mdi-alert-circle icon-table text-green"></i> Reparado';
                                            }else{
                                                return '<i class="mdi mdi-alert-circle icon-table text-danger"></i> No reparado';
                                            }
                                        }
                              },

                        ],
                        "columnDefs": [ 
                            {
                            "targets": 5,
                            "className": "text-center"
                            }
                        ],                            
                        "displayLength": 10
                                       
                    });
                    
                }else{
                    swal("No hay bauches","","warning");
                    
                    $("#"+id+" #tableBauchesList").DataTable({
                        "dom": 'f<t>lp<"contentInfo"i>',
                        "order": [[ 0, 'asc' ]],
                        "destroy": true
                    });
                }
                
            }).catch(function(error){
                swal("No hay bauches","","warning");
                $("#"+id+" #formTabServicioCliente")[0].reset();
                $("#"+id+" #tableBauchesList").DataTable({
                    "dom": 'f<t>lp<"contentInfo"i>',
                    "order": [[ 0, 'asc' ]],
                    "destroy": true
                });
            });
        }
        
    }
    

    function postRequestForm(url, data, espc = false) {
        
        var formData = new FormData();
        Object.keys(data).forEach(item => formData.append(item,data[item]))

        if(espc != false){
            for (var i = 0; i < espc.length; i++) {
               formData.append("detalleFactura["+i+"][id_producto]",espc[i]["id_producto"]);
               formData.append("detalleFactura["+i+"][precio]",espc[i]["precio"]);
               formData.append("detalleFactura["+i+"][descripcion]",espc[i]["descripcion"]);
               formData.append("detalleFactura["+i+"][cantidad]",espc[i]["cantidad"]);
            }
        }

        var user = JSON.parse(localStorage.getItem("usuario"));
        var token = user['token'];
        
        if(!espc){

           return fetch(url, {
                method: 'POST',
                dataType: 'formData',
                body:  JSON.stringify(data),
                headers: new Headers({
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization' : 'Bearer '+ token
                    }),
              })
              .then(response => response.json()) 
        }else{
            return fetch(url, {
                method: 'POST',
                dataType: 'formData',
                body:  formData,
                headers: new Headers({
                      'Accept': 'application/json',
                      'Authorization' : 'Bearer '+ token
                    }),
              })
              .then(response => response.json())
        }

          
                                      
        }


    function putRequestForm(url, data) {
        
        var user = JSON.parse(localStorage.getItem("usuario"));
        var token = user['token'];        
            return fetch(url, {
                method: 'PUT',
                dataType: 'JSON',
                body:  JSON.stringify(data),
                headers: new Headers({
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer '+ token
                }),
              })
              .then(response => response.json())                           
    }


  
    function getRequestForm(url) {
        var user = JSON.parse(localStorage.getItem("usuario"));
        var token = user['token'];
        return fetch(url, {            
            method: 'GET',            
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization' : 'Bearer '+ token
            }),
          })
          .then(response => response.json())                           
    }



