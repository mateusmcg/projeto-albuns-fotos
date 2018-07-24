module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'app.js',
                dest: 'build/app.min.js'
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    { expand: true, src: ['app.js', 'index.html'], dest: 'build/', filter: 'isFile' },
                    { expand: true, src: ['assets/**', 'app/**'], dest: 'build/' },
                    { expand: true, flatten: true, src: ['node_modules/bootstrap/dist/fonts/**'], dest: 'build/assets/fonts' },
                    { expand: true, flatten: true, src: ['node_modules/bootstrap/dist/css/bootstrap.min.css'], dest: 'build/assets/css', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['node_modules/bootstrap/dist/css/bootstrap.min.css.map'], dest: 'build/assets/css', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['node_modules/bootstrap/dist/js/bootstrap.min.js'], dest: 'build/assets/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['node_modules/jquery/dist/jquery.min.js'], dest: 'build/assets/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['node_modules/@fortawesome/fontawesome-free/css/all.min.css'], dest: 'build/assets/css/', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['node_modules/@fortawesome/fontawesome-free/webfonts/**'], dest: 'build/assets/webfonts/' },
                    { src: ['config/config.json'], dest: 'build/config/config.json', filter: 'isFile' },
                ],
            },
            dev: {
                files: [
                    { src: ['env/env.dev.json'], dest: 'build/env/env.json', filter: 'isFile' },
                ]
            },
            prd: {
                files: [
                    { src: ['env/env.prd.json'], dest: 'build/env/env.json', filter: 'isFile' },
                ]
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('dev', ['copy:main', 'copy:dev']);
    grunt.registerTask('prd', ['copy:main', 'copy:prd']);

};