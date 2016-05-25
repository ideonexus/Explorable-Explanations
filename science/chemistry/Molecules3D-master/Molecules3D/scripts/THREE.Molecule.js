THREE.Molecule = function () {
};

THREE.Molecule.prototype = new THREE.Object3D();

THREE.Object3D.prototype.clear = function () {
    var children = this.children;
    for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        child.clear();
        this.remove(child);
    };
};

THREE.Molecule.prototype.loadAsync = function (url, data, loadedCallback) {
    this.clear();
	var me = this;

	function unitVector(v) {
		return v.clone().normalize();
	}

	function subtractVectors(a, b) {
		return new THREE.Vector3().subVectors(a, b);
	}

	function addVectors(a, b) {
		return new THREE.Vector3().addVectors(a, b);
	}

	$.post(url, data, function (result) {
		var atoms = result.Atoms;
		for (var i = 0; i < atoms.length; i++) {
			var atom = atoms[i];
			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(0.3, 16, 16),
				new THREE.MeshPhongMaterial({ color: atom.Color, ambient: atom.Color, shininess: 60 })
			);
			sphere.position.x = atom.X;
			sphere.position.y = atom.Y;
			sphere.position.z = atom.Z;
			me.add(sphere);
		}

		var bonds = result.Bonds;
		for (var j = 0; j < bonds.length; j++) {
			var bond = bonds[j];

			var from = new THREE.Vector3(bond.FromX, bond.FromY, bond.FromZ);
			var to   = new THREE.Vector3(bond.ToX, bond.ToY, bond.ToZ);

			var bondVector = subtractVectors(to, from);
			var bondLength = bondVector.length();
			var bondAxis   = unitVector(bondVector);

			var bondCentre     = addVectors(to, from).divideScalar(2);
			var bondCentreUnit = unitVector(bondCentre);

			var bondOrder = bond.BondOrder;
			var bondYs = [];

			switch(bondOrder) {
				case 2:
					bondYs = [0.06, -0.06];
					break;
				case 3:
					bondYs = [0.08, 0, -0.08];
					break;
				default:
					bondYs = [0];
			}

			// Create bond object
			var bondObject = new THREE.Object3D();
			for (var k = 0; k < bondOrder; k++) {
				var bondCylinder = new THREE.Mesh(
					new THREE.TubeGeometry(new THREE.SplineCurve3([new THREE.Vector3(-bondLength / 2, bondYs[k], 0), new THREE.Vector3(bondLength / 2, bondYs[k], 0)]), 64, 0.03),
					new THREE.MeshPhongMaterial({ color: 0xF9F9F9, ambient: 0xF9F9F9 })
				);

				bondObject.add(bondCylinder);
			}

			// Euler rotation calculation
			var objectAxis = new THREE.Vector3(1, 0, 0);
			var rotationAxis = new THREE.Vector3().crossVectors(objectAxis, bondAxis).normalize();
			var angle = Math.acos(objectAxis.dot(bondAxis)); // a · b = |a| × |b| × cos(θ), but in this case |a| and |b| are both 1

			bondObject.translateOnAxis(bondCentreUnit, bondCentre.length());
			bondObject.rotateOnAxis(rotationAxis, angle);

			me.add(bondObject);

		}

		loadedCallback();
	});
};