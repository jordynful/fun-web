import {
	MathUtils,
	Spherical,
	Vector3
} from "three";

class FirstPersonControls {


	constructor(object, domElement, targetObject) {

		if (domElement === undefined) {

			console.warn('THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.');
			domElement = document;

		}
		//console.log("new first person controls 15");
		this.targetObject = targetObject;
		this.object = object;
		this.domElement = domElement;

		// API
		this.enabled = true;

		this.movementSpeed = 0.01; //changed from 1.0
		this.lookSpeed = 0.001;

		this.lookVertical = true;
		this.autoForward = false;

		this.activeLook = true;

		this.heightSpeed = false;
		this.heightCoef = 1.0; //was 1.0
		this.heightMin = 0.0;
		this.heightMax = 1.0;

		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;

		this.mouseDragOn = false;

		// internals
		this.autoSpeedFactor = 0.0;

		this.mouseX = 0;
		this.mouseY = 0;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;

		this.viewHalfX = 0;
		this.viewHalfY = 0;

		// private variables
		var lat = 0;
		var lon = 0;


		var lookDirection = new Vector3();
		var spherical = new Spherical();
		var target = new Vector3();

		        // Define properties at the top of the class
				this.lookDirection2 = new Vector3(0, 0, 0);
				this.spherical2 = new Spherical(1);
				this.target2 = new Vector3(0, 0, 0);

		//
		if (this.domElement !== document) {

			this.domElement.setAttribute('tabindex', -1);

		}

		//
		this.handleResize = function () {

			if (this.domElement === document) {

				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;

			} else {

				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;

			}

		};

		this.onMouseDown = function (event) {

			if (this.domElement !== document) {

				this.domElement.focus();

			}

			event.preventDefault();
			event.stopPropagation();

			if (this.activeLook) {

				switch (event.button) {

					case 0: this.moveForward = true; break;
					case 2: this.moveBackward = true; break;

				}

			}

			this.mouseDragOn = true;

		};

		this.onMouseUp = function (event) {

			event.preventDefault();
			event.stopPropagation();

			if (this.activeLook) {

				switch (event.button) {

					case 0: this.moveForward = false; break;
					case 2: this.moveBackward = false; break;

				}

			}

			this.mouseDragOn = false;

		};

		this.onMouseMove = function (event) {

			if (this.domElement === document) {

				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = event.pageY - this.viewHalfY;
				

			} else {

				this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
			
			}

		};

		this.onKeyDown = function (event) {
			//event.preventDefault();

			switch (event.keyCode) {

				case 38: /*up*/
				case 87: /*W*//*W*/ this.moveForward = true; break;

				case 37: /*left*/
				case 65: /*A*//*A*/ this.moveLeft = true; break;

				case 40: /*down*/
				case 83: /*S*//*S*/ this.moveBackward = true; break;

				case 39: /*right*/
				case 68: /*D*//*D*/ this.moveRight = true; break;

				case 82: /*R*//*R*/ this.moveUp = true; break;
				case 70: /*F*//*F*/ this.moveDown = true; break;

			}

		};

		this.onKeyUp = function (event) {

			switch (event.keyCode) {

				case 38: /*up*/
				case 87: /*W*//*W*/ this.moveForward = false; break;

				case 37: /*left*/
				case 65: /*A*//*A*/ this.moveLeft = false; break;

				case 40: /*down*/
				case 83: /*S*//*S*/ this.moveBackward = false; break;

				case 39: /*right*/
				case 68: /*D*//*D*/ this.moveRight = false; break;

				case 82: /*R*//*R*/ this.moveUp = false; break;
				case 70: /*F*//*F*/ this.moveDown = false; break;

			}

		};

		this.lookAt = function (x, y, z) {

			if (x.isVector3) {

				target.copy(x);

			} else {

				target.set(x, y, z);

			}

			this.object.lookAt(target);

			setOrientation(this);

			return this;

		};

		this.update = function () {

			var targetPosition = new Vector3();

			return function update(delta) {
				
				if (this.enabled === false) return;

				if (this.heightSpeed) {

					var y = MathUtils.clamp(this.object.position.y, this.heightMin, this.heightMax);
					var heightDelta = y - this.heightMin;

					this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

				} else {

					this.autoSpeedFactor = 0.0;

				}

				var actualMoveSpeed = delta * this.movementSpeed;

				//if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
				if (this.moveForward || (this.autoForward && !this.moveBackward)) {
					this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
					//console.log("firstpersoncontrols.js 248 move forward");
				}
				if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

				if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
				if (this.moveRight) this.object.translateX(actualMoveSpeed);

				if (this.moveUp) {
					this.object.translateY(actualMoveSpeed);
				}
				if (this.moveDown) {
					this.object.translateY(-actualMoveSpeed);
				}

				var actualLookSpeed = delta * this.lookSpeed;

				if (!this.activeLook) {

					actualLookSpeed = 0;

				}

				var verticalLookRatio = 1; // was 1

				if (this.constrainVertical) {

					verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

				}

				lon -= this.mouseX * actualLookSpeed;
				if (this.lookVertical) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

				lat = Math.max(-85, Math.min(85, lat));

				var phi = MathUtils.degToRad(90 - lat);
				var theta = MathUtils.degToRad(lon);

				if (this.constrainVertical) {

					phi = MathUtils.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);

				}

				var position = this.object.position;
				this.targetObject.updateMatrixWorld();
				targetPosition.setFromMatrixPosition(this.targetObject.matrixWorld);
			//	targetPosition.setFromSphericalCoords(1, phi, theta).add(position);

				//this is where we update the coordinates
				this.lookDirection2.copy(lookDirection);
				this.spherical2.copy(spherical);
				this.target2.copy(target);
				//console.log(targetPosition)
				this.object.lookAt(targetPosition);

			};

		} ();

		function contextmenu(event) {

			event.preventDefault();

		}

		this.dispose = function () {

			this.domElement.removeEventListener('contextmenu', contextmenu, false);
			this.domElement.removeEventListener('mousedown', _onMouseDown, false);
			this.domElement.removeEventListener('mousemove', _onMouseMove, false);
			this.domElement.removeEventListener('mouseup', _onMouseUp, false);

			window.removeEventListener('keydown', _onKeyDown, false);
			window.removeEventListener('keyup', _onKeyUp, false);

		};

		var _onMouseMove = bind(this, this.onMouseMove);
		var _onMouseDown = bind(this, this.onMouseDown);
		var _onMouseUp = bind(this, this.onMouseUp);
		var _onKeyDown = bind(this, this.onKeyDown);
		var _onKeyUp = bind(this, this.onKeyUp);

		this.domElement.addEventListener('contextmenu', contextmenu, false);
		this.domElement.addEventListener('mousemove', _onMouseMove, false);
		this.domElement.addEventListener('mousedown', _onMouseDown, false);
		this.domElement.addEventListener('mouseup', _onMouseUp, false);

		window.addEventListener('keydown', _onKeyDown, false);
		window.addEventListener('keyup', _onKeyUp, false);

		function bind(scope, fn) {

			return function () {

				fn.apply(scope, arguments);

			};

		}


		function setOrientation(controls) {
			console.log("setting orientation");
			var quaternion = controls.object.quaternion;

			lookDirection.set(0, 0, -1).applyQuaternion(quaternion);
			spherical.setFromVector3(lookDirection);

			lat = 90 - MathUtils.radToDeg(spherical.phi);
			lon = MathUtils.radToDeg(spherical.theta);
			//Ive added this
	   controls.lookDirection2.copy(lookDirection);
        controls.spherical2.copy(spherical);
        controls.target2.copy(target);
		//maybe need to adjust location since position should actually be a bit in front
		}

		this.handleResize();

		setOrientation(this);


	}

	getLookDirection() {
		return this.lookDirection2;
	}

	getSpherical() {
		return this.spherical2;
	}

	getTarget() {
		return this.target2;
	}
	getMouseX() {
		return this.mouseX;
	}
	getMouseY() {
		return this.mouseY;
	}

	getMoveLeft() {
		return this.moveLeft;
	}

	getMoveRight() {
		return this.moveRight;
	}
	getObject() {
		return this.object;
	}

}

export { FirstPersonControls };