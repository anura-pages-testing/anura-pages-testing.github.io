const settingsCSS = css`
    .self {
        color: white;
    }
    .header {
        margin-left: 20px;
    }
    .container {
        display: flex;
    }
    .settings-category {
        margin-left: 20px;
        width: 100%;
    }
    .settings-body {
        display: flex;
        width: 100%;
        margin-right: 20px;
        flex-direction: column;
    }
    .sidebar {
        margin-left: 20px;
        margin-top: 15px;
    }
    .sidebar-settings-item {
        height: 40px;
        display: flex;
        align-items: center;
        margin: 5px;
        width: 150px;
        cursor: pointer;
        border-radius: 5px;
        transition: 250ms ease-in-out;
    }
    .sidebar-settings-item-name > a:hover {
        color: #b9b9b9;
    }
    .settings-category-name {
        color: rgb(225 225 225);
        margin-bottom: 15px;
    }
    .settings-item {
        margin-bottom: 10px;
        background-color: rgb(20 20 20);
        height: 40px;
        display: flex;
        margin-right: 10px;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 20px);
        border-radius: 10px;
    }
    .settings-item-name {
        margin-left: 10px;
    }
    .settings-button {
        background-color: #2f2f2f;
        border: none;
        border-radius: 5px;
        padding: 5px;
        color: #c1c1c1;
        cursor: pointer;
        margin-right: 10px;
    }
    .settings-item-text-input {
        background-color: #2f2f2f;
        margin-right: 10px;
        border: none;
        border-radius: 5px;
        padding: 5px;
        color: white;
    }
    .settings-item-text-input:focus {
        outline: none;
    }
    .sidebar-settings-item-name > a {
        color: #c1c1c1;
        margin-left: 20px;
        text-decoration: none;
    }
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 18px;
        margin-right: 10px;
    }
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 28px;
        width: 28px;
        bottom: -5px;
        background-color: white;
        transition: all 0.4s ease 0s;
    }

    input:checked + .slider {
        background-color: #2196f3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
        transform: translateX(34px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
    .disk-info {
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .disk-size-bytes {
        height: 15px;
        margin-left: 10px;
    }
    .settings-button-group {
        display: flex;
    }
    .grouped-btn {
        width: 100%;
    }
`;

class SettingsApp extends App {
    name = "Settings";
    package = "anura.settings";
    icon = "/assets/icons/settings.png";

    state = stateful({
        show_x86_install: anura.settings.get("x86-disabled"),
        x86_installing: false,
        resizing: false,
    });

    page = async () => (
        <div
            style="height:100%;width:100%;position:absolute"
            class={`background ${settingsCSS} self`}
        >
            <div class="header">
                <h2 color="white">Anura Settings</h2>
            </div>

            <div css={this.state} class="container">
                <div class="sidebar">
                    <div class="sidebar-settings-item">
                        <h4 class="sidebar-settings-item-name">
                            <a href="#general">General</a>
                        </h4>
                    </div>
                    <div class="sidebar-settings-item">
                        <h4 class="sidebar-settings-item-name">
                            <a href="#v86">v86</a>
                        </h4>
                    </div>
                    <div class="sidebar-settings-item">
                        <h4 class="sidebar-settings-item-name">
                            <a href="#reset">Reset</a>
                        </h4>
                    </div>
                </div>
                <div class="settings-body">
                    <div id="general" class="general settings-category">
                        <h3 class="settings-category-name">General</h3>
                        <div class="settings-item">
                            <h4 class="settings-item-name">
                                Borderless AboutBrowser
                            </h4>
                            <label class="switch">
                                <input
                                    on:click={(event: any) => {
                                        if (event.target.checked) {
                                            anura.settings.set(
                                                "borderless-aboutbrowser",
                                                true,
                                            );
                                        } else {
                                            anura.settings.set(
                                                "borderless-aboutbrowser",
                                                false,
                                            );
                                        }
                                    }}
                                    id="borderless-aboutbrowser"
                                    type="checkbox"
                                />
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="settings-item">
                            <h4 class="settings-item-name">
                                Window Edge Clamping
                            </h4>
                            <label class="switch">
                                <input
                                    on:click={(event: any) => {
                                        if (event.target.checked) {
                                            anura.settings.set(
                                                "clampWindows",
                                                true,
                                            );
                                        } else {
                                            anura.settings.set(
                                                "clampWindows",
                                                false,
                                            );
                                        }
                                    }}
                                    id="clampWindows"
                                    type="checkbox"
                                />
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="settings-item">
                            <h4 class="settings-item-name">
                                Transparent Anura Shell Background
                            </h4>
                            <label class="switch">
                                <input
                                    on:click={(event: any) => {
                                        if (event.target.checked) {
                                            anura.settings.set(
                                                "transparent-ashell",
                                                true,
                                            );
                                        } else {
                                            anura.settings.set(
                                                "transparent-ashell",
                                                false,
                                            );
                                        }
                                    }}
                                    id="transparent-ashell"
                                    type="checkbox"
                                />
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="settings-item">
                            <h4 class="settings-item-name">
                                Enable Launcher Keybind
                            </h4>
                            <label class="switch">
                                <input
                                    on:click={(event: any) => {
                                        if (event.target.checked) {
                                            anura.settings.set(
                                                "launcher-keybind",
                                                true,
                                            );
                                        } else {
                                            anura.settings.set(
                                                "launcher-keybind",
                                                false,
                                            );
                                        }
                                    }}
                                    id="launcher-keybind"
                                    type="checkbox"
                                />
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="settings-item">
                            <h4 class="settings-item-name">Custom Wisp URL</h4>
                            <input
                                class="settings-item-text-input"
                                on:change={(event: any) => {
                                    anura.settings.set(
                                        "wisp-url",
                                        event.target.value,
                                    );
                                }}
                                placeholder={anura.settings.get("wisp-url")}
                                type="text"
                            />
                        </div>
                        <div class="settings-item">
                            <h4 class="settings-item-name">
                                Custom Bare URL (deprecated)
                            </h4>
                            <input
                                class="settings-item-text-input"
                                on:change={(event: any) => {
                                    anura.settings.set(
                                        "bare-url",
                                        event.target.value,
                                    );
                                }}
                                placeholder={anura.settings.get("bare-url")}
                                type="text"
                            />
                        </div>
                    </div>
                    <div id="v86" class="v86 settings-category">
                        <h3 class="settings-category-name">Anura x86</h3>
                        {this.state.show_x86_install ? (
                            <div>
                                <button
                                    on:click={async () => {
                                        this.state.x86_installing = true;
                                        const chosenRootFS = prompt(
                                            'Enter the name of the rootfs you want to install ("alpine", "debian", "arch")',
                                        );
                                        if (
                                            chosenRootFS == "debian" ||
                                            chosenRootFS == "arch" ||
                                            chosenRootFS == "alpine"
                                        ) {
                                            anura.settings.set(
                                                "x86-image",
                                                chosenRootFS,
                                            );
                                            await installx86();
                                            anura.settings.set(
                                                "x86-disabled",
                                                false,
                                            );
                                            anura.notifications.add({
                                                title: "x86 Subsystem Installed",
                                                description:
                                                    "x86 OS has sucessfully installed. Reload the page to use it!",
                                                timeout: 5000,
                                            });

                                            this.state.x86_installing = false;
                                            this.state.show_x86_install = true;

                                            if (
                                                document.getElementById(
                                                    "tracker",
                                                )
                                            ) {
                                                document.getElementById(
                                                    "tracker",
                                                )!.innerText = "Installed!";
                                            }
                                        } else {
                                            alert(
                                                "Invalid rootfs name! Valid names are: alpine, debian, arch",
                                            );
                                        }
                                    }}
                                    class="settings-button"
                                >
                                    Install x86 Subsystem
                                </button>
                                <div id="tracker"></div>
                            </div>
                        ) : (
                            <div className="x86-container">
                                <div class="settings-item">
                                    <h4 class="settings-item-name">
                                        Custom Bare URL
                                    </h4>
                                    <input
                                        class="settings-item-text-input"
                                        on:change={(event: any) => {
                                            anura.settings.set(
                                                "relay-url",
                                                event.target.value,
                                            );
                                        }}
                                        placeholder={anura.settings.get(
                                            "relay-url",
                                        )}
                                        type="text"
                                    />
                                </div>
                                <div class="settings-item">
                                    <div class="disk-info">
                                        <h4 class="settings-item-name">
                                            Disk Size (MB)
                                        </h4>
                                        <input
                                            class="settings-item-text-input disk-size-bytes"
                                            id="disk-size-bytes"
                                            value={
                                                Math.ceil(
                                                    anura.x86hdd.size / 1000000,
                                                ) || 0
                                            }
                                            type="text"
                                        />
                                    </div>
                                    <button
                                        on:click={async () => {
                                            anura.x86?.emulator.stop();
                                            clearInterval(
                                                anura.x86?.saveinterval,
                                            );

                                            this.state.resizing = true;
                                            if (
                                                document.getElementById(
                                                    "resize-disk-btn",
                                                )
                                            ) {
                                                document.getElementById(
                                                    "resize-disk-btn",
                                                )!.innerText = "Resizing...";
                                            }
                                            if (
                                                document.getElementById(
                                                    "disk-size-bytes",
                                                )
                                            ) {
                                                await anura.x86hdd.resize(
                                                    parseInt(
                                                        (
                                                            document.getElementById(
                                                                "disk-size-bytes",
                                                            ) as HTMLInputElement
                                                        ).value,
                                                    ) * 1000000,
                                                );
                                                const emulator = new V86Starter(
                                                    {
                                                        wasm_path:
                                                            "/lib/v86.wasm",
                                                        memory_size:
                                                            512 * 1024 * 1024,
                                                        vga_memory_size:
                                                            8 * 1024 * 1024,
                                                        screen_container:
                                                            anura.x86!
                                                                .screen_container,

                                                        initrd: {
                                                            url: "/images/resizefs.img",
                                                        },

                                                        bzimage: {
                                                            url: "/images/bzResize",
                                                            async: false,
                                                        },
                                                        hda: {
                                                            buffer: anura.x86hdd,
                                                            async: true,
                                                        },

                                                        cmdline:
                                                            "random.trust_cpu=on 8250.nr_uarts=10 spectre_v2=off pti=off",

                                                        bios: {
                                                            url: "/bios/seabios.bin",
                                                        },
                                                        vga_bios: {
                                                            url: "/bios/vgabios.bin",
                                                        },
                                                        autostart: true,
                                                        uart1: true,
                                                        uart2: true,
                                                    },
                                                );
                                                let s0data = "";
                                                emulator.add_listener(
                                                    "serial0-output-byte",
                                                    async (byte: number) => {
                                                        const char =
                                                            String.fromCharCode(
                                                                byte,
                                                            );
                                                        if (char === "\r") {
                                                            anura.logger.debug(
                                                                s0data,
                                                            );

                                                            if (
                                                                s0data.includes(
                                                                    "Finished Disk",
                                                                )
                                                            ) {
                                                                await anura.x86hdd.save(
                                                                    emulator,
                                                                );
                                                                this.state.resizing =
                                                                    false;
                                                                if (
                                                                    document.getElementById(
                                                                        "resize-disk-btn",
                                                                    )
                                                                ) {
                                                                    document.getElementById(
                                                                        "resize-disk-btn",
                                                                    )!.innerText =
                                                                        "Resize Disk";
                                                                }
                                                                confirm(
                                                                    "Resized disk! Would you like to reload the page?",
                                                                )
                                                                    ? window.location.reload()
                                                                    : null;
                                                            }

                                                            s0data = "";
                                                            return;
                                                        }
                                                        s0data += char;
                                                    },
                                                );
                                            }
                                        }}
                                        class="settings-button"
                                        id="resize-disk-btn"
                                    >
                                        Resize Disk
                                    </button>
                                </div>
                                <div class="settings-button-group">
                                    <button
                                        on:click={() => {
                                            this.state.show_x86_install = false;
                                            anura.settings.set(
                                                "x86-disabled",
                                                true,
                                            );
                                            setTimeout(() => {
                                                anura.x86hdd.delete();
                                            }, 200);
                                        }}
                                        class="settings-button grouped-btn"
                                    >
                                        Disable x86 Subsystem
                                    </button>
                                    <button
                                        on:click={() => {
                                            if (
                                                confirm(
                                                    "Custom RootFSes are in beta and may not work properly. Continue?",
                                                )
                                            ) {
                                                const inp =
                                                    document.createElement(
                                                        "input",
                                                    );
                                                inp.type = "file";
                                                inp.addEventListener(
                                                    "change",
                                                    async () => {
                                                        if (inp.files) {
                                                            if (inp.files[0]) {
                                                                try {
                                                                    // @ts-ignore
                                                                    await anura.x86hdd.loadfile(
                                                                        inp
                                                                            .files[0],
                                                                    );
                                                                    anura.notifications.add(
                                                                        {
                                                                            title: "Custom RootFS Loaded",
                                                                            description:
                                                                                "Custom RootFS has sucessfully loaded!",
                                                                            timeout: 5000,
                                                                        },
                                                                    );
                                                                } catch (e) {
                                                                    alert(
                                                                        "Error loading file: " +
                                                                            e,
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    },
                                                );
                                                inp.click();
                                            }
                                        }}
                                        class="settings-button grouped-btn"
                                    >
                                        Upload Custom RootFS
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div id="reset" class="settings-category">
                        <h3 class="settings-category-name">Reset Anura</h3>
                        <div class="settings-item">
                            <h4 class="settings-item-name">
                                Reset your Anura install.
                            </h4>
                            <button
                                class="settings-button"
                                on:click={async () => {
                                    const confirmation = await confirm(
                                        "Are you sure you want to powerwash Anura? All of your data will be lost.",
                                    );
                                    if (confirmation) {
                                        const sh = new anura.fs.Shell();
                                        try {
                                            localStorage.clear();
                                            await sleep(2);
                                            await sh.promises.rm("/", {
                                                recursive: true,
                                            });
                                            window.location.reload();
                                        } catch (error) {
                                            window.location.reload();
                                        }
                                    }
                                }}
                            >
                                Powerwash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    constructor() {
        super();
    }

    async open(): Promise<WMWindow | undefined> {
        const win = anura.wm.create(this, {
            title: "",
            width: "910px",
            height: "720px",
            resizable: false,
        });

        win.content.appendChild(await this.page());

        if (document.getElementById("borderless-aboutbrowser")) {
            if (anura.settings.get("borderless-aboutbrowser")) {
                document
                    .getElementById("borderless-aboutbrowser")!
                    .setAttribute("checked", "");
            }
        }
        if (document.getElementById("clampWindows")) {
            if (anura.settings.get("clampWindows")) {
                document
                    .getElementById("clampWindows")!
                    .setAttribute("checked", "");
            }
        }
        if (document.getElementById("transparent-ashell")) {
            if (anura.settings.get("transparent-ashell")) {
                document
                    .getElementById("transparent-ashell")!
                    .setAttribute("checked", "");
            }
        }
        if (document.getElementById("launcher-keybind")) {
            if (anura.settings.get("launcher-keybind")) {
                document
                    .getElementById("launcher-keybind")!
                    .setAttribute("checked", "");
            }
        }

        return win;
    }
}
