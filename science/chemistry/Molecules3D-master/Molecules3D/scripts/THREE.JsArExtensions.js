// Some extensions to three.js objects helpful for use with the JSARToolkit

THREE.Camera.prototype.setJsArMatrix = function (jsArParameters) {
    var matrixArray = new Float32Array(16);
    jsArParameters.copyCameraMatrix(matrixArray, 10, 10000);

    return this.projectionMatrix.set(
        matrixArray[0], matrixArray[4], matrixArray[8],  matrixArray[12],
        matrixArray[1], matrixArray[5], matrixArray[9],  matrixArray[13],
        matrixArray[2], matrixArray[6], matrixArray[10], matrixArray[14],
        matrixArray[3], matrixArray[7], matrixArray[11], matrixArray[15]);
};

THREE.Object3D.prototype.setJsArMatrix = function (jsArMatrix) {
    return this.matrix.set(
         jsArMatrix.m00,  jsArMatrix.m01, -jsArMatrix.m02,  jsArMatrix.m03,
        -jsArMatrix.m10, -jsArMatrix.m11,  jsArMatrix.m12, -jsArMatrix.m13,
         jsArMatrix.m20,  jsArMatrix.m21, -jsArMatrix.m22,  jsArMatrix.m23,
                      0,               0,               0,               1
    );
};
