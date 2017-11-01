var RenderPassViewports = function ( scene, cameras, overrideMaterial, clearColor, clearAlpha ) {

  this.scene = scene;
  this.cameras = cameras;

  this.overrideMaterial = overrideMaterial;

  this.clearColor = clearColor;
  this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

  this.oldClearColor = new THREE.Color();
  this.oldClearAlpha = 1;

  this.enabled = true;
  this.clear = true;
  this.needsSwap = false;

};


RenderPassViewports.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    this.scene.overrideMaterial = this.overrideMaterial;

    if ( this.clearColor ) {

      this.oldClearColor.copy( renderer.getClearColor() );
      this.oldClearAlpha = renderer.getClearAlpha();

      renderer.setClearColor( this.clearColor, this.clearAlpha );
    }


    //  UHHHHHHHH
    //  I don't know why this is working but
    //  the first render is fucked up
    //  burn a render just so the projection matrix is ok
    //  WHAT???
    //  comment this out if you don't believe me
    renderer.render( this.scene, this.cameras[ 0 ], readBuffer, false );

    var first = 0;
    var last = this.cameras.length;

    for( var i=first; i<last; i++ ){
      var camera = this.cameras[ i ];
      var x = i * viewWidth;
      var y = 0;
      renderer.setViewport( x, y, viewWidth, viewHeight );
      renderer.setScissor( x, y, viewWidth, viewHeight );
      renderer.enableScissorTest( true );
      renderer.render( this.scene, camera, readBuffer, true );
    }

    //  restore this otherwise shaderpass will be messed up
    renderer.setViewport( 0, 0, views * viewWidth, viewHeight );
    renderer.setScissor( 0, 0, views * viewWidth, viewHeight );
    renderer.enableScissorTest( false );

    if ( this.clearColor ) {

      renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

    }

    this.scene.overrideMaterial = null;

  }

};