
export const encodeState = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    // Using btoa with encodeURIComponent to handle special characters
    return btoa(encodeURIComponent(jsonString));
  } catch (e) {
    console.error("Erro ao codificar dados:", e);
    return "";
  }
};

export const decodeState = (encoded: string): any => {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Erro ao decodificar dados do link:", e);
    return null;
  }
};
