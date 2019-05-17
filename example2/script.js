window.onload = function() {

    let container;
    let camera, scene, renderer;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init () {

        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 400;

        // Create a three.js scene
        // Used to add lights, camera, objects
        scene = new THREE.Scene();

        // This light globally illuminates all objects in the scene equally.
        // This light cannot be used to cast shadows as it does not have a direction.
        let ambientLight = new THREE.AmbientLight( '#cccccc', 0.4 );
        scene.add( ambientLight );

        //A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb.
        // This light can cast shadows
        let pointLight = new THREE.PointLight( '#ffffff', 0.8 );
        camera.add(pointLight);
        scene.add(camera);

        // Progress loader
        let onProgress = function (xhr) {
            if ( xhr.lengthComputable ) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
            }
        };

        let onError = function (xhr) { };

        // A loader for loading an .mtl resource, used internaly by OBJLoader.
        // The Material Template Library format (MTL) or .MTL File Format is a companion file format to .OBJ 
        // that describes surface shading (material) properties of objects within one or more .OBJ files.
        new THREE.MTLLoader()
            .setPath('assets/model/')
            .load('Coding serbia logo.mtl', function (materials) {

                materials.preload();

                // A loader for loading a .obj resource.
                // The OBJ file format is a simple data-format that represents 3D geometry in a human readable format as the position of each vertex, 
                // the UV position of each texture coordinate vertex, vertex normals, and the faces that make each polygon defined as a list of vertices, and texture vertices.
                new THREE.OBJLoader()
                    .setMaterials( materials )
                    .setPath('assets/model/')
                    .load('Coding serbia logo.obj', function (object) {

                        object.position.x = 0;
                        object.position.y = 0;
                        //object.rotateX(-Math.PI / 2);
                        // object.traverse( function ( child ) {
                        //     if ( child instanceof THREE.Mesh ) {
                        //         child.material[0].color.setRGB (255, 255, 255);
                        //         child.material[1].color = new THREE.Color("rgb(255, 207, 54)");
                        //     }
                        // });
                        scene.add(object);

                    }, onProgress, onError);
            } );

        // The WebGL renderer displays your beautifully crafted scenes using WebGL
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        
        // Add event listeners
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize () {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onDocumentMouseMove (event) {

        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;
    }

    function animate () {

        // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation
        // and requests that the browser call a specified function to update an animation before the next repaint.
        // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        requestAnimationFrame(animate);
        render();
    }

    function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        renderer.render( scene, camera );
    }
}