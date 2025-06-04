# Nexus: Security and Privacy

## Security
By itself, Nexus does essentially nothing (and is safe). It provides a platform for modular applications **but does not aggressively review or vet community-created modules**. Users are responsible for verifying the safety and privacy practices of third-party modules. The current Nexus API is completely unrestricted for to allow for creativity and flexibility, but this also means that any developer can add malicious code to run within their module. 

Therefore, it is up to **you** to choose what modules you install.


For any suggestions on implementing module security, please raise an issue on the [Nexus GitHub Repository](https://github.com/aarontburn/nexus-core/issues). All suggestions are appreciated and will be read.


## Privacy

### Cookies
Nexus does not use cookies or trackers except for session management where required.

### Data Collection
The Nexus Marketplace collects the following data when registering:
- Username
- Email Address
- Password (stored using secure, industry-standard hashing algorithms)
- Timestamp of creation date
  
This information is used solely for user authentication and account management and is never shared with third parties.


When uploading a module to the marketplace, only provided module metadata is stored, including:
- Module Name
- Author Username
- Source GitHub Repository


Registered users may request deletion or modification of their personal data by contacting aarontburn@outlook.com. Nexus retains account data only as long as necessary for account functionality and compliance with legal obligations.



The Nexus desktop application **does not** collect or send any information by itself. However, as stated above, there is no guarantee that community-created applications do not collect any information 


## Best Practices
1. Never install modules from an untrusted source.
2. Never install modules if you aren't 100% sure they are safe (better safe than sorry!).
3. Take some time to go through the source code of the modules.
   