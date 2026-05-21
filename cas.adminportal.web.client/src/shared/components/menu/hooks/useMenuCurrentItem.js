import {
    matchPath,
    useLocation
} from 'react-router-dom';

const useMenuCurrentItem = (items) => {
    const { pathname, search } = useLocation();

    const findCurrentItem = (items) => {
        if (!items) return null;

        // Try to find an exact match including query params
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.children) {
                const childItem = findCurrentItem(item.children);
                if (childItem) {
                    return childItem;
                }
            }

            if (item.path) {
                const [basePath, queryString] = item.path.split('?');
                const isPathMatch = matchPath({ path: basePath, end: true }, pathname) ||
                    matchPath({ path: basePath, end: false }, pathname);

                if (isPathMatch) {
                    const itemParams = new URLSearchParams(queryString || '');
                    const currentParams = new URLSearchParams(search);

                    if (itemParams.has('v')) {
                        if (currentParams.get('v') === itemParams.get('v')) {
                            return item;
                        }
                    } else if (!currentParams.has('v')) {
                        return item;
                    }
                }
            }
        }
        return null;
    };
    return findCurrentItem(items);
};

export {
    useMenuCurrentItem
};