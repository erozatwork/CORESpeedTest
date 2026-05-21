import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [{
        ignores: ['dist']
    },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true
                },
                sourceType: 'module',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
           ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/display-name': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off',
            'no-dupe-keys': 'off',
            'react/prop-types': 'off',
            'react/jsx-no-target-blank': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react-refresh/only-export-components': 'off',
            'no-unsafe-optional-chaining': 'off',
        },
    },
]