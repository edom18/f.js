{spawn, exec} = require 'child_process'
 
option '-o', '--output [DIR]', 'Output directory.'
option '-t', '--target [DIR]', 'Watch target directory.'
 
stdout_handler = (data) ->
    console.log data.toString().trim()
 
build = (watch, output = 'js', target = '_src/coffee') ->
    console.log 'Watching coffee scripts'
    console.log "Watch to #{target}"
 
    options = ['-cmb', '-o', output, target]
 

    if watch is true
        options[0] = '-cmbw'
 
    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', stdout_handler
 
style = (watch) ->
    console.log 'Watching compass files.'

    options = ['compile']

    if watch is true
        options = ['watch']

    compass = spawn 'compass', options
    compass.stdout.on 'data', (data) -> stdout_handler
    compass.stderr.on 'data', (data) -> stdout_handler

 
task 'build', 'build the project', (watch) ->
    build watch
 
task 'watch', 'watch for changes and rebuild', (options) ->
    build true, options.output, options.target
    style true
