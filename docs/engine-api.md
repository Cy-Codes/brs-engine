# BrightScript Engine API

The engine worker library has a programable interface to make it easy to integrate into any web based application. 

Check the [documentation](docs/integrating.md) to learn how to start using it. The only pre-requisite is to expose a `canvas` object named `display` on the default `document`, and optionally,  if you want to show the performance statistics, you also need to expose a `div` object named `stats`.

## Methods

| Method | Description | Parameters / Details|
| --- | --- | --- |
|initialize(`customDeviceInfo?`, `options?`)|Initializes the engine simulated device|<ul><li>`customDeviceInfo?` (object): customized device information, see [/src/api/package.ts](/src/api/package.ts) for valid properties.</li><li>`options?` (object): init options, valid properties are:<br>- `debugToConsole`(boolean): if `false` prevents messages to be sent to the `console`, you still can get debug messages using the `debug` event, default is `true`.<br>- `showStats`(boolean): if `true` the performance statistics overlay will be shown over the display when the app is running, default is `false`.<br>- `disableGamePads`(boolean): Set this option to `true` if you want to disable the GamePad remote control emulation, default is `false`<br>- `disableKeys`(boolean): if the engine is running on a device with no keyboard, or you don't need keyboard control, set this option to `true` and disable the default keyboard remote control emulation, default is `false`<br>- `customKeys`(Map): a custom map of keyboard keys to add/remove from the remote control emulation, see [/src/api/control.ts](/src/api/control.ts) for the default mappings.</li>|
|subscribe(`observerId`, `observerCallback`)|Subscribes to the engine events (see list below) |<ul><li>`observerId` (string): identifier of the subscriber process.</li><li>`observerCallback` (function): callback function to receive the events from the engine.</li>|
|unsubscribe(`observerId`)|Unsubscribes to the engine events|<ul><li>`observerId` (string): identifier of the subscriber process.</li>|
|execute(`filePath`, `fileData`, `options?`)|Loads and run an app package (`.zip`/`.bpk`), a source code file (`.brs`) or plain text BrightScript code|<ul><li>`filePath` (string): path of the loaded file, make sure extension is `.zip` or `.bpk` if loading a full app.</li><li>`fileData` (ArrayBuffer/Blob/string): contents of the file or just a string with BrightScript code.</li><li>`options?` (object): execution options, valid properties are:<br>- `clearDisplayOnExit` (boolean): if `false` the display will keep the last image when app ends, default is `true`.<br>- `muteSound` (boolean): if `true` the engine will mute all audio but events are still raised, default is `false`.<br>- `execSource` (string): the execution source to be sent on the input params (see [Roku docs](https://developer.roku.com/en-gb/docs/developer-program/getting-started/architecture/dev-environment.md#source-parameter)).<br>- `debugOnCrash` (boolean): if `true` stops on the Micro Debugger when a crash happens, default is `false`.<br>- `password` (string): the password to decrypt a `.bpk`, or encrypt a `.zip` package, default is "".</li>|
|terminate(`reason`)|Terminates the current app/source code execution|<ul><li>`reason` (string): the reason for the termination to be shown on debug.</li>|
|redraw(`fullScreen`, `width?`, `height?`, `dpr?`)|Requests a display redraw (always keeps the aspect ratio based on display mode)|<ul><li>`fullScreen` (boolean): Flag to inform if the full screen mode is activated.</li><li>`width?` (number): width of the canvas, if not passed uses `window.innerWidth`.</li><li>`height?` (number): height of the canvas, if not passed uses `window.innerHeight`.</li><li>`dpr?` (number): device pixel ratio, if not passed uses `window.devicePixelRatio`.</li>|
|setDisplayMode(`mode`)|Configures the display mode (if an app is running will reset the simulated device) |<ul><li>`mode` (string): supported modes are `"480p"` (SD), `"720p"` (HD) or `"1080p"`(FHD).</li>|
|getDisplayMode()|Returns the current display mode. ||
|setOverscanMode(`mode`)|Configures the overscan mode. |<ul><li>`mode` (string): supported modes are `"disabled"`, `"guidelines"` or `"overscan"`.</li>|
|getOverscanMode()|Returns the current overscan mode.||
|enableStats(`state`)|Enables or disables the performance stats overlay |<ul><li>`state` (boolean): if `true` performance statistics will be shown over the display, on the top left.</li>|
|setAudioMute(`mute`)|Mutes or un-mutes the audio during app execution|<ul><li>`mute` (boolean): if `true` the audio will be muted.</li>|
|getAudioMute()|Returns `true` if the audio is muted ||
|getSerialNumber()|Returns the device serial number, this value changes when the `deviceData.deviceModel` is updated ||
|setCustomKeys(`keysMap`)|Sends a custom map of keyboard keys to add/remove from the remote control emulation |<ul><li>`keysMap` (Map): see [/src/api/control.ts](/src/api/control.ts) for the default mappings.</li>|
|sendKeyDown(`key`)|Sends a remote control key down event to the engine|<ul><li>`key` (string): one of valid key codes (see [Roku doc](https://developer.roku.com/docs/references/scenegraph/component-functions/onkeyevent.md)).</li>|
|sendKeyUp(`key`)|Sends a remote control key up event to the engine|<ul><li>`key` (string): one of valid key codes (see [Roku doc](https://developer.roku.com/docs/references/scenegraph/component-functions/onkeyevent.md)).</li>|
|sendKeyPress(`key`, `delay?`)|Sends a remote control key press event to the engine|<ul><li>`key` (string): one of valid key codes (see [Roku doc](https://developer.roku.com/docs/references/scenegraph/component-functions/onkeyevent.md)).</li><li>`delay` (number): the delay (in milliseconds) between sending Key Up and Key Down (default is 300ms).|
|debug(`command`)|Sends a debug command to the Engine|<ul><li>`command` (string): the Micro Debugger can be enabled sending `break` command, and after that, any valid BrightScript expression or [debug commands](https://developer.roku.com/en-gb/docs/developer-program/debugging/debugging-channels.md#brightscript-console-port-8085-commands) can be sent. You can also send `pause` to interrupt the interpreter, for instance, when the app loses focus. The command `cont` restarts the app. You can use this method on the browser console to debug your app.|
|getVersion()|Returns the version of the API library ||

## Events

| Event      | Description                                      | Data Type                         |
|------------|--------------------------------------------------|-----------------------------------|
| loaded     | Triggered when the source code data has finished loading | object: `{id: string, file: string, title: string, subtitle: string, version: string, running: boolean}`|
| icon       | Triggered when the zip file is loaded and manifest links to a valid icon for the app | base64: A base64 string of the app icon, extracted from the zip file. |
| registry   | Triggered when the app updates the registry | Map: the registry with all recent recent updates. |
| started    | Triggered when the engine started running the source code | object: `{id: string, file: string, title: string, subtitle: string, version: string, running: boolean}` |
| closed     | Triggered when the engine terminated the execution of the source code | string: the exit reason based on [Roku documentation](https://developer.roku.com/docs/developer-program/getting-started/architecture/dev-environment.md#lastexitorterminationreason-parameter) |
| reset      | Triggered when the `RebootSystem()` function is executed from the engine | null: Nothing is returned as data |
| redraw     | Triggered when the display canvas is redrawn/resized | boolean: If `true` the display canvas is in **full screen** mode |
| resolution | Triggered when the emulated screen resolution changes (controlled via BrightScript) | object: `{width: integer, height: integer}` |
| debug      | Triggered when debug messages arrive from the worker library (BrightScript Interpreter) | object: `{level: string, content: string}`, levels are: `print`, `beacon`, `warning`, `error`, `stop`, `pause`, `continue` |
| error      | Triggered when the any execution exception happens on the API library | string: The message describing the error |