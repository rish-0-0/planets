import * as THREE from "three";

export class SphericalObject {
    public mesh: THREE.Mesh;

    constructor(size: number, color: number, position: THREE.Vector3) {
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
    }

    public addToScene(scene: THREE.Scene) {
        scene.add(this.mesh);
    }

    get id() {
        return this.mesh.id;
    }

    get position() {
        return this.mesh.position;
    }

    public updatePosition(position: THREE.Vector3) {
        this.mesh.position.copy(position);
    }

    get radius() {
        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        return Math.max(size.x, size.y, size.z)/2;
    }
}
