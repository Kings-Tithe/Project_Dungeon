### Structure
This folder contains all the source code for the game.
The interfaces and classes folders hold such structures used
by both the client and the server. However they may contain their
own extended versions of a class. For example the client will extend
most classes to add on graghical representation of the data for that
class and functions to help the player interact with them (user-interface).
Due to a lack of support for multiple inheritance in javascript/typescript
most classes will extend the server version of a class and then contain it's
graghical representation.

Temporary Note:
Subfolders meant to be on this folder go as follows (they won't upload to github while their empty):
- classes
- client
- interfaces
- server