/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

'use strict';

/*

  Digger App

  
*/

/* Controllers */

angular

  .module('quarry.app.digger', [
    'quarry.core',
    'quarry.ui'
  ])

  .controller('ModalFormCtrl', ['$scope', 'dialog', 'node', function($scope, dialog, node){

    $scope.node = node;
    $scope.confirmtitle = 'Save ' + node.tagname();

    $scope.confirm = function(){
      console.log('-------------------------------------------');
      console.log('SAVING');
      dialog.close(true);
    }

    $scope.close = function(){
      dialog.close(false);
    }

  }])

  .factory('$digger', ['$warehouse', '$dialog', function($warehouse, $dialog){
    

    return function(options){

      if(!options.$scope){
        throw new Error('Digger needs a $scope');
      }

      var $scope = options.$scope;

      var baseblueprints = options.baseblueprints || $warehouse.blank();

      /*

        what blueprints populate the add list

      */
      function get_blueprints(parent){
        var blueprints = $warehouse.blank();
        blueprints.add(baseblueprints);
        return blueprints;
      }

      function get_installers(parent){
        var installers = $warehouse.blank();
        return installers;
      }

      /*
      
        this is the form is there is no other form
        
      */
      function get_default_html(container){

        console.log('-------------------------------------------');
        console.log('defauilt');
        console.dir(container.toJSON());
        var childrentab = !container.data('modal') && !container.meta('leaf') ? [
            '  <pane heading="Children">',
            '     <children-view />',
            '  </pane>'
        ].join('') : ''

        return [

          '<tabs>',
            childrentab,
          '  <pane heading="Attr" class="render-view">',
          '     <attr-view />',
          '  </pane>',
          '  <pane heading="Meta" class="render-view">',
          '     <meta-view />',
          '  </pane>',
          '</tabs>'

        ].join('')

      }

      /*
      
        the same as the render_html but targets the output to a modal window
        
      */
      function get_create_html(container){
        return [

          '<div class="modal-body">',
            get_render_html(container),
          '</div>',
          '<div class="modal-footer">',
          '        <button class="btn btn-small cancel" ng-click="close()">Cancel</button>',
          '        <button class="btn" ng-click="confirm()">{{confirmtitle}}</button>',
          '</div>'

        ].join("\n")
      }
      /*
      
        return the array of render panes that the renderer will display for the given container

        what is displayed is entirely up to this function and the context of the app

      */
      function get_render_html(container){

        if(!container){
          return '<div>no container given</div>';
        }
        if(!container.full()){
          return '<div>loading...</div>';
        }

        if(container.tagname()=='supplychain'){
          return '<children-view />';
        }

        /*
        
          lets check to see if we have a blueprint for the container

          this is based on the blueprint meta data - if the user has added blueprints to the project
          they will have been added to the collection also


          
        */
        var blueprintid = container.meta('blueprint') || 'node';
        var blueprint = baseblueprints.find('#' + blueprintid);

        /*
        
          we have found a blueprint - render it's HTML (this gives total control over the rendering)
          
        */
        if(blueprint.attr('html')){
          return blueprint.attr('html');
        }
        /*
        
          
          
        */
        else{
          return get_default_html(container);
        }

      }


      var digger = _.extend({

        clipboard:[],
        selection:[],
        openstates:[],

        setwarehouse:function(warehouse){
          warehouse.data('active', true);
          warehouse.attr('root', true);

          this.warehouse = warehouse;
          this.openstates[warehouse.quarryid()] = 'root';

          this.openfn(this.warehouse, function(){
            console.log('-------------------------------------------');
            console.log('digger booted');
          })
        },

        /*

          produce the angular HTML to be compiled into the viewer for a given container

          if you return false or null - the default children viewer will be used

          if you return a HTML string - it will be used as a single view

          if you return an array of objects like this:

            {
              title:'tab title',
              html:'<angular>'
            }

          then they will be rendered as tabs

          you can use the built-in views by proiving their keys as the html

          a blank html property means the 'children' key

          the views are:

            children    (icon list of the containers direct children - with dig search bar)
            form        (the standard auto form container - you can create custom HTML fragments with bits of forms in too)
            dom         (the overview of the containers and it's descendents in simple XML form)
          
        */
        renderfn:function(){
      
          return get_render_html(this.activecontainer);

        },

        /*
    
          return what blueprints can be added to the given container
          
        */
        blueprintfn:function(container){
          /*
          
            we don't add anything to leaves
            
          */
          if(container.meta('leaf')){
            return $warehouse.blank();
          }

          return get_blueprints(container);
        },

        /*
    
          return what installers can be added to the given container
          
        */
        installerfn:function(container){
          /*
          
            we don't add anything to leaves
            
          */
          if(container.meta('leaf')){
            return $warehouse.blank();
          }

          return get_installers(container);
        },

        /*
    
          this is called when a container is requested to be added

          we spawn a new container based on the blueprint

          the blueprint can either be pointing to some HTML (in which case we load it)

          or it can provide the raw blueprint markup


          
        */
        createfn:function(blueprintcontainer, install_mode){

          var self = this;
          var container = blueprintcontainer.blueprint(this.activecontainer);

          container.data('modal', true);

          var html = get_create_html(container);

          console.log('-------------------------------------------');
          console.log('-------------------------------------------');
          console.log('HELLO');
          console.dir(html);

          

          var d = $dialog.dialog({
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            template:  html,
            resolve:{
              node:function(){
                return container;
              }
            },
            controller: 'ModalFormCtrl'
          })

          d.open().then(function(result){

            container.data('modal', false);

            if(result)
            {
              self
                .activecontainer
                .append(container)
                .ship(function(){
                  
                })
            }
          })

        },

        /*
        
          opening the container means either loading it's children
          or if it's a leaf then loading it's data
          
        */
        openfn:function(container, done){

          var self = this;
          this.selection = [];

          if(container.empty()){
            done && done();
            return;
          }

          this.loadfn(container, function(){
            
              self.activecontainer = container;
              $scope.$broadcast('loadcontainer');
              done && done();
          })
            
          
        },

        loadfn:function(container, done){
          var self = this;
          container.get(0).children = [];
          
          container('>*')

            .ship(function(children){

              $scope.$apply(function(){
                container.addchildren(children);
                container.data('active', true);
                container.sort();
                container.recurse(function(des){
                  self.openstates[des.quarryid()] = false;
                })

                self.openstates[container.quarryid()] = true;

                done && done();
              })
            })
        },

        savefn:function(container, done){

          container.save().ship(function(){
            done && done();
          })

        },


        /*
        
          delete container and descendents
          
        */
        deletefn:function(containers, done){
          var self = this;
          if(!this.selection || this.selection.length<=0){
            return;
          }

          _.each(this.selection, function(selected){
            self.activecontainer.removechildren(selected);
          })
          
          $warehouse.merge(_.map(this.selection, function(container){
            return container.delete();
          })).ship(done);

          


        }

      }, options);

      return digger;
    }

  }])