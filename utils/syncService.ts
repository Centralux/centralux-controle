
import { saveDataToFirebase, getDataFromFirebase, generateCloudId } from './firebase';

export const createCloudStorage = async (data: any): Promise<string | null> => {
  try {
    const id = generateCloudId();
    const success = await saveDataToFirebase(id, data);
    if (success) {
      return id;
    }
    return null;
  } catch (error) {
    console.error("Erro ao criar nuvem:", error);
    return null;
  }
};

export const updateCloudStorage = async (id: string, data: any): Promise<boolean> => {
  try {
    return await saveDataToFirebase(id, data);
  } catch (error) {
    console.error("Erro ao atualizar nuvem:", error);
    return false;
  }
};

export const getCloudData = async (id: string): Promise<any | null> => {
  try {
    return await getDataFromFirebase(id);
  } catch (error) {
    console.error("Erro ao carregar nuvem:", error);
    return null;
  }
};
