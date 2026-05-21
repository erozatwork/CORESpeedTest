module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "one_core",
    "hidden",
    "oc-filled",
    "oc-outline",
    "oc-duotone",
    "oc-solid",
    {
      pattern: /^apexcharts-.*$/,
    },
    {
      pattern: /^leaflet-.*$/,
    },
  ],
  darkMode: "class",
  theme: {
    extend: {
      base: {
        colors: {
          gray: {
            light: {
              100: "#F9F9F9",
              200: "#F1F1F4",
              300: "#DBDFE9",
              400: "#C4CADA",
              500: "#99A1B7",
              600: "#78829D",
              700: "#4B5675",
              800: "#252F4A",
              900: "#071437",
            },
            dark: {
              100: "#1B1C22",
              200: "#26272F",
              300: "#363843",
              400: "#464852",
              500: "#636674",
              600: "#808290",
              700: "#9A9CAE",
              800: "#B5B7C8",
              900: "#F5F5F5",
            },
          },

          contextual: {
            light: {
              red: {
                brand: {
                  default: "#FF6F1E",
                  active: "#F15700",
                  light: "#FFF5EF",
                  clarity: "rgba(255, 111, 30, 0.20)",
                  inverse: "#ffffff",
                },
                primary: {
                  default: "#ED1F24",
                  active: "#C91A1E",
                  light: "#FFECEC",
                  clarity: "rgba(237, 31, 36, 0.20)",
                  inverse: "#ffffff",
                },
                success: {
                  default: "#17C653",
                  active: "#04B440",
                  light: "#EAFFF1",
                  clarity: "rgba(23, 198, 83, 0.20)",
                  inverse: "#ffffff",
                },
                info: {
                  default: "#7239EA",
                  active: "#5014D0",
                  light: "#F8F5FF",
                  clarity: "rgba(114, 57, 234, 0.20)",
                  inverse: "#ffffff",
                },
                danger: {
                  default: "#ed1f24",
                  active: "#ed1f24",
                  light: "#f49494",
                  clarity: "rgba(228, 40, 85, 0.20)",
                  inverse: "#ffffff",
                },
                warning: {
                  default: "#F6B100",
                  active: "#DFA000",
                  light: "#FFF8DD",
                  clarity: "rgba(246, 177, 0, 0.20)",
                  inverse: "#ffffff",
                },
                dark: {
                  default: "#1E2129",
                  active: "#111318",
                  light: "#F9F9F9",
                  clarity: "rgba(30, 33, 41, 0.20)",
                  inverse: "#ffffff",
                },
                light: {
                  default: "#ffffff",
                  active: "#FCFCFC",
                  light: "#ffffff",
                  clarity: "rgba(255, 255, 255, 0.20)",
                  inverse: "#4B5675",
                },
                secondary: {
                  default: "#FDECEC",
                  active: "#FBDCDC",
                  light: "#FFF5F5",
                  clarity: "rgba(253, 236, 236, 0.20)",
                  inverse: "#F57D80",
                },
                gray: {
                  default: "#EDEDED",
                  active: "#DCDCDC",
                  light: "#F5F5F5",
                  clarity: "rgba(237, 237, 237, 0.20)",
                  inverse: "#7D7D7D",
                },
                darkblue: {
                  default: "#011C40",
                  active: "#011C40",
                  light: "#011C40",
                  clarity: "#011C40",
                  inverse: "#011C40",
                },
              },
              blue: {
                brand: {
                  default: "#FF6F1E",
                  active: "#F15700",
                  light: "#FFF5EF",
                  clarity: "rgba(255, 111, 30, 0.20)",
                  inverse: "#ffffff",
                },
                primary: {
                  default: "#1B84FF",
                  active: "#056EE9",
                  light: "#EFF6FF",
                  clarity: "rgba(27, 132, 255, 0.20)",
                  inverse: "#ffffff",
                },
                success: {
                  default: "#17C653",
                  active: "#04B440",
                  light: "#EAFFF1",
                  clarity: "rgba(23, 198, 83, 0.20)",
                  inverse: "#ffffff",
                },
                info: {
                  default: "#7239EA",
                  active: "#5014D0",
                  light: "#F8F5FF",
                  clarity: "rgba(114, 57, 234, 0.20)",
                  inverse: "#ffffff",
                },
                danger: {
                  default: "#ed1f24",
                  active: "#ed1f24",
                  light: "#f49494",
                  clarity: "rgba(228, 40, 85, 0.20)",
                  inverse: "#ffffff",
                },
                warning: {
                  default: "#F6B100",
                  active: "#DFA000",
                  light: "#FFF8DD",
                  clarity: "rgba(246, 177, 0, 0.20)",
                  inverse: "#ffffff",
                },
                dark: {
                  default: "#1E2129",
                  active: "#111318",
                  light: "#F9F9F9",
                  clarity: "rgba(30, 33, 41, 0.20)",
                  inverse: "#ffffff",
                },
                light: {
                  default: "#ffffff",
                  active: "#FCFCFC",
                  light: "#ffffff",
                  clarity: "rgba(255, 255, 255, 0.20)",
                  inverse: "#4B5675",
                },
                secondary: {
                  default: "#EAF3FF",
                  active: "#D6EBFF",
                  light: "#F5FAFF",
                  clarity: "rgba(234, 243, 255, 0.20)",
                  inverse: "#1B84FF",
                },
                gray: {
                  default: "#EDEDED",
                  active: "#DCDCDC",
                  light: "#F5F5F5",
                  clarity: "rgba(237, 237, 237, 0.20)",
                  inverse: "#7D7D7D",
                },
                darkblue: {
                  default: "#011C40",
                  active: "#011C40",
                  light: "#011C40",
                  clarity: "#011C40",
                  inverse: "#011C40",
                },
              },
              violet: {
                brand: {
                  default: "#FF6F1E",
                  active: "#F15700",
                  light: "#FFF5EF",
                  clarity: "rgba(255, 111, 30, 0.20)",
                  inverse: "#ffffff",
                },
                primary: {
                  default: "#7C3AED",
                  active: "#6D28D9",
                  light: "#F3E8FF",
                  clarity: "rgba(124, 58, 237, 0.20)",
                  inverse: "#ffffff",
                },
                success: {
                  default: "#17C653",
                  active: "#04B440",
                  light: "#EAFFF1",
                  clarity: "rgba(23, 198, 83, 0.20)",
                  inverse: "#ffffff",
                },
                info: {
                  default: "#7239EA",
                  active: "#5014D0",
                  light: "#F8F5FF",
                  clarity: "rgba(114, 57, 234, 0.20)",
                  inverse: "#ffffff",
                },
                danger: {
                  default: "#ed1f24",
                  active: "#ed1f24",
                  light: "#f49494",
                  clarity: "rgba(228, 40, 85, 0.20)",
                  inverse: "#ffffff",
                },
                warning: {
                  default: "#F6B100",
                  active: "#DFA000",
                  light: "#FFF8DD",
                  clarity: "rgba(246, 177, 0, 0.20)",
                  inverse: "#ffffff",
                },
                dark: {
                  default: "#1E2129",
                  active: "#111318",
                  light: "#F9F9F9",
                  clarity: "rgba(30, 33, 41, 0.20)",
                  inverse: "#ffffff",
                },
                light: {
                  default: "#ffffff",
                  active: "#FCFCFC",
                  light: "#ffffff",
                  clarity: "rgba(255, 255, 255, 0.20)",
                  inverse: "#4B5675",
                },
                secondary: {
                  default: "#F9F1FF",
                  active: "#E1C5FF",
                  light: "#FDF7FF",
                  clarity: "rgba(243, 232, 255, 0.10)",
                  inverse: "#B2A3FF",
                },
                gray: {
                  default: "#EDEDED",
                  active: "#DCDCDC",
                  light: "#F5F5F5",
                  clarity: "rgba(237, 237, 237, 0.20)",
                  inverse: "#7D7D7D",
                },
                darkblue: {
                  default: "#011C40",
                  active: "#011C40",
                  light: "#011C40",
                  clarity: "#011C40",
                  inverse: "#011C40",
                },
              },
            },
            dark: {
              red: {
                brand: {
                  default: "#D74E00",
                  active: "#F35700",
                  light: "#272320",
                  clarity: "rgba(215, 78, 0, 0.20)",
                  inverse: "#ffffff",
                },
                primary: {
                  default: "#ED1F24",
                  active: "#C91A1E",
                  light: "#FFECEC",
                  clarity: "rgba(237, 31, 36, 0.20)",
                  inverse: "#ffffff",
                },
                success: {
                  default: "#00A261",
                  active: "#01BF73",
                  light: "#1F2623",
                  clarity: "rgba(0, 162, 97, 0.20);",
                  inverse: "#ffffff",
                },
                info: {
                  default: "#883FFF",
                  active: "#9E63FF",
                  light: "#272134",
                  clarity: "rgba(136, 63, 255, 0.20)",
                  inverse: "#ffffff",
                },
                danger: {
                  default: "#ed1f24",
                  active: "#ed1f24",
                  light: "#f49494",
                  clarity: "rgba(228, 40, 85, 0.20)",
                  inverse: "#ffffff",
                },
                warning: {
                  default: "#C59A00",
                  active: "#D9AA00",
                  light: "#242320",
                  clarity: "rgba(197, 154, 0, 0.20)",
                  inverse: "#ffffff",
                },
                dark: {
                  default: "#272A34",
                  active: "#2D2F39",
                  light: "#1E2027",
                  clarity: "rgba(39, 42, 52, 0.20)",
                  inverse: "#ffffff",
                },
                light: {
                  default: "#1F212A",
                  active: "#1F212A",
                  light: "#1F212A",
                  clarity: "rgba(31, 33, 42, 0.20)",
                  inverse: "#9A9CAE",
                },
                secondary: {
                  default: "#F9F9F9",
                  active: "#F9F9F9",
                  light: "#F9F9F9",
                  clarity: "rgba(249, 249, 249, 0.20)",
                  inverse: "#4B5675",
                },
                gray: {
                  default: "#EDEDED",
                  active: "#DCDCDC",
                  light: "#F5F5F5",
                  clarity: "rgba(237, 237, 237, 0.20)",
                  inverse: "#7D7D7D",
                },
                darkblue: {
                  default: "#011C40",
                  active: "#011C40",
                  light: "#011C40",
                  clarity: "#011C40",
                  inverse: "#011C40",
                },
              },
              blue: {
                brand: {
                  default: "#FF6F1E",
                  active: "#F15700",
                  light: "#FFF5EF",
                  clarity: "rgba(255, 111, 30, 0.20)",
                  inverse: "#ffffff",
                },
                primary: {
                  default: "#1B84FF",
                  active: "#056EE9",
                  light: "#EFF6FF",
                  clarity: "rgba(27, 132, 255, 0.20)",
                  inverse: "#ffffff",
                },
                success: {
                  default: "#17C653",
                  active: "#04B440",
                  light: "#EAFFF1",
                  clarity: "rgba(23, 198, 83, 0.20)",
                  inverse: "#ffffff",
                },
                info: {
                  default: "#7239EA",
                  active: "#5014D0",
                  light: "#F8F5FF",
                  clarity: "rgba(114, 57, 234, 0.20)",
                  inverse: "#ffffff",
                },
                danger: {
                  default: "#ed1f24",
                  active: "#ed1f24",
                  light: "#f49494",
                  clarity: "rgba(228, 40, 85, 0.20)",
                  inverse: "#ffffff",
                },
                warning: {
                  default: "#F6B100",
                  active: "#DFA000",
                  light: "#FFF8DD",
                  clarity: "rgba(246, 177, 0, 0.20)",
                  inverse: "#ffffff",
                },
                dark: {
                  default: "#1E2129",
                  active: "#111318",
                  light: "#F9F9F9",
                  clarity: "rgba(30, 33, 41, 0.20)",
                  inverse: "#ffffff",
                },
                light: {
                  default: "#ffffff",
                  active: "#FCFCFC",
                  light: "#ffffff",
                  clarity: "rgba(255, 255, 255, 0.20)",
                  inverse: "#4B5675",
                },
                secondary: {
                  default: "#F9F9F9",
                  active: "#F9F9F9",
                  light: "#F9F9F9",
                  clarity: "rgba(249, 249, 249, 0.20)",
                  inverse: "#4B5675",
                },
                gray: {
                  default: "#EDEDED",
                  active: "#DCDCDC",
                  light: "#F5F5F5",
                  clarity: "rgba(237, 237, 237, 0.20)",
                  inverse: "#7D7D7D",
                },
                darkblue: {
                  default: "#011C40",
                  active: "#011C40",
                  light: "#011C40",
                  clarity: "#011C40",
                  inverse: "#011C40",
                },
              },
              violet: {
                brand: {
                  default: "#FF6F1E",
                  active: "#F15700",
                  light: "#FFF5EF",
                  clarity: "rgba(255, 111, 30, 0.20)",
                  inverse: "#ffffff",
                },
                primary: {
                  default: "#7C3AED",
                  active: "#6D28D9",
                  light: "#F3E8FF",
                  clarity: "rgba(124, 58, 237, 0.20)",
                  inverse: "#ffffff",
                },
                success: {
                  default: "#17C653",
                  active: "#04B440",
                  light: "#EAFFF1",
                  clarity: "rgba(23, 198, 83, 0.20)",
                  inverse: "#ffffff",
                },
                info: {
                  default: "#7239EA",
                  active: "#5014D0",
                  light: "#F8F5FF",
                  clarity: "rgba(114, 57, 234, 0.20)",
                  inverse: "#ffffff",
                },
                danger: {
                  default: "#ed1f24",
                  active: "#ed1f24",
                  light: "#f49494",
                  clarity: "rgba(228, 40, 85, 0.20)",
                  inverse: "#ffffff",
                },
                warning: {
                  default: "#F6B100",
                  active: "#DFA000",
                  light: "#FFF8DD",
                  clarity: "rgba(246, 177, 0, 0.20)",
                  inverse: "#ffffff",
                },
                dark: {
                  default: "#1E2129",
                  active: "#111318",
                  light: "#F9F9F9",
                  clarity: "rgba(30, 33, 41, 0.20)",
                  inverse: "#ffffff",
                },
                light: {
                  default: "#ffffff",
                  active: "#FCFCFC",
                  light: "#ffffff",
                  clarity: "rgba(255, 255, 255, 0.20)",
                  inverse: "#4B5675",
                },
                secondary: {
                  default: "#F9F9F9",
                  active: "#F9F9F9",
                  light: "#F9F9F9",
                  clarity: "rgba(249, 249, 249, 0.20)",
                  inverse: "#4B5675",
                },
                gray: {
                  default: "#EDEDED",
                  active: "#DCDCDC",
                  light: "#F5F5F5",
                  clarity: "rgba(237, 237, 237, 0.20)",
                  inverse: "#7D7D7D",
                },
                darkblue: {
                  default: "#011C40",
                  active: "#011C40",
                  light: "#011C40",
                  clarity: "#011C40",
                  inverse: "#011C40",
                },
              },
            },
          },
        },
        boxShadows: {
          light: {
            default: "0px 4px 12px 0px rgba(0, 0, 0, 0.09)",
            light: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
            primary: "0px 4px 12px 0px rgba(40, 132, 239, 0.35)",
            success: "0px 4px 12px 0px rgba(53, 189, 100, 0.35)",
            danger: "0px 4px 12px 0px rgba(241, 65, 108, 0.35)",
            info: "0px 4px 12px 0px rgba(114, 57, 234, 0.35)",
            warning: "0px 4px 12px 0px rgba(246, 192, 0, 0.35)",
            dark: "0px 4px 12px 0px rgba(37, 47, 74, 0.35)",
          },
          dark: {
            default: "none",
            light: "none",
            primary: "none",
            success: "none",
            danger: "none",
            info: "none",
            warning: "none",
            dark: "none",
          },
        },
      },
      fontFamily: {
        sans: ["Albert Sans", "system-ui", "sans-serif"],
      },
      colors: {
        //begin: Shadcn UI Colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--darkblue))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        //end
        gray: {
          100: "var(--tw-gray-100)",
          200: "var(--tw-gray-200)",
          300: "var(--tw-gray-300)",
          400: "var(--tw-gray-400)",
          500: "var(--tw-gray-500)",
          600: "var(--tw-gray-600)",
          700: "var(--tw-gray-700)",
          800: "var(--tw-gray-800)",
          900: "var(--tw-gray-900)",
        },
        primary: {
          DEFAULT: "var(--tw-primary)",
          active: "var(--tw-primary-active)",
          light: "var(--tw-primary-light)",
          clarity: "var(--tw-primary-clarity)",
          inverse: "var(--tw-primary-inverse)",
          foreground: "hsl(var(--primary-foreground))",
        },
        success: {
          DEFAULT: "var(--tw-success)",
          active: "var(--tw-success-active)",
          light: "var(--tw-success-light)",
          clarity: "var(--tw-success-clarity)",
          inverse: "var(--tw-success-inverse)",
        },
        warning: {
          DEFAULT: "var(--tw-warning)",
          active: "var(--tw-warning-active)",
          light: "var(--tw-warning-light)",
          clarity: "var(--tw-warning-clarity)",
          inverse: "var(--tw-warning-inverse)",
        },
        danger: {
          DEFAULT: "var(--tw-danger)",
          active: "var(--tw-danger-active)",
          light: "var(--tw-danger-light)",
          clarity: "var(--tw-danger-clarity)",
          inverse: "var(--tw-danger-inverse)",
        },
        info: {
          DEFAULT: "var(--tw-info)",
          active: "var(--tw-info-active)",
          light: "var(--tw-info-light)",
          clarity: "var(--tw-info-clarity)",
          inverse: "var(--tw-info-inverse)",
        },
        dark: {
          DEFAULT: "var(--tw-dark)",
          active: "var(--tw-dark-active)",
          light: "var(--tw-dark-light)",
          clarity: "var(--tw-dark-clarity)",
          inverse: "var(--tw-dark-inverse)",
        },
        secondary: {
          DEFAULT: "var(--tw-secondary)",
          active: "var(--tw-secondary-active)",
          light: "var(--tw-secondary-light)",
          clarity: "var(--tw-secondary-clarity)",
          inverse: "var(--tw-secondary-inverse)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        light: {
          DEFAULT: "var(--tw-light)",
          active: "var(--tw-light-active)",
          light: "var(--tw-light-light)",
          clarity: "var(--tw-light-clarity)",
          inverse: "var(--tw-light-inverse)",
        },
        brand: {
          DEFAULT: "var(--tw-brand)",
          active: "var(--tw-brand-active)",
          light: "var(--tw-brand-light)",
          clarity: "var(--tw-brand-clarity)",
          inverse: "var(--tw-brand-inverse)",
        },
        smoke: {
          DEFAULT: "var(--tw-gray)",
          active: "var(--tw-gray-active)",
          light: "var(--tw-gray-light)",
          clarity: "var(--tw-gray-clarity)",
          inverse: "var(--tw-gray-inverse)",
        },
        initial: {
          DEFAULT: "var(--tw-darkblue)",
          active: "var(--tw-darkblue-active)",
          light: "var(--tw-darkblue-light)",
          clarity: "var(--tw-darkblue-clarity)",
          inverse: "var(--tw-darkblue-inverse)",
        },
        coal: {
          100: "#15171C",
          200: "#13141A",
          300: "#111217",
          400: "#0F1014",
          500: "#0D0E12",
          600: "#0B0C10",
          black: "#000000",
          clarity: "rgba(24, 25, 31, 0.50)",
        },
        themeColorDarkMode: {
          button: "#919EAB29",
          card: "#1C252E",
          page: "#141A21",
          menu: "#1C252E",
        },
      },
      boxShadow: {
        card: "var(--tw-card-box-shadow)",
        default: "var(--tw-default-box-shadow)",
        light: "var(--tw-light-box-shadow)",
        primary: "var(--tw-primary-box-shadow)",
        success: "var(--tw-success-box-shadow)",
        danger: "var(--tw-danger-box-shadow)",
        info: "var(--tw-info-box-shadow)",
        warning: "var(--tw-warning-box-shadow)",
        dark: "var(--tw-dark-box-shadow)",
      },
      fontSize: {
        "4xs": [
          "0.5625rem", // 9px
          {
            lineHeight: "0.6875rem", // 11px
          },
        ],
        "3xs": [
          "0.625rem", // 10px
          {
            lineHeight: "0.75rem", // 12px
          },
        ],
        "2xs": [
          "0.6875rem", // 11px
          {
            lineHeight: "0.75rem", // 12px
          },
        ],
        "2sm": [
          "0.8125rem", // 13px
          {
            lineHeight: "1.125rem", // 18px
          },
        ],
        md: [
          "0.9375rem", // 15px
          {
            lineHeight: "1.375rem", // 22px
          },
        ],
        "1.5xl": [
          "1.375rem", // 22px
          {
            lineHeight: "1.8125rem", // 29px
          },
        ],
        "2.5xl": [
          "1.625rem", // 26px
          {
            lineHeight: "2.125rem", // 34px
          },
        ],
      },
      lineHeight: {
        0: "0", // 0px
        5.5: "1.375rem", // 22px
      },
      zIndex: {
        1: "1",
        5: "5",
        15: "15",
        25: "25",
      },
      borderWidth: {
        3: "3px",
      },
      spacing: {
        0.75: "0.1875rem", // 3px
        1.25: "0.3rem", // 5px
        1.75: "0.4375rem", // 7px
        2.25: "0.563rem", // 9px
        2.75: "0.688rem", // 11px
        4.5: "1.125rem", // 18px
        5.5: "1.375rem", // 22px
        6.5: "1.625rem", // 26px
        7.5: "1.875rem", // 30px
        12.5: "3.125rem", // 40px
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      //begin: Shadcn UI Animations
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "collapsible-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-collapsible-content-height)",
          },
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)",
          },
          to: {
            height: "o",
          },
        },
        // Shake
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        shakeWithDelay: {
          "0%": { transform: "translateX(0)" },
          "2%": { transform: "translateX(-4px)" },
          "4%": { transform: "translateX(4px)" },
          "6%": { transform: "translateX(-4px)" },
          "8%": { transform: "translateX(4px)" },
          "10%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(0)" },
        },
        // Rotate
        "rotate-clockwise": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        // Shake
        shake: "shake 0.5s ease-in-out",
        "shake-with-delay": "shakeWithDelay 3.5s ease-in-out infinite",
        // Rotate
        "rotate-clockwise": "rotate-clockwise 3s linear infinite",
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: theme("fontSize.4xl")[0],
              fontWeight: "700",
              color: theme("colors.zinc.900"),
            },
            h2: {
              fontSize: theme("fontSize.3xl")[0],
              fontWeight: "600",
              color: theme("colors.zinc.800"),
            },
            h3: {
              fontSize: theme("fontSize.2xl")[0],
              fontWeight: "600",
              color: theme("colors.zinc.700"),
            },
            h4: {
              fontSize: theme("fontSize.xl")[0],
              fontWeight: "500",
              color: theme("colors.zinc.700"),
            },
            h5: {
              fontSize: theme("fontSize.lg")[0],
              fontWeight: "500",
              color: theme("colors.zinc.600"),
            },
            h6: {
              fontSize: theme("fontSize.base")[0],
              fontWeight: "600",
              color: theme("colors.blue.600"),
            },
          },
        },
        dark: {
          css: {
            h1: { color: theme("colors.zinc.100") },
            h2: { color: theme("colors.zinc.200") },
            h3: { color: theme("colors.zinc.300") },
            h4: { color: theme("colors.zinc.300") },
            h5: { color: theme("colors.zinc.400") },
            h6: { color: theme("colors.zinc.400") },
          },
        },
      }),
      //end
    },
    custom: ({ theme }) => ({
      components: {
        common: {
          backgrounds: {
            light: {
              card: "white",
              tooltip: theme("colors.coal")["400"],
              popover: "white",
              modal: "white",
              drawer: "white",
              dropdown: "white",
              backdrop: "rgba(0, 0, 0, 0.80)",
              tableHead: "var(--tw-light-active)",
              subcard: "rgba(246, 246, 249, 1)",
            },
            dark: {
              card: theme("colors.coal")["300"],
              tooltip: theme("colors.coal")["600"],
              popover: theme("colors.coal")["600"],
              modal: theme("colors.coal")["600"],
              drawer: theme("colors.coal")["600"],
              dropdown: theme("colors.coal")["600"],
              backdrop: "rgba(0, 0, 0, 0.80)",
              tableHead: theme("colors.coal")["200"],
            },
          },
          borders: {
            light: {
              card: "1px solid var(--tw-gray-300)",
              table: "1px solid var(--tw-gray-200)",
              dropdown: "1px solid var(--tw-gray-200)",
              popover: "1px solid var(--tw-gray-200)",
              tooltip: "0",
            },
            dark: {
              card: `1px solid ${theme("base.colors.gray.dark")["100"]}`,
              table: `1px solid ${theme("base.colors.gray.dark")["100"]}`,
              dropdown: `1px solid ${theme("base.colors.gray.dark")["100"]}`,
              tooltip: `1px solid ${theme("base.colors.gray.dark")["100"]}`,
              popover: `1px solid ${theme("base.colors.gray.dark")["100"]}`,
            },
          },
          boxShadows: {
            light: {
              card: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              tooltip: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              popover: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              modal: "0px 10px 14px 0px rgba(15, 42, 81, 0.03)",
              drawer: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              dropdown: "0px 7px 18px 0px rgba(0, 0, 0, 0.09)",
              input: "0px 0px 10px 0px rgba(0, 0, 0, 0.10)",
            },
            dark: {
              card: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              tooltip: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              popover: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              modal: "0px 10px 14px 0px rgba(15, 42, 81, 0.03)",
              drawer: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)",
              dropdown: "0px 7px 18px 0px rgba(0, 0, 0, 0.09)",
              input: "0px 0px 10px 0px rgba(0, 0, 0, 0.10)",
            },
          },
          borderRadius: {
            btn: theme("borderRadius.md"),
            progress: theme("borderRadius.lg"),
            dropdown: theme("borderRadius.xl"),
            badge: theme("borderRadius.DEFAULT"),
            card: theme("borderRadius.xl"),
            tooltip: theme("borderRadius.lg"),
            popover: theme("borderRadius.lg"),
            modal: theme("borderRadius.xl"),
          },
        },
        container: {
          fixed: {
            px: {
              DEFAULT: theme("spacing")["6"],
              xl: theme("spacing")["7.5"],
            },
            "max-width": theme("screens.xl"),
          },
          fluid: {
            px: {
              DEFAULT: theme("spacing")["6"],
              xl: theme("spacing")["7.5"],
            },
          },
        },
        btn: {
          xs: {
            height: "1.75rem",
            px: "0.5rem",
            py: "0.35rem",
            gap: "0.25rem",
            fontSize: theme("fontSize.2xs")[0],
            fontWeight: "500",
            iconFontSize: "0.75rem",
            onlyIconFontSize: "1rem",
          },
          sm: {
            height: "2rem",
            px: "0.75rem",
            py: "0.45rem",
            gap: "0.275rem",
            fontSize: theme("fontSize.xs")[0],
            fontWeight: "500",
            iconFontSize: "0.875rem",
            onlyIconFontSize: "1.125rem",
            tabsGap: "0.188rem",
          },
          DEFAULT: {
            height: "2.5rem",
            px: "1rem",
            py: "0.55rem",
            gap: "0.375rem",
            fontSize: theme("fontSize.2sm")[0],
            fontWeight: "500",
            iconFontSize: "1.125rem",
            onlyIconFontSize: "1.5rem",
            tabsGap: "0.25rem",
          },
          lg: {
            height: "3rem",
            px: "1.25rem",
            py: "0.75rem",
            gap: "0.5rem",
            fontSize: theme("fontSize.sm")[0],
            fontWeight: "500",
            iconFontSize: "1.25rem",
            onlyIconFontSize: "1.75rem",
            tabsGap: "0.313rem",
          },
        },
        input: {
          sm: {
            px: "0.625rem",
          },
          DEFAULT: {
            px: "0.75rem",
          },
          lg: {
            gap: "0.875rem",
          },
        },
        checkbox: {
          sm: {
            size: "1.125rem",
            borderRadius: "0.25rem",
          },
          DEFAULT: {
            size: "1.375rem",
            borderRadius: "0.375rem",
          },
          lg: {
            size: "1.625rem",
            borderRadius: "0.5rem",
          },
        },
        radio: {
          sm: {
            size: "1.125rem",
          },
          DEFAULT: {
            size: "1.375rem",
          },
          lg: {
            size: "1.625rem",
          },
        },
        switch: {
          sm: {
            height: "1.125rem",
            width: "1.875rem",
          },
          DEFAULT: {
            height: "1.375rem",
            width: "2.125rem",
          },
          lg: {
            height: "1.625rem",
            width: "2.375rem",
          },
        },
        card: {
          px: theme("spacing")["7.5"],
          py: {
            header: theme("spacing.3"),
            body: theme("spacing.5"),
            footer: theme("spacing.3"),
            group: theme("spacing.3"),
          },
          grid: {
            px: theme("spacing.5"),
          },
        },
        table: {
          px: {
            xs: "0.5rem",
            sm: "0.75rem",
            DEFAULT: "1rem",
            lg: "1.25rem",
          },
          py: {
            xs: {
              head: "0.225rem",
              body: "0.35rem",
            },
            sm: {
              head: "0.425rem",
              body: "0.5rem",
            },
            DEFAULT: {
              head: "0.625rem",
              body: "0.75rem",
            },
            lg: {
              head: "0.825rem",
              body: "0.95rem",
            },
          },
        },
      },
      layouts: {
        one_core: {
          sidebar: {
            width: {
              desktop: "280px",
              desktopCollapse: "80px",
              mobile: "280px",
            },
          },
          header: {
            height: {
              desktop: "70px",
              mobile: "60px",
            },
          },
        },
      },
    }),
  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("./src/shared/plugins/plugin"),
    require("./src/shared/plugins/components/theme"),
    require("./src/shared/plugins/components/breakpoints"),
    require("./src/shared/plugins/components/typography"),
    require("./src/shared/plugins/components/menu"),
    require("./src/shared/plugins/components/dropdown"),
    require("./src/shared/plugins/components/accordion"),
    require("./src/shared/plugins/components/input"),
    require("./src/shared/plugins/components/input-group"),
    require("./src/shared/plugins/components/select"),
    require("./src/shared/plugins/components/textarea"),
    require("./src/shared/plugins/components/file-input"),
    require("./src/shared/plugins/components/switch"),
    require("./src/shared/plugins/components/checkbox"),
    require("./src/shared/plugins/components/radio"),
    require("./src/shared/plugins/components/range"),
    require("./src/shared/plugins/components/container"),
    require("./src/shared/plugins/components/image-input"),
    require("./src/shared/plugins/components/modal"),
    require("./src/shared/plugins/components/drawer"),
    require("./src/shared/plugins/components/tooltip"),
    require("./src/shared/plugins/components/popover"),
    require("./src/shared/plugins/components/btn"),
    require("./src/shared/plugins/components/btn-group"),
    require("./src/shared/plugins/components/tabs"),
    require("./src/shared/plugins/components/pagination"),
    require("./src/shared/plugins/components/card"),
    require("./src/shared/plugins/components/subcard"),
    require("./src/shared/plugins/components/table"),
    require("./src/shared/plugins/components/badge"),
    require("./src/shared/plugins/components/rating"),
    require("./src/shared/plugins/components/scrollable"),
    require("./src/shared/plugins/components/progress"),
    require("./src/shared/plugins/components/apexcharts"),
    require("./src/shared/plugins/components/leaflet"),
  ],
};
