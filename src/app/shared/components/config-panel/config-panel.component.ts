import { Component, Inject } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { map } from 'rxjs/operators';
import { LayoutService } from '../../services/layout.service';
import { VexConfigName } from '../../config/config-name.model';
import { ColorVariable, colorVariables } from './color-variables';
import { DOCUMENT } from '@angular/common';
import { ColorSchemeName } from '../../config/colorSchemeName';
import { Observable } from 'rxjs';
import { VexConfig } from '../../config/vex-config.interface';

@Component({
  selector: 'vex-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent {

  configs: VexConfig[] = this.configService.configs;
  colorVariables: Record<string, ColorVariable> = colorVariables;

  config$: Observable<VexConfig> = this.configService.config$;

  isDark$: Observable<boolean> = this.config$.pipe(
    map(config => config.style.colorScheme === ColorSchemeName.dark)
  );

  ColorSchemeName = ColorSchemeName;
  selectedColor = (this.configService.templateConfig)
    ? this.configService.templateConfig.style.colors.primary
    : colorVariables.azul;

  constructor(private configService: ConfigService,
              private layoutService: LayoutService,
              @Inject(DOCUMENT) private document: Document) { }

  setConfig(layout: VexConfigName, colorScheme: ColorSchemeName): void {
    this.configService.setConfig(layout);
    this.configService.updateConfig({
      style: {
        colorScheme
      }
    });
    this.selectColor(colorVariables.azul);
  }

  selectColor(color: ColorVariable): void {
    this.selectedColor = color;
    this.configService.updateConfig({
      style: {
        colors: {
          primary: {
            default: color.default,
            contrast: color.contrast
          }
        }
      }
    });
  }

  isSelectedColor(color: ColorVariable): boolean {
    return (this.selectedColor.default === color.default && this.selectedColor.contrast === color.contrast);
  }

  enableDarkMode(): void {
    this.configService.updateConfig({
      style: {
        colorScheme: ColorSchemeName.dark
      }
    });
  }

  disableDarkMode(): void {
    this.configService.updateConfig({
      style: {
        colorScheme: ColorSchemeName.default
      }
    });
  }
}
