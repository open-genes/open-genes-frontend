export abstract class ToMap {
  /*
   * Method used for mapping complex objects from http response
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toMap(object): Map<any, any> {
    if (object) {
      const mappedObj = new Map();
      try {
        // if there is an array of objects
        for (const element of object) {
          for (const [key, value] of Object.entries(element)) {
            mappedObj.set(key, value);
          }
        }
      } catch (e) {
        // if object is not iterable
        for (const [key, value] of Object.entries(object)) {
          mappedObj.set(key, value);
        }
      }
      return mappedObj;
    } else {
      return new Map();
    }
  }
}
