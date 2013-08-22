/*global module */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            production: {
                options: {
                    paths: ["_assets/_less"],
                    yuicompress: false
                },
                files: {
                    "css/styles.min.css": "_assets/_less/styles.less"
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
                files: 'Gruntfile.js',
                tasks: ['concurrent:compile', 'exec:build']
            },
            src: {
                files: ['js/*.js', '_assets/_less/*.less', '_includes/*.html', '_layouts/*.html', '!lib/dontwatch.js'],
                tasks: ['concurrent:compile', 'exec:build'],
                options: {
                    livereload: true
                }
            }
        },
        /*copy: {
            bootstrap: {
                files: [
                    {
                        expand: true,
                        cwd: 'components/bootstrap/img/',
                        src: ['**'],
                        dest: 'assets/img/'
                    }
                ]
            }
        },*/
        concurrent: {
            jekyll: {
                tasks: ['exec:serve', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            compile: {
                tasks: ['less', 'uglify'],
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

    grunt.registerTask('default', ['less', 'uglify', 'exec:build']);
    grunt.registerTask('serve', ['concurrent:jekyll']);
    grunt.registerTask('deploy', ['default', 'exec:deploy']);

};