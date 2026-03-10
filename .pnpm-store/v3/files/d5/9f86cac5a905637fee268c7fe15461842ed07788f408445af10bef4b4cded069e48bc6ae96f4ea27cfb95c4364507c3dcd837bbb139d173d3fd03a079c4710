import { s as Awaitable, t as CustomIconLoader } from "./types-Dgtmp2aa.mjs";
import "./index.mjs";
import { AutoInstall, ExternalPkgName } from "@iconify/utils/lib/loader/types";

//#region src/loaders.d.ts
declare function FileSystemIconLoader(dir: string, transform?: (svg: string) => Awaitable<string>): CustomIconLoader;
declare function ExternalPackageIconLoader(packageName: ExternalPkgName, autoInstall?: AutoInstall): Record<string, CustomIconLoader>;
//#endregion
export { ExternalPackageIconLoader, FileSystemIconLoader };