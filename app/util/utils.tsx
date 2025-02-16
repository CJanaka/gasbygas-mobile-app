import AsyncStorage from '@react-native-async-storage/async-storage';

class Utill {
  /**
   * Stores data in AsyncStorage.
   * @param key - The key under which data will be stored.
   * @param value - The value to store.
   */
  static async storeData(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log(`Data stored successfully: ${key}`);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  /**
   * Retrieves data from AsyncStorage.
   * @param key - The key of the data to retrieve.
   * @returns The retrieved value or null if not found.
   */
  static async getData<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  /**
   * Removes data from AsyncStorage.
   * @param key - The key of the data to remove.
   */
  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Data removed: ${key}`);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }
}

export default Utill;