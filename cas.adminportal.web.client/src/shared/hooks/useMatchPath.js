import { matchPath, useLocation } from 'react-router-dom';

const useMatchPath = (path, mode = 'default') => {
    const { pathname, search } = useLocation();

    let match = false;
    const pathStr = path || '';
    const [basePath, queryString] = pathStr.split('?');
    
    if (mode === 'default' && matchPath({ path: basePath, end: true }, pathname)) {
        match = true;
    } else if (mode === 'full' && matchPath({ path: basePath, end: false }, pathname)) {
        match = true;
    }

    if (match) {
        const itemParams = new URLSearchParams(queryString || '');
        const currentParams = new URLSearchParams(search);

        if (itemParams.has('v')) {
            if (currentParams.get('v') !== itemParams.get('v')) {
                match = false;
            }
        } else {
            if (currentParams.has('v')) {
                match = false;
            }
        }
    }

    return {
        match,
        isExternal: pathStr.startsWith('http') || pathStr.startsWith('//')
    };
};

export { useMatchPath };