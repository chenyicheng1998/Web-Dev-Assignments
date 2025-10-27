// src/utils/localSession.js
const localSession = {
    set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
    get: (key) => {
      const value = sessionStorage.getItem(key);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    remove: (key) => sessionStorage.removeItem(key),
  };
  
  export default localSession;
  