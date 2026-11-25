import { osm } from "./osm.js"; import { places } from "./places.js"; import { brave } from "./brave.js";
import type { Connector } from "./types.js";
export const CONNECTORS: Connector[] = [osm, places, brave];
export type { Candidate, Connector } from "./types.js";
