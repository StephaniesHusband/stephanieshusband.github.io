/*global module:false*/
module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({

      "ftp-deploy": {
         src: {
            auth: {
               host: "erwin5.com",
               port: 21,
               authKey: "fedex.erwin5"
            },
            src: [
               "src"
            ],
            dest: "/route",
            exclusions: [".*.swp"]
         },
         fonts: {
            auth: {
               host: "erwin5.com",
               port: 21,
               authKey: "fedex.erwin5"
            },
            src: [
               "bower_components/font-awesome/fonts"
            ],
            dest: "/fonts"
         }
      },

      "bower_concat": {
         all: {
            dest: "src/_bower.js",
            cssDest: "src/_bower.css",
            mainFiles: (function() {
               var out = {};
               var overrides = grunt.file.readJSON("./bower.json").overrides;

               Object.keys(overrides).forEach(function(key) {
                  out[key] = overrides[key].main;
               });

               return out;
            }())
         }
      }
   });

  grunt.loadNpmTasks("grunt-ftp-deploy");
  grunt.loadNpmTasks("grunt-bower-concat");

  grunt.registerTask("deploy", ["ftp-deploy"]);
};
