(function(){


    let DB;


    $(document).ready( function () {


        conectarDB();
        $("#formulario").submit(validarCliente);


    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(e){
            console.log('Hubo error');
        }

        abrirConexion.onsuccess = function(){
            DB =abrirConexion.result;

        }
    }


    function validarCliente(e){
        e.preventDefault();
        const nombre = $("#nombre").val();
        const email = $("#email").val();
        const telefono = $("#telefono").val();
        const empresa = $("#empresa").val();
        

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){

            Swal.fire(
                'Todos los campos son obligatorios',
                '',
                'error'
            )
        }
        else{

            const cliente = {
                nombre,
                email,
                telefono,
                empresa
            }

            cliente.id = Date.now();

            crearNuevoCliente(cliente);
        }
      
    }

    function crearNuevoCliente(cliente){

        const transaction = DB.transaction('crm','readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function(e){
            Swal.fire(
                'Hubo un error al crear el registro',
                '',
                'error'
            )
        }

        transaction.oncomplete = function(){
            Swal.fire(
                'El cliente ha sido creado',
                '',
                'success'
            ).then(()=> window.location.href= 'index.html');
        }
    }

})();