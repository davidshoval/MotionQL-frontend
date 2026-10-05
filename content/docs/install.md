MotionQL is a desktop app for **macOS** and **Windows**, and from version 1.1 for **Linux** (an x64 AppImage and a `.deb` package). The download page shows the Linux files as soon as a release includes them.

## System requirements

| | Requirement |
|---|---|
| **macOS** | macOS 12 (Monterey) or later, Apple silicon or Intel |
| **Windows** | Windows 10 or 11, 64-bit (x64) |
| **Memory** | 4 GB RAM minimum, 8 GB recommended for large result sets and imports |
| **Disk** | About 500 MB for the app, plus space for exports and dumps |
| **Secure storage** | macOS Keychain or your Windows user profile (DPAPI). MotionQL encrypts saved passwords with it |
| **MongoDB** | MongoDB 4.4 or later, including Atlas, replica sets and sharded clusters. Amazon DocumentDB, Azure Cosmos DB for MongoDB and FerretDB work too, limited to the features those services implement |

## Download

1. [Create a free account](/register) and confirm your email address.
2. Open the [download page](/download). It picks the right file for your computer:
   - **macOS:** a `.dmg` for Apple silicon (`arm64`) or Intel (`x64`).
   - **Windows:** an installer (`.exe`) and a portable version that runs without installation.
3. Every release lists a `SHA256SUMS.txt` file. To check a download:

```sh
# macOS
shasum -a 256 -c SHA256SUMS.txt --ignore-missing
# Windows (PowerShell): compare the output with the line in SHA256SUMS.txt
Get-FileHash .\MotionQL-1.0.1-win-x64.exe -Algorithm SHA256
```

## Install on Linux

**AppImage:**

```sh
chmod +x MotionQL-*-linux-x86_64.AppImage
./MotionQL-*-linux-x86_64.AppImage
```

AppImages need FUSE 2. On Ubuntu 22.04 and later run `sudo apt install libfuse2` (Ubuntu 24.04: `libfuse2t64`). The AppImage is the Linux build that can update itself.

**Debian and Ubuntu:** install the `.deb` with `sudo apt install ./MotionQL-*.deb`.

MotionQL keeps passwords in your desktop's Secret Service (GNOME Keyring or KWallet). On minimal desktops, install and start one, for example `gnome-keyring`.

## About the security warnings

The current MotionQL installers are **not yet code-signed** with an Apple Developer ID or a Windows code-signing certificate. Your operating system will warn you the first time you open the app. This is expected for unsigned apps; it does not mean the file is damaged. If you want to be sure the file is the one we published, check its SHA-256 checksum as shown above.

Because in-app updates require signed builds, MotionQL does not update itself yet. Download new versions from the [download page](/download); the [changelog](/changelog) lists what changed.

## Install on macOS

1. Open the `.dmg` and drag **MotionQL** to **Applications**.
2. Open MotionQL from Applications. macOS says it **cannot verify the developer** and offers only **Done** or **Move to Bin**. Choose **Done**.
3. Open **System Settings → Privacy & Security**. Scroll to **Security**, where you will see *"MotionQL" was blocked to protect your Mac*. Click **Open Anyway** and confirm with your password or Touch ID.
4. MotionQL opens. You only need to do this once per installed version.

On older macOS versions you can instead **Control-click** (right-click) MotionQL in Applications, choose **Open**, then **Open** again in the dialog.

## Install on Windows

1. Run `MotionQL-<version>-win-x64.exe`.
2. Microsoft Defender SmartScreen shows **Windows protected your PC**. Click **More info**, check that the file name is the one you downloaded, then click **Run anyway**.
3. Choose whether to install **for you only** (default, no administrator rights needed, installs to `%LOCALAPPDATA%\Programs\MotionQL`) or **for all users** (needs administrator rights, installs to `C:\Program Files\MotionQL`).

Some browsers also flag unfamiliar downloads. In Edge or Chrome, open the downloads list, choose **Keep** (Edge: **⋯ → Keep → Show more → Keep anyway**).

**Portable version.** `MotionQL-<version>-win-portable.exe` runs without installing. It still keeps settings and encrypted passwords in your user profile.

**Silent install** for IT teams: the installer accepts `/S` (silent), `/allusers`, `/currentuser` and `/D=<folder>` (last argument, unquoted).

```bat
MotionQL-1.0.1-win-x64.exe /S /currentuser
```

## First run

1. **License agreement.** Read and accept the EULA.
2. **Activate Pro (optional).** Paste your free Pro key in **Settings → License**. See [Register and activate Pro](/docs/activate).
3. **Connect.** The Connection Manager opens. Paste a `mongodb://` or `mongodb+srv://` connection string, click **Test**, then **Save** and **Connect**. See [Connections](/docs/connections).
4. **App lock (recommended).** In **Settings → Security**, set an app password so MotionQL locks after a period of inactivity and closes database connections while locked.

## Uninstall

| Platform | How |
|---|---|
| macOS | Quit MotionQL and move `/Applications/MotionQL.app` to the Bin |
| Windows | **Settings → Apps → MotionQL → Uninstall**, or run `Uninstall MotionQL.exe` in the install folder |

Uninstalling keeps your data (saved connections, settings, audit log). To remove it too, delete the data folder:

| Platform | Data folder |
|---|---|
| macOS | `~/Library/Application Support/motionql/` |
| Windows | `%APPDATA%\motionql\` |
