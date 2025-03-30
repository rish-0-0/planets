import * as THREE from "three";

export class SpacetimeWarp {
    mesh: THREE.Mesh;
    geometry: THREE.SphereGeometry;
    originalPositions: Float32Array;

    constructor() {
        // Create a sphere-like spacetime surface
        this.geometry = new THREE.SphereGeometry(5, 64, 64); // Increase segments for smoothness
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(this.geometry, material);

        // Store original vertex positions
        this.originalPositions = this.geometry.attributes.position.array.slice() as Float32Array;

        // Apply initial warping
        this.warpSpace(new THREE.Vector3(0, 0.2, 0), 1.5);
    }

    warpSpace(center: THREE.Vector3, strength: number) {
        const positions = this.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            // Compute distance from the Sun
            const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2 + (z - center.z) ** 2);

            // Apply smooth gravitational falloff
            const warpEffect = -strength * Math.exp(-distance * distance);

            // Apply deformation outward or inward
            const scaleFactor = 1 + warpEffect * 0.1;

            positions[i] *= scaleFactor;
            positions[i + 1] *= scaleFactor;
            positions[i + 2] *= scaleFactor;
        }

        this.geometry.attributes.position.needsUpdate = true;
    }

    addToScene(scene: THREE.Scene) {
        scene.add(this.mesh);
    }
}
