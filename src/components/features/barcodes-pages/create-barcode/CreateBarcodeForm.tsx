'use client';
import * as React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHeadCell,
	TableCell,
} from '@/components/ui/Table';
import { useCreateBarcodeManager } from '@/hooks/barcode_hooks/useCreateBarcodeManager';
import { BarcodeLocation } from '@/types/barcodes';
import { BARCODE_LOCATIONS } from '@/constants/barcodes';
import { BarcodeFormDropdown } from '../shared/BarcodeFormDropdown';
import { CreateBarcodeQueueRow } from './CreateBarcodeQueueRow';

const LOCATION_OPTIONS = BARCODE_LOCATIONS.map((location) => ({
	value: location,
	label: location,
}));

const isLocation = (value: string): value is BarcodeLocation =>
	BARCODE_LOCATIONS.some((location) => location === value);

export function CreateBarcodeForm() {
	const manager = useCreateBarcodeManager();
	const { setLocation } = manager;

	const handleLocationChange = React.useCallback(
		(value: string) => {
			if (isLocation(value)) {
				setLocation(value);
			}
		},
		[setLocation],
	);

	return (
		<>
			{/* Top Selection Area */}
			<div className='flex flex-col md:flex-row items-end gap-4 border-b border-brand-subtext/20 pb-6'>
				<BarcodeFormDropdown
					label='Product'
					required
					placeholder='Choose a product'
					value={manager.selectedProductId}
					options={manager.productOptions}
					onChange={manager.setSelectedProductId}
					emptyText='No products in the catalogue'
				/>
				<BarcodeFormDropdown
					label='Attribute'
					required
					placeholder={
						manager.selectedProductId
							? 'Choose an attribute'
							: 'Choose a product first'
					}
					value={manager.selectedVariantId}
					options={manager.variantOptions}
					onChange={manager.setSelectedVariantId}
					disabled={!manager.selectedProductId}
					emptyText='This product has no variants'
				/>
				<button
					type='button'
					onClick={manager.handleAddToQueue}
					className='rounded-md bg-brand-bg border border-brand-subtext/30 px-6 py-2.5 text-sm font-bold text-brand-text transition-colors hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
				>
					Add
				</button>
			</div>

			{/* Staging Queue Table */}
			<div className='flex flex-col gap-1.5 flex-1 mt-6'>
				<label className='text-xs font-bold text-brand-subtext tracking-wider'>
					Order Queue <span className='text-red-500'>*</span>
				</label>
				<div className='rounded-lg border border-brand-subtext/20 bg-brand-bg/30 overflow-x-auto custom-scrollbar flex-1'>
					<Table>
						<TableHeader>
							<TableHeadCell>Product</TableHeadCell>
							<TableHeadCell>SKU</TableHeadCell>
							<TableHeadCell>Retail Price</TableHeadCell>
							<TableHeadCell>Serial Numbers</TableHeadCell>
							<TableHeadCell className='text-center w-30'>
								Quantity
							</TableHeadCell>
							<TableHeadCell className='text-right w-30'>Action</TableHeadCell>
						</TableHeader>

						<TableBody>
							{manager.stagedItems.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className='text-center py-12 text-brand-subtext'
									>
										No products added to generation queue
									</TableCell>
								</TableRow>
							) : (
								manager.stagedItems.map((item) => (
									<CreateBarcodeQueueRow
										key={item.id}
										item={item}
										onRemove={manager.handleRemoveFromQueue}
										onQuantityChange={manager.handleQuantityChange}
										onSkuChange={manager.handleSkuChange}
										onMrpChange={manager.handleMrpChange}
										onSerialModeChange={manager.handleSerialModeChange}
										onAddSerial={manager.handleAddManualSerial}
										onRemoveSerial={manager.handleRemoveManualSerial}
									/>
								))
							)}
						</TableBody>
					</Table>
				</div>
				<p className='text-[11px] text-brand-subtext'>
					Auto creates serials as SKU-YYYYMMDD-0001. Manual lets you type or
					scan each serial / IMEI.
				</p>
			</div>

			<div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-6'>
				<div className='w-full sm:max-w-xs'>
					<BarcodeFormDropdown
						label='Location'
						required
						placeholder='Choose a location'
						value={manager.location}
						options={LOCATION_OPTIONS}
						onChange={handleLocationChange}
					/>
				</div>
				<button
					type='button'
					onClick={manager.handleGenerateBarcodes}
					disabled={
						manager.stagedItems.length === 0 || manager.totalUnits === 0
					}
					className='rounded-md bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					Generate Barcode
					{manager.totalUnits > 1 ? ` (${manager.totalUnits})` : ''}
				</button>
			</div>
		</>
	);
}
