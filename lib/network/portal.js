/*
  Copyright (c) 2013 All contributors as noted in the AUTHORS file

  This file is part of quarry.io

  quarry.io is free software; you can redistribute it and/or modify it under
  the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation; either version 3 of the License, or
  (at your option) any later version.

  quarry.io is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/**
 * Module dependencies.
 */


/*

  quarry.io - portal

  this is a client wrapper onto either a switchboard or 
  directly onto a supplier

  you can create portals onto any url within a network

  they connect to transports - which can direct suppliers
  or ZeroMQ proxies to them

  portals are the PUB/SUB side of supplychains

  you create a supplychain pointing to a place in the network
  the portal part allows you to listen to messages coming from that place

  if you give a selector as part of the portal - it will 

  
*/

module.exports = function(transport){

  return {
    listen:function(selector, fn){
      if(!fn){
        fn = selector;
        selector = null;
      }

      transport.on('broadcast', function(container, message){
        if(!selector || container.match(selector)){
          fn(container, message);
        }
      })

    },
    broadcast:function(message){
      //transport.broadcast(message);
    }
  }
    
}