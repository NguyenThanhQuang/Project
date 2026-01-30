// src/types/mui.d.ts
import '@mui/types';

declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Add any custom HTML attributes here if needed
    }
  }
}

declare module '@mui/material/Grid' {
  interface GridProps {
    size?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
    columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  }
}

// Extend other MUI components if needed
declare module '@mui/material/Container' {
  interface ContainerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  }
}

declare module '@mui/material/Box' {
  interface BoxProps {
    component?: React.ElementType;
  }
}