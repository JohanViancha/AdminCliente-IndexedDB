

    let DB;
    let tabla;
(function(){


    $(document).ready( function () {

        crearDB();
        conectarDB();

        if(window.indexedDB.open('crm',1)){

            obtenerClientes();
        }

    
    
    } );


    
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(e){
            console.log('Hubo error');
        }

        abrirConexion.onsuccess = function(){
            DB =abrirConexion.result;

        }
    }

    function crearDB(){
        const crearDB = window.indexedDB.open('crm',1);

        crearDB.onerror = function(){
            console.log('Hubo un error');
        }

        crearDB.onsuccess = function(){
            DB = crearDB.result;
        }


        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm',{keyPath:'id', autoIncrement:true});

            objectStore.createIndex('nombre','nombre',{unique:false});
            objectStore.createIndex('email','email',{unique:true});
            objectStore.createIndex('telefono','telefono',{unique:false});
            objectStore.createIndex('empresa','empresa',{unique:false});
            objectStore.createIndex('id','id',{unique:true});

            console.log('DB Lista y Creada');

        }
    }




    function obtenerClientes() {
        
        const abrirConexion = window.indexedDB.open('crm',1);

        abrirConexion.onerror = function() {
            
            console.log('Hubo error');
        }

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
            let cliente = [];
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e){

                const cursor = e.target.result;
                
                if(cursor){

                    const {nombre,email, telefono, empresa, id} = cursor.value;

                    cliente.push({nombre,email, telefono,empresa,id});
                    cursor.continue();

                    
                }
                else{

                    var nuevoArreglo = cliente.map(function(o) {
                        return Object.keys(o).reduce(function(array, key) {
                            return array.concat([o[key]]);
                        }, []);
                    });

                    
                    tabla = $('#myTable').DataTable( {
                        "lengthMenu": [ 5, 10,15,20, 50, 100 ],
                        "destroy":true,
                         "language": {
                            "lengthMenu": "Mostrar _MENU_ registros por página",
                            "zeroRecords": "No hay clientes registrados",
                            "info": "Página _PAGE_ de _PAGES_",
                            "infoEmpty": "Cero regisros",
                            "paginate": {
                                "first":      "Primero",
                                "last":       "Ultimo",
                                "next":       "Siguiente",
                                "previous":   "Anterior"
                            },
                            "search":         "Buscar:",
                            "infoFiltered": "(filtered from _MAX_ total records)"
                            },
                        data: nuevoArreglo,
                        columns: [
                            { nombre: "nombre",

                                //Si el estado es activo entonces...
                            "render": function(data,type,row,meta){

                                let nombre = `<p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${data}</p>`;
                                let email =  `<p class="text-sm leading-10 font-medium text-gray-700">${row[1]}</p>`;
                                return nombre + email;
                                }
                            },
                            {  tefono: "",
                                "render": function(data,type,row,meta){

                                return `<p class="text-gray-700">${row[2]}</p>`;
                            }   
                             },
                            { empresa: "",
                            "render": function(data,type,row,meta){

                                return `<p class="text-gray-700">${row[3]}</p>`;
                            }  
                            },
                            { opciones: "",
                                "render": function(data,type,row,meta){

                                    let editar = `<a href="editar-cliente.html?id=${row[4]}"><button class="btn btn-info border-0">Editar</button></a>`;
                                    let eliminar = ` <a><button onclick="eliminar(event,${row[4]})" data-cliente="${row[4]}" class="btn btn-danger border-0">Eliminar</button></a>`

                                    return editar+eliminar;
                                }
                            }
                        ]
                    } );
                    
                }
            }

        }
    }




   
})();



 
function eliminar(event,idEliminar){

    Swal.fire({
        title: "¿Está seguro que desea eliminar al cliente?",
        type: "question",
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#319795',
        cancelButtonColor: '#d33',
      })
      .then((result) => {
        if (result.value) {
            const transaction = DB.transaction(['crm'], 'readwrite');
            const objectStore = transaction.objectStore('crm');
         
            objectStore.delete(idEliminar);

            transaction.oncomplete = function(){
                Swal.fire(
                    'El cliente ha sido eliminado',
                    '',
                    'success'
                ).then(()=> {
                    
                    event.target.parentElement.parentElement.parentElement.remove();

                });


            }

            transaction.onerror = function(){
                console.log('Hubo un error');
            }

        }
    });

    }