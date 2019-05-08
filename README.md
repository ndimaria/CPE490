# CPE490
Information System Project
Connection to allow Online Playability via Video Streaming

4/19/2019 Update:
A simple chat application has been implemented to run on 18.219.224.83:3000 when the instance is up. Next the team will write a simple html game and host that on the server.

4/23/2019 Update:
Code was created for the controller to be read and recognized as well as the screen to be shared and hosted.

4/24/2019 Update:
Chat application was modified to read in inputs from left/right/up/down keys on keyboard for support. The team is working on getting support for gamepads to be read such as Xbox 360 controllers and screen sharing implementation.

4/25/2019 Update:
Chat application no longer responds to keyboard inputs while focus is in the text box. Started using the Gamepad API for controller support.
To Do: remove unnecessary HTML coding and differentiate between different button presses.

4/29/2019 Update:
On joining the chat, a user now creates a unique ID for themselves and sends it to the server, who stores it. The server then sends a message to all connected users that this user has now joined.

5/6/2019 Update:
The service has been moved from http to https for both security reasons and to support WebRTC screensharing. Support for Access Control Allow Origin headers is in progress.

5/7/2019 Update:
The server and client have been consolidated under one domain, thus removing the issues experienced with Access Control Allow Origin headers. Issues regarding the broadcasting client not sending messages to the server have been resolved. Additionally, issues with the server not routing video data have been bypassed with a temporary workaround. Currently, the service can grab video data about a screen, send it to the server, and begin the signaling process with another client, but the process for reproducing this chain of events is inconsistent and requires the clients to follow a specific sequence of events to get it to work. Today it was also realized that the html file that was being served to the client was not the html file that was being modified for the last week, so all of the old chat and gamepad features have now broken.

5/8/2019 Update:
Added the "Current Working State" directory, which contains the index files for a state where the project allowed users to connect to a browser with a gamepad and have the server receive inputs from their controller. This will serve as a snapshot of an earlier state of the project for grading purposes.
