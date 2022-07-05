export interface ColorVariable {
  light: string;
  default: string;
  contrast: string;
}

export const colorVariables: Record<string, ColorVariable> = {
  azul: {
    light: 'rgba(99, 102, 241, .1)',
    default: 'rgb(99, 102, 241)',
    contrast: 'rgb(255, 255, 255)'
  },
  naranja: {
    light: 'rgba(255, 152, 0, 0.1)',
    default: 'rgb(255, 152, 0)',
    contrast: 'rgb(0, 0, 0)',
  },
  'naranja-oscuro': {
    light: 'rgba(255, 87, 34, 0.1)',
    default: 'rgb(255, 87, 34)',
    contrast: 'rgb(255, 255, 255)'
  },
  'ámbar': {
    light: 'rgba(255, 193, 7, 0.1)',
    default: 'rgb(255, 193, 7)',
    contrast: 'rgb(0, 0, 0)'
  },
  verde: {
    light: 'rgba(76, 175, 80, 0.1)',
    default: 'rgb(76, 175, 80)',
    contrast: 'rgb(255, 255, 255)',
  },
  'verde-azulado': {
    light: 'rgba(0, 150, 136, 0.1)',
    default: 'rgb(0, 150, 136)',
    contrast: 'rgb(255, 255, 255)'
  },
  cian: {
    light: 'rgba(0, 188, 212, 0.1)',
    default: 'rgb(0, 188, 212)',
    contrast: 'rgb(255, 255, 255)'
  },
  'morado-oscuro': {
    light: 'rgba(103, 58, 183, 0.1)',
    default: 'rgb(103, 58, 183)',
    contrast: 'rgb(255, 255, 255)'
  },
  rosa: {
    light: 'rgba(233, 30, 99, 0.1)',
    default: 'rgb(233, 30, 99)',
    contrast: 'rgb(255, 255, 255)'
  },
};
