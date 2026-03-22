import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { buildGalaxyBlueprint } from "./galaxyBlueprint.js";

function createCircleLine(radius, color, opacity) {
  const points = [];
  for (let i = 0; i <= 64; i += 1) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function createLineBetween(from, to, color, opacity) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(from.x, from.y, from.z),
      new THREE.Vector3(to.x, to.y, to.z),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function metricToColor(metricName, metrics) {
  const value = metrics[metricName] || 0;
  if (metricName === "threat") return new THREE.Color(`hsl(${Math.max(0, 42 - value * 0.35)} 88% 58%)`);
  if (metricName === "economy") return new THREE.Color(`hsl(${35 + value * 0.7} 85% 58%)`);
  if (metricName === "diplomacy") return new THREE.Color(`hsl(${190 + value * 0.7} 80% 62%)`);
  if (metricName === "anomaly") return new THREE.Color(`hsl(${110 + value * 0.4} 75% 55%)`);
  if (metricName === "jump") return new THREE.Color(`hsl(${250 + value * 0.3} 70% 68%)`);
  if (metricName === "recon") return new THREE.Color(`hsl(${55 + value * 0.4} 80% 58%)`);
  return new THREE.Color(`hsl(${190 + value * 0.45} 78% 62%)`);
}

function shipModeProfile(mode) {
  if (mode === "survey") return { color: 0x38bdf8, emissive: 0x082f49, speed: 0.8, radius: 1.3 };
  if (mode === "intercept") return { color: 0xff6b6b, emissive: 0x4a1010, speed: 1.65, radius: 0.82 };
  if (mode === "colonize") return { color: 0x4ade80, emissive: 0x123524, speed: 0.62, radius: 1.5 };
  return { color: 0xfb7185, emissive: 0x5e1026, speed: 1, radius: 1 };
}

function objectStyle(type) {
  if (type === "asteroid") return { geometry: new THREE.DodecahedronGeometry(0.8, 0), color: 0xa8b4c7, emissive: 0x0d1117 };
  if (type === "comet") return { geometry: new THREE.OctahedronGeometry(1.1, 0), color: 0x7dd3fc, emissive: 0x0b3551 };
  if (type === "relay") return { geometry: new THREE.BoxGeometry(1.3, 1.3, 1.3), color: 0x38bdf8, emissive: 0x0d2943 };
  if (type === "derelict") return { geometry: new THREE.TetrahedronGeometry(1.2, 0), color: 0xf59e0b, emissive: 0x3a2106 };
  if (type === "anomaly") return { geometry: new THREE.TorusKnotGeometry(0.8, 0.22, 40, 6), color: 0x4ade80, emissive: 0x0a4228 };
  return { geometry: new THREE.BoxGeometry(1.1, 0.8, 2.2), color: 0xfb7185, emissive: 0x4b1023 };
}

function createAsteroidBelt(belt) {
  const points = [];
  const total = 120 + Math.round(belt.density * 1.4);
  for (let i = 0; i < total; i += 1) {
    const angle = (i / total) * Math.PI * 2;
    const radius = belt.radius + Math.sin(i * 1.7) * belt.thickness;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(i * 0.6) * belt.thickness * 0.12,
        Math.sin(angle) * radius,
      ),
    );
  }
  return new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.7, transparent: true, opacity: 0.58 }),
  );
}

function createShipToken(system, index, profile) {
  const group = new THREE.Group();
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: profile.color,
    emissive: profile.emissive,
    roughness: 0.35,
    metalness: 0.45,
  });
  const hull = new THREE.Mesh(new THREE.ConeGeometry(4, 14, 5), hullMaterial);
  hull.rotation.x = Math.PI / 2;
  group.add(hull);

  const wingMaterial = new THREE.MeshStandardMaterial({
    color: profile.color,
    emissive: profile.emissive,
    roughness: 0.35,
    metalness: 0.4,
  });
  const wingA = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 6), wingMaterial);
  wingA.position.set(-3.4, 0, 0);
  const wingB = wingA.clone();
  wingB.position.x = 3.4;
  group.add(wingA, wingB);

  const trailMaterial = new THREE.LineBasicMaterial({
    color: profile.color,
    transparent: true,
    opacity: 0.45,
  });
  const trail = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -3), new THREE.Vector3(0, 0, 18)]),
    trailMaterial,
  );
  trail.position.z = -4;
  group.add(trail);
  group.position.set(system.position.x, system.position.y + 16, system.position.z);

  return {
    group,
    hullMaterial,
    wingMaterial,
    trailMaterial,
    systemId: system.id,
    baseRadius: 24 + (index % 3) * 8,
    baseSpeed: 0.42 + (index % 5) * 0.16,
    offset: index * 0.6,
    laneTilt: (index % 4) * 0.4,
  };
}

export function createSceneController(options) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06111d);
  scene.fog = new THREE.FogExp2(0x06111d, 0.00045);
  const viewportWidth = () => Math.max(options.container.clientWidth || window.innerWidth, 1);
  const viewportHeight = () => Math.max(options.container.clientHeight || window.innerHeight, 1);

  const camera = new THREE.PerspectiveCamera(55, viewportWidth() / viewportHeight(), 0.1, 25000);
  camera.position.set(0, 420, 880);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(viewportWidth(), viewportHeight());
  options.container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 80;
  controls.maxDistance = 2800;

  const ambientLight = new THREE.AmbientLight(0xbcd7ff, 0.55);
  const keyLight = new THREE.PointLight(0xffffff, 1.7, 7000);
  keyLight.position.set(240, 420, 360);
  const fillLight = new THREE.PointLight(0x5db0ff, 0.9, 6500);
  fillLight.position.set(-520, -160, -280);
  scene.add(ambientLight, keyLight, fillLight);

  const rootGroup = new THREE.Group();
  const dustGroup = new THREE.Group();
  const sectorGroup = new THREE.Group();
  const routeGroup = new THREE.Group();
  const tradeGroup = new THREE.Group();
  const diplomacyGroup = new THREE.Group();
  const fleetGroup = new THREE.Group();
  const systemGroup = new THREE.Group();
  scene.add(rootGroup);
  rootGroup.add(dustGroup, sectorGroup, routeGroup, tradeGroup, diplomacyGroup, fleetGroup, systemGroup);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const systemMap = new Map();
  const selectableMeshes = [];
  const fleetTokens = [];

  let currentBlueprint = null;
  let currentPage = null;
  let motionEnabled = true;
  let selectedSystemId = null;
  let hoveredSystemId = null;
  let selectedPlanetId = null;
  let viewMode = "galaxy";
  let shipMode = "patrol";

  function disposeObject(object) {
    object.traverse?.((node) => {
      node.geometry?.dispose?.();
      if (Array.isArray(node.material)) node.material.forEach((material) => material.dispose?.());
      else node.material?.dispose?.();
    });
  }

  function clearGroup(group) {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      disposeObject(child);
    }
  }

  function buildDustField(seed) {
    clearGroup(dustGroup);
    const rng = ((seed * 9301 + 49297) % 233280) / 233280;
    const positions = new Float32Array(1600 * 3);
    for (let i = 0; i < 1600; i += 1) {
      const radius = 200 + (i / 1600) * 1700;
      const angle = i * 0.043 + rng * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius + Math.sin(i * 0.17) * 25;
      positions[i * 3 + 1] = Math.sin(i * 0.31) * 60;
      positions[i * 3 + 2] = Math.sin(angle) * radius + Math.cos(i * 0.17) * 25;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dustGroup.add(new THREE.Points(geometry, new THREE.PointsMaterial({
      color: 0x7dc1ff,
      size: 3.2,
      transparent: true,
      opacity: 0.38,
      sizeAttenuation: true,
    })));
  }

  function buildSectorShells() {
    clearGroup(sectorGroup);
    for (let ring = 1; ring <= 7; ring += 1) {
      const line = createCircleLine(ring * 180, 0x3d7ea6, ring === 7 ? 0.35 : 0.22);
      line.rotation.x = Math.PI / 2;
      sectorGroup.add(line);
    }
    for (let arm = 0; arm < 10; arm += 1) {
      const angle = (arm / 10) * Math.PI * 2;
      sectorGroup.add(createLineBetween(
        { x: 0, y: -1, z: 0 },
        { x: Math.cos(angle) * 1320, y: -1, z: Math.sin(angle) * 1320 },
        0x224c63,
        0.28,
      ));
    }
  }

  function buildFleetTokens(systems) {
    clearGroup(fleetGroup);
    fleetTokens.length = 0;
    const profile = shipModeProfile(shipMode);
    const topSystems = [...systems]
      .sort((a, b) => b.metrics.command + b.metrics.logistics - (a.metrics.command + a.metrics.logistics))
      .slice(0, 18);
    topSystems.forEach((system, index) => {
      const token = createShipToken(system, index, profile);
      fleetGroup.add(token.group);
      fleetTokens.push(token);
    });
  }

  function createSystemObject(system) {
    const group = new THREE.Group();
    group.position.set(system.position.x, system.position.y, system.position.z);

    const starMesh = new THREE.Mesh(
      new THREE.SphereGeometry(system.starSize, 18, 18),
      new THREE.MeshStandardMaterial({
        color: metricToColor("command", system.metrics),
        emissive: 0x1f2937,
        emissiveIntensity: 0.9,
        roughness: 0.35,
        metalness: 0.05,
      }),
    );
    starMesh.userData = { kind: "system", systemId: system.id };
    group.add(starMesh);
    selectableMeshes.push(starMesh);

    const haloMesh = new THREE.Mesh(
      new THREE.SphereGeometry(system.starSize * 2.2, 18, 18),
      new THREE.MeshBasicMaterial({
        color: metricToColor("economy", system.metrics),
        transparent: true,
        opacity: 0.12,
        wireframe: true,
      }),
    );
    group.add(haloMesh);

    const threatRing = createCircleLine(12 + system.metrics.threat * 0.18, 0xff7c6d, 0.2);
    threatRing.rotation.x = Math.PI / 2;
    threatRing.position.y = -2;
    group.add(threatRing);

    const economyRing = createCircleLine(16 + system.metrics.economy * 0.16, 0xf6c65b, 0.15);
    economyRing.rotation.x = Math.PI / 2;
    group.add(economyRing);

    const jumpRing = createCircleLine(10 + system.metrics.jump * 0.12, 0xb9a4ff, 0.18);
    jumpRing.rotation.x = Math.PI / 2;
    jumpRing.position.y = 2;
    group.add(jumpRing);

    const reconNeedle = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.5 + system.metrics.recon * 0.025, 0),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0x7c5a02 }),
    );
    reconNeedle.position.y = 10 + system.starSize;
    group.add(reconNeedle);

    const anomalyBeacon = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.6, 0.35, 48, 8),
      new THREE.MeshStandardMaterial({ color: 0x43d3a8, emissive: 0x0a503d }),
    );
    anomalyBeacon.position.y = 18 + system.starSize;
    group.add(anomalyBeacon);

    const planetGroup = new THREE.Group();
    const stationGroup = new THREE.Group();
    const objectGroup = new THREE.Group();
    const beltGroup = new THREE.Group();
    const planetEntries = [];
    const stationEntries = [];
    const objectEntries = [];

    system.asteroidBelts.forEach((belt, index) => {
      const beltMesh = createAsteroidBelt(belt);
      beltMesh.rotation.x = Math.PI / 2;
      beltMesh.rotation.z = index * 0.15;
      beltGroup.add(beltMesh);
    });

    system.planets.forEach((planet) => {
      const orbit = createCircleLine(planet.orbitRadius, 0x8aa4b6, 0.16);
      orbit.rotation.x = Math.PI / 2;
      planetGroup.add(orbit);

      const anchor = new THREE.Group();
      anchor.userData = { orbitRadius: planet.orbitRadius, orbitSpeed: planet.orbitSpeed, orbitAngle: planet.orbitAngle };

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.size, 14, 14),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(planet.color), roughness: 0.78, metalness: 0.06 }),
      );
      mesh.userData = { kind: "planet", systemId: system.id, planetId: planet.id };
      selectableMeshes.push(mesh);
      anchor.add(mesh);

      const moonGroup = new THREE.Group();
      const moonEntries = [];
      planet.moons.forEach((moon) => {
        const moonOrbit = createCircleLine(moon.orbitRadius, 0x94a3b8, 0.18);
        moonOrbit.rotation.x = Math.PI / 2;
        moonGroup.add(moonOrbit);

        const moonMesh = new THREE.Mesh(
          new THREE.SphereGeometry(moon.size, 10, 10),
          new THREE.MeshStandardMaterial({
            color: moon.biome === "ice" ? 0xe2e8f0 : 0x94a3b8,
            roughness: 0.9,
            metalness: 0.03,
          }),
        );
        moonMesh.userData = { orbitRadius: moon.orbitRadius, orbitSpeed: moon.orbitSpeed, orbitAngle: moon.orbitAngle };
        moonGroup.add(moonMesh);
        moonEntries.push({ mesh: moonMesh, orbit: moonOrbit });
      });

      anchor.add(moonGroup);
      planetGroup.add(anchor);
      planetEntries.push({ planet, anchor, mesh, orbit, moonGroup, moonEntries });
    });

    system.stations.forEach((station) => {
      const orbit = createCircleLine(station.orbitRadius, 0x7dd3fc, 0.16);
      orbit.rotation.x = Math.PI / 2;
      stationGroup.add(orbit);

      const anchor = new THREE.Group();
      anchor.userData = { orbitRadius: station.orbitRadius, orbitSpeed: station.orbitSpeed, orbitAngle: station.orbitAngle };
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 1.4, 4.4, 6),
        new THREE.MeshStandardMaterial({
          color: station.role === "defense" ? 0xfb7185 : station.role === "science" ? 0x38bdf8 : 0xf8fafc,
          emissive: station.role === "trade" ? 0x43310b : 0x122436,
          roughness: 0.35,
          metalness: 0.65,
        }),
      );
      mesh.rotation.z = Math.PI / 2;
      anchor.add(mesh);
      stationGroup.add(anchor);
      stationEntries.push({ anchor, mesh, orbit });
    });

    system.interstellarObjects.forEach((object) => {
      const style = objectStyle(object.type);
      const mesh = new THREE.Mesh(
        style.geometry,
        new THREE.MeshStandardMaterial({
          color: style.color,
          emissive: style.emissive,
          roughness: 0.45,
          metalness: object.type === "relay" ? 0.7 : 0.2,
        }),
      );
      mesh.userData = {
        orbitRadius: object.orbitRadius,
        orbitSpeed: object.orbitSpeed,
        orbitAngle: object.orbitAngle,
        elevation: object.elevation,
      };
      mesh.position.set(
        Math.cos(object.orbitAngle) * object.orbitRadius,
        object.elevation,
        Math.sin(object.orbitAngle) * object.orbitRadius,
      );
      objectGroup.add(mesh);
      objectEntries.push({ mesh, type: object.type });
    });

    group.add(planetGroup, stationGroup, objectGroup, beltGroup);
    systemGroup.add(group);
    systemMap.set(system.id, {
      system,
      group,
      starMesh,
      haloMesh,
      threatRing,
      economyRing,
      jumpRing,
      reconNeedle,
      anomalyBeacon,
      planetGroup,
      stationGroup,
      objectGroup,
      beltGroup,
      planetEntries,
      stationEntries,
      objectEntries,
    });
  }

  function buildConnections(blueprint) {
    clearGroup(routeGroup);
    clearGroup(tradeGroup);
    clearGroup(diplomacyGroup);
    const lookup = new Map(blueprint.systems.map((system) => [system.id, system]));
    blueprint.routeLanes.forEach((lane) => {
      const from = lookup.get(lane.fromId);
      const to = lookup.get(lane.toId);
      if (from && to) routeGroup.add(createLineBetween(from.position, to.position, 0x78d6ff, 0.22));
    });
    blueprint.tradeLanes.forEach((lane) => {
      const from = lookup.get(lane.fromId);
      const to = lookup.get(lane.toId);
      if (from && to) tradeGroup.add(createLineBetween(from.position, to.position, 0xf59e0b, 0.26));
    });
    blueprint.diplomacyLinks.forEach((link) => {
      const from = lookup.get(link.fromId);
      const to = lookup.get(link.toId);
      if (from && to) diplomacyGroup.add(createLineBetween(from.position, to.position, 0x82cfff, 0.3));
    });
  }

  function getPlanetSelection() {
    const systemEntry = selectedSystemId ? systemMap.get(selectedSystemId) : null;
    const planetEntry = systemEntry?.planetEntries.find((entry) => entry.planet.id === selectedPlanetId) || null;
    return systemEntry && planetEntry ? { systemEntry, planetEntry } : null;
  }

  function backgroundColor() {
    if (currentPage?.overlayMode === "threat") return 0x140b10;
    if (currentPage?.overlayMode === "planet") return 0x07151f;
    if (currentPage?.overlayMode === "interstellar") return 0x0a1019;
    return 0x06111d;
  }

  function updateEntry(entry) {
    const overlayMode = currentPage?.overlayMode || "command";
    const focusMetric = currentPage?.focusMetric || "command";
    const isSelected = entry.system.id === selectedSystemId;
    const isHovered = entry.system.id === hoveredSystemId;
    const showLocal = isSelected && viewMode !== "galaxy";

    entry.starMesh.material.color.copy(metricToColor(focusMetric, entry.system.metrics));
    entry.haloMesh.material.color.copy(metricToColor(focusMetric, entry.system.metrics));
    entry.haloMesh.material.opacity = 0.1 + (entry.system.metrics[focusMetric] || 0) / 650;
    entry.starMesh.scale.setScalar(isSelected ? 1.9 : isHovered ? 1.45 : 1);
    entry.haloMesh.scale.setScalar(isSelected ? 1.7 : isHovered ? 1.35 : 1);
    entry.starMesh.material.emissiveIntensity = isSelected ? 1.7 : isHovered ? 1.15 : 0.9;

    entry.threatRing.visible = ["threat", "patrols", "borders", "command", "system"].includes(overlayMode);
    entry.economyRing.visible = ["economy", "trade", "logistics", "command", "planet", "system"].includes(overlayMode);
    entry.jumpRing.visible = entry.system.hasJumpGate && ["jump", "routes", "fleets", "system"].includes(overlayMode);
    entry.reconNeedle.visible = entry.system.metrics.recon > 65 && ["recon", "anomalies", "threat", "interstellar"].includes(overlayMode);
    entry.anomalyBeacon.visible = entry.system.hasAnomaly && ["anomalies", "expeditions", "recon", "interstellar"].includes(overlayMode);

    entry.planetGroup.visible = showLocal;
    entry.stationGroup.visible = showLocal || (isSelected && ["logistics", "fleets", "patrols", "system"].includes(overlayMode));
    entry.objectGroup.visible = showLocal || (isSelected && ["interstellar", "anomalies", "recon", "expeditions"].includes(overlayMode));
    entry.beltGroup.visible = showLocal || (isSelected && ["interstellar", "system", "economy", "anomalies"].includes(overlayMode));

    entry.planetEntries.forEach((planetEntry) => {
      const selectedPlanet = planetEntry.planet.id === selectedPlanetId;
      planetEntry.mesh.scale.setScalar(selectedPlanet ? 1.35 : showLocal ? 1.06 : 0.96);
      planetEntry.moonGroup.visible = selectedPlanet && viewMode === "planet";
      planetEntry.orbit.material.opacity = showLocal ? 0.22 : 0.12;
      planetEntry.moonEntries.forEach((moonEntry) => {
        moonEntry.orbit.material.opacity = selectedPlanet ? 0.22 : 0.1;
      });
    });
  }

  function refreshPresentation() {
    scene.background = new THREE.Color(backgroundColor());
    const overlayMode = currentPage?.overlayMode || "command";
    const galaxyView = viewMode === "galaxy";
    sectorGroup.visible = galaxyView || ["command", "sectors", "routes", "jump"].includes(overlayMode);
    routeGroup.visible = galaxyView || ["routes", "jump", "logistics", "fleets", "patrols", "expeditions"].includes(overlayMode);
    tradeGroup.visible = galaxyView || ["economy", "trade", "logistics"].includes(overlayMode);
    diplomacyGroup.visible = galaxyView || ["diplomacy", "borders", "envoys", "command"].includes(overlayMode);
    fleetGroup.visible = overlayMode === "fleets" || overlayMode === "patrols" || overlayMode === "expeditions" || viewMode !== "planet";
    systemMap.forEach(updateEntry);
  }

  function focusSelection() {
    const planetSelection = getPlanetSelection();
    if (viewMode === "planet" && planetSelection) {
      const position = planetSelection.planetEntry.mesh.getWorldPosition(new THREE.Vector3());
      controls.target.copy(position);
      camera.position.copy(position).add(new THREE.Vector3(14, 8, 16));
      return;
    }
    if ((viewMode === "system" || viewMode === "planet") && selectedSystemId) {
      const entry = systemMap.get(selectedSystemId);
      if (entry) {
        controls.target.set(entry.system.position.x, entry.system.position.y, entry.system.position.z);
        camera.position.set(entry.system.position.x + 130, entry.system.position.y + 88, entry.system.position.z + 150);
        return;
      }
    }
    if (!selectedSystemId && currentBlueprint && currentPage) {
      const spotlight = [...currentBlueprint.systems]
        .sort((a, b) => (b.metrics[currentPage.focusMetric] || 0) - (a.metrics[currentPage.focusMetric] || 0))[0];
      if (spotlight) {
        controls.target.set(spotlight.position.x, spotlight.position.y, spotlight.position.z);
        camera.position.set(spotlight.position.x + 420, spotlight.position.y + 250, spotlight.position.z + 620);
        return;
      }
    }
    controls.target.set(0, 0, 0);
    camera.position.set(0, 420, 880);
  }

  function rebuildGalaxy({ seed, systemCount }) {
    currentBlueprint = buildGalaxyBlueprint({ seed, systemCount });
    selectableMeshes.length = 0;
    systemMap.clear();
    clearGroup(systemGroup);
    buildDustField(seed);
    buildSectorShells();
    buildConnections(currentBlueprint);
    currentBlueprint.systems.forEach(createSystemObject);
    buildFleetTokens(currentBlueprint.systems);
    syncSelection({ selectedSystemId: null, hoveredSystemId: null, selectedPlanetId: null });
    refreshPresentation();
    focusSelection();
  }

  function applyPage(page) {
    currentPage = page;
    if (!currentBlueprint) return;
    refreshPresentation();
    if (!selectedSystemId) focusSelection();
  }

  function syncSelection(selection) {
    selectedSystemId = selection.selectedSystemId;
    hoveredSystemId = selection.hoveredSystemId;
    selectedPlanetId = selection.selectedPlanetId || null;
    refreshPresentation();
  }

  function setViewMode(nextMode) {
    viewMode = nextMode;
    if (viewMode === "galaxy") {
      controls.minDistance = 80;
      controls.maxDistance = 2800;
    } else if (viewMode === "system") {
      controls.minDistance = 30;
      controls.maxDistance = 900;
    } else {
      controls.minDistance = 6;
      controls.maxDistance = 220;
    }
    refreshPresentation();
    focusSelection();
  }

  function panCamera(horizontal, vertical) {
    const offset = new THREE.Vector3(horizontal, 0, vertical);
    camera.position.add(offset);
    controls.target.add(offset);
  }

  function zoomCamera(delta) {
    const direction = new THREE.Vector3();
    direction.subVectors(camera.position, controls.target).normalize();
    camera.position.addScaledVector(direction, delta);
  }

  function orbitCamera(horizontal, vertical) {
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= horizontal;
    spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, spherical.phi + vertical));
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
  }

  function applyShipControlMode(nextMode) {
    shipMode = nextMode;
    const profile = shipModeProfile(nextMode);
    fleetTokens.forEach((token) => {
      token.hullMaterial.color.setHex(profile.color);
      token.hullMaterial.emissive.setHex(profile.emissive);
      token.wingMaterial.color.setHex(profile.color);
      token.wingMaterial.emissive.setHex(profile.emissive);
      token.trailMaterial.color.setHex(profile.color);
    });
  }

  renderer.domElement.addEventListener("pointermove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  renderer.domElement.addEventListener("click", () => {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(selectableMeshes, false)[0];
    if (!hit) {
      options.onSystemSelect?.(null);
      return;
    }
    const { kind, systemId, planetId } = hit.object.userData;
    if (kind === "planet") {
      const systemEntry = systemMap.get(systemId);
      const planetEntry = systemEntry?.planetEntries.find((entry) => entry.planet.id === planetId);
      if (systemEntry && planetEntry) {
        options.onPlanetSelect?.({ system: systemEntry.system, planet: planetEntry.planet });
        return;
      }
    }
    options.onSystemSelect?.(systemMap.get(systemId)?.system || null);
  });

  window.addEventListener("resize", () => {
    camera.aspect = viewportWidth() / viewportHeight();
    camera.updateProjectionMatrix();
    renderer.setSize(viewportWidth(), viewportHeight());
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    controls.update();

    raycaster.setFromCamera(pointer, camera);
    const hoveredId = raycaster.intersectObjects(selectableMeshes, false)[0]?.object?.userData?.systemId || null;
    if (hoveredId !== hoveredSystemId) {
      options.onSystemHover?.(hoveredId ? systemMap.get(hoveredId)?.system || null : null);
    }

    if (motionEnabled) {
      systemMap.forEach((entry) => {
        entry.haloMesh.rotation.y += 0.002;
        entry.anomalyBeacon.rotation.x += 0.02;
        entry.anomalyBeacon.rotation.y += 0.016;
        entry.reconNeedle.rotation.y += 0.018;
        entry.beltGroup.rotation.y += 0.0008;

        entry.planetEntries.forEach((planetEntry) => {
          const orbit = planetEntry.anchor.userData;
          orbit.orbitAngle += orbit.orbitSpeed;
          planetEntry.anchor.position.set(
            Math.cos(orbit.orbitAngle) * orbit.orbitRadius,
            0,
            Math.sin(orbit.orbitAngle) * orbit.orbitRadius,
          );
          planetEntry.mesh.rotation.y += 0.004;
          planetEntry.moonEntries.forEach((moonEntry) => {
            const moonOrbit = moonEntry.mesh.userData;
            moonOrbit.orbitAngle += moonOrbit.orbitSpeed;
            moonEntry.mesh.position.set(
              Math.cos(moonOrbit.orbitAngle) * moonOrbit.orbitRadius,
              0,
              Math.sin(moonOrbit.orbitAngle) * moonOrbit.orbitRadius,
            );
          });
        });

        entry.stationEntries.forEach((stationEntry) => {
          const orbit = stationEntry.anchor.userData;
          orbit.orbitAngle += orbit.orbitSpeed;
          stationEntry.anchor.position.set(
            Math.cos(orbit.orbitAngle) * orbit.orbitRadius,
            Math.sin(elapsed + orbit.orbitRadius) * 1.2,
            Math.sin(orbit.orbitAngle) * orbit.orbitRadius,
          );
          stationEntry.mesh.rotation.y += 0.01;
        });

        entry.objectEntries.forEach((objectEntry) => {
          const orbit = objectEntry.mesh.userData;
          orbit.orbitAngle += orbit.orbitSpeed;
          objectEntry.mesh.position.set(
            Math.cos(orbit.orbitAngle) * orbit.orbitRadius,
            orbit.elevation + Math.sin(elapsed + orbit.orbitAngle) * 0.8,
            Math.sin(orbit.orbitAngle) * orbit.orbitRadius,
          );
          objectEntry.mesh.rotation.x += 0.008;
          objectEntry.mesh.rotation.y += 0.01;
        });
      });

      const profile = shipModeProfile(shipMode);
      fleetTokens.forEach((token) => {
        const entry = systemMap.get(token.systemId);
        if (!entry) return;
        const theta = elapsed * token.baseSpeed * profile.speed + token.offset;
        const radius = token.baseRadius * profile.radius;
        token.group.position.set(
          entry.system.position.x + Math.cos(theta) * radius,
          entry.system.position.y + 16 + Math.sin(theta * 2 + token.laneTilt) * 4,
          entry.system.position.z + Math.sin(theta) * radius,
        );
        token.group.lookAt(entry.system.position.x, entry.system.position.y, entry.system.position.z);
      });
    }

    renderer.render(scene, camera);
  }
  animate();

  return {
    rebuildGalaxy,
    applyPage,
    syncSelection,
    focusSelectedSystem: focusSelection,
    setMotionEnabled(enabled) {
      motionEnabled = enabled;
    },
    setViewMode,
    panCamera,
    zoomCamera,
    orbitCamera,
    applyShipControlMode,
  };
}
