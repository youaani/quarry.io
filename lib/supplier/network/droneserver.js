/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */


/**
 * Module dependencies.
 */


var utils = require('../../utils')
  , eyes = require('eyes')
  , _ = require('lodash');

var Container = require('../../container');
var Warehouse = require('../../warehouse');

var quarrydb = require('../quarrydb');

var SparkManager = require('../../network/spark');

/*

  Quarry.io - Drone Server
  -----------------------------

  runs stacks in low footprint mode for testing
  (one process and minimal port usage)
  
*/

module.exports = function(options, network){

  var warehouse = Warehouse();

  var supplychain = network.hq_supplychain;
  var hq_warehouse = network.hq_warehouse;

  /*
  
    a map of the running stacks by their id
    
  */
  var runningstacks = {};

  /*
  
    grab a reference to the stack in the project

    then create a deployment for it
    
  */
  function deploystack(config, callback){

    config || (config = {});

    /*
    
      this is the hq url of the stack we are booting
      
    */
    var id = config.id || utils.littleid();
    var name = config.name || 'running stack';
    var stackpath = config.stackpath;

    var deployment = SparkManager.drone({
      id:id,
      name:name,
      stackpath:stackpath,
      network:network,
      deployment_database_path:options.deployment_database_path + '/' + id
    })

    deployment.boot(callback);

  }


  /*
  
    this is the core deployment method

    it means spark a process somewhere so it can connect to the network

    we can then add jobs to the worker to get it to run things that are useful
    
  */
  warehouse.get('/', function(req, res, next){

    if(!req.url!='/'){
      next();
      return;
    }
    
    /*
    
      respond with an array of the currently running stacks
      
    */
    res.send(_.keys(runningstacks));

  })

  
  warehouse.post('/deploy', function(req, res, next){

    /*
    
      get the stack uploaded into the deployment database

      this gives us the list of jobs that need distributing
      to workers

      the step of allocating jobs onto workers is, well,
      the 'allocation' step
      
    */
    deploystack(req.body, function(error, result){
      if(error){
        res.error(error);
        return;
      }
      res.send(result);
    })
  })

  return warehouse;
}
