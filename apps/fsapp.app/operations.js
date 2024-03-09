var currentlySelected = [];
var clipboard = [];
var removeAfterPaste = false;

window.fs = anura.fs;
window.Buffer = Filer.Buffer;
let sh = new anura.fs.Shell();

async function mountLocalFs() {
    let path = prompt(
        "Enter the path where you want to mount the local filesystem",
    );
    if (!path.startsWith("/")) {
        anura.notifications.add({
            title: "File Manager",
            description: 'Path does not start with a "/" character',
            timeout: 5000,
        });
        return;
    }
    await LocalFS.new(path);
}

async function loadPath(path) {
    console.debug("loading path: ", path);
    const files = await fs.promises.readdir(path + "/");
    console.debug("files: ", files);
    setBreadcrumbs(path);
    let table = document.querySelector("tbody");
    table.innerHTML = "";
    let filesToLoad = files.length;
    files.forEach(async (file) => {
        let row = document.createElement("tr");
        let iconContainer = document.createElement("td");
        let icon = document.createElement("img");
        let name = document.createElement("td");
        let size = document.createElement("td");
        let description = document.createElement("td");
        let date = document.createElement("td");
        let type = document.createElement("td");
        iconContainer.className = "iconContainer";
        icon.className = "icon";

        const stats = await fs.promises.stat(`${path}/${file}`);

        if (stats.isDirectory()) {
            name.innerText = `${file}/`;
            description.innerText = "Folder";
            date.innerText = new Date(stats.mtime).toLocaleString();
            size.innerText = stats.size;

            let folderExt = file.split(".").slice("-1")[0];

            if (
                (folderExt == "app") | (folderExt == "lib") &&
                file !== folderExt
            ) {
                let manifestPath = `${path}/${file}/manifest.json`;

                const data = await fs.promises.readFile(manifestPath);
                let manifest = JSON.parse(data);

                icon.src = `/fs${path}/${file}/${manifest.icon}`;
                icon.onerror = () => {
                    icon.src = anura.files.folderIcon;
                };
                description.innerText = `Anura ${folderExt == "app" ? "Application" : "Library"}`;
            } else {
                icon.src = anura.files.folderIcon;
            }

            iconContainer.appendChild(icon);
            row.appendChild(iconContainer);
            row.appendChild(name);
            row.appendChild(size);
            row.appendChild(description);
            row.appendChild(date);

            row.setAttribute("data-type", "dir");
            row.setAttribute("data-path", `${path}/${file}`);
        } else {
            name.innerText = `${file}`;
            description.innerText = "Anura File";
            anura.files.getFileType(`${path}/${file}`).then((type) => {
                description.innerText = type;
            });
            date.innerText = new Date(stats.mtime).toLocaleString();
            size.innerText = stats.size;

            try {
                const iconURL = await anura.files.getIcon(`${path}/${file}`);
                icon.src = iconURL;
            } catch (e) {
                icon.src = anura.files.fallbackIcon;
                console.error(e);
            }

            iconContainer.appendChild(icon);
            row.appendChild(iconContainer);
            row.appendChild(name);
            row.appendChild(size);
            row.appendChild(description);
            row.appendChild(date);

            row.setAttribute("data-type", "file");
            row.setAttribute("data-path", `${path}/${file}`);
        }
        console.debug("appending");
        table.appendChild(row);
        console.log(files[files.length - 1], file);
        filesToLoad--;
        if (filesToLoad == 0) {
            reloadListeners();
        }
    });
}

function reloadListeners() {
    console.debug("reloading listeners");
    console.debug(document.querySelectorAll("tr"));
    document.querySelectorAll("tr").forEach((row) => {
        if (row.parentNode.nodeName.toLowerCase() !== "thead") {
            console.debug("adding listeners to ", row);
            row.addEventListener("mouseenter", (e) => {
                e.currentTarget.classList.add("hover");
            });
            row.addEventListener("mouseleave", (e) => {
                e.currentTarget.classList.remove("hover");
            });
            row.addEventListener("contextmenu", (e) => {
                if (currentlySelected.length > 0) {
                    return;
                }
                e.currentTarget.classList.add("selected");
                currentlySelected = [e.currentTarget];
            });
            row.addEventListener("click", (e) => {
                if (currentlySelected.includes(e.currentTarget)) {
                    fileAction(currentlySelected);
                    currentlySelected.forEach((row) => {
                        row.classList.remove("selected");
                    });
                    currentlySelected = [];
                    return;
                }
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {
                        currentlySelected.forEach((row) => {
                            row.classList.remove("selected");
                        });
                        currentlySelected = [];
                    }
                    e.currentTarget.classList.add("selected");
                    currentlySelected.push(e.currentTarget);
                } else {
                    if (currentlySelected.length == 0) {
                        e.currentTarget.classList.add("selected");
                        currentlySelected.push(e.currentTarget);
                    } else {
                        var arr = Array.from(
                            document.querySelectorAll("tr"),
                        ).filter(
                            (row) =>
                                row.parentNode.nodeName.toLowerCase() !==
                                "thead",
                        );
                        var firstI = arr.indexOf(
                            currentlySelected[currentlySelected.length - 1],
                        );
                        var lastI = arr.indexOf(e.currentTarget);
                        var first = Math.min(firstI, lastI);
                        var last = Math.max(firstI, lastI);
                        for (var i = first; i <= last; i++) {
                            if (!currentlySelected.includes(arr[i])) {
                                currentlySelected.push(arr[i]);
                                arr[i].classList.add("selected");
                            }
                        }
                    }
                }
            });
        }
    });
}

async function fileAction(selected) {
    if (selected.length == 1) {
        // SINGLE FILE SELECTION //

        var fileSelected = selected[0];
        if (fileSelected.getAttribute("data-type") == "file") {
            console.debug("Clicked on file");
            if (
                fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice("-2")
                    .join(".") == "app.zip"
            ) {
                console.log("App Archive detected, extracting");

                let data = await fs.promises.readFile(
                    fileSelected.getAttribute("data-path"),
                );

                const path = fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice(0, -1)
                    .join(".");

                const zip = await JSZip.loadAsync(
                    new Blob([data], {
                        type: "application/zip",
                    }),
                );

                console.log(zip);

                const manifestFile = zip.file("manifest.json");

                const manifest = JSON.parse(await manifestFile.async("text"));

                const iconFile = zip.file(manifest.icon);

                const icon = new Blob([await iconFile.async("arraybuffer")]);

                const win = anura.wm.create(instance, {
                    title: "",
                    width: "450px",
                    height: "525px",
                });

                const iframe = document.createElement("iframe");

                iframe.setAttribute(
                    "src",
                    document.location.href.split("/").slice(0, -1).join("/") +
                        "/appview.html?manifest=" +
                        ExternalApp.serializeArgs([
                            await manifestFile.async("text"),
                            URL.createObjectURL(icon),
                            "app",
                        ]),
                );

                iframe.style =
                    "top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0;";

                win.content.appendChild(iframe);

                Object.assign(iframe.contentWindow, {
                    anura,
                    ExternalApp,
                    instance,
                    instanceWindow: win,
                    install: {
                        session: async () => {
                            await fs.mkdir(`${path}`);

                            let filesRemaining = Object.keys(zip.files).length;

                            zip.forEach(
                                async function (relativePath, zipEntry) {
                                    if (zipEntry.dir) {
                                        await fs.promises.mkdir(
                                            `${path}/${zipEntry.name}`,
                                        );
                                    } else {
                                        await fs.promises.writeFile(
                                            `${path}/${zipEntry.name}`,
                                            Buffer.from(
                                                await zipEntry.async(
                                                    "arraybuffer",
                                                ),
                                            ),
                                        );
                                    }
                                    filesRemaining--;
                                    console.log(filesRemaining);
                                    if (filesRemaining == 0) {
                                        await anura.registerExternalApp(
                                            `/fs${path}`.replace("//", "/"),
                                        );
                                        anura.notifications.add({
                                            title: "Application Installed for Session",
                                            description: `Application ${path.replace(
                                                "//",
                                                "/",
                                            )} has been installed temporarily, it will go away on refresh`,
                                            timeout: 50000,
                                        });
                                    }
                                },
                                function (e) {
                                    console.error(e);
                                },
                            );
                        },
                        permanent: async () => {
                            await fs.mkdir(
                                anura.settings.get("directories")["apps"] +
                                    "/" +
                                    path.split("/").slice("-1")[0],
                            );

                            let filesRemaining = Object.keys(zip.files).length;

                            zip.forEach(
                                async function (relativePath, zipEntry) {
                                    if (zipEntry.dir) {
                                        await fs.promises.mkdir(
                                            `${anura.settings.get("directories")["apps"]}/${path.split("/").slice("-1")[0]}/${zipEntry.name}`,
                                        );
                                    } else {
                                        await fs.promises.writeFile(
                                            `${anura.settings.get("directories")["apps"]}/${path.split("/").slice("-1")[0]}/${zipEntry.name}`,
                                            Buffer.from(
                                                await zipEntry.async(
                                                    "arraybuffer",
                                                ),
                                            ),
                                        );
                                    }
                                    filesRemaining--;
                                    console.log(filesRemaining);
                                    if (filesRemaining == 0) {
                                        await anura.registerExternalApp(
                                            `/fs${anura.settings.get("directories")["apps"]}/${path.split("/").slice("-1")[0]}`.replace(
                                                "//",
                                                "/",
                                            ),
                                        );
                                        anura.notifications.add({
                                            title: "Application Installed",
                                            description: `Application ${path.replace(
                                                "//",
                                                "/",
                                            )} has been installed permanently`,
                                            timeout: 50000,
                                        });
                                    }
                                },
                                function (e) {
                                    console.error(e);
                                },
                            );
                        },
                    },
                });

                iframe.contentWindow.addEventListener("load", () => {
                    const matter = document.createElement("link");
                    matter.setAttribute("rel", "stylesheet");
                    matter.setAttribute("href", "/assets/matter.css");
                    iframe.contentDocument.head.appendChild(matter);
                });
            } else if (
                fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice("-2")
                    .join(".") == "lib.zip"
            ) {
                console.log("Library Archive detected, extracting");
                const data = await fs.promises.readFile(
                    fileSelected.getAttribute("data-path"),
                );

                const path = fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice(0, -1)
                    .join(".");

                const zip = await JSZip.loadAsync(
                    new Blob([data], {
                        type: "application/zip",
                    }),
                );

                console.log(zip);

                const manifestFile = zip.file("manifest.json");

                const manifest = JSON.parse(await manifestFile.async("text"));

                const iconFile = zip.file(manifest.icon);

                const icon = new Blob([await iconFile.async("arraybuffer")]);

                const win = anura.wm.create(instance, {
                    title: "",
                    width: "450px",
                    height: "525px",
                });

                const iframe = document.createElement("iframe");

                iframe.setAttribute(
                    "src",
                    document.location.href.split("/").slice(0, -1).join("/") +
                        "/appview.html?manifest=" +
                        ExternalApp.serializeArgs([
                            await manifestFile.async("text"),
                            URL.createObjectURL(icon),
                            "lib",
                        ]),
                );

                iframe.style =
                    "top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0;";

                win.content.appendChild(iframe);

                Object.assign(iframe.contentWindow, {
                    anura,
                    ExternalApp,
                    instance,
                    instanceWindow: win,
                    install: {
                        session: async () => {
                            await fs.mkdir(`${path}`);

                            let filesRemaining = Object.keys(zip.files).length;

                            zip.forEach(
                                async function (relativePath, zipEntry) {
                                    if (zipEntry.dir) {
                                        await fs.promises.mkdir(
                                            `${path}/${zipEntry.name}`,
                                        );
                                    } else {
                                        await fs.promises.writeFile(
                                            `${path}/${zipEntry.name}`,
                                            Buffer.from(
                                                await zipEntry.async(
                                                    "arraybuffer",
                                                ),
                                            ),
                                        );
                                    }
                                    filesRemaining--;
                                    console.log(filesRemaining);
                                    if (filesRemaining == 0) {
                                        await anura.registerExternalLib(
                                            `/fs/${path}`.replace("//", "/"),
                                        );
                                        anura.notifications.add({
                                            title: "Library Installed for Session",
                                            description: `Library ${path.replace(
                                                "//",
                                                "/",
                                            )} has been installed temporarily, it will go away on refresh`,
                                            timeout: 50000,
                                        });
                                    }
                                },
                                function (e) {
                                    console.error(e);
                                },
                            );
                        },
                        permanent: async () => {
                            await fs.mkdir(
                                anura.settings.get("directories")["libs"] +
                                    "/" +
                                    path.split("/").slice("-1")[0],
                            );

                            let filesRemaining = Object.keys(zip.files).length;

                            zip.forEach(
                                async function (relativePath, zipEntry) {
                                    if (zipEntry.dir) {
                                        await fs.promises.mkdir(
                                            `${anura.settings.get("directories")["libs"]}/${path.split("/").slice("-1")[0]}/${zipEntry.name}`,
                                        );
                                    } else {
                                        await fs.promises.writeFile(
                                            `${anura.settings.get("directories")["libs"]}/${path.split("/").slice("-1")[0]}/${zipEntry.name}`,
                                            Buffer.from(
                                                await zipEntry.async(
                                                    "arraybuffer",
                                                ),
                                            ),
                                        );
                                    }
                                    filesRemaining--;
                                    console.log(filesRemaining);
                                    if (filesRemaining == 0) {
                                        await anura.registerExternalLib(
                                            `/fs${anura.settings.get("directories")["libs"]}/${path.split("/").slice("-1")[0]}`.replace(
                                                "//",
                                                "/",
                                            ),
                                        );
                                        anura.notifications.add({
                                            title: "Library Installed",
                                            description: `Library ${path.replace(
                                                "//",
                                                "/",
                                            )} has been installed permanently`,
                                            timeout: 50000,
                                        });
                                    }
                                },
                                function (e) {
                                    console.error(e);
                                },
                            );
                        },
                    },
                });

                iframe.contentWindow.addEventListener("load", () => {
                    const matter = document.createElement("link");
                    matter.setAttribute("rel", "stylesheet");
                    matter.setAttribute("href", "/assets/matter.css");
                    iframe.contentDocument.head.appendChild(matter);
                });
            } else if (
                fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice("-1")[0] == "zip"
            ) {
                console.debug("Zip file detected, extracting");
                const path = fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice(0, -1)
                    .join(".");
                await fs.promises.mkdir(path);
                const data = await fs.promises.readFile(
                    fileSelected.getAttribute("data-path"),
                );
                console.log(data);
                let zip = await JSZip.loadAsync(
                    new Blob([data], {
                        type: "application/zip",
                    }),
                ); // 1) read the Blob

                console.log(zip);
                let filesRemaining = Object.keys(zip.files).length;
                zip.forEach(
                    async function (relativePath, zipEntry) {
                        // 2) print entries
                        if (zipEntry.dir) {
                            await fs.promises.mkdir(`${path}/${zipEntry.name}`);
                        } else {
                            await fs.promises.writeFile(
                                `${path}/${zipEntry.name}`,
                                Buffer.from(
                                    await zipEntry.async("arraybuffer"),
                                ),
                            );
                        }
                        filesRemaining--;
                        console.log(filesRemaining);
                        if (filesRemaining == 0) {
                            reload();
                        }
                    },
                    function (e) {
                        console.error(e);
                    },
                );
            } else {
                anura.files.open(fileSelected.getAttribute("data-path"));
            }
        } else if (fileSelected.getAttribute("data-type") == "dir") {
            if (
                fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice("-1")[0] == "app"
            ) {
                try {
                    const data = await fs.promises.readFile(
                        `${fileSelected.getAttribute("data-path")}/manifest.json`,
                    );
                    const manifest = JSON.parse(data);
                    if (anura.apps[manifest.package]) {
                        anura.apps[manifest.package].open();
                        return;
                    }

                    const iconData = await fs.promises.readFile(
                        `${fileSelected.getAttribute("data-path")}/${manifest.icon}`,
                    );

                    const icon = new Blob([iconData]);

                    const win = anura.wm.create(instance, {
                        title: "",
                        width: "450px",
                        height: "525px",
                    });

                    const iframe = document.createElement("iframe");
                    iframe.setAttribute(
                        "src",
                        document.location.href
                            .split("/")
                            .slice(0, -1)
                            .join("/") +
                            "/appview.html?manifest=" +
                            ExternalApp.serializeArgs([
                                data.toString(),
                                URL.createObjectURL(icon),
                                "app",
                            ]),
                    );
                    iframe.style =
                        "top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0;";

                    win.content.appendChild(iframe);
                    Object.assign(iframe.contentWindow, {
                        anura,
                        ExternalApp,
                        instance,
                        instanceWindow: win,
                        install: {
                            session: async () => {
                                await anura.registerExternalApp(
                                    `/fs${fileSelected.getAttribute("data-path")}`.replace(
                                        "//",
                                        "/",
                                    ),
                                );
                                anura.notifications.add({
                                    title: "Application Installed for Session",
                                    description: `Application ${fileSelected
                                        .getAttribute("data-path")
                                        .replace(
                                            "//",
                                            "/",
                                        )} has been installed temporarily, it will go away on refresh`,
                                    timeout: 50000,
                                });
                                win.close();
                            },
                            permanent: async () => {
                                await fs.promises.rename(
                                    fileSelected.getAttribute("data-path"),
                                    anura.settings.get("directories")["apps"] +
                                        "/" +
                                        fileSelected
                                            .getAttribute("data-path")
                                            .split("/")
                                            .slice("-1")[0],
                                );
                                await anura.registerExternalApp(
                                    `/fs${anura.settings.get("directories")["apps"]}/${fileSelected.getAttribute("data-path").split("/").slice("-1")[0]}`.replace(
                                        "//",
                                        "/",
                                    ),
                                );
                                anura.notifications.add({
                                    title: "Application Installed",
                                    description: `Application ${fileSelected
                                        .getAttribute("data-path")
                                        .replace(
                                            "//",
                                            "/",
                                        )} has been installed permanently`,
                                    timeout: 50000,
                                });
                                win.close();
                            },
                        },
                    });

                    iframe.contentWindow.addEventListener("load", () => {
                        const matter = document.createElement("link");
                        matter.setAttribute("rel", "stylesheet");
                        matter.setAttribute("href", "/assets/matter.css");
                        iframe.contentDocument.head.appendChild(matter);
                    });
                } catch (e) {
                    anura.notifications.add({
                        title: "Application Install Error",
                        description: `Application had an error installing: ${e}`,
                        timeout: 50000,
                    });
                }
            } else if (
                fileSelected
                    .getAttribute("data-path")
                    .split(".")
                    .slice("-1")[0] == "lib"
            ) {
                try {
                    console.log(fileSelected.getAttribute("data-path"));
                    const data = await fs.promises.readFile(
                        `${fileSelected.getAttribute("data-path")}/manifest.json`,
                    );

                    const manifest = JSON.parse(data);
                    if (anura.libs[manifest.package]) {
                        return;
                    }

                    const iconData = await fs.promises.readFile(
                        `${fileSelected.getAttribute("data-path")}/${manifest.icon}`,
                    );

                    const icon = new Blob([iconData]);

                    const win = anura.wm.create(instance, {
                        title: "",
                        width: "450px",
                        height: "525px",
                    });

                    const iframe = document.createElement("iframe");

                    iframe.setAttribute(
                        "src",
                        document.location.href
                            .split("/")
                            .slice(0, -1)
                            .join("/") +
                            "/appview.html?manifest=" +
                            ExternalApp.serializeArgs([
                                data.toString(),
                                URL.createObjectURL(icon),
                                "lib",
                            ]),
                    );

                    iframe.style =
                        "top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0;";

                    win.content.appendChild(iframe);

                    Object.assign(iframe.contentWindow, {
                        anura,
                        ExternalApp,
                        instance,
                        instanceWindow: win,
                        install: {
                            session: async () => {
                                await anura.registerExternalLib(
                                    `/fs${fileSelected.getAttribute("data-path")}`.replace(
                                        "//",
                                        "/",
                                    ),
                                );
                                anura.notifications.add({
                                    title: "Library Installed for Session",
                                    description: `Library ${fileSelected
                                        .getAttribute("data-path")
                                        .replace(
                                            "//",
                                            "/",
                                        )} has been installed temporarily, it will go away on refresh`,
                                    timeout: 50000,
                                });
                                win.close();
                            },
                            permanent: async () => {
                                await fs.promises.rename(
                                    fileSelected.getAttribute("data-path"),
                                    anura.settings.get("directories")["libs"] +
                                        "/" +
                                        fileSelected
                                            .getAttribute("data-path")
                                            .split("/")
                                            .slice("-1")[0],
                                );
                                await anura.registerExternalLib(
                                    `/fs${anura.settings.get("directories")["libs"]}/${fileSelected.getAttribute("data-path").split("/").slice("-1")[0]}`.replace(
                                        "//",
                                        "/",
                                    ),
                                );
                                anura.notifications.add({
                                    title: "Library Installed",
                                    description: `Library ${fileSelected
                                        .getAttribute("data-path")
                                        .replace(
                                            "//",
                                            "/",
                                        )} has been installed permanently`,
                                    timeout: 50000,
                                });
                                win.close();
                            },
                        },
                    });
                    iframe.contentWindow.addEventListener("load", () => {
                        const matter = document.createElement("link");
                        matter.setAttribute("rel", "stylesheet");
                        matter.setAttribute("href", "/assets/matter.css");
                        iframe.contentDocument.head.appendChild(matter);
                    });
                } catch (e) {
                    anura.notifications.add({
                        title: "Library Install Error",
                        description: `Library had an error installing: ${e}`,
                        timeout: 50000,
                    });
                }
            } else {
                console.debug(
                    "Changing folder to ",
                    fileSelected.getAttribute("data-path"),
                );
                loadPath(fileSelected.getAttribute("data-path"));
            }
        } else {
            console.warn(
                "Unknown filetype ",
                fileSelected.getAttribute("data-type"),
                " doing nothing!",
            );
        }
    } else {
        // MULTIPLE FILE SELECTION //

        console.error("raff please implement");
    }
}

function setBreadcrumbs(path) {
    path = path.replace(/(\/)\1+/g, "$1");
    var pathSplit = path.split("/");
    pathSplit[0] = "My files";
    var breadcrumbs = document.querySelector(".breadcrumbs");
    breadcrumbs.setAttribute("data-current-path", path);
    breadcrumbs.innerHTML = "";
    if (
        pathSplit.length == 2 &&
        pathSplit[0] == "My files" &&
        pathSplit[1] == ""
    ) {
        var breadcrumb = document.createElement("button");
        breadcrumb.innerText = "My files";
        breadcrumb.addEventListener("click", () => {
            loadPath("/");
        });
        breadcrumbs.appendChild(breadcrumb);
        return;
    }
    for (var i = 0; i < pathSplit.length; i++) {
        console.log(i);
        var breadcrumb = document.createElement("button");
        breadcrumb.innerText = pathSplit[i];
        var index = i;
        breadcrumb.addEventListener("click", () => {
            loadPath("/" + pathSplit.slice(1, index).join("/"));
        });
        breadcrumbs.appendChild(breadcrumb);
        if (pathSplit[i] !== pathSplit[pathSplit.length - 1]) {
            var breadcrumbSpan = document.createElement("span");
            breadcrumbSpan.innerText = ">";
            breadcrumbs.appendChild(breadcrumbSpan);
        }
    }
}

document.querySelector("table").addEventListener("click", (e) => {
    if (e.currentTarget === e.target) {
        currentlySelected.forEach((row) => {
            row.classList.remove("selected");
        });
        currentlySelected = [];
    }
});
document.addEventListener("contextmenu", (e) => {
    if (e.shiftKey) {
        return;
    }
    e.preventDefault();
    const boundingRect = window.frameElement.getBoundingClientRect();

    // var contextmenu = document.querySelector("#contextMenu");

    // contextmenu.style.left = e.pageX + "px";
    // contextmenu.style.top = e.pageY + "px";
    // const hasSelection = currentlySelected.length > 0;
    // for (const elt of contextmenu.getElementsByClassName("needs-selection")) {
    //     elt.ariaDisabled = !hasSelection;
    //     elt.onclick = hasSelection ? elt.onclick : null;
    // }
    // contextmenu.style.removeProperty("display");
    const containsApps =
        currentlySelected
            .map(
                (item) =>
                    item.getAttribute("data-path").split(".").slice("-1")[0],
            )
            .filter((item) => item == "app" || item == "lib").length > 0;

    if (containsApps) {
        appcontextmenu.show(e.pageX + boundingRect.x, e.pageY + boundingRect.y);
        newcontextmenu.hide();
        emptycontextmenu.hide();
    } else if (currentlySelected.length != 0) {
        newcontextmenu.show(e.pageX + boundingRect.x, e.pageY + boundingRect.y);
        appcontextmenu.hide();
        emptycontextmenu.hide();
    } else {
        emptycontextmenu.show(
            e.pageX + boundingRect.x,
            e.pageY + boundingRect.y,
        );
        newcontextmenu.hide();
        appcontextmenu.hide();
    }
});

document.addEventListener("click", (e) => {
    if (
        !document.querySelector("#contextMenu").contains(e.target) ||
        !e.target.ariaDisabled
    ) {
        // document.querySelector("#contextMenu").style.setProperty("display", "none");
        newcontextmenu.hide();
        appcontextmenu.hide();
        emptycontextmenu.hide();
    }
});

function newFolder(path) {
    if (path === undefined) {
        path =
            document
                .querySelector(".breadcrumbs")
                .getAttribute("data-current-path") +
            "/" +
            prompt("Folder Name: ");
    }
    fs.mkdir(path);
    reload();
}

function newFile(path) {
    if (path === undefined) {
        path =
            document
                .querySelector(".breadcrumbs")
                .getAttribute("data-current-path") +
            "/" +
            prompt("File Name: ");
    }
    fs.writeFile(path, "");
    reload();
}

function reload() {
    loadPath(
        document
            .querySelector(".breadcrumbs")
            .getAttribute("data-current-path"),
    );
}

function reload() {
    loadPath(
        document
            .querySelector(".breadcrumbs")
            .getAttribute("data-current-path"),
    );
}

function upload() {
    let fauxput = document.createElement("input"); // fauxput - fake input that isn't shown or ever added to page TODO: think of a better name for this variable
    fauxput.type = "file";
    fauxput.onchange = async (e) => {
        const file = await e.target.files[0];
        const content = await file.arrayBuffer();
        fs.writeFile(
            `${document
                .querySelector(".breadcrumbs")
                .getAttribute("data-current-path")}/${file.name}`,
            Buffer.from(content),
            function (err) {
                reload();
            },
        );
    };
    fauxput.click();
}

function deleteFile() {
    if (currentlySelected.length == 0) {
        anura.notifications.add({
            title: "Filesystem app",
            description:
                "BUG: You have no files selected, right clicking does not select files",
            timeout: 5000,
        });
    }
    currentlySelected.forEach(async (item) => {
        await sh.rm(
            item.getAttribute("data-path"),
            {
                recursive: true,
            },
            function (err) {
                if (err) throw err;
                reload();
            },
        );
    });
}

function copy() {
    clipboard = currentlySelected;
    removeAfterPaste = false;
}

function cut() {
    clipboard = currentlySelected;
    removeAfterPaste = true;
}

function paste() {
    const path = document
        .querySelector(".breadcrumbs")
        .getAttribute("data-current-path");
    if (!removeAfterPaste) {
        // copy
        destination = path;
        clipboard.forEach((item) => {
            origin = item.getAttribute("data-path");
            fs.stat(origin, function (err, data) {
                if (data.isDirectory()) {
                    // Ok so you are about to be in for a ride
                    sh.ls(
                        origin,
                        {
                            recursive: true,
                        },
                        async function (err, entries) {
                            if (err) throw err;
                            let items = [];
                            let dirs = [];
                            entries.forEach((entry) => {
                                function recurse(dirnode, path) {
                                    dirnode.contents.forEach((entry) => {
                                        if (entry.type === "DIRECTORY") {
                                            recurse(
                                                entry,
                                                path + "/" + entry.name,
                                            );
                                            dirs.push(path + "/" + entry.name);
                                        } else {
                                            items.push(path + "/" + entry.name);
                                        }
                                    });
                                }

                                const topLevelFolder = origin;
                                dirs.push(origin);
                                if (entry.type === "DIRECTORY") {
                                    recurse(entry, origin + "/" + entry.name);
                                    dirs.push(origin + "/" + entry.name);
                                } else {
                                    items.push(origin + "/" + entry.name);
                                }
                            });
                            destItems = [];
                            destDirs = [];
                            numberToSubBy =
                                origin.length - origin.split("/").pop().length;

                            for (item in items) {
                                destItems.push(
                                    destination +
                                        "/" +
                                        items[item].slice(numberToSubBy),
                                );
                            }
                            for (dir in dirs) {
                                destDirs.push(
                                    destination +
                                        "/" +
                                        dirs[dir].slice(numberToSubBy),
                                );
                            }
                            console.log("initials");
                            console.log(items);
                            console.log("destinations");
                            console.log(destItems);
                            console.log("directories to mkdir -p ");
                            console.log(destDirs);
                            for (dir in destDirs) {
                                await new Promise((resolve, reject) => {
                                    sh.mkdirp(destDirs[dir], function (err) {
                                        if (err) {
                                            reject(err);
                                            console.error(err);
                                        }
                                        resolve();
                                    });
                                });
                            }

                            for (item in items) {
                                fs.readFile(items[item], function (err, data) {
                                    fs.writeFile(destItems[item], data);
                                });
                            }
                            reload();
                        },
                    );
                } else {
                    fs.readFile(origin, function (err, data) {
                        if (err) throw err;
                        fs.writeFile(
                            `${path}/${origin.split("/").slice("-1")[0]}`,
                            data,
                        );
                        reload();
                    });
                }
            });
        });
    }
    if (removeAfterPaste) {
        // cut
        clipboard.forEach((item) => {
            itemName = item.getAttribute("data-path");
            fs.rename(
                itemName,
                `${path}/${itemName.split("/").slice("-1")[0]}`,
                function (err) {
                    if (err) throw err;
                    reload();
                },
            );
        });
    }
}

function rename() {
    const path = document
        .querySelector(".breadcrumbs")
        .getAttribute("data-current-path");
    if (currentlySelected.length == 0) {
        anura.notifications.add({
            title: "Filesystem app",
            description:
                "BUG: You have no files selected, right clicking does not select files",
            timeout: 5000,
        });

        return;
    }
    if (currentlySelected.length > 1) {
        anura.notifications.add({
            title: "Filesystem app",
            description: "Renaming only works with one file",
            timeout: 5000,
        });
        return;
    }
    fs.rename(
        currentlySelected[0].getAttribute("data-path"),
        `${path}/${prompt("filename:")}`,
        function (err) {
            if (err) throw err;
            reload();
        },
    );
}

function installSession() {
    if (currentlySelected.length == 0) {
        anura.notifications.add({
            title: "Filesystem app",
            description:
                "BUG: You have no files selected, right clicking does not select files",
            timeout: 5000,
        });
        return;
    }
    currentlySelected.forEach(async (item) => {
        const path = item.getAttribute("data-path");
        const ext = path.split(".").slice("-1")[0];
        fs.stat(path, async function (err, stats) {
            if (stats.isDirectory()) {
                if (ext == "app") {
                    try {
                        await anura.registerExternalApp(
                            `/fs${path}`.replace("//", "/"),
                        );
                        anura.notifications.add({
                            title: "Application Installed for Session",
                            description: `Application ${path.replace(
                                "//",
                                "/",
                            )} has been installed temporarily, it will go away on refresh`,
                            timeout: 50000,
                        });
                    } catch (e) {
                        anura.notifications.add({
                            title: "Application Install Error",
                            description: `Application had an error installing: ${e}`,
                            timeout: 50000,
                        });
                    }
                }
                if (ext == "lib") {
                    try {
                        await anura.registerExternalLib(
                            `/fs${path}`.replace("//", "/"),
                        );
                        anura.notifications.add({
                            title: "Library Installed for Session",
                            description: `Library ${path.replace(
                                "//",
                                "/",
                            )} has been installed temporarily, it will go away on refresh`,
                            timeout: 50000,
                        });
                    } catch (e) {
                        anura.notifications.add({
                            title: "Library Install Error",
                            description: `Library had an error installing: ${e}`,
                            timeout: 50000,
                        });
                    }
                }
            }
        });
    });
}

function installPermanent() {
    if (currentlySelected.length == 0) {
        anura.notifications.add({
            title: "Filesystem app",
            description:
                "BUG: You have no files selected, right clicking does not select files",
            timeout: 5000,
        });
        return;
    }
    currentlySelected.forEach(async (item) => {
        const path = item.getAttribute("data-path");
        const ext = path.split(".").slice("-1")[0];

        fs.stat(path, async function (err, stats) {
            if (stats.isDirectory()) {
                if (ext == "app") {
                    const destination =
                        anura.settings.get("directories")["apps"];
                    try {
                        await fs.promises.rename(
                            path,
                            destination + "/" + path.split("/").slice("-1")[0],
                        );
                        await anura.registerExternalApp(
                            `/fs${destination}/${path.split("/").slice("-1")[0]}`.replace(
                                "//",
                                "/",
                            ),
                        );
                    } catch (e) {
                        anura.notifications.add({
                            title: "Application Install Error",
                            description: `Application had an error installing: ${e}`,
                            timeout: 50000,
                        });
                    }
                }
                if (ext == "lib") {
                    const destination =
                        anura.settings.get("directories")["libs"];
                    try {
                        sh.ls(
                            path,
                            {
                                recursive: true,
                            },
                            async function (err, entries) {
                                if (err) throw err;
                                let items = [];
                                let dirs = [];
                                entries.forEach((entry) => {
                                    function recurse(dirnode, path) {
                                        dirnode.contents.forEach((entry) => {
                                            if (entry.type === "DIRECTORY") {
                                                recurse(
                                                    entry,
                                                    path + "/" + entry.name,
                                                );
                                                dirs.push(
                                                    path + "/" + entry.name,
                                                );
                                            } else {
                                                items.push(
                                                    path + "/" + entry.name,
                                                );
                                            }
                                        });
                                    }

                                    const topLevelFolder = path;
                                    dirs.push(path);
                                    if (entry.type === "DIRECTORY") {
                                        recurse(entry, path + "/" + entry.name);
                                        dirs.push(path + "/" + entry.name);
                                    } else {
                                        items.push(path + "/" + entry.name);
                                    }
                                });
                                destItems = [];
                                destDirs = [];
                                numberToSubBy =
                                    path.length - path.split("/").pop().length;

                                for (item in items) {
                                    destItems.push(
                                        destination +
                                            "/" +
                                            items[item].slice(numberToSubBy),
                                    );
                                }
                                for (dir in dirs) {
                                    destDirs.push(
                                        destination +
                                            "/" +
                                            dirs[dir].slice(numberToSubBy),
                                    );
                                }
                                console.log("initials");
                                console.log(items);
                                console.log("destinations");
                                console.log(destItems);
                                console.log("directories to mkdir -p ");
                                console.log(destDirs);
                                for (dir in destDirs) {
                                    await new Promise((resolve, reject) => {
                                        sh.mkdirp(
                                            destDirs[dir],
                                            function (err) {
                                                if (err) {
                                                    reject(err);
                                                    console.error(err);
                                                }
                                                resolve();
                                            },
                                        );
                                    });
                                }

                                for (item in items) {
                                    await new Promise((resolve, reject) => {
                                        fs.readFile(
                                            items[item],
                                            function (err, data) {
                                                fs.writeFile(
                                                    destItems[item],
                                                    data,
                                                    function (err) {
                                                        if (err) {
                                                            reject(err);
                                                            console.error(err);
                                                        }
                                                        resolve();
                                                    },
                                                );
                                            },
                                        );
                                    });
                                }

                                console.log("finished copying files???");

                                await anura.registerExternalLib(
                                    `/fs${destination}/${path.split("/").slice("-1")[0]}`.replace(
                                        "//",
                                        "/",
                                    ),
                                );
                                anura.notifications.add({
                                    title: "Library Installed",
                                    description: `Library ${path.replaceAll(
                                        "/",
                                        "",
                                    )} has been installed permanently.`,
                                    timeout: 50000,
                                });

                                reload();
                            },
                        );
                    } catch (e) {
                        anura.notifications.add({
                            title: "Library Install Error",
                            description: `Library had an error installing: ${e}`,
                            timeout: 50000,
                        });
                    }
                }
            }
        });
    });
}

// Context menu version of the loadPath function
// Used to enter app and lib folders, as double
// clicking on them will install them.
function navigate() {
    if (currentlySelected.length == 1) {
        loadPath(currentlySelected[0].getAttribute("data-path"));
    }
    // Can't navigate to multiple folders
}

loadPath("/");
