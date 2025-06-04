# Accessing Windows

## Overview
While developing your module, you might be reliant on either the main applications window or your module's [`WebContentView`](https://www.electronjs.org/docs/latest/api/web-contents-view), which is where your module's frontend is hosted.

The main window is coded as a [`BaseWindow`](https://www.electronjs.org/docs/latest/api/base-window). You could do `BaseWindow.getAllWindows()[0]`, but there is no guarantee that it will reference the correct window.

## Solution
Utilizing module communication, `nexus.Main` offers ways to reference either windows.


### `get-primary-window`
Get the client's main `BaseWindow`.

> **Parameters**  
> None  
> **Returns**  
> `200 OK` and the reference to the main `BaseWindow`.


Example: accessing the `BaseWindow` before closing to store window information.
```ts
export default class SampleProcess extends Process {
    //  ...

    public async onExit() {
        const mainWindow: BaseWindow = (await this.requestExternal('nexus.Main', 'get-primary-window')).body;

        // get position, size, etc.
    } 


    //  ...
}

```


--- 

### `get-module-window`
Get the caller module's `WebContentView`, if applicable.

> **Parameters**  
> None  
> **Returns**  
> `404 NOT FOUND` if the caller module doesn't have a corresponding `WebContentView`
> `200 OK` and the reference to the callers `WebContentView`.

Example: accessing your module's `WebContentView` to reload it.
```ts
export default class SampleProcess extends Process {
    //  ...

    public async sampleFunction() {
        const view: WebContentView = (await this.requestExternal('nexus.Main', 'get-module-window')).body;
        view.reload();
    } 

    //  ...
}

```