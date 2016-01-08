/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    "ftp-deploy": {
      build: {
        auth: {
          host: 'erwin5.com',
          port: 21,
          authKey: 'fedex.erwin5'
        },
        src: 'src',
        dest: '/route',
        exclusions: ['.*.swp']
      }
    }
  });

  grunt.registerTask('deploy', ['ftp-deploy']);
};
