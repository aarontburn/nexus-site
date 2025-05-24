<h1 align="center">Introduction</h1>


## What is Nexus?
**Nexus** is an cross-platform application environment and loader. Developers can create applications, or **modules**, that can be loaded into the Nexus environment, keeping everything in one place. 

Think of **Nexus** as a customizable toolbox — one app that can do anything that you (or the community) build into it.


<p align="center">
    <img src="../assets/google-calendar.png" alt="Google Calendar Sample Image" width="1000"/>
</p>

## Installing Nexus
Currently, Nexus is **Windows only**, but support for Linux and MacOS is being worked on.

Download the latest release for your platform and run the installer.

### [Nexus: Latest Release](https://github.com/aarontburn/nexus-core/releases/latest)


## What is a module?

A **module** is an application written to run within the Nexus environment. This can be **anything**.

Check out some example modules to try out.

### [Discord Monkey](https://github.com/aarontburn/nexus-discord-monkey)
Many people have Discord open on their computer from startup to shutdown; why not free up some window clutter? Embed your Discord client as a Nexus module.


### [ChatGPT](https://github.com/aarontburn/nexus-chatgpt)
Use ChatGPT often? Embed ChatGPT as a Nexus module for quick access.

### Emails: [Gmail](https://github.com/aarontburn/nexus-google-gmail) and [Outlook](https://github.com/aarontburn/nexus-microsoft-outlook)
If you regularly check your email, embed them into Nexus.



## Developing for Nexus
To begin developing a module for Nexus, visit [Building Your First Module](./2%20-%20Building%20Your%20First%20Module.md).

The benefit of developing with Nexus is that any module you install can be loaded into a single application, reducing window clutter, and Nexus provides an extensive framework to allow for module interconnectivity and ease-of-development.

**Application Lifecycle Handling**: Built-in and easily-modifiable functions are called during different parts of the application lifecycle, such as when your module is opened, closed, and initialized.

**User Configuration Settings**: Nexus provides a simple way to create and handle settings that your module may want the user to configure. Simply provide the settings you want to expose, and Nexus will create the UI, event handling, and do the storage reading/writing for you.

**Storage Handling**: Built-in classes and methods make it easy to read/write from storage.

**Module Communication**: Modules have the ability to communicate with each other and expose an API that other modules can access, which allows for interconnectivity and extensibility.

**Export and Distribution**: Nexus comes pre-configured to export your module into an archive file for easy distribution without much (or any) configuration.

**Remote Module Updating**: Easily set up remote updates to your module.