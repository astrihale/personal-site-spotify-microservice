import {createClient, RedisClientType} from 'redis';

class RedisCache extends CacheStorage {

    private client: RedisClientType;

    private readonly connectionString: string;

    constructor(connectionString: string) {
        super();

        this.connectionString = connectionString;

        this.client = createClient({
            url: this.connectionString
        });
    }


    containsKey(key: string): boolean {
        return false;
    }

    obtain(key: string): any {
    }

    store(key: string, data: any): boolean {
        return false;
    }

}
