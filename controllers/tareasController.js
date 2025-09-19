import { getDB } from '../db/mongo.js';
import Tarea from '../models/tarea.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';

class TareasController {
    constructor() {
        this.db = getDB();
        this.tareasCollection = this.db.collection('tareas');
    }

    async crearTarea() {
        try {
            const { descripcion } = await inquirer.prompt([{
                type: 'input',
                name: 'descripcion',
                message: 'Descripción de la tarea:',
                validate: (input) => input.trim().length > 0 || 'La descripción no puede estar vacía.'
            }]);

            const nuevaTarea = new Tarea(descripcion.trim());
            await this.tareasCollection.insertOne(nuevaTarea);
            console.log(chalk.green('✅ Tarea agregada.'));
        } catch (error) {
            console.error(chalk.red('❌ Error al crear la tarea:', error));
        }
    }

    async listarTareas() {
        try {
            const tareas = await this.tareasCollection.find({}).toArray();
            if (tareas.length === 0) {
                console.log(chalk.yellow('⚠️ No hay tareas registradas.'));
                return;
            }
            console.log(chalk.blue('\n📋 Lista de tareas:'));
            tareas.forEach((tarea, i) => {
                const estado = tarea.completada ? chalk.green('✅') : chalk.red('❌');
                const fecha = new Date(tarea.fechaCreacion).toLocaleDateString('es-ES');
                console.log(`${chalk.gray(i + 1 + '.')}. [${estado}] ${tarea.descripcion} - ${chalk.gray(`(Creada: ${fecha})`)}`);
            });
        } catch (error) {
            console.error(chalk.red('❌ Error al listar las tareas:', error));
        }
    }

    async listarPendientesCompletadas(completada = true) {
        try {
            const tareas = await this.tareasCollection.find({ completada }).toArray();
            if (tareas.length === 0) {
                console.log(chalk.yellow(`⚠️ No hay tareas ${completada ? 'completadas' : 'pendientes'}.`));
                return;
            }
            console.log(chalk.blue(`\n📋 Lista de tareas ${completada ? 'completadas' : 'pendientes'}:`));
            tareas.forEach((tarea, i) => {
                const estado = tarea.completada ? chalk.green('✅') : chalk.red('❌');
                console.log(`${chalk.gray(i + 1 + '.')}. [${estado}] ${tarea.descripcion}`);
            });
        } catch (error) {
            console.error(chalk.red('❌ Error al listar tareas por estado:', error));
        }
    }
    
    async toggleCompletadas() {
        try {
            const tareas = await this.tareasCollection.find({}).toArray();
            if (tareas.length === 0) {
                console.log(chalk.yellow('⚠️ No hay tareas para actualizar.'));
                return;
            }

            const { idsSeleccionados } = await inquirer.prompt([{
                type: 'checkbox',
                name: 'idsSeleccionados',
                message: 'Selecciona tareas para marcar como completadas/incompletas:',
                choices: tareas.map(t => ({
                    name: `${t.completada ? chalk.green('[✅]') : chalk.red('[❌]')} ${t.descripcion}`,
                    value: t._id.toString(),
                    checked: t.completada
                })),
                // Personalización del mensaje de la ayuda.
                message: 'Selecciona una o más tareas para actualizar (Presiona <espacio> para seleccionar, <a> para todos, <i> para invertir selección, y <enter> para continuar):',
                instruction: 'Usa <espacio> para seleccionar, <a> para todos, <i> para invertir, y <enter> para confirmar.'
            }]);

            // Obtener los IDs de las tareas que ya estaban completadas
            const tareasCompletadasOriginales = tareas.filter(t => t.completada).map(t => t._id.toString());

            // Tareas a completar: las seleccionadas que no estaban completadas
            const tareasACompletar = idsSeleccionados.filter(id => !tareasCompletadasOriginales.includes(id));
            if (tareasACompletar.length > 0) {
                await this.tareasCollection.updateMany(
                    { _id: { $in: tareasACompletar.map(id => new ObjectId(id)) } },
                    { $set: { completada: true } }
                );
            }

            // Tareas a descompletar: las que estaban completadas pero no fueron seleccionadas
            const tareasADescompletar = tareasCompletadasOriginales.filter(id => !idsSeleccionados.includes(id));
            if (tareasADescompletar.length > 0) {
                await this.tareasCollection.updateMany(
                    { _id: { $in: tareasADescompletar.map(id => new ObjectId(id)) } },
                    { $set: { completada: false } }
                );
            }

            console.log(chalk.green('✅ Tareas actualizadas.'));

        } catch (error) {
            console.error(chalk.red('❌ Error al actualizar tareas:', error));
        }
    }
    
    async borrarTarea() {
        try {
            const tareas = await this.tareasCollection.find({}).toArray();
            if (tareas.length === 0) {
                console.log(chalk.yellow('⚠️ No hay tareas para eliminar.'));
                return;
            }
            const { id } = await inquirer.prompt([{
                type: 'list',
                name: 'id',
                message: 'Selecciona una tarea para eliminar:',
                choices: tareas.map(t => ({
                    name: `${t.descripcion} ${t.completada ? chalk.green('(completada)') : chalk.red('(pendiente)')}`,
                    value: t._id.toString()
                }))
            }]);

            const { confirmacion } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirmacion',
                message: '¿Estás seguro de que deseas eliminar esta tarea?',
                default: false
            }]);

            if (confirmacion) {
                await this.tareasCollection.deleteOne({ _id: new ObjectId(id) });
                console.log(chalk.green('🗑️ Tarea eliminada.'));
            } else {
                console.log(chalk.blue('Operación cancelada.'));
            }
        } catch (error) {
            console.error(chalk.red('❌ Error al eliminar la tarea:', error));
        }
    }
}

export default TareasController;