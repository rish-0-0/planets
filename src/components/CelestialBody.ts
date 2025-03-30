import * as THREE from "three";
import {SphericalObject} from "./SphericalObject.ts";

export class CelestialBody extends SphericalObject {
    public mass: number = 0;
    public velocityVector: THREE.Vector3;

    constructor(mass: number, size: number, color: number, position: THREE.Vector3, velocity?: THREE.Vector3) {
        super(size, color, position);
        this.mass = mass;
        this.velocityVector = velocity ?? new THREE.Vector3(0,0,0);
    }

    get velocity(): THREE.Vector3 {
        return this.velocityVector;
    }

    get speed(): number {
        return this.velocity.length();
    }

    public updateVelocity(velocity: THREE.Vector3) {
        this.velocityVector.copy(velocity);
    }
}