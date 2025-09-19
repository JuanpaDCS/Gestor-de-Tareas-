export default class Tarea {
    constructor(descripcion, completada = false) {
        this.descripcion = descripcion;
        this.completada = completada;
        this.fechaCreacion = new Date();
    }
}