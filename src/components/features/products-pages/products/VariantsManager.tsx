'use client';
import * as React from 'react';
import Image from 'next/image';
import { Trash2, X, ChevronDown, UploadCloud, Package } from 'lucide-react';
import { toast } from 'sonner';
import {
	ProductVariant,
	ProductVariantOption,
	VariantDraftStore,
	VariantRowSaveConfig,
} from '@/types/products';
import { useCatalogNames } from '@/hooks/products_hooks/useProductCatalogOptions';
import { buildVariantRows, isColorAttribute } from '@/utils/productRules';
import { VariantInlineTable } from './variants/VariantInlineTable';

interface VariantsManagerProps {
	options: ProductVariantOption[];
	/** Saved values of each row; inline edits are kept in `drafts` until saved. */
	variants: ProductVariant[];
	onChange: (
		options: ProductVariantOption[],
		variants: ProductVariant[],
	) => void;
	drafts: VariantDraftStore;
	/** Shows a Save button on each row. Omit where the parent form saves everything. */
	rowSave?: VariantRowSaveConfig;
}

// Attribute names the builder offered before the Attributes page was connected.
const DEFAULT_ATTRIBUTES = ['Color', 'Storage', 'Condition'];

const newVariant = (title: string): ProductVariant => ({
	id: `var-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
	title,
	sku: '',
	maxRetailPrice: null,
	sellingPrice: null,
	inStock: true,
	isPrebook: false,
});

export function VariantsManager({
	options,
	variants,
	onChange,
	drafts,
	rowSave,
}: VariantsManagerProps) {
	const { attributeNames } = useCatalogNames();
	const attributeOptions = React.useMemo(
		() => Array.from(new Set([...DEFAULT_ATTRIBUTES, ...attributeNames])),
		[attributeNames],
	);

	const [openNameDropdownId, setOpenNameDropdownId] = React.useState<
		string | null
	>(null);
	const [openValueDropdownId, setOpenValueDropdownId] = React.useState<
		string | null
	>(null);
	const [searchQuery, setSearchQuery] = React.useState('');
	const builderRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				builderRef.current &&
				!builderRef.current.contains(event.target as Node)
			) {
				setOpenNameDropdownId(null);
				setOpenValueDropdownId(null);
				setSearchQuery('');
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Any change to the options regenerates the variant rows, keeping rows that still exist.
	const commitOptions = (nextOptions: ProductVariantOption[]) => {
		const nextVariants = buildVariantRows(nextOptions, variants, newVariant);
		// Edits of rows that no longer exist would otherwise count as unsaved forever.
		drafts.getState().pruneDrafts(nextVariants.map((variant) => variant.id));
		onChange(nextOptions, nextVariants);
	};

	const addRow = () =>
		commitOptions([
			...options,
			{ id: `opt-${Date.now()}`, name: '', values: [], valueImages: {} },
		]);
	const removeRow = (id: string) =>
		commitOptions(options.filter((row) => row.id !== id));

	const updateRowName = (id: string, name: string) => {
		if (options.some((row) => row.id !== id && row.name === name)) {
			toast.error(`${name} is already used in another row.`);
			return;
		}
		commitOptions(
			options.map((row) => (row.id === id ? { ...row, name } : row)),
		);
		setOpenNameDropdownId(null);
		setSearchQuery('');
	};

	const addRowValue = (id: string, value: string) => {
		const trimmed = value.trim();
		commitOptions(
			options.map((row) => {
				if (row.id === id && trimmed && !row.values.includes(trimmed)) {
					return { ...row, values: [...row.values, trimmed] };
				}
				return row;
			}),
		);
		setSearchQuery('');
		setOpenValueDropdownId(null);
	};

	const removeRowValue = (id: string, valueToRemove: string) => {
		commitOptions(
			options.map((row) => {
				if (row.id !== id) return row;
				const valueImages = { ...row.valueImages };
				delete valueImages[valueToRemove];
				return {
					...row,
					values: row.values.filter((value) => value !== valueToRemove),
					valueImages,
				};
			}),
		);
	};

	const setValueImage = (id: string, value: string, image: string | null) => {
		onChange(
			options.map((row) => {
				if (row.id !== id) return row;
				const valueImages = { ...row.valueImages };
				if (image) valueImages[value] = image;
				else delete valueImages[value];
				return { ...row, valueImages };
			}),
			variants,
		);
	};

	// Variant images are offered only for colour attributes, one per colour value.
	const colorRows = options.filter(
		(row) => isColorAttribute(row.name) && row.values.length > 0,
	);

	return (
		<div className='flex flex-col gap-8'>
			<div
				ref={builderRef}
				className='flex flex-col gap-4 pb-6 border-b border-brand-subtext/20'
			>
				<div className='grid grid-cols-12 gap-4 text-xs font-bold text-brand-subtext uppercase tracking-wider mb-1'>
					<div className='col-span-5'>
						Attribute Name <span className='text-red-500'>*</span>
					</div>
					<div className='col-span-6'>
						Attribute Value <span className='text-red-500'>*</span>
					</div>
					<div className='col-span-1 text-center'>Action</div>
				</div>

				{options.map((row) => (
					<div key={row.id} className='grid grid-cols-12 gap-4 items-start'>
						{/* ATTRIBUTE NAME */}
						<div className='col-span-5 relative'>
							<div
								onClick={() => {
									setOpenNameDropdownId(
										openNameDropdownId === row.id ? null : row.id,
									);
									setOpenValueDropdownId(null);
								}}
								className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors ${openNameDropdownId === row.id ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-brand-subtext/40'}`}
							>
								<span
									className={
										row.name
											? 'text-brand-text font-medium'
											: 'text-brand-subtext'
									}
								>
									{row.name || 'Choose a Attribute'}
								</span>
								<ChevronDown className='h-4 w-4 text-brand-subtext' />
							</div>
							{openNameDropdownId === row.id && (
								<div className='absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-md border border-brand-subtext/20 bg-white shadow-xl max-h-48 overflow-y-auto custom-scrollbar'>
									{attributeOptions.map((opt) => (
										<div
											key={opt}
											onClick={() => updateRowName(row.id, opt)}
											className='cursor-pointer px-3 py-2 text-sm hover:bg-emerald-50 text-brand-text'
										>
											{opt}
										</div>
									))}
								</div>
							)}
						</div>

						{/* ATTRIBUTE VALUE */}
						<div className='col-span-6 relative'>
							<div
								onClick={() => {
									setOpenValueDropdownId(
										openValueDropdownId === row.id ? null : row.id,
									);
									setOpenNameDropdownId(null);
								}}
								className={`flex min-h-9.5 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1.5 transition-colors ${openValueDropdownId === row.id ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-brand-subtext/40'}`}
							>
								{row.values.length === 0 ? (
									<span className='px-1 text-sm text-brand-subtext'>
										Choose a Attribute Value
									</span>
								) : (
									row.values.map((val) => (
										<span
											key={val}
											className='flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200'
										>
											{val}
											<X
												onClick={(e) => {
													e.stopPropagation();
													removeRowValue(row.id, val);
												}}
												className='h-3 w-3 cursor-pointer hover:text-emerald-900 ml-0.5'
											/>
										</span>
									))
								)}
							</div>
							{openValueDropdownId === row.id && (
								<div className='absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-md border border-brand-subtext/20 bg-white shadow-xl p-2'>
									<div className='relative mb-2'>
										<input
											autoFocus
											type='text'
											placeholder='Type and press enter...'
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' && searchQuery) {
													e.preventDefault();
													addRowValue(row.id, searchQuery);
												}
											}}
											className='w-full rounded-md border border-brand-subtext/30 bg-brand-bg/50 py-1.5 px-3 text-sm focus:border-emerald-500 focus:outline-none'
										/>
									</div>
									<p className='text-xs text-brand-subtext text-center'>
										Type a value and press Enter
									</p>
								</div>
							)}
						</div>

						<div className='col-span-1 flex justify-center pt-2'>
							<button
								type='button'
								onClick={() => removeRow(row.id)}
								className='text-red-400 hover:text-red-600 transition-colors'
							>
								<Trash2 className='h-5 w-5' />
							</button>
						</div>
					</div>
				))}

				<div className='mt-2'>
					<button
						type='button'
						onClick={addRow}
						className='rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-800'
					>
						Add Another Option
					</button>
				</div>
			</div>

			{/* VARIANT IMAGE (colour attributes only) */}
			{colorRows.length > 0 && (
				<div className='flex flex-col gap-3'>
					<h3 className='text-sm font-semibold text-brand-text'>
						Variant Image
					</h3>
					{colorRows.map((row) => (
						<div
							key={row.id}
							className='grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6'
						>
							{row.values.map((value) => {
								const image = row.valueImages[value];
								return (
									<div
										key={value}
										className='flex flex-col items-center gap-1.5'
									>
										{image ? (
											<div className='relative h-24 w-full overflow-hidden rounded-lg border border-brand-subtext/20 bg-brand-bg'>
												<Image
													src={image}
													alt={value}
													fill
													sizes='160px'
													className='object-contain p-1'
												/>
												<button
													type='button'
													onClick={() => setValueImage(row.id, value, null)}
													className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-colors'
													title='Remove image'
												>
													<X className='h-3 w-3' />
												</button>
											</div>
										) : (
											<button
												type='button'
												onClick={() => {
													setValueImage(row.id, value, '/phone.png');
													toast.success('Image uploaded successfully.');
												}}
												className='flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50'
											>
												<UploadCloud className='h-5 w-5 text-brand-subtext' />
											</button>
										)}
										<span className='text-xs font-semibold text-brand-text'>
											{value}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>
			)}

			{/* VARIANT STOCK TABLE */}
			<div className='border-t border-brand-subtext/20 pt-6'>
				{variants.length === 0 ? (
					<div className='flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center'>
						<Package className='h-8 w-8 text-brand-subtext/60' />
						<h3 className='text-sm font-bold text-brand-text'>
							No variants yet
						</h3>
						<p className='text-xs text-brand-subtext'>
							Choose an attribute and add its values above to generate variants.
						</p>
					</div>
				) : (
					<VariantInlineTable
						options={options}
						rows={variants}
						drafts={drafts}
						rowSave={rowSave}
					/>
				)}
			</div>
		</div>
	);
}
