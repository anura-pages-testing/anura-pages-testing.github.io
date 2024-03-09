"use strict";
class FilerAFSProvider extends AFSProvider {
    domain = "/";
    name = "Filer";
    version = "1.0.0";
    fs;
    constructor(fs) {
        super();
        this.fs = fs;
    }
    rename(oldPath, newPath, callback) {
        this.fs.rename(oldPath, newPath, callback);
    }
    ftruncate(fd, len, callback) {
        this.fs.ftruncate(fd.fd, len, (err, fd) => callback(err, { fd, [AnuraFDSymbol]: this.domain }));
    }
    truncate(path, len, callback) {
        this.fs.truncate(path, len, callback);
    }
    stat(path, callback) {
        this.fs.stat(path, callback);
    }
    fstat(fd, callback) {
        this.fs.fstat(fd.fd, callback);
    }
    lstat(path, callback) {
        this.fs.lstat(path, callback);
    }
    /** @deprecated fs.exists() is an anachronism and exists only for historical reasons. */
    exists(path, callback) {
        this.fs.exists(path, callback);
    }
    link(srcPath, dstPath, callback) {
        this.fs.link(srcPath, dstPath, callback);
    }
    symlink(path, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.symlink(path, ...rest);
    }
    readlink(path, callback) {
        this.fs.readlink(path, callback);
    }
    unlink(path, callback) {
        this.fs.unlink(path, callback);
    }
    mknod(path, mode, callback) {
        this.fs.mknod(path, mode, callback);
    }
    rmdir(path, callback) {
        this.fs.rmdir(path, callback);
    }
    mkdir(path, ...rest) {
        this.fs.mkdir(path, ...rest);
    }
    access(path, ...rest) {
        this.fs.access(path, ...rest);
    }
    mkdtemp(...args) {
        // Temp directories should remain in the root filesystem for now
        // @ts-ignore - Overloaded methods are scary
        this.fs.mkdtemp(...args);
    }
    readdir(path, ...rest) {
        this.fs.readdir(path, ...rest);
    }
    close(fd, callback) {
        callback ||= () => { };
        this.fs.close(fd.fd, callback);
    }
    open(path, flags, mode, callback) {
        if (typeof mode === "number") {
            this.fs.open(path, flags, mode, (err, fd) => callback(err, {
                fd,
                [AnuraFDSymbol]: this.domain,
            }));
        }
        else {
            this.fs.open(path, flags, (err, fd) => mode(err, {
                fd,
                [AnuraFDSymbol]: this.domain,
            }));
        }
    }
    utimes(path, atime, mtime, callback) {
        this.fs.utimes(path, atime, mtime, callback);
    }
    futimes(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.futimes(fd.fd, ...rest);
    }
    chown(path, uid, gid, callback) {
        this.fs.chown(path, uid, gid, callback);
    }
    fchown(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.fchown(fd.fd, ...rest);
    }
    chmod(path, mode, callback) {
        this.fs.chmod(path, mode, callback);
    }
    fchmod(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.fchmod(fd.fd, ...rest);
    }
    fsync(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.fsync(fd.fd, ...rest);
    }
    write(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.write(fd.fd, ...rest);
    }
    read(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.read(fd.fd, ...rest);
    }
    readFile(path, callback) {
        this.fs.readFile(path, callback);
    }
    writeFile(path, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.writeFile(path, ...rest);
    }
    appendFile(path, data, callback) {
        this.fs.appendFile(path, data, callback);
    }
    setxattr(path, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.setxattr(path, ...rest);
    }
    fsetxattr(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.fsetxattr(fd.fd, ...rest);
    }
    getxattr(path, name, callback) {
        this.fs.getxattr(path, name, callback);
    }
    fgetxattr(fd, name, callback) {
        this.fs.fgetxattr(fd.fd, name, callback);
    }
    removexattr(path, name, callback) {
        this.fs.removexattr(path, name, callback);
    }
    fremovexattr(fd, ...rest) {
        // @ts-ignore - Overloaded methods are scary
        this.fs.fremovexattr(fd.fd, ...rest);
    }
    promises = {
        appendFile: (path, data, options) => this.fs.promises.appendFile(path, data, options),
        access: (path, mode) => this.fs.promises.access(path, mode),
        chown: (path, uid, gid) => this.fs.promises.chown(path, uid, gid),
        chmod: (path, mode) => this.fs.promises.chmod(path, mode),
        getxattr: (path, name) => this.fs.promises.getxattr(path, name),
        link: (srcPath, dstPath) => this.fs.promises.link(srcPath, dstPath),
        lstat: (path) => this.fs.promises.lstat(path),
        mkdir: (path, mode) => this.fs.promises.mkdir(path, mode),
        mkdtemp: (prefix, options) => this.fs.promises.mkdtemp(prefix, options),
        mknod: (path, mode) => this.fs.promises.mknod(path, mode),
        open: async (path, flags, mode) => ({
            fd: await this.fs.promises.open(path, flags, mode),
            [AnuraFDSymbol]: this.domain,
        }),
        readdir: (path, options) => this.fs.promises.readdir(path, options),
        readFile: (path) => this.fs.promises.readFile(path),
        readlink: (path) => this.fs.promises.readlink(path),
        removexattr: (path, name) => this.fs.promises.removexattr(path, name),
        rename: (oldPath, newPath) => this.fs.promises.rename(oldPath, newPath),
        rmdir: (path) => this.fs.promises.rmdir(path),
        setxattr: (path, name, value, flag) => this.fs.promises.setxattr(path, name, value, flag),
        stat: (path) => this.fs.promises.stat(path),
        symlink: (srcPath, dstPath, type) => this.fs.promises.symlink(srcPath, dstPath, type),
        truncate: (path, len) => this.fs.promises.truncate(path, len),
        unlink: (path) => this.fs.promises.unlink(path),
        utimes: (path, atime, mtime) => this.fs.promises.utimes(path, atime, mtime),
        writeFile: (path, data, options) => this.fs.promises.writeFile(path, data, options),
    };
}
//# sourceMappingURL=FilerFS.js.map