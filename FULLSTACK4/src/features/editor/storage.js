const storageService = {
  saveData: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data', error);
    }
  },
  loadData: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data', error);
      return null;
    }
  }
};

export default storageService;
