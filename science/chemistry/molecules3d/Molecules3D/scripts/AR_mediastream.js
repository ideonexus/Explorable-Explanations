$(function () {
	if (Detector.webgl !== true) {
		$('#loading').hide();
		$('#nowebgl').show();
		return;
	}

	// Set this to true and the JSARToolkit will output some debug information to
	// the console and copy a visualisation of its analysis results to the
	// debugCanvas.
    DEBUG = false;
    if (DEBUG) {
        $("#debugCanvas").show();
    }

    var width = 320;
    var height = 240;

    // Set up the JSARToolkit detector...
    // ...this is what analyses the canvas images for AR markers
    // (You can adjust markerWidth so that your objects appear
    // the right size relative to your markers)
    var markerWidth = 10;
    var parameters = new FLARParam(width, height);
    var detector = new FLARMultiIdMarkerDetector(parameters, markerWidth);

    // The three.js camera for rendering the overlay on the input images
    // (We need to give it the same projection matrix as the detector
    // so the overlay will line up with what the detector is 'seeing')
    var overlayCamera = new THREE.Camera();
    overlayCamera.setJsArMatrix(parameters);

    // Now, set up the rest of the overlay scene just like any other
    // three.js scene...(renderer, light source, and 3D objects)
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width * 2, height * 2);
    $('#result').append(renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0x555555);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0.3, 0.5, 2);
    overlayCamera.add(directionalLight);

    var molecule = new THREE.Molecule();
    molecule.loadAsync('/api/search/', { '': 'Cn1cnc2c1c(=O)n(c(=O)n2C)C' }, function () {
        // We'll be telling the object when to update its matrix,
        // based on what the detector finds...
        // ...so, don't do it unless we tell you to!
        molecule.matrixAutoUpdate = false;

        $('#loading').hide();
    });

    // Then put the scene together.
    var overlayScene = new THREE.Scene();
    overlayScene.add(ambientLight);
    overlayScene.add(molecule);
    overlayScene.add(overlayCamera);

    // This is the canvas that we draw our input image on & pass
    // to the detector to analyse for markers...
    var inputCapture = $('#inputCapture')[0];
	
    // Set up another three.js scene that just draws the inputCapture...
    var inputCamera = new THREE.Camera();
    var inputScene = new THREE.Scene();
    var inputTexture = new THREE.Texture(inputCapture);
    var inputPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({ map: inputTexture }));
    inputPlane.material.depthTest = false;
    inputPlane.material.depthWrite = false;
    inputScene.add(inputPlane);
    inputScene.add(inputCamera);

    // This JSARToolkit object reads image data from the input canvas...
    var imageReader = new NyARRgbRaster_Canvas2D(inputCapture);

    // ...and we'll store matrix information about the detected markers here.
    var resultMatrix = new NyARTransMatResult();

    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || function (type, success, error) { error(); };

	// Get permission to use the webcam video stream as input to the detector
	// (Otherwise we can fallback to a static image for the input)
    var input;
    navigator.getUserMedia({ 'video': true }, function (stream) {
    	input = $('#inputStream')[0];
    	input.src = window.URL.createObjectURL(stream);

        // Start the animation loop (see below)
    	jsFrames.start();
    }, function () {
    	alert("Couldn't access webcam. Fallback to static image");
    	input = $('#inputImage')[0];
    	jsFrames.start();
    });

    // The animation loop...
    // (jsFrames comes from here - https://github.com/ianreah/jsFrames
    // but it's mostly just requestAnimationFrame wrapped up with a
    // polyfill)
    jsFrames.registerAnimation(function () {
        // Capture the current frame from the inputStream
        inputCapture.getContext('2d').drawImage(input, 0, 0, width, height);

        // then we need to tell the image reader and the input scene that the input has changed
        inputCapture.changed = true;
        inputTexture.needsUpdate = true;

        // Use the imageReader to detect the markers
        // (The 2nd parameter is a threshold)
        if (detector.detectMarkerLite(imageReader, 128) > 0) {
            // If any markers were detected, get the transform matrix of the first one
            detector.getTransformMatrix(0, resultMatrix);

            // and use it to transform our three.js object
            molecule.setJsArMatrix(resultMatrix);
            molecule.matrixWorldNeedsUpdate = true;
        }

        // Render the three.js scenes (the input image first overlaid with the
        // scene containing the transformed object)
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(inputScene, inputCamera);
        renderer.render(overlayScene, overlayCamera);
    });
});