# Nexus: Security

## Overview
By itself, Nexus does nothing (and is safe). However, there is no guarantee that community-created modules are safe. The current Nexus API is completely unrestricted for to allow for creativity and flexibility, but this also means that any developer can add malicious code to run within their module. 

Therefore, it is up to **you** to choose whether to install module.



For any suggestions on implementing module security, please raise an issue on the [Nexus GitHub Repository](https://github.com/aarontburn/nexus-core/issues). All suggestions are appreciated and will be read.


## Best Practices
1. Never install modules from an untrusted source.
2. Never install modules if you aren't 100% sure they are safe (better safe than sorry!).
3. Take some time to go through the source code of the modules.