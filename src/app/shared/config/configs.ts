import { mergeDeep } from '../utils/merge-deep';
import { VexConfigName } from './config-name.model';
import { VexConfig } from './vex-config.interface';
import { ColorSchemeName } from './colorSchemeName';
import { colorVariables } from '../components/config-panel/color-variables';

const defaultConfig: VexConfig = {
  id: VexConfigName.apollo,
  name: 'Apollo',
  style: {
    colorScheme: ColorSchemeName.default,
    colors: {
      primary: colorVariables.azul
    },
    borderRadius: {
      value: 0.25,
      unit: 'rem'
    },
    button: {
      borderRadius: undefined
    }
  },
  direction: 'ltr',
  imgSrc: '//vex-landing.visurel.com/assets/img/layouts/apollo.png',
  layout: 'horizontal',
  boxed: false,
  sidenav: {
    title: 'Panel',
    imageUrl: 'assets/img/logo/logo-cm-sort.ico',
    showCollapsePin: true,
    user: {
      visible: true
    },
    search: {
      visible: true
    },
    state: 'expanded'
  },
  toolbar: {
    fixed: true,
    user: {
      visible: true
    }
  },
  navbar: {
    position: 'below-toolbar'
  },
  footer: {
    visible: true,
    fixed: true
  }
};

export const configs: VexConfig[] = [
  defaultConfig,
  mergeDeep({ ...defaultConfig }, {
    id: VexConfigName.poseidon,
    name: 'Poseidon',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/poseidon.png',
    style: {
      borderRadius: {
        value: 0.5,
        unit: 'rem'
      },
      button: {
        borderRadius: {
          value: 9999,
          unit: 'px'
        }
      }
    },
    sidenav: {
      user: {
        visible: true
      },
      search: {
        visible: true
      }
    },
    toolbar: {
      user: {
        visible: false
      }
    },
    footer: {
      fixed: false
    }
  }), mergeDeep({ ...defaultConfig }, {
    id: VexConfigName.ares,
    name: 'Ares',
    imgSrc: '//vex-landing.visurel.com/assets/img/layouts/ares.png',
    sidenav: {
      user: {
        visible: false
      },
      search: {
        visible: false
      },
    },
    toolbar: {
      fixed: false
    },
    navbar: {
      position: 'in-toolbar'
    },
    footer: {
      fixed: false
    },
  })
];
