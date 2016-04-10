module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'public/javascripts/libs/*.js',
                    'public/javascripts/main.js'
                ],
                dest: 'public/javascripts/production.js'
            }
        },
        uglify: {
            build: {
                src: 'public/javascripts/production.js',
                dest: 'public/javascripts/production.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'public/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/images/build/'
                }]
            }
        },
        'watch': {
            scripts: {
                files: ['public/javascripts/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            }
        },
        'jshint': {
            all: ['public/javascripts/main.js'],
            options: {
                boss: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                expr: true,
                immed: true,
                noarg: true,
                quotmark: "double",
                smarttabs: true,
                trailing: true,
                undef: true,
                unused: true,
                globals: {
                    $: false,
                    alert: false,
                    document: false
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    grunt.registerTask( 'default', [ 'concat', 'jshint' ] )
};