$(function () {
	if (Detector.webgl !== true) {
		$('#loading').hide();
		$('#nowebgl').show();
		return;
	}

	$('#smiles').keydown(function (event) {
	    if (event.keyCode == 13) {
	        $('#loading').show();

	        molecule.loadAsync('/api/search/', { '' : $('#smiles').val() }, function () {
	            $('#loading').hide();
	        });

	        return false;
	    }
	});

	var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.z = 10;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	$('#container').append(renderer.domElement);

	var ambientLight = new THREE.AmbientLight(0x555555);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0.3, 0.5, 2);
	camera.add(directionalLight);

	var molecule = new THREE.Molecule();

	var scene = new THREE.Scene();
	scene.add(ambientLight);
	scene.add(molecule);
	scene.add(camera);

	molecule.loadAsync('/api/search/', { '': 'Cn1cnc2c1c(=O)n(c(=O)n2C)C' }, function () {
	    $('#loading').hide();
	});

	var controls = new THREE.TrackballControls(camera, renderer.domElement);
	
	jsFrames.registerAnimation(function () {
		controls.update();

		var time = Date.now() * 0.0004;

		molecule.rotation.x = time;
		molecule.rotation.y = time * 0.7;

		renderer.render(scene, camera);
	});
	jsFrames.start();
	
	$(window).resize(function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	});
});