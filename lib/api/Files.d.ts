declare class FilesAPI {
    fallbackIcon: string;
    folderIcon: string;
    open: (path: string) => Promise<void>;
    defaultOpen(path: string): Promise<void>;
    getIcon: (path: string) => Promise<any>;
    defaultIcon(path: string): Promise<any>;
    getFileType(path: string): Promise<any>;
    setFolderIcon(path: string): void;
    set(path: string, extension: string): void;
    setModule(id: string, extension: string): void;
}
