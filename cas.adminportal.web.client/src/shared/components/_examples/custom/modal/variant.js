import { cva } from "class-variance-authority";

export const modalVariant = cva('modal-content modal-center w-full p-4 py-6', {
  variants: {
    maxWidth: {
        xs: "max-w-[425px]",
        sm: 'max-w-[600px]',
        md: 'max-w-[900px]',
        lg: 'max-w-[1200px]',
    },    
  },
  defaultVariants: {
    variant: 'default'
  }
});