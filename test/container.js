var io = require('../');
var eyes = require('eyes');

// we create the root warehouse with a basic supply chain
var warehouse = io.warehouse(function(packet, callback){
  callback(null, packet);
})

describe('container', function(){

	it('should be a function', function () {
    var container = warehouse.new();

		container.should.be.a('function');
  })

  it('should allow blank construction and attribute manipulation', function () {

    var test = warehouse.new()
      .tagname('product')
      .attr({
        fruit:'apple',
        city:'London'
      })
      
    test
    .attr({
      color:'red',
      price:100
    })
    .id('Big Apple')
    .attr('size', 'large')
    .addClass('onsale');
    
    test.attr('color').should.equal('red');
    test.attr('size').should.equal('large');
    test.attr('city').should.equal('London');
    test.hasClass('onsale').should.equal(true);
    test.hasClass('badclass').should.equal(false);
    test.id().should.equal('Big Apple');
    test.tagname().should.equal('product');


  })

  it('should allow blank children to be added', function () {

    var parent = warehouse.new();
    var child = warehouse.new();

    parent.append(child);

    parent.children().count().should.equal(1);
    parent.children().eq(0).quarryid().should.equal(child.quarryid());

  })


  it('should be able to find children once they are added', function() {

    var parent = warehouse.new();
    var child = warehouse.new();

    child.addClass('red');
    child.attr('test', 10);

    parent.append(child);

    parent.find('.red').attr('test').should.equal(10);


  })


  it('should be able to find children within a context', function() {

    var generateImage = function(className){
      return warehouse.new('image').addClass(className);
    }

    var generateGallery = function(className){
      return warehouse.new('gallery').addClass(className);
    }

    var redGallery = generateGallery('red');
    var blueGallery = generateGallery('blue');

    var base = warehouse.new();

    base.append([redGallery, blueGallery]);

    var img = generateImage('picasso').attr('size', 120);

    redGallery.append(img);

    base.find('image.picasso', '.red').quarryid().should.equal(img.quarryid());
  })

  it('should be able to find children with attributes', function() {

    var generateImage = function(className){
      return warehouse.new('image').addClass(className);
    }

    var generateGallery = function(className){
      return warehouse.new('gallery').addClass(className);
    }

    var redGallery = generateGallery('red');
    var blueGallery = generateGallery('blue');

    var base = warehouse.new();

    base.append([redGallery, blueGallery]);

    var img = generateImage('picasso').attr('size', 120);

    redGallery.append(img);

    base.find('image.picasso[size>=120]', '.red').eq(0).quarryid().should.equal(img.quarryid());

  })

})
