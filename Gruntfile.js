module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      basic: {
        src: [
          'public/lib/jquery.js', 
          'public/lib/underescore.js', 
          'public/lib/handlebars.js',
          'public/lib/backbone.js',
        ],
        dest: 'public/dist/compiledLibs.js'
      },
      extras: {
        src: [ 'public/client/*.js' ],
        dest: 'public/dist/compiledModels.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/compiledLibsMin.js': ['public/dist/compiledLibs.js'],
          'public/dist/compiledModelsMin.js': ['public/dist/compiledModels.js'],
        }
      }
    },

    eslint: {
      target: ['*.js']
    },

    cssmin: {
      target: {
        files: {
          'public/dist/styleMin.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt',
          quite: false,
          clearRequireCache: false
        },
        src: ['test/*.js']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('lint', [
    'eslint'
  ]);

  grunt.registerTask('build', [
    'concat', 'cssmin',  'uglify'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    grunt.task.run(['test', 'lint', 'build', 'upload']);
  ]);


};
