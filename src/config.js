import os from 'os';
import path from 'path';

export default {
    notesDir: path.resolve(os.homedir(), '.local/quick/'),
    notesFile: 'notes.json'
}