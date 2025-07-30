import { ConfigureFlow, FlowConfig, FlowJsonConfig } from "./types";
import { Path } from "mzfw/device/Path";
import { renameSync } from "@zosx/fs";

export class FlowConfigureTool implements ConfigureFlow {
  private config: FlowConfig;

  constructor(config: FlowConfig) {
    this.config = config;
  }

  checkRequirements(): boolean {
    return true;
  }

  setConfig(language: string): boolean {
    try {
      console.log("Reading original config...");
      const origFile = new Path('full', this.config.fileLocation);
      const origConfig: FlowJsonConfig = origFile.fetchJSON();
      const updatedConfig: FlowJsonConfig = {
        ...origConfig,
        flowLanguageCodeZone: language,
      };

      console.log("Creating temp config file...");
      const tempFile = new Path('data', 'temp.json');
      tempFile.remove();
      tempFile.overrideWithJSON(updatedConfig);

      console.log("Removing orig config file...");
      origFile.remove();

      console.log(`Trying to rename file ${tempFile.relativePath} over ${origFile.relativePath}`);
      renameSync({
        oldPath: tempFile.relativePath,
        newPath: origFile.relativePath,
      });

      return true;
    } catch(e) {
      console.log(e);

      return false;
    }
  }
}
