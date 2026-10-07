import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@/types/product';
import { ProductFormData } from '@/schemas/product';

export const productsApiSlice = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
    tagTypes: ['Product'], // Used for automatic cache invalidation
    endpoints: (builder) => ({

        // Fetch all products
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
            providesTags: ['Product'],
        }),

        // Add a new product
        addProduct: builder.mutation<Product, ProductFormData>({
            query: (newProduct) => ({
                url: '/products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Product'], // Instantly refreshes the table after save
        }),

        // Quick Action: Toggle Ecommerce Status (Optimistic Update)
        toggleEcommerce: builder.mutation<Product, { id: string; ecommerce: boolean }>({
            query: ({ id, ecommerce }) => ({
                url: `/products/${id}/ecommerce`,
                method: 'PATCH',
                body: { ecommerce },
            }),
            // Optimistic update: UI changes instantly before server responds
            async onQueryStarted({ id, ecommerce }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    productsApiSlice.util.updateQueryData('getProducts', undefined, (draft) => {
                        const product = draft.find(p => p.id === id);
                        if (product) product.ecommerce = ecommerce;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo(); // Revert if API fails
                }
            },
        }),
    }),
});

export const {
    useGetProductsQuery,
    useAddProductMutation,
    useToggleEcommerceMutation
} = productsApiSlice;