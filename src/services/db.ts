import firebaseApp from '../firebaseConfig';
import { getDatabase } from 'firebase/database'

const db = getDatabase(firebaseApp);

export default db;