( function () {

	/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 */

	class CSS3DObject extends THREE.Object3D {

		constructor( element ) {

			super();
			this.element = element || document.createElement( 'div' );
			this.element.style.position = 'absolute';
			this.element.style.pointerEvents = 'auto';
			this.addEventListener( 'removed', function () {

				this.traverse( function ( object ) {

					if ( object.element instanceof Element && object.element.parentNode !== null ) {

						object.element.parentNode.removeChild( object.element );

					}

				} );

			} );

		}

		copy( source, recursive ) {

			super.copy( source, recursive );
			this.element = source.element.cloneNode( true );
			return this;

		}

	}

	CSS3DObject.prototype.isCSS3DObject = true;

	class CSS3DSprite extends CSS3DObject {

		constructor( element ) {

			super( element );

		}

	}

	CSS3DSprite.prototype.isCSS3DSprite = true; //

	const _matrix = new THREE.Matrix4();

	class CSS3DRenderer {

		constructor( { cameraInObjects = false } = {} ) {

			const _this = this;
			const viewObjectMatrix = new THREE.Matrix4();

			let _width, _height;

			let _widthHalf, _heightHalf;

			const cache = {
				camera: {
					fov: 0,
					style: ''
				},
				objects: new WeakMap()
			};
			const domElement = document.createElement( 'div' );
			domElement.style.overflow = 'hidden';
			this.domElement = domElement;
			const cameraElement = document.createElement( 'div' );
			cameraElement.style.transformStyle = 'preserve-3d';
			cameraElement.style.pointerEvents = 'none';
			domElement.appendChild( cameraElement );

			this.getSize = function () {

				return {
					width: _width,
					height: _height
				};

			};

			this.render = function ( scene, camera ) {

				const fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

				if ( cache.camera.fov !== fov ) {

					domElement.style.perspective = camera.isPerspectiveCamera ? fov + 'px' : '';
					cache.camera.fov = fov;

				}

				if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
				if ( camera.parent === null ) camera.updateMatrixWorld();
				let tx, ty;

				if ( camera.isOrthographicCamera ) {

					tx = - ( camera.right + camera.left ) / 2;
					ty = ( camera.top + camera.bottom ) / 2;

				}

				const cameraCSSMatrix = camera.isOrthographicCamera ? 'scale(' + fov + ')' + 'translate(' + epsilon( tx ) + 'px,' + epsilon( ty ) + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse ) : 'translateZ(' + fov + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse );
				// Keep the containing layer facing the viewport when requested.
				// Rotating that layer behind the viewer can clip otherwise-visible
				// room faces in mobile/remote browser compositors. Project each
				// object into camera space instead; the final geometry is identical.
				const containerMatrix = cameraInObjects && camera.isPerspectiveCamera ? 'translateZ(' + fov + 'px)' : cameraCSSMatrix;
				const style = containerMatrix + 'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

				if ( cache.camera.style !== style ) {

					cameraElement.style.transform = style;
					cache.camera.style = style;

				}

				renderObject( scene, scene, camera, cameraCSSMatrix );

			};

			this.setSize = function ( width, height ) {

				_width = width;
				_height = height;
				_widthHalf = _width / 2;
				_heightHalf = _height / 2;
				domElement.style.width = width + 'px';
				domElement.style.height = height + 'px';
				cameraElement.style.width = width + 'px';
				cameraElement.style.height = height + 'px';

			};

			function epsilon( value ) {

				return Math.abs( value ) < 1e-10 ? 0 : value;

			}

			function getCameraCSSMatrix( matrix ) {

				const elements = matrix.elements;
				return 'matrix3d(' + epsilon( elements[ 0 ] ) + ',' + epsilon( - elements[ 1 ] ) + ',' + epsilon( elements[ 2 ] ) + ',' + epsilon( elements[ 3 ] ) + ',' + epsilon( elements[ 4 ] ) + ',' + epsilon( - elements[ 5 ] ) + ',' + epsilon( elements[ 6 ] ) + ',' + epsilon( elements[ 7 ] ) + ',' + epsilon( elements[ 8 ] ) + ',' + epsilon( - elements[ 9 ] ) + ',' + epsilon( elements[ 10 ] ) + ',' + epsilon( elements[ 11 ] ) + ',' + epsilon( elements[ 12 ] ) + ',' + epsilon( - elements[ 13 ] ) + ',' + epsilon( elements[ 14 ] ) + ',' + epsilon( elements[ 15 ] ) + ')';

			}

			function getObjectCSSMatrix( matrix ) {

				const elements = matrix.elements;
				const matrix3d = 'matrix3d(' + epsilon( elements[ 0 ] ) + ',' + epsilon( elements[ 1 ] ) + ',' + epsilon( elements[ 2 ] ) + ',' + epsilon( elements[ 3 ] ) + ',' + epsilon( - elements[ 4 ] ) + ',' + epsilon( - elements[ 5 ] ) + ',' + epsilon( - elements[ 6 ] ) + ',' + epsilon( - elements[ 7 ] ) + ',' + epsilon( elements[ 8 ] ) + ',' + epsilon( elements[ 9 ] ) + ',' + epsilon( elements[ 10 ] ) + ',' + epsilon( elements[ 11 ] ) + ',' + epsilon( elements[ 12 ] ) + ',' + epsilon( elements[ 13 ] ) + ',' + epsilon( elements[ 14 ] ) + ',' + epsilon( elements[ 15 ] ) + ')';
				return 'translate(-50%,-50%)' + matrix3d;

			}

			function getViewObjectCSSMatrix( matrix ) {

				const e = matrix.elements;
				// CSS screen Y runs downward: flip the view's Y row as well as
				// the object's Y column, just as the two original matrices do.
				const values = [ e[ 0 ], - e[ 1 ], e[ 2 ], e[ 3 ], - e[ 4 ], e[ 5 ], - e[ 6 ], - e[ 7 ], e[ 8 ], - e[ 9 ], e[ 10 ], e[ 11 ], e[ 12 ], - e[ 13 ], e[ 14 ], e[ 15 ] ];
				return 'translate(-50%,-50%)matrix3d(' + values.map( epsilon ).join( ',' ) + ')';

			}

			function renderObject( object, scene, camera, cameraCSSMatrix ) {

				if ( object.isCSS3DObject ) {

					object.onBeforeRender( _this, scene, camera );
					let style;

					if ( object.isCSS3DSprite ) {

						// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/
						_matrix.copy( camera.matrixWorldInverse );

						_matrix.transpose();

						_matrix.copyPosition( object.matrixWorld );

						_matrix.scale( object.scale );

						_matrix.elements[ 3 ] = 0;
						_matrix.elements[ 7 ] = 0;
						_matrix.elements[ 11 ] = 0;
						_matrix.elements[ 15 ] = 1;
						style = getObjectCSSMatrix( _matrix );

					} else {

						style = getObjectCSSMatrix( object.matrixWorld );

					}

					if ( cameraInObjects && camera.isPerspectiveCamera ) {

						viewObjectMatrix.multiplyMatrices( camera.matrixWorldInverse, object.isCSS3DSprite ? _matrix : object.matrixWorld );
						style = getViewObjectCSSMatrix( viewObjectMatrix );

					}

					const element = object.element;
					const cachedObject = cache.objects.get( object );

					if ( cachedObject === undefined || cachedObject.style !== style ) {

						element.style.transform = style;
						const objectData = {
							style: style
						};
						cache.objects.set( object, objectData );

					}

					element.style.display = object.visible ? '' : 'none';

					if ( element.parentNode !== cameraElement ) {

						cameraElement.appendChild( element );

					}

					object.onAfterRender( _this, scene, camera );

				}

				for ( let i = 0, l = object.children.length; i < l; i ++ ) {

					renderObject( object.children[ i ], scene, camera, cameraCSSMatrix );

				}

			}

		}

	}

	THREE.CSS3DObject = CSS3DObject;
	THREE.CSS3DRenderer = CSS3DRenderer;
	THREE.CSS3DSprite = CSS3DSprite;

} )();
