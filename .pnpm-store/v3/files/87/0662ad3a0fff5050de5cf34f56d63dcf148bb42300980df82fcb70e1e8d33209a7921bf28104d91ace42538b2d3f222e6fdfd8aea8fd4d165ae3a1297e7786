import { NxJsonConfiguration } from '../../config/nx-json';
import { PackageJson } from '../../utils/package-json';
import { Agent } from '../../ai/utils';
export interface InitArgs {
    interactive: boolean;
    nxCloud?: boolean;
    useDotNxInstallation?: boolean;
    integrated?: boolean;
    verbose?: boolean;
    force?: boolean;
    aiAgents?: Agent[];
}
export declare function initHandler(options: InitArgs, inner?: boolean): Promise<void>;
export declare function detectPlugins(nxJson: NxJsonConfiguration, packageJson: PackageJson | null, interactive: boolean, includeAngularCli?: boolean): Promise<{
    plugins: string[];
    updatePackageScripts: boolean;
}>;
//# sourceMappingURL=init-v2.d.ts.map