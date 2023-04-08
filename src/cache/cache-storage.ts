interface CacheStorage {

    containsKey(key: string): boolean;

    obtain(key: string): any | null;

    store(key: string, data: any): boolean;

}
