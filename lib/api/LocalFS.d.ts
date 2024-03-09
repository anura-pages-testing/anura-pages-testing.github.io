declare class LocalFS extends AFSProvider<any> {
    dirHandle: FileSystemDirectoryHandle;
    domain: string;
    name: string;
    version: string;
    fds: FileSystemHandle[];
    cursors: number[];
    constructor(dirHandle: FileSystemDirectoryHandle, domain: string);
    relativizePath(path: string): string;
    randomId(): string;
    getChildDirHandle(path: string): Promise<FileSystemDirectoryHandle>;
    static new(anuraPath: string): Promise<LocalFS>;
    readdir(path: string, _options?: any, callback?: (err: Error | null, files: string[]) => void): void;
    stat(path: string, callback?: (err: Error | null, stats: any) => void): void;
    readFile(path: string, callback?: (err: Error | null, data: typeof Filer.Buffer) => void): void;
    writeFile(path: string, data: Uint8Array | string, _options?: any, callback?: (err: Error | null) => void): void;
    appendFile(path: string, data: Uint8Array, callback?: (err: Error | null) => void): void;
    unlink(path: string, callback?: (err: Error | null) => void): void;
    mkdir(path: string, _mode?: any, callback?: (err: Error | null) => void): void;
    rmdir(path: string, callback?: (err: Error | null) => void): void;
    rename(srcPath: string, dstPath: string, callback?: (err: Error | null) => void): void;
    truncate(path: string, len: number, callback?: (err: Error | null) => void): void;
    /** @deprecated — fs.exists() is an anachronism and exists only for historical reasons. */
    exists(path: string, callback?: (exists: boolean) => void): void;
    promises: {
        writeFile: (path: string, data: Uint8Array | string, options?: any) => Promise<void>;
        readFile: (path: string) => Promise<any>;
        readdir: (path: string) => Promise<string[]>;
        appendFile: (path: string, data: Uint8Array) => Promise<void>;
        unlink: (path: string) => Promise<void>;
        mkdir: (path: string) => Promise<void>;
        rmdir: (path: string) => Promise<void>;
        rename: (oldPath: string, newPath: string) => Promise<void>;
        stat: (path: string) => Promise<{
            name: string | undefined;
            size: number;
            atime: Date;
            mtime: Date;
            ctime: Date;
            atimeMs: number;
            mtimeMs: number;
            ctimeMs: number;
            node: string;
            nlinks: number;
            mode: number;
            type: string;
            uid: number;
            gid: number;
            isFile: () => boolean;
            isDirectory: () => boolean;
            isSymbolicLink: () => boolean;
            dev: string;
        }>;
        truncate: (path: string, len: number) => Promise<void>;
        access: () => never;
        chown: () => never;
        chmod: () => never;
        getxattr: () => never;
        link: () => never;
        lstat: (...args: any[]) => Promise<{
            name: string | undefined;
            size: number;
            atime: Date;
            mtime: Date;
            ctime: Date;
            atimeMs: number;
            mtimeMs: number;
            ctimeMs: number;
            node: string;
            nlinks: number;
            mode: number;
            type: string;
            uid: number;
            gid: number;
            isFile: () => boolean;
            isDirectory: () => boolean;
            isSymbolicLink: () => boolean;
            dev: string;
        }>;
        mkdtemp: () => never;
        mknod: () => never;
        open: (path: string, _flags: "r" | "r+" | "w" | "w+" | "a" | "a+", _mode?: any) => Promise<{
            fd: number;
            [AnuraFDSymbol]: string;
        }>;
        readlink: () => never;
        removexattr: () => never;
        setxattr: () => never;
        symlink: () => never;
        utimes: () => never;
    };
    ftruncate(): void;
    fstat(fd: AnuraFD, callback: (err: Error | null, stats: any) => void): void;
    lstat(...args: any[]): void;
    link(): void;
    symlink(): void;
    readlink(): void;
    mknod(): void;
    access(): void;
    mkdtemp(): void;
    fchown(): void;
    chmod(): void;
    fchmod(): void;
    fsync(): void;
    write(fd: AnuraFD, buffer: Uint8Array, offset: number, length: number, position: number | null, callback?: (err: Error | null, nbytes: number) => void): void;
    read(): void;
    setxattr(): void;
    fsetxattr(): void;
    getxattr(): void;
    fgetxattr(): void;
    removexattr(): void;
    fremovexattr(): void;
    utimes(): void;
    futimes(): void;
    chown(): void;
    close(fd: AnuraFD, callback: (err: Error | null) => void): void;
    open(path: string, flags: "r" | "r+" | "w" | "w+" | "a" | "a+", mode?: any, callback?: ((err: Error | null, fd: AnuraFD) => void) | undefined): void;
}
