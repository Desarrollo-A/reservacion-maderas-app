import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigService } from './shared/config/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from './shared/services/navigation.service';
import { LayoutService } from './shared/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { VexConfigName } from './shared/config/config-name.model';
import { ColorSchemeName } from './shared/config/colorSchemeName';
import { MatIconRegistry, SafeResourceUrlWithIconOptions } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ColorVariable, colorVariables } from './shared/components/config-panel/color-variables';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private configService: ConfigService,
              private renderer: Renderer2,
              private platform: Platform,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) private localeId: string,
              private layoutService: LayoutService,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
              private readonly matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.matIconRegistry.addSvgIconResolver(
      (
        name: string,
        namespace: string
      ): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
        switch (namespace) {
          case 'mat':
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/material-design-icons/two-tone/${name}.svg`
            );

          case 'logo':
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/logos/${name}.svg`
            );
        }
      }
    );

    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap.subscribe(queryParamMap => {
      if (queryParamMap.has('layout')) {
        this.configService.setConfig(queryParamMap.get('layout') as VexConfigName);
      }

      if (queryParamMap.has('style')) {
        this.configService.updateConfig({
          style: {
            colorScheme: queryParamMap.get('style') as ColorSchemeName
          }
        });
      }

      if (queryParamMap.has('primaryColor')) {
        const color: ColorVariable = colorVariables[queryParamMap.get('primaryColor')];

        if (color) {
          this.configService.updateConfig({
            style: {
              colors: {
                primary: color
              }
            }
          });
        }
      }

      if (queryParamMap.has('rtl')) {
        this.configService.updateConfig({
          direction: coerceBooleanProperty(queryParamMap.get('rtl')) ? 'rtl' : 'ltr'
        });
      }
    });

    /**
     * Add your own routes here
     */
    this.navigationService.items = [
      {
        type: 'subheading',
        label: 'Principal',
        children: [
          {
            type: 'link',
            label: 'Home',
            route: '/dashboard/inicio',
            icon: 'mat:roofing',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Aplicaciones',
        children: [
          {
            type: 'dropdown',
            label: 'Reservaciones',
            icon: 'mat:content_paste',
            children: [
              {
                type: 'link',
                label: 'Sala de Juntas',
                route: '/dashboard/solicitud/sala'
              },
              {
                type: 'link',
                label: 'Automóvil',
                route: '/dashboard/solicitud/auto'
              },
              {
                type: 'link',
                label: 'Conductor',
                route: '/dashboard/solicitud/conductor'
              }
            ]
          },
          {
            type: 'link',
            label: 'Calendario',
            route: '/dashboard/calendario',
            icon: 'mat:date_range',
            badge: {
              value: '12',
              bgClass: 'bg-deep-purple',
              textClass: 'text-deep-purple-contrast',
            },
          },
          {
            type: 'link',
            label: 'Inventario',
            route: '/dashboard/inventario',
            icon: 'mat:inventory_2'
          },
          {
            type: 'link',
            label: 'Reportes',
            route: '/dashboard/reporte',
            icon: 'mat:auto_graph'
          },
          {
            type: 'dropdown',
            label: 'Historial',
            icon: 'mat:manage_search',
            children: [
              {
                type: 'link',
                label: 'Sala de Juntas',
                route: '/dashboard/historial/sala'
              },
              {
                type: 'link',
                label: 'Automóvil',
                route: '/dashboard/historial/auto'
              },
              {
                type: 'link',
                label: 'Conductor',
                route: '/dashboard/historial/conductor'
              }
            ]
          }
        ]
      }
    ];
  }
}
