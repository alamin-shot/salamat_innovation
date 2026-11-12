'use client';
import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { AttributeValue, ProductAttribute } from '@/types/products';
import { isColorAttribute } from '@/utils/productRules';
import { NameWithThumbnail } from '../shared/NameWithThumbnail';
import { AuditCells } from '../shared/AuditCells';
import { ChipListCell } from '../shared/ChipListCell';

interface AttributeRowProps {
	attribute: ProductAttribute;
	isSelected: boolean;
	onToggleSelect: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onUpdateValues: (id: string, values: AttributeValue[]) => void;
}

export const AttributeRow = React.memo(function AttributeRow({
	attribute,
	isSelected,
	onToggleSelect,
	onEdit,
	onDelete,
	onUpdateValues,
}: AttributeRowProps) {
	// Colour attributes preview their first swatch image; others fall back to the initial tile.
	const thumbnail = isColorAttribute(attribute.name)
		? (attribute.values.find((value) => value.image)?.image ?? null)
		: null;

	const chipItems = React.useMemo(
		() =>
			attribute.values.map((value) => ({ key: value.id, label: value.label })),
		[attribute.values],
	);

	const handleAddValue = React.useCallback(
		(label: string) => {
			const value: AttributeValue = {
				id: `val-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
				label,
				image: null,
			};
			onUpdateValues(attribute.id, [...attribute.values, value]);
		},
		[attribute.id, attribute.values, onUpdateValues],
	);

	return (
		<TableRow className={isSelected ? 'bg-emerald-50/30' : ''}>
			<TableCell className='w-12 px-4'>
				<input
					type='checkbox'
					checked={isSelected}
					onChange={() => onToggleSelect(attribute.id)}
					className='h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer'
				/>
			</TableCell>

			<TableCell>
				<NameWithThumbnail name={attribute.name} image={thumbnail} />
			</TableCell>

			<TableCell>
				<ChipListCell
					items={chipItems}
					chipClassName='inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-none'
					onAdd={handleAddValue}
					addTitle='Add Value'
					placeholder='Enter Value'
				/>
			</TableCell>

			<AuditCells
				createdBy={attribute.createdBy}
				createdAt={attribute.createdAt}
			/>

			<TableCell className='text-right'>
				<div className='flex items-center justify-end gap-1'>
					<button
						type='button'
						onClick={() => onEdit(attribute.id)}
						className='flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors'
					>
						<Edit className='h-4 w-4' />
					</button>
					<button
						type='button'
						onClick={() => onDelete(attribute.id)}
						className='flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors'
					>
						<Trash2 className='h-4 w-4' />
					</button>
				</div>
			</TableCell>
		</TableRow>
	);
});

AttributeRow.displayName = 'AttributeRow';
