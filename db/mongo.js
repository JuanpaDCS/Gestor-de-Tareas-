import { MongoClient } from "mongodb";
import chalk from "chalk";

const uri = "mongodb://localhost:27017/";
const cliente = new MongoClient(uri);

let db;

export const conectarDB = async () => {
    try {
        await cliente.connect();
        db = cliente.db("gestorTareas");
        console.log(chalk.blue("✅ Conexión a MongoDB establecida."));
    } catch (error) {
        console.error(chalk.red("❌ Error al conectar con MongoDB:", error));
        process.exit(1); // Finalizar el proceso si la conexión falla
    }
};

export const getDB = () => db;

export const desconectarDB = async () => {
    await cliente.close();
    console.log(chalk.red("❌ Conexión con MongoDB cerrada."));
};