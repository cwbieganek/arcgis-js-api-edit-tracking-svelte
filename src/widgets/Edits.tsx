import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { init } from "@arcgis/core/core/watchUtils";
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from "@arcgis/core/widgets/support/widget";

interface AttributeChange {
	name: string;
	oldValue: any;
	newValue: any;
}

type EditType = 'geometry' | 'attribute';

interface Edit {
	type: EditType;
	moveDistance?: number;
	attributeChange?: AttributeChange;
}

interface State {
	edits: Edit[];
}

@subclass('esri.widgets.Edits')
class Edits extends Widget {
	@property()
	state: State;

	constructor(params?: any) {
		super(params);

		this.state = {
			edits: [
				{
					type: 'attribute',
					attributeChange: {
						name: 'Letter',
						oldValue: 'A',
						newValue: 'B'
					}
				},
				{
					type: 'attribute',
					attributeChange: {
						name: 'Rating',
						oldValue: 9,
						newValue: 10
					}
				}
			]
		};
	}

	addGeometryEdit(moveDistance: number): void {
		this.state.edits.push(
			{
				type: 'geometry',
				moveDistance: moveDistance
			}
		);
	}

	addAttributeEdit(name: string, oldValue: any, newValue: any): void {
		this.state.edits.push(
			{
				type: 'attribute',
				attributeChange: {
					name: name,
					oldValue: oldValue,
					newValue: newValue
				}
			}
		);
	}

	private renderEdit(edit: Edit, num: number) {
		let editTypeCapitalized = edit.type[0].toUpperCase() + edit.type.slice(1);
		
		return (
			<div class="edits-list-item">
				{editTypeCapitalized} change (edit #{num}): {
				edit.type === 'geometry' ? 
				'Moved ' + edit.moveDistance.toString() : 
				edit.attributeChange.name + ' changed from ' + edit.attributeChange.oldValue + ' to ' + edit.attributeChange.newValue
				}
			</div>
		);
	}

	render() {
		return (
			<div class="esri-widget edits-list-container">
				<h3>Edits</h3>
				<div class="edits-list-item-container">
					{this.state.edits.map((edit, i) => {
						return this.renderEdit(edit, i + 1);
					})}
				</div>
			</div>
		);
	}
}

export default Edits;