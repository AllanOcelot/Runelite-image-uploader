/*
    OSRS Runelite image bot is a very simple node bot.
    It has a very simple task, it checks a folder for images
    Then uploads the file to an FTP server, and updates a JSON file.

    This allows you to use the images, and call any of them via JSON
    This is great for anyone keeping a runescape blog etc
    Or, in my case, a fun project to get better at node :)
*/

// REQUIRES
var ftp_details = require('./ftp_details');
var fs = require('fs');
var watch = require('node-watch');
var EasyFtp = require('easy-ftp');
var stdin = process.openStdin();

// PATH VARIABLES
var HOME_ENV = process.env.HOME;
var PATH_TO_SCREENSHOTS = HOME_ENV.concat('/.runelite/screenshots/allanCodes');
var LENGTH_OF_PATH = PATH_TO_SCREENSHOTS.length;
var PATH_TO_PUT_IMAGES = '/htdocs/runescape_images';

// FTP DETAILS
var FTP_CLIENT = new EasyFtp();
var FTP_CONFIG = {
    host: ftp_details.FTP_HOST,
    port: 21,
    username: ftp_details.FTP_USER,
    password: ftp_details.FTP_PASS,
    type : 'ftp'
};


// FUNCTION
function exitClient(){
    console.log('Exiting image uploader');
    FTP_CLIENT.close();
    process.exit(0);
}




console.log('-------------------------------------------');
console.log('============= R U N E L I T E =============');
console.log('-------------------------------------------');
console.log('=============== I M A G E =================');
console.log('-------------------------------------------');
console.log('============= U P L O A D E R =============');
console.log('-------------------------------------------');

//Attempt to connect
if (FTP_CLIENT.isLoginFail) {
    console.log('E R R O R : Login to FTP server has failed, please check your details.');
    exitClient();
}
FTP_CLIENT.connect(FTP_CONFIG);
console.log(FTP_CLIENT);

// Tell console bot is running:
console.log('OSRS Image uploader is working....');

// USER INPUT COMMANDS VIA CONSOLE
stdin.addListener("data", function(d) {
    //Check if user supplied directory exists
    if( fs.existsSync(PATH_TO_SCREENSHOTS) ){
        var USER_INPUT = d.toString().trim();
        // Connect to FTP client
        FTP_CLIENT.connect(FTP_CONFIG);

            // Exit
            if( USER_INPUT === 'quit' || USER_INPUT === 'exit'){
                exitClient();
            }

            else if
            ( USER_INPUT === 'watch' ){
                console.log('Watching folder....');
                console.log(PATH_TO_SCREENSHOTS);
                // Watch our Runelite directory for any new images
                watch(PATH_TO_SCREENSHOTS, { recursive: true }, function(evt, name) {
                    //console.log('%s changed.', name);
                    //We log in the console the human readable file added / removed.
                    var IMAGE_NAME_FILE = name.substr(LENGTH_OF_PATH + 1);
                    var IMAGE_NAME_RAW = IMAGE_NAME_FILE.substr(0, IMAGE_NAME_FILE.length-4);
                    console.log('====| ' + IMAGE_NAME_RAW  + ' ====| FILE NAME');

                    console.log(name);

                    if (evt == 'update') {
                        console.log('An image was added to the folder!');
                        console.log('Attepting FTP Conenction');
                        FTP_CLIENT.upload(name, PATH_TO_PUT_IMAGES, function(err){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('Image has been uploaded');
                            }
                        });
                    }
                    if (evt == 'remove') {
                        console.log('An image was removed!');
                    }
                });
            }

            else if

            // Upload all files to the FTP server
             ( USER_INPUT === 'bulk upload'){
                var FILE_ARRAY = [];
                fs.readdir(PATH_TO_SCREENSHOTS, (err, files) => {
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        files.forEach(file => {
                            var FILE_URL = PATH_TO_SCREENSHOTS + '/' + file;
                            console.log(FILE_URL);
                            FTP_CLIENT.upload(file, PATH_TO_PUT_IMAGES);
                        });
                    }
                });
            } else {
            console.log('Sorry, that is not a valid command');
        }
    }else{
        console.log('You have supplied an invalid path to the Runelite Images folder');
    }

});
