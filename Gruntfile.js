module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: ['assets/css'],
                    compress: true
                },
                files: {
                    'Content/styles.css': ['src/less/*.less', 'src/less/common/*.less', 'src/less/manager/*.less', 'src/less/manager/*.less', 'src/less/mentor/*.less', 'src/less/scrum/*.less', 'src/less/trainee/*.less', 'src/less/media/*.less']
                }
            }
        },
        watch: {
            concat: {
                files: ['src/less/*.less', 'src/less/common/*.less', 'src/less/manager/*.less', 'src/less/manager/*.less', 'src/less/mentor/*.less', 'src/less/scrum/*.less', 'src/less/trainee/*.less', 'src/less/media/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'watch']);

};