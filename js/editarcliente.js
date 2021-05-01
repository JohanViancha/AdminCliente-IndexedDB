(function(){
    let DB;
    let idCliente;
    $(document).ready(function () {
        
        conectarDB();

        $("#formulario").submit(actualizarCliente);

        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');

        if(idCliente){

            setTimeout(() => {
                obtenerCliente(idCliente);
 
            }, 50);
        }

    });



    function actualizarCliente(e) {

        e.preventDefault();

        if($("#nombre").val() === ''||
        $("#email").val() === '' ||
        $("#telefono").val() === '' ||
        $("#empresa").val() === ''){

             Swal.fire(
                'Todos los campos son obligatorios',
                '',
                'error'
            )
        }
        else{
            const clienteActualizado = {
                nombre: $("#nombre").val(),
                email: $("#email").val(),
                telefono: $("#telefono").val(),
                empresa : $("#empresa").val(),
                id: Number(idCliente)
            }


            const transaction = DB.transaction(['crm'],'readwrite');

            const objectStore = transaction.objectStore('crm');
            objectStore.put(clienteActualizado);

            transaction.oncomplete= function(){
                Swal.fire(
                    'El cliente ha sido editado',
                    '',
                    'success'
                ).then(()=> window.location.href= 'index.html');

            }

            transaction.onerror = function(){

                console.log('Hubo un error');
            }
        }



        
    }


    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){

                if(cursor.value.id === Number(id)){

                   llenarFormulario(cursor.value); 

                }

                cursor.continue();
            }
        }
    }


    function llenarFormulario(datosCliente){

        $("#nombre").val(datosCliente.nombre);
        $("#email").val(datosCliente.email);
        $("#telefono").val(datosCliente.telefono);
        $("#empresa").val(datosCliente.empresa);
    }


    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(e){
            console.log('Hubo error');
        }

        abrirConexion.onsuccess = function(){
            DB =abrirConexion.result;

        }
    }

})();