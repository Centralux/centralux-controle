
// Usando um endpoint público de alta disponibilidade como fallback
const API_URL = 'https://api.npoint.io/documents';

export const createCloudStorage = async (data: any): Promise<string | null> => {
  try {
    // Tentativa com npoint (POST simplificado)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.id || null;
    }
    return null;
  } catch (error) {
    console.error("Erro ao criar nuvem:", error);
    return null;
  }
};

export const updateCloudStorage = async (id: string, data: any): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const getCloudData = async (id: string): Promise<any | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
};
