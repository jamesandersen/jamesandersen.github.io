/*global module */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            production: {
                options: {
                    paths: ["_assets/_less", "bower-components/font-awesome/css/"],
                    yuicompress: false
                },
                files: {
                    "assets/css/styles.min.css": "_assets/_less/styles.less"
                }
            }
        },
        uglify: {
            jquery: {
                files: {
                    'js/vendor/jquery.min.js': 'bower_components/jquery/jquery.js'
                }
            }
        },
        watch: {
            gruntfile: {
                files: ['Gruntfile.js', '_config.yml'],
                tasks: ['concurrent:compile', 'exec:build']
            },
            src: {
                files: ['js/*.js', '_assets/_less/*.less', '_includes/*.html', '_layouts/*.html', '_posts/*.markdown', 'about/*.html', 'mormontrails/**/*', '!lib/dontwatch.js'],
                tasks: ['concurrent:compile', 'exec:build'],
                /*options: {
                    livereload: true
                }*/
            }
        },
        copy: {
            fontawesome: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome/font/',
                        src: ['**'],
                        dest: 'assets/font/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome/less/',
                        src: ['*.less'],
                        dest: '_assets/_less/font-awesome/'
                    }
                ]
            }
        },
        concurrent: {
            jekyll: {
                tasks: ['exec:serve', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            compile: {
                tasks: ['copy:fontawesome', 'less', 'uglify'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        exec: {
            build: {
                cmd: 'jekyll build'
            },
            serve: {
                cmd: 'jekyll serve'
            },
            deploy: {
                cmd: 'rsync --progress -a --delete -e "ssh -q" _site/ myuser@host:mydir/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['copy:fontawesome', 'less', 'uglify', 'exec:build']);
    grunt.registerTask('serve', ['concurrent:jekyll']);
    grunt.registerTask('deploy', ['default', 'exec:deploy']);
};