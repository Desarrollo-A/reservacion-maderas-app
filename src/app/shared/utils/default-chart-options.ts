import { ApexOptions } from '../components/chart/chart.component';
import { mergeDeep } from './merge-deep';

export const defaultChartOptions = (options: Partial<ApexOptions> = {}): ApexOptions => mergeDeep({
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0
    }
  },
  chart: {
    parentHeightOffset: 0,
    type: 'area',
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: true
    },
    defaultLocale: 'es',
    locales: [{
      name: 'es',
      options: {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        shortDays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        toolbar: {
          download: 'Descargar SVG',
          selection: 'Selección',
          selectionZoom: 'Selección zoom',
          zoomIn: 'Acercarse',
          zoomOut: 'Alejarse',
          pan: 'Panorámica',
          reset: 'Reestablecer zoom',
        }
      }
    }]
  },
  labels: [],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2.5
  },
  fill: {
    gradient: {}
  },
  xaxis: {
    type: 'numeric',
    labels: {
      show: false,
      style: {
        cssClass: 'text-secondary fill-current caption font-medium',
        fontFamily: 'inherit'
      }
    },
    axisBorder: {
      show: true,
      color: '#EEEEEE'
    },
    axisTicks: {
      show: false
    },
    floating: false,
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
      style: {
        cssClass: 'text-secondary fill-current caption font-medium',
        fontFamily: 'inherit'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
  },
  legend: {
    position: 'top',
    fontFamily: 'inherit',
    horizontalAlign: 'left',
    offsetX: -18,
    itemMargin: {
      horizontal: 0,
      vertical: 12
    },
    markers: {
      radius: 4,
      width: 12,
      height: 12
    },
    labels: {
      colors: ['var(--text-secondary-color)']
    }
  },
  tooltip: {
    x: { show: false }
  },
}, options);
