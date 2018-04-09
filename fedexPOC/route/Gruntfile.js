/*global module:false*/
module.exports = function(grunt) {

   var getMainFileOverrides = function(likeBower) {
      var out = {};
      var overrides = grunt.file.readJSON("./bower.json").overrides;

      if (likeBower) {
         out = overrides;
      }
      else {
         Object.keys(overrides).forEach(function(key) {
            out[key] = overrides[key].main;
         });
      }

      return out;
   };

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


      wiredep: {
         task: {
            src: "src/development.html",
            overrides: getMainFileOverrides(true)
         }
      },

      "bower_concat": {
         all: {
            dest: "src/_bower.js",
            cssDest: "src/_bower.css",
            mainFiles: getMainFileOverrides()
         }
      }
   });

   grunt.loadNpmTasks("grunt-ftp-deploy");
   grunt.loadNpmTasks("grunt-bower-concat");
   grunt.loadNpmTasks("grunt-wiredep");

   grunt.registerTask("deploy", ["ftp-deploy"]);
};
