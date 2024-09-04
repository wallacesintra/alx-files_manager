import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // redis client
    this.client = createClient();

    // error handling
    this.client.on('error', (err) => {
      console.log(`Redis Client Connection Error: ${err}`);
    });

    // connect redis client
    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    // redis client asynchrous methods
    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncSet = promisify(this.client.set).bind(this.client);
    this.asyncDel = promisify(this.client.del).bind(this.client);
  }

  /**
   * checks if the redis client is connected
   * @returns Boolean
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * takes a string key as argument and returns the Redis value stored for this key
   * @param key : key name
   * @returns value
   */
  async get(key) {
    try {
      return await this.asyncGet(key);
    } catch (err) {
      console.log(`getting redis value error: ${err}`);
      return null;
    }
  }

  /**
   *  that takes a string key, a value and a duration in second as arguments
        to store it in Redis (with an expiration set by the duration argument)
   * @param {string} key
   * @param {*} value
   * @param {number} duration
   */
  async set(key, value, duration) {
    try {
      await this.asyncSet(key, value, duration);
      console.key(`${key} key set successful`);
    } catch (err) {
      console.log(`Setting key error: ${err}`);
    }
  }

  /**
   *  takes a string key as argument and remove the value in Redis for this key
   * @param {string} key
   */
  async del(key) {
    try {
      await this.asyncDel(key);
      console.log(`${key} value removed successfully`);
    } catch (err) {
      console.log(`Deleting ${key} value error: ${err}`);
    }
  }
}

export const redisClient = new RedisClient();
export default redisClient;
