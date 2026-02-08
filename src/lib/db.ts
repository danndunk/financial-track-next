import fs from 'fs';
import path from 'path';
import { User, Transaction, Pocket, Plan } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface DBData {
    users: User[];
    transactions: Transaction[];
    pockets: Pocket[];
    plans: Plan[];
}

const DEFAULT_DATA: DBData = {
    users: [],
    transactions: [],
    pockets: [],
    plans: []
};

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export function readDB(): DBData {
    if (!fs.existsSync(DB_PATH)) {
        writeDB(DEFAULT_DATA);
        return DEFAULT_DATA;
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB:", error);
        return DEFAULT_DATA;
    }
}

export function writeDB(data: DBData) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing DB:", error);
    }
}
