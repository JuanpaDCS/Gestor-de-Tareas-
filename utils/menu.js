import inquirer from 'inquirer';

export default async function mostrarMenu() {
    const { opcion } = await inquirer.prompt([
        {
            type: 'list',
            name: 'opcion',
            message: 'Selecciona una opción:',
            choices: [
                { name: '1. Agregar tarea', value: '1' },
                { name: '2. Listar todas las tareas', value: '2' },
                { name: '3. Listar tareas pendientes', value: '3' },
                { name: '4. Listar tareas completadas', value: '4' },
                { name: '5. Marcar/desmarcar tareas', value: '5' },
                { name: '6. Eliminar tarea', value: '6' },
                { name: '7. Salir', value: '7' }
            ]
        }
    ]);
    return opcion;
}