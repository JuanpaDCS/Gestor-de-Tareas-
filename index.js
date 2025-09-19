import mostrarMenu from './utils/menu.js';
import TareasController from './controllers/tareasController.js';
import { conectarDB, desconectarDB } from './db/mongo.js';
import chalk from 'chalk';

async function main() {
    let salir = false;
    let tareasController;

    await conectarDB();
    tareasController = new TareasController();

    while (!salir) {
        const opcion = await mostrarMenu();
        switch (opcion) {
            case '1':
                await tareasController.crearTarea();
                break;
            case '2':
                await tareasController.listarTareas();
                break;
            case '3':
                await tareasController.listarPendientesCompletadas(false);
                break;
            case '4':
                await tareasController.listarPendientesCompletadas(true);
                break;
            case '5':
                await tareasController.toggleCompletadas();
                break;
            case '6':
                await tareasController.borrarTarea();
                break;
            case '7':
                salir = true;
                await desconectarDB();
                console.log(chalk.blue('👋 ¡Hasta pronto!'));
                break;
        }
    }
}

main();