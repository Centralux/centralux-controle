import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAh51hUlzgskzlJW28k2Dfa912Nm6H48",
  authDomain: "centralux-estoque.firebaseapp.com",
  projectId: "centralux-estoque",
  storageBucket: "centralux-estoque.firebasestorage.app",
  messagingSenderId: "745903200954",
  appId: "1:745903200954:web:f7685d624f134e3b640083",
  measurementId: "G-V9ULCS38P",
  databaseURL: "https://centralux-estoque-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const saveDataToFirebase = async (id: string, data: any): Promise<boolean> => {
  try {
    await set(ref(database, `centralux/${id}`), {
      ...data,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Erro ao salvar no Firebase:", error);
    return false;
  }
};

export const getDataFromFirebase = async (id: string): Promise<any | null> => {
  try {
    const snapshot = await get(child(ref(database), `centralux/${id}`));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar do Firebase:", error);
    return null;
  }
};

export const generateCloudId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
