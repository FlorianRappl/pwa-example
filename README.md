# PWA Example

A simple example illustrating the transformation of a standard web app into a progressive web app.

## Branches

The following branches illustrate different steps:

### original

The baseline example. A simple web app fetching some data and showing it. Not working offline, not using push notifications and not installable.

### standalone

Makes the app installable by providing a stub service worker and valid manifest file. A set of sample icons is included.

### push

Installs a (pseudo) web push notification service. Indicates the installation status on the screen (bottom of the page).

### offline

Includes a service worker implementation to retrieve data from cache.

### master

The latest version. Is only used for contributions / improvements.
