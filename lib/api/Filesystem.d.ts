declare const AnuraFDSymbol: unique symbol;
type AnuraFD = {
    fd: number;
    [AnuraFDSymbol]: string;
};
declare abstract class AnuraFSOperations<TStats> {
    abstract rename(oldPath: string, newPath: string, callback?: (err: Error | null) => void): void;
    abstract ftruncate(fd: AnuraFD, len: number, callback?: (err: Error | null, fd: AnuraFD) => void): void;
    abstract truncate(path: string, len: number, callback?: (err: Error | null) => void): void;
    abstract stat(path: string, callback?: (err: Error | null, stats: TStats) => void): void;
    abstract fstat(fd: AnuraFD, callback?: (err: Error | null, stats: TStats) => void): void;
    abstract lstat(path: string, callback?: (err: Error | null, stats: TStats) => void): void;
    /** @deprecated fs.exists() is an anachronism and exists only for historical reasons. */
    abstract exists(path: string, callback?: (exists: boolean) => void): void;
    abstract link(srcPath: string, dstPath: string, callback?: (err: Error | null) => void): void;
    abstract symlink(srcPath: string, dstPath: string, type: string, callback?: (err: Error | null) => void): void;
    abstract symlink(srcPath: string, dstPath: string, callback?: (err: Error | null) => void): void;
    abstract readlink(path: string, callback?: (err: Error | null, linkContents: string) => void): void;
    abstract unlink(path: string, callback?: (err: Error | null) => void): void;
    abstract mknod(path: string, mode: number, callback?: (err: Error | null) => void): void;
    abstract rmdir(path: string, callback?: (err: Error | null) => void): void;
    abstract mkdir(path: string, mode: number, callback?: (err: Error | null) => void): void;
    abstract mkdir(path: string, callback?: (err: Error | null) => void): void;
    abstract access(path: string, mode: number, callback?: (err: Error | null) => void): void;
    abstract access(path: string, callback?: (err: Error | null) => void): void;
    abstract mkdtemp(prefix: string, options: {
        encoding: string;
    } | string, callback?: (err: Error | null, path: string) => void): void;
    abstract mkdtemp(prefix: string, callback?: (err: Error | null, path: string) => void): void;
    abstract readdir(path: string, options: {
        encoding: string;
        withFileTypes: boolean;
    } | string, callback?: (err: Error | null, files: string[]) => void): void;
    abstract readdir(path: string, callback?: (err: Error | null, files: string[]) => void): void;
    abstract close(fd: AnuraFD, callback?: (err: Error | null) => void): void;
    abstract open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode: number, callback?: (err: Error | null, fd: AnuraFD) => void): void;
    abstract open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", callback?: (err: Error | null, fd: AnuraFD) => void): void;
    abstract utimes(path: string, atime: number | Date, mtime: number | Date, callback?: (err: Error | null) => void): void;
    abstract futimes(fd: AnuraFD, atime: number | Date, mtime: number | Date, callback?: (err: Error | null) => void): void;
    abstract chown(path: string, uid: number, gid: number, callback?: (err: Error | null) => void): void;
    abstract fchown(fd: AnuraFD, uid: number, gid: number, callback?: (err: Error | null) => void): void;
    abstract chmod(path: string, mode: number, callback?: (err: Error | null) => void): void;
    abstract fchmod(fd: AnuraFD, mode: number, callback?: (err: Error | null) => void): void;
    abstract fsync(fd: AnuraFD, callback?: (err: Error | null) => void): void;
    abstract write(fd: AnuraFD, buffer: Uint8Array, offset: number, length: number, position: number | null, callback?: (err: Error | null, nbytes: number) => void): void;
    abstract read(fd: AnuraFD, buffer: Uint8Array, offset: number, length: number, position: number | null, callback?: (err: Error | null, nbytes: number, buffer: Uint8Array) => void): void;
    abstract readFile(path: string, callback?: (err: Error | null, data: Uint8Array) => void): void;
    abstract writeFile(path: string, data: Uint8Array | string, options: {
        encoding: string;
        flag: "r" | "r+" | "w" | "w+" | "a" | "a+";
    } | string, callback?: (err: Error | null) => void): void;
    abstract writeFile(path: string, data: Uint8Array | string, callback?: (err: Error | null) => void): void;
    abstract appendFile(path: string, data: Uint8Array, callback?: (err: Error | null) => void): void;
    abstract setxattr(path: string, name: string, value: string | object, flag: "CREATE" | "REPLACE", callback?: (err: Error | null) => void): void;
    abstract setxattr(path: string, name: string, value: string | object, callback?: (err: Error | null) => void): void;
    abstract fsetxattr(fd: AnuraFD, name: string, value: string | object, flag: "CREATE" | "REPLACE", callback?: (err: Error | null) => void): void;
    abstract fsetxattr(fd: AnuraFD, name: string, value: string | object, callback?: (err: Error | null) => void): void;
    abstract getxattr(path: string, name: string, callback?: (err: Error | null, value: string | object) => void): void;
    abstract fgetxattr(fd: AnuraFD, name: string, callback?: (err: Error | null, value: string | object) => void): void;
    abstract removexattr(path: string, name: string, callback?: (err: Error | null) => void): void;
    abstract fremovexattr(fd: AnuraFD, name: string, callback?: (err: Error | null) => void): void;
    abstract promises: {
        appendFile(path: string, data: Uint8Array, options: {
            encoding: string;
            mode: number;
            flag: string;
        }): Promise<void>;
        access(path: string, mode?: number): Promise<void>;
        chown(path: string, uid: number, gid: number): Promise<void>;
        chmod(path: string, mode: number): Promise<void>;
        getxattr(path: string, name: string): Promise<string | object>;
        link(srcPath: string, dstPath: string): Promise<void>;
        lstat(path: string): Promise<TStats>;
        mkdir(path: string, mode?: number): Promise<void>;
        mkdtemp(prefix: string, options?: {
            encoding: string;
        }): Promise<string>;
        mknod(path: string, mode: number): Promise<void>;
        open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode?: number): Promise<AnuraFD>;
        readdir(path: string, options?: string | {
            encoding: string;
            withFileTypes: boolean;
        }): Promise<string[]>;
        readFile(path: string): Promise<Uint8Array>;
        readlink(path: string): Promise<string>;
        removexattr(path: string, name: string): Promise<void>;
        rename(oldPath: string, newPath: string): Promise<void>;
        rmdir(path: string): Promise<void>;
        setxattr(path: string, name: string, value: string | object, flag?: "CREATE" | "REPLACE"): Promise<void>;
        stat(path: string): Promise<TStats>;
        symlink(srcPath: string, dstPath: string, type?: string): Promise<void>;
        truncate(path: string, len: number): Promise<void>;
        unlink(path: string): Promise<void>;
        utimes(path: string, atime: number | Date, mtime: number | Date): Promise<void>;
        writeFile(path: string, data: Uint8Array | string, options?: {
            encoding: string;
            mode: number;
            flag: string;
        }): Promise<void>;
    };
}
/**
 * Generic class for a filesystem provider
 * This should be extended by the various filesystem providers
 */
declare abstract class AFSProvider<TStats> extends AnuraFSOperations<TStats> {
    /**
     * This is the domain that the filesystem provider is responsible
     * for. The provider with the most specific domain
     * will be used to handle a given path.
     *
     * @example "/" If you want to handle the root filesystem
     *
     * @example "/tmp" If you want to handle everything under /tmp.
     * This will take precedence over the root filesystem.
     */
    abstract domain: string;
    /**
     * The name of the filesystem provider
     */
    abstract name: string;
    /**
     * The filesystem provider's version
     */
    abstract version: string;
}
declare class AFSShell {
    #private;
    env: any;
    cat(files: string[], callback: (err: Error | null, contents: string) => void): void;
    exec(path: string): void;
    find(path: string, options?: {
        /**
         * Regex to match file paths against
         */
        regex?: RegExp;
        /**
         * Base name to search for (match patern)
         */
        name?: string;
        /**
         * Folder to search in (match pattern)
         */
        path?: string;
        /**
         * Callback to execute on each file.
         */
        exec?: (path: string, next: () => void) => void;
    }, callback?: (err: Error | null, files: string[]) => void): void;
    find(path: string, callback?: (err: Error | null, files: string[]) => void): void;
    ls(dir: string, options?: {
        recursive?: boolean;
    }, callback?: (err: Error | null, entries: any[]) => void): void;
    ls(dir: string, callback?: (err: Error | null, entries: any[]) => void): void;
    mkdirp(path: string, callback: (err: Error | null) => void): void;
    rm(path: string, options?: {
        recursive?: boolean;
    }, callback?: (err: Error | null) => void): void;
    rm(path: string, callback?: (err: Error | null) => void): void;
    tempDir(callback?: (err: Error | null, path: string) => void): void;
    touch(path: string, options?: {
        updateOnly?: boolean;
        date?: Date;
    }, callback?: (err: Error | null) => void): void;
    touch(path: string, callback?: (err: Error | null) => void): void;
    cd(dir: string): void;
    pwd(): any;
    promises: {
        cat: (files: string[]) => Promise<string>;
        exec: (path: string) => Promise<void>;
        find: (path: string, options?: {
            regex?: RegExp | undefined;
            name?: string | undefined;
            path?: string | undefined;
            exec?: ((path: string, next: () => void) => void) | undefined;
        } | undefined) => Promise<string[]>;
        ls: (dir: string, options?: {
            recursive?: boolean;
        }) => Promise<string[]>;
        mkdirp: (path: string) => Promise<void>;
        rm: (path: string, options?: {
            recursive?: boolean;
        }) => Promise<void>;
        touch: (path: string, options?: {
            updateOnly?: boolean;
            date?: Date;
        }) => Promise<void>;
    };
    constructor(options?: {
        env?: {
            [key: string]: string;
        };
    });
}
/**
 * Anura File System API
 *
 * This is fully compatible with Filer's filesystem API and,
 * by extension, most of the Node.js filesystem API. This is
 * a drop-in replacement for the legacy Filer API and should
 * be used in place of the Filer API in all new code.
 *
 * This API has the added benefit of type safety and a the ability
 * to register multiple filesystem providers. This allows for the
 * creation of virtual filesystems and the ability to mount filesystems
 * at arbitrary paths.
 */
declare class AnuraFilesystem implements AnuraFSOperations<any> {
    providers: Map<string, AFSProvider<any>>;
    providerCache: {
        [path: string]: AFSProvider<any>;
    };
    static Shell: typeof AFSShell;
    Shell: typeof AFSShell;
    constructor(providers: AFSProvider<any>[]);
    clearCache(): void;
    installProvider(provider: AFSProvider<any>): void;
    processPath(path: string): AFSProvider<any>;
    processFD(fd: AnuraFD): AFSProvider<any>;
    rename(oldPath: string, newPath: string, callback?: (err: Error | null) => void): void;
    ftruncate(fd: AnuraFD, len: number, callback?: (err: Error | null, fd: AnuraFD) => void): void;
    truncate(path: string, len: number, callback?: (err: Error | null) => void): void;
    stat(path: string, callback?: (err: Error | null, stats: any) => void): void;
    fstat(fd: AnuraFD, callback?: ((err: Error | null, stats: any) => void) | undefined): void;
    lstat(path: string, callback?: (err: Error | null, stats: any) => void): void;
    /** @deprecated fs.exists() is an anachronism and exists only for historical reasons. */
    exists(path: string, callback?: (exists: boolean) => void): void;
    link(srcPath: string, dstPath: string, callback?: (err: Error | null) => void): void;
    symlink(path: string, ...rest: any[]): void;
    readlink(path: string, callback?: (err: Error | null, linkContents: string) => void): void;
    unlink(path: string, callback?: (err: Error | null) => void): void;
    mknod(path: string, mode: number, callback?: (err: Error | null) => void): void;
    rmdir(path: string, callback?: (err: Error | null) => void): void;
    mkdir(path: string, ...rest: any[]): void;
    access(path: string, ...rest: any[]): void;
    mkdtemp(...args: any[]): void;
    readdir(path: string, ...rest: any[]): void;
    close(fd: AnuraFD, callback?: ((err: Error | null) => void) | undefined): void;
    open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode: number, callback?: ((err: Error | null, fd: AnuraFD) => void) | undefined): void;
    open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", callback?: ((err: Error | null, fd: AnuraFD) => void) | undefined): void;
    utimes(path: string, atime: number | Date, mtime: number | Date, callback?: (err: Error | null) => void): void;
    futimes(fd: AnuraFD, ...rest: any[]): void;
    chown(path: string, uid: number, gid: number, callback?: (err: Error | null) => void): void;
    fchown(fd: AnuraFD, ...rest: any[]): void;
    chmod(path: string, mode: number, callback?: (err: Error | null) => void): void;
    fchmod(fd: AnuraFD, ...rest: any[]): void;
    fsync(fd: AnuraFD, ...rest: any[]): void;
    write(fd: AnuraFD, ...rest: any[]): void;
    read(fd: AnuraFD, ...rest: any[]): void;
    readFile(path: string, callback?: (err: Error | null, data: Uint8Array) => void): void;
    writeFile(path: string, ...rest: any[]): void;
    appendFile(path: string, data: Uint8Array, callback?: (err: Error | null) => void): void;
    setxattr(path: string, ...rest: any[]): void;
    fsetxattr(fd: AnuraFD, ...rest: any[]): void;
    getxattr(path: string, name: string, callback?: (err: Error | null, value: string | object) => void): void;
    fgetxattr(fd: AnuraFD, ...rest: any[]): void;
    removexattr(path: string, name: string, callback?: (err: Error | null) => void): void;
    fremovexattr(fd: AnuraFD, ...rest: any[]): void;
    promises: {
        appendFile: (path: string, data: Uint8Array, options: {
            encoding: string;
            mode: number;
            flag: string;
        }) => Promise<void>;
        access: (path: string, mode?: number) => Promise<void>;
        chown: (path: string, uid: number, gid: number) => Promise<void>;
        chmod: (path: string, mode: number) => Promise<void>;
        getxattr: (path: string, name: string) => Promise<string | object>;
        link: (srcPath: string, dstPath: string) => Promise<void>;
        lstat: (path: string) => Promise<any>;
        mkdir: (path: string, mode?: number) => Promise<void>;
        mkdtemp: (prefix: string, options?: {
            encoding: string;
        }) => Promise<string>;
        mknod: (path: string, mode: number) => Promise<void>;
        open: (path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode?: number) => Promise<AnuraFD>;
        readdir: (path: string, options?: string | {
            encoding: string;
            withFileTypes: boolean;
        }) => Promise<string[]>;
        readFile: (path: string) => Promise<Uint8Array>;
        readlink: (path: string) => Promise<string>;
        removexattr: (path: string, name: string) => Promise<void>;
        rename: (oldPath: string, newPath: string) => Promise<void>;
        rmdir: (path: string) => Promise<void>;
        setxattr: (path: string, name: string, value: string | object, flag?: "CREATE" | "REPLACE") => Promise<void>;
        stat: (path: string) => Promise<any>;
        symlink: (srcPath: string, dstPath: string, type?: string) => Promise<void>;
        truncate: (path: string, len: number) => Promise<void>;
        unlink: (path: string) => Promise<void>;
        utimes: (path: string, atime: number | Date, mtime: number | Date) => Promise<void>;
        writeFile: (path: string, data: Uint8Array | string, options?: {
            encoding: string;
            mode: number;
            flag: string;
        }) => Promise<void>;
    };
}
