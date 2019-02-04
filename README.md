# Runelite Image Uploader
A node bot that uploads all screenshots saved from RuneLite (runescape client) to an FTP server.

Great for blogs about Old School Runescape, or for people who wish to keep their screenshots on a web server using FTP.

For me this was a fun project, but I'm happy to share the code incase anyone wants to save time.


# Installing:
You will need both [NODE](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed on your machine.

# Configuring the Runelite Image Uploader
To configure, open up the `ftp_details file`, and enter your FTP details.
Inside the app.js file, edit the `PATH_TO_PUT_IMAGES` if you wish to change the upload location of images.

# Commands:
`npm start` Starts the program.

`exit` or `quit` will terminate the program.


# Special thanks
Special thanks to [Easy-FTP](https://github.com/humy2833/easy-ftp) for providing a very simple node FTP interface.
