import { Point } from '../../types/point.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { ForceSimulation } from './simulation.js';
import { ForceLayoutOptions, ParsedForceLayoutOptions } from './types.js';

/**
 * <zh/> 力导向布局 (Force)
 *
 * <en/> Force-directed layout (Force)
 *
 * @remarks
 * <zh/> 基于自定义物理模拟的力导向布局，使用库伦定律计算斥力，胡克定律计算引力
 *
 * <en/> Force-directed layout based on custom physics simulation, using Coulomb's law for repulsion and Hooke's law for attraction
 */
declare class ForceLayout extends BaseLayoutWithIterations<ForceLayoutOptions> {
    id: string;
    simulation: ForceSimulation | null;
    protected getDefaultOptions(): Partial<ForceLayoutOptions>;
    protected layout(): Promise<void>;
    /**
     * Initialize physics properties on model nodes and edges
     */
    private initializePhysicsData;
    /**
     * Setup simulation and forces
     */
    protected setSimulation(options: ParsedForceLayoutOptions): ForceSimulation;
    /**
     * Setup repulsive force (Coulomb's law)
     */
    protected setupRepulsiveForce(simulation: ForceSimulation, options: ParsedForceLayoutOptions): void;
    /**
     * Setup attractive force (Hooke's law)
     */
    protected setupAttractiveForce(simulation: ForceSimulation, options: ParsedForceLayoutOptions): void;
    /**
     * Setup gravity force toward center
     */
    protected setupGravityForce(simulation: ForceSimulation, options: ParsedForceLayoutOptions): void;
    /**
     * Setup collision force to prevent overlap
     */
    protected setupCollideForce(simulation: ForceSimulation, options: ParsedForceLayoutOptions): void;
    /**
     * Setup centripetal force (unique to Force)
     */
    protected setupCentripetalForce(simulation: ForceSimulation, options: ParsedForceLayoutOptions): void;
    /**
     * Parse and format options
     */
    protected parseOptions(options: ForceLayoutOptions): ParsedForceLayoutOptions;
    /**
     * Format centripetal options
     */
    private formatCentripetal;
    /**
     * Get same type leaf map for clustering
     */
    private getSameTypeLeafMap;
    /**
     * Get core node and sibling leaves
     */
    private getCoreNodeAndSiblingLeaves;
    /**
     * Get average position of nodes
     */
    private getAvgNodePosition;
    /**
     * Manually step the simulation
     */
    tick(iterations?: number): this;
    /**
     * Stop the simulation
     */
    stop(): this;
    /**
     * Restart the simulation
     */
    restart(): this;
    /**
     * Set fixed position for a node
     */
    setFixedPosition(nodeId: string, position: Point | null): this;
}

export { ForceLayout, ForceLayoutOptions };
