declare class FilerAFSProvider extends AFSProvider<any> {
    domain: string;
    name: string;
    version: string;
    fs: FilerFS;
    constructor(fs: FilerFS);
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
    fgetxattr(fd: AnuraFD, name: string, callback?: (err: Error | null, value: string | object) => void): void;
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
        lstat: (path: string) => Promise<TStats>;
        mkdir: (path: string, mode?: number) => Promise<void>;
        mkdtemp: (prefix: string, options?: {
            encoding: string;
        }) => Promise<string>;
        mknod: (path: string, mode: number) => Promise<void>;
        open: (path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode?: number) => Promise<{
            fd: number;
            [AnuraFDSymbol]: string;
        }>;
        readdir: (path: string, options?: {
            encoding: string;
            withFileTypes: boolean;
        }) => Promise<string[]>;
        readFile: (path: string) => Promise<Uint8Array>;
        readlink: (path: string) => Promise<string>;
        removexattr: (path: string, name: string) => Promise<void>;
        rename: (oldPath: string, newPath: string) => Promise<void>;
        rmdir: (path: string) => Promise<void>;
        setxattr: (path: string, name: string, value: string | object, flag?: "CREATE" | "REPLACE") => Promise<void>;
        stat: (path: string) => Promise<TStats>;
        symlink: (srcPath: string, dstPath: string, type?: string) => Promise<void>;
        truncate: (path: string, len: number) => Promise<void>;
        unlink: (path: string) => Promise<void>;
        utimes: (path: string, atime: number | Date, mtime: number | Date) => Promise<void>;
        writeFile: (path: string, data: Uint8Array | string, options: {
            encoding: string;
            mode: number;
            flag: string;
        }) => Promise<void>;
    };
}
