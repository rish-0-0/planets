// Newton's Gravitational Laws (Rishabh's)
import * as THREE from 'three';

const UNIVERSAL_GRAVITATIONAL_CONSTANT = 6.67e-5;

import {CelestialBody} from "../components/CelestialBody.ts";

export function newtonGravitationalAcceleration(body1: CelestialBody, body2: CelestialBody): THREE.Vector3 {
    // F = m * a -> a = F / m1
    const rSq = body1.position.distanceToSquared(body2.position);
    const directionalVector = body2.position.clone().sub(body1.position).normalize();
    const magnitude = (UNIVERSAL_GRAVITATIONAL_CONSTANT * body2.mass) / rSq;

    return directionalVector.multiplyScalar(magnitude);
}

export function updateBodyPosition(body1:CelestialBody, body2: CelestialBody, t: number): void {

    const radiiSq = (body1.radius + body2.radius) * (body1.radius + body2.radius);

    if (body1.position.distanceToSquared(body2.position) <= radiiSq) {
        return;
    }

    const acceleration = newtonGravitationalAcceleration(body1, body2);

    // v = u + at
    body1.velocity.add(acceleration.multiplyScalar(t));

    // Update body1's position and velocity
    body1.position.add(body1.velocity.clone().multiplyScalar(t));
}

