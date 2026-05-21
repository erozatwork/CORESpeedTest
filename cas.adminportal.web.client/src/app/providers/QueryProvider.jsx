import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
	MutationCache,
} from "react-query";

import { persistQueryClient } from "@tanstack/react-query-persist-client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const QueryProvider = ({ children }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000,
				cacheTime: 5 * 60 * 1000,
			},
		},
		queryCache: new QueryCache({
			onError: (error) => {
				console.error(JSON.stringify(error));
			},
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				console.error(JSON.stringify(error));
			},
		}),
	});

	const localStoragePersister = createSyncStoragePersister({
		storage: window.localStorage,
	});

	persistQueryClient({
		queryClient,
		persister: localStoragePersister,
		maxAge: 5 * 60 * 1000,
	});

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export { QueryProvider };

// import {
//     QueryCache,
//     QueryClient,
//     QueryClientProvider,
//     MutationCache,
// } from "react-query";

// const QueryProvider = ({ children }) => {
//     const queryClient = new QueryClient({
//         defaultOptions: {
//             queries: {
//                 staleTime: 60 * 1000,
//             },
//         },
//         queryCache: new QueryCache({
//             onError: (error) => {
//                 console.error(JSON.stringify(error));
//             },
//         }),
//         mutationCache: new MutationCache({
//             onError: (error) => {
//                 console.error(JSON.stringify(error));
//             },
//         }),
//     });

//     return (
//         <QueryClientProvider client={queryClient}>
//             {children}
//         </QueryClientProvider>
//     );
// };

// export { QueryProvider };
